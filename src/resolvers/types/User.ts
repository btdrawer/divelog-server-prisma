import { User as UserSchema } from "../../types/typeDefs";
import { Context, QueryArgs } from "../../types";

const FRAGMENT_USER_ID = "fragment userId on User { id }";

export const User = {
    email: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const { authUserId } = context;
            if (authUserId && authUserId === parent.id) {
                return parent.email;
            }
            return null;
        }
    },
    dives: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const { authUserId, prisma } = context;
            if (authUserId && authUserId === parent.id) {
                return parent.dives;
            }
            return prisma.query.dives({
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
            const { authUserId } = context;
            if (authUserId && authUserId === parent.id) {
                return parent.gear;
            }
            return null;
        }
    },
    friends: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const { authUserId } = context;
            if (authUserId && authUserId === parent.id) {
                return parent.friends;
            }
            return null;
        }
    },
    friendRequestsInbox: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const { authUserId } = context;
            if (authUserId && authUserId === parent.id) {
                return parent.friendRequestsInbox;
            }
            return null;
        }
    },
    friendRequestsSent: {
        fragment: FRAGMENT_USER_ID,
        resolve: (parent: UserSchema, args: QueryArgs, context: Context) => {
            const { authUserId } = context;
            if (authUserId && authUserId === parent.id) {
                return parent.friendRequestsSent;
            }
            return null;
        }
    }
};
