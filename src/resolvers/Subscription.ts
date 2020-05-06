import { combineResolvers } from "graphql-resolvers";
import { Context } from "../types";
import { isAuthenticated } from "./middleware";
import { isGroupParticipant } from "./middleware/groupMiddleware";

export const Subscription = {
    newMessage: {
        subscribe: combineResolvers(
            isAuthenticated,
            isGroupParticipant,
            async (parent: object, args: { id: string }, context: Context) =>
                context.prisma.subscription.post({
                    where: {
                        node: {
                            group: {
                                id: args.id
                            }
                        }
                    }
                })
        )
    }
};
