const {
    getUserId,
    signJwt,
    hashPassword
} = require("../../authentication/authUtils");
const {
    INVALID_AUTH,
    CANNOT_ADD_YOURSELF,
    FRIEND_REQUEST_ALREADY_SENT,
    ALREADY_FRIENDS
} = require("../../constants/errorCodes");
const bcrypt = require("bcrypt");

const formatAuthPayload = (user, token) => ({
    user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
    },
    token
});

module.exports = {
    createUser: async (parent, { data }, { prisma }) => {
        data.password = hashPassword(data.password);
        const user = await prisma.mutation.createUser({
            data
        });
        const token = signJwt(user.id);
        return formatAuthPayload(user, token);
    },
    login: async (parent, { username, password }, { prisma }) => {
        const user = await prisma.query.user({
            where: {
                username
            }
        });
        if (!user) {
            throw new Error(INVALID_AUTH);
        }
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            throw new Error(INVALID_AUTH);
        }
        const token = signJwt(user.id);
        return formatAuthPayload(user, token);
    },
    updateUser: (parent, { data }, { request, prisma }, info) => {
        const userId = getUserId(request);
        return prisma.mutation.updateUser(
            {
                where: {
                    id: userId
                },
                data
            },
            info
        );
    },
    sendOrAcceptFriendRequest: async (
        parent,
        { id },
        { request, prisma },
        info
    ) => {
        const myId = getUserId(request);
        if (id === myId) {
            throw new Error(CANNOT_ADD_YOURSELF);
        }
        const checkInbox = await prisma.query.user({
            where: {
                id: myId
            }
        });
        if (checkInbox.friendRequestsSent.includes(id)) {
            throw new Error(FRIEND_REQUEST_ALREADY_SENT);
        } else if (checkInbox.friends.includes(id)) {
            throw new Error(ALREADY_FRIENDS);
        } else if (checkInbox.friendRequestsInbox.includes(id)) {
            // Accept request
            await prisma.mutation.updateUser({
                where: {
                    id
                },
                data: {
                    friends: {
                        connect: {
                            id: myId
                        }
                    },
                    friendRequestsInbox: {
                        disconnect: {
                            id: myId
                        }
                    }
                }
            });
            return prisma.mutation.updateUser(
                {
                    where: {
                        id: myId
                    },
                    data: {
                        friends: {
                            connect: {
                                id
                            }
                        },
                        friendRequestsSent: {
                            disconnect: {
                                id
                            }
                        }
                    }
                },
                info
            );
        }
        // Send request
        await prisma.mutation.updateUser({
            where: {
                id
            },
            data: {
                friendRequestsInbox: {
                    connect: {
                        id: myId
                    }
                }
            }
        });
        return prisma.mutation.updateUser(
            {
                where: {
                    id: myId
                },
                data: {
                    friendRequestsSent: {
                        connect: {
                            id
                        }
                    }
                }
            },
            info
        );
    },
    unfriend: async (parent, { id }, { request, prisma }, info) => {
        const myId = getUserId(request);
        await prisma.mutation.updateUser({
            where: {
                id
            },
            data: {
                friends: {
                    disconnect: {
                        id: myId
                    }
                }
            }
        });
        return prisma.mutation.updateUser(
            {
                where: {
                    id: myId
                },
                data: {
                    friends: {
                        disconnect: {
                            id
                        }
                    }
                }
            },
            info
        );
    },
    deleteUser: async (parent, args, { request, prisma }) => {
        const userId = getUserId(request);
        await Promise.all([
            prisma.mutation.deleteManyGears({
                owner: {
                    id: userId
                }
            }),
            prisma.mutation.deleteManyDives({
                user: {
                    id: userId
                }
            })
        ]);
        const user = await prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        });
        const { managerOfClubs } = user;
        if (managerOfClubs && managerOfClubs.length > 0) {
            managerOfClubs.forEach(async club => {
                if (club.managers.length < 2) {
                    await prisma.mutation.deleteClub({
                        id: club.id
                    });
                }
            });
        }
        return user;
    }
};
