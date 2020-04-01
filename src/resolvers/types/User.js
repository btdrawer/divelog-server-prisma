const { getUserId } = require("../../authentication/authUtils");

const FRAGMENT_USER_ID = "fragment userId on User { id }";

module.exports = {
    email: {
        fragment: FRAGMENT_USER_ID,
        resolve: ({ id, email }, args, { request }) => {
            const userId = getUserId(request, false, false);
            if (userId && userId === id) {
                return email;
            }
            return null;
        }
    },
    dives: {
        fragment: FRAGMENT_USER_ID,
        resolve: ({ id, dives }, args, { request, prisma }) => {
            const userId = getUserId(request, false, false);
            if (userId && userId === id) {
                return dives;
            }
            return prisma.query.dives({
                where: {
                    user: id,
                    public: true
                }
            });
        }
    },
    gear: {
        fragment: FRAGMENT_USER_ID,
        resolve: ({ id, gear }, args, { request }) => {
            const userId = getUserId(request, false, false);
            if (userId && userId === id) {
                return gear;
            }
            return null;
        }
    },
    friends: {
        fragment: FRAGMENT_USER_ID,
        resolve: ({ id, friends }, args, { request }) => {
            const userId = getUserId(request, false, false);
            if (userId && userId === id) {
                return friends;
            }
            return null;
        }
    },
    friendRequestsInbox: {
        fragment: FRAGMENT_USER_ID,
        resolve: ({ id, friendRequestsInbox }, args, { request }) => {
            const userId = getUserId(request, false, false);
            if (userId && userId === id) {
                return friendRequestsInbox;
            }
            return null;
        }
    },
    friendRequestsSent: {
        fragment: FRAGMENT_USER_ID,
        resolve: ({ id, friendRequestsSent }, args, { request }) => {
            const userId = getUserId(request, false, false);
            if (userId && userId === id) {
                return friendRequestsSent;
            }
            return null;
        }
    }
};
