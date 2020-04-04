import groupMiddleware from "../authentication/middleware/groupMiddleware";
import { Context } from "../types";

export const Subscription = {
    newMessage: {
        subscribe: async function(
            parent: object,
            args: { groupId: string },
            context: Context
        ) {
            const { request, prisma } = context;
            const { groupId } = args;
            await groupMiddleware({
                groupId,
                context,
                isSubscription: true
            });
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
