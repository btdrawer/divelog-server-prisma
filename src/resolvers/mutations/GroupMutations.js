const { getUserId } = require("../../authentication/authUtils");
const groupMiddleware = require("../../authentication/middleware/groupMiddleware");

const updateOperationTemplate = async ({
    groupId,
    data,
    request,
    prisma,
    info
}) => {
    await groupMiddleware({
        groupId,
        request,
        prisma
    });
    return prisma.mutation.updateGroup(
        {
            where: {
                id: groupId
            },
            data
        },
        info
    );
};

module.exports = {
    createGroup: async (parent, { data }, { request, prisma }, info) => {
        const myId = getUserId(request);
        const { name, participants, text } = data;
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
    renameGroup: (parent, { id, name }, { request, prisma }, info) =>
        updateOperationTemplate({
            groupId: id,
            data: {
                name
            },
            request,
            prisma,
            info
        }),
    sendMessage: async (parent, { id, text }, { request, prisma }, info) => {
        const userId = getUserId(request);
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
            request,
            prisma,
            info
        });
    },
    addGroupParticipant: (
        parent,
        { groupId, memberId },
        { request, prisma },
        info
    ) =>
        updateOperationTemplate({
            groupId,
            data: {
                participants: {
                    connect: {
                        id: memberId
                    }
                }
            },
            request,
            prisma,
            info
        }),
    leaveGroup: (parent, { id }, { request, prisma }, info) => {
        const userId = getUserId(request);
        return updateOperationTemplate({
            groupId: id,
            data: {
                participants: {
                    disconnect: {
                        id: userId
                    }
                }
            },
            request,
            prisma,
            info
        });
    }
};
