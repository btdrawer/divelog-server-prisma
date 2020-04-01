const groupMiddleware = require("../authentication/middleware/groupMiddleware");

module.exports = {
    newMessage: {
        subscribe: async (parent, { groupId }, { request, prisma }) => {
            await groupMiddleware({ groupId, request, isSubscription: true });
            return prisma.subscription.post({
                where: {
                    node: {
                        group: {
                            id: groupId
                        }
                    }
                }
            });
        }
    }
};
