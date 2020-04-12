import { GraphQLResolveInfo } from "graphql";
import { combineResolvers } from "graphql-resolvers";
import * as bcrypt from "bcrypt";

import { signJwt, hashPassword } from "../../utils/authUtils";
import {
    INVALID_AUTH,
    CANNOT_ADD_YOURSELF,
    FRIEND_REQUEST_ALREADY_SENT,
    ALREADY_FRIENDS
} from "../../constants/errorCodes";

import { Context, FieldResolver } from "../../types";
import { User, Club } from "../../types/typeDefs";

import { isAuthenticated } from "../middleware";

const formatAuthPayload = (user: User, token: string): any => ({
    user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
    },
    token
});

export const UserMutations = {
    createUser: async (
        parent: User,
        args: any,
        context: Context
    ): Promise<FieldResolver> => {
        const { data } = args;
        data.password = hashPassword(data.password);
        const user = await context.prisma.mutation.createUser({
            data
        });
        const token = signJwt(user.id);
        return formatAuthPayload(user, token);
    },
    login: async (
        parent: User,
        args: { username: string; password: string },
        context: Context
    ): Promise<FieldResolver> => {
        const { username, password } = args;
        const user = await context.prisma.query.user({
            where: {
                username
            }
        });
        if (!user) {
            throw new Error(INVALID_AUTH);
        }
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            throw new Error(INVALID_AUTH);
        }
        const token = signJwt(user.id);
        return formatAuthPayload(user, token);
    },
    updateUser: combineResolvers(
        isAuthenticated,
        async (
            parent: User,
            args: any,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateUser(
                {
                    where: {
                        id: context.authUserId
                    },
                    data: args.data
                },
                info
            )
    ),
    sendOrAcceptFriendRequest: combineResolvers(
        isAuthenticated,
        async (
            parent: User,
            args: any,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { id } = args;
            const { authUserId, prisma } = context;
            if (id === authUserId) {
                throw new Error(CANNOT_ADD_YOURSELF);
            }
            const checkInbox = await prisma.query.user({
                where: {
                    id: authUserId
                }
            });
            if (checkInbox.friendRequestsSent.includes(id)) {
                throw new Error(FRIEND_REQUEST_ALREADY_SENT);
            } else if (checkInbox.friends.includes(id)) {
                throw new Error(ALREADY_FRIENDS);
            } else if (checkInbox.friendRequestsInbox.includes(id)) {
                // Accept request
                await prisma.mutation.updateUser({
                    where: {
                        id
                    },
                    data: {
                        friends: {
                            connect: {
                                id: authUserId
                            }
                        },
                        friendRequestsInbox: {
                            disconnect: {
                                id: authUserId
                            }
                        }
                    }
                });
                return prisma.mutation.updateUser(
                    {
                        where: {
                            id: authUserId
                        },
                        data: {
                            friends: {
                                connect: {
                                    id
                                }
                            },
                            friendRequestsSent: {
                                disconnect: {
                                    id
                                }
                            }
                        }
                    },
                    info
                );
            }
            // Send request
            await prisma.mutation.updateUser({
                where: {
                    id
                },
                data: {
                    friendRequestsInbox: {
                        connect: {
                            id: authUserId
                        }
                    }
                }
            });
            return prisma.mutation.updateUser(
                {
                    where: {
                        id: authUserId
                    },
                    data: {
                        friendRequestsSent: {
                            connect: {
                                id
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    unfriend: combineResolvers(
        isAuthenticated,
        async (
            parent: User,
            args: any,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { id } = args;
            const { authUserId, prisma } = context;
            await prisma.mutation.updateUser({
                where: {
                    id
                },
                data: {
                    friends: {
                        disconnect: {
                            id: authUserId
                        }
                    }
                }
            });
            return prisma.mutation.updateUser(
                {
                    where: {
                        id: authUserId
                    },
                    data: {
                        friends: {
                            disconnect: {
                                id
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    deleteUser: combineResolvers(
        isAuthenticated,
        async (
            parent: User,
            args: any,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { authUserId, prisma } = context;
            await Promise.all([
                prisma.mutation.deleteManyGears({
                    owner: {
                        id: authUserId
                    }
                }),
                prisma.mutation.deleteManyDives({
                    user: {
                        id: authUserId
                    }
                })
            ]);
            const user = await prisma.mutation.deleteUser(
                {
                    where: {
                        id: authUserId
                    }
                },
                info
            );
            const { managerOfClubs } = user;
            if (managerOfClubs && managerOfClubs.length > 0) {
                managerOfClubs.forEach(async (club: Club) => {
                    if (club.managers.length < 2) {
                        await prisma.mutation.deleteClub({
                            id: club.id
                        });
                    }
                });
            }
            return user;
        }
    )
};
