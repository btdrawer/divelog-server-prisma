import { getUserId } from "../../authentication/authUtils";
import groupMiddleware from "../../authentication/middleware/groupMiddleware";
import { Context, FieldResolver } from "../../types";
import { Group, CreateGroupInput } from "../../types/schema";
import { GraphQLResolveInfo } from "graphql";

const updateOperationTemplate = async (input: {
    groupId: string;
    data: object;
    context: Context;
    info: GraphQLResolveInfo;
}): Promise<FieldResolver> => {
    const { groupId, data, context, info } = input;
    await groupMiddleware({
        groupId,
        context
    });
    return context.prisma.mutation.updateGroup(
        {
            where: {
                id: groupId
            },
            data
        },
        info
    );
};

export const GroupMutations = {
    createGroup: async (
        parent: Group,
        args: { data: CreateGroupInput },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { request, prisma } = context;
        const myId = getUserId(request);
        const { name, participants, text } = args.data;
        participants.push(myId);
        return prisma.mutation.createGroup(
            {
                data: {
                    name,
                    participants: {
                        connect: participants.map(id => ({
                            id
                        }))
                    },
                    messages: {
                        create: [
                            {
                                text,
                                sender: {
                                    connect: {
                                        id: myId
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            info
        );
    },
    renameGroup: (
        parent: Group,
        args: { id: string; name: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        updateOperationTemplate({
            groupId: args.id,
            data: {
                name: args.name
            },
            context,
            info
        }),
    sendMessage: async (
        parent: Group,
        args: { id: string; text: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { id, text } = args;
        const userId = getUserId(context.request);
        return updateOperationTemplate({
            groupId: id,
            data: {
                messages: {
                    create: {
                        text,
                        sender: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                }
            },
            context,
            info
        });
    },
    addGroupParticipant: (
        parent: Group,
        args: { groupId: string; memberId: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        updateOperationTemplate({
            groupId: args.groupId,
            data: {
                participants: {
                    connect: {
                        id: args.memberId
                    }
                }
            },
            context,
            info
        }),
    leaveGroup: (
        parent: Group,
        args: { id: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const userId = getUserId(context.request);
        return updateOperationTemplate({
            groupId: args.id,
            data: {
                participants: {
                    disconnect: {
                        id: userId
                    }
                }
            },
            context,
            info
        });
    }
};
