import { GraphQLResolveInfo } from "graphql";
import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated } from "../middleware";
import { isClubManager, isClubMember } from "../middleware/clubMiddleware";

import { Context, FieldResolver } from "../../types";
import { Club, User } from "../../types/typeDefs";
import { CreateClubInput, UpdateClubInput } from "../../types/inputs";

const {
    ALREADY_A_MANAGER,
    NOT_A_MANAGER,
    ALREADY_A_MEMBER,
    NOT_A_MEMBER
} = require("../../constants/errorCodes");

export const ClubMutations = {
    createClub: combineResolvers(
        isAuthenticated,
        async (
            parent: Club,
            args: {
                data: CreateClubInput;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { authUserId, prisma } = context;
            return prisma.mutation.createClub(
                {
                    data: {
                        ...args.data,
                        managers: {
                            connect: {
                                id: authUserId
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    updateClub: combineResolvers(
        isAuthenticated,
        isClubManager,
        async (
            parent: Club,
            args: {
                id: string;
                data: UpdateClubInput;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { id, data } = args;
            return context.prisma.mutation.updateClub(
                {
                    where: {
                        id
                    },
                    data
                },
                info
            );
        }
    ),
    addClubManager: combineResolvers(
        isAuthenticated,
        isClubManager,
        async (
            parent: Club,
            args: {
                id: string;
                userId: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { id, userId } = args;
            const { prisma } = context;
            const club = await prisma.query.club(
                {
                    where: {
                        id
                    }
                },
                "{ id managers { id } }"
            );
            if (club.managers.some((manager: User) => manager.id === userId)) {
                throw new Error(ALREADY_A_MANAGER);
            }
            return prisma.mutation.updateClub(
                {
                    where: {
                        id
                    },
                    data: {
                        managers: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    removeClubManager: combineResolvers(
        isAuthenticated,
        isClubManager,
        async (
            parent: Club,
            args: {
                id: string;
                userId: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { id, userId } = args;
            const { prisma } = context;
            const club = await prisma.query.club(
                {
                    where: {
                        id
                    }
                },
                "{ id managers { id } }"
            );
            if (!club.managers.some((manager: User) => manager.id === userId)) {
                throw new Error(NOT_A_MANAGER);
            }
            return prisma.mutation.updateClub(
                {
                    where: {
                        id
                    },
                    data: {
                        managers: {
                            disconnect: {
                                id: userId
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    joinClub: combineResolvers(
        isAuthenticated,
        async (
            parent: Club,
            args: {
                id: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { id } = args;
            const { authUserId, prisma } = context;
            const club = await prisma.query.club(
                {
                    where: {
                        id
                    }
                },
                "{ id members { id } }"
            );
            if (club.members.some((member: User) => member.id === authUserId)) {
                throw new Error(ALREADY_A_MEMBER);
            }
            return prisma.mutation.updateClub(
                {
                    where: {
                        id
                    },
                    data: {
                        members: {
                            connect: {
                                id: authUserId
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    leaveClub: combineResolvers(
        isAuthenticated,
        isClubMember,
        async (
            parent: Club,
            args: {
                id: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { id } = args;
            const { authUserId, prisma } = context;
            const club = await prisma.query.club(
                {
                    where: {
                        id
                    }
                },
                "{ id members { id } }"
            );
            if (
                !club.members.some((member: User) => member.id === authUserId)
            ) {
                throw new Error(NOT_A_MEMBER);
            }
            return prisma.mutation.updateClub(
                {
                    where: {
                        id
                    },
                    data: {
                        members: {
                            disconnect: {
                                id: authUserId
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    removeClubMember: combineResolvers(
        isAuthenticated,
        isClubManager,
        async (
            parent: Club,
            args: {
                id: string;
                userId: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { id, userId } = args;
            const { prisma } = context;
            const club = await prisma.query.club(
                {
                    where: {
                        id
                    }
                },
                "{ id members { id } }"
            );
            if (!club.members.some((member: User) => member.id === userId)) {
                throw new Error(NOT_A_MEMBER);
            }
            return prisma.mutation.updateClub(
                {
                    where: {
                        id
                    },
                    data: {
                        members: {
                            disconnect: {
                                id: userId
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    deleteClub: combineResolvers(
        isAuthenticated,
        isClubManager,
        async (
            parent: Club,
            args: {
                id: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.deleteClub(
                {
                    where: {
                        id: args.id
                    }
                },
                info
            )
    )
};
