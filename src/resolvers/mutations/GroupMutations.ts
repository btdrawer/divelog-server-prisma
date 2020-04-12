import { GraphQLResolveInfo } from "graphql";
import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated } from "../middleware";
import { isGroupParticipant } from "../middleware/groupMiddleware";

import { Context, FieldResolver } from "../../types";
import { Group } from "../../types/typeDefs";
import { CreateGroupInput } from "../../types/inputs";

export const GroupMutations = {
    createGroup: combineResolvers(
        isAuthenticated,
        async (
            parent: Group,
            args: {
                data: CreateGroupInput;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { authUserId, prisma } = context;
            const { name, participants, text } = args.data;
            participants.push(<string>authUserId);
            return prisma.mutation.createGroup(
                {
                    data: {
                        name,
                        participants: {
                            connect: participants.map((id: string) => ({
                                id
                            }))
                        },
                        messages: {
                            create: [
                                {
                                    text,
                                    sender: {
                                        connect: {
                                            id: authUserId
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                info
            );
        }
    ),
    renameGroup: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        async (
            parent: Group,
            args: {
                id: string;
                name: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateGroup(
                {
                    where: {
                        id: args.id
                    },
                    data: {
                        name: args.name
                    }
                },
                info
            )
    ),
    sendMessage: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        async (
            parent: Group,
            args: {
                id: string;
                text: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { id, text } = args;
            const { authUserId, prisma } = context;
            return prisma.mutation.updateGroup(
                {
                    where: {
                        id
                    },
                    data: {
                        messages: {
                            create: {
                                text,
                                sender: {
                                    connect: {
                                        id: authUserId
                                    }
                                }
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    addGroupParticipant: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        async (
            parent: Group,
            args: {
                id: string;
                userId: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateGroup(
                {
                    where: {
                        id: args.id
                    },
                    data: {
                        participants: {
                            connect: {
                                id: args.userId
                            }
                        }
                    }
                },
                info
            )
    ),
    leaveGroup: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        async (
            parent: Group,
            args: {
                id: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateGroup(
                {
                    where: {
                        id: args.id
                    },
                    data: {
                        participants: {
                            disconnect: {
                                id: context.authUserId
                            }
                        }
                    }
                },
                info
            )
    )
};
