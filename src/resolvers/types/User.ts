import { getUserId } from "../../authentication/authUtils";
import { User as UserSchema } from "../../types/schema";
import { Context, QueryArgs } from "../../types";

const FRAGMENT_USER_ID = "fragment userId on User { id }";

export const User = {
    email: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const userId = getUserId(context.request, false, false);
            if (userId && userId === parent.id) {
                return parent.email;
            }
            return null;
        }
    },
    dives: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const userId = getUserId(context.request, false, false);
            if (userId && userId === parent.id) {
                return parent.dives;
            }
            return context.prisma.query.dives({
                where: {
                    user: parent.id,
                    public: true
                }
            });
        }
    },
    gear: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const userId = getUserId(context.request, false, false);
            if (userId && userId === parent.id) {
                return parent.gear;
            }
            return null;
        }
    },
    friends: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const userId = getUserId(context.request, false, false);
            if (userId && userId === parent.id) {
                return parent.friends;
            }
            return null;
        }
    },
    friendRequestsInbox: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const userId = getUserId(context.request, false, false);
            if (userId && userId === parent.id) {
                return parent.friendRequestsInbox;
            }
            return null;
        }
    },
    friendRequestsSent: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const userId = getUserId(context.request, false, false);
            if (userId && userId === parent.id) {
                return parent.friendRequestsSent;
            }
            return null;
        }
    }
};
