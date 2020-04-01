const { getUserId } = require("../../authentication/authUtils");
const clubMiddleware = require("../../authentication/middleware/clubMiddleware");
const { UPDATE, DELETE } = require("../../constants/methods");
const clubOperations = require("../../constants/clubOperations");

module.exports = {
    createClub: async (parent, { data }, { request, prisma }, info) => {
        const userId = getUserId(request);
        return prisma.mutation.createClub(
            {
                data: {
                    ...data,
                    managers: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    updateClub: async (parent, { id, data }, { request, prisma }, info) => {
        await clubMiddleware({
            method: UPDATE,
            clubId: id,
            request,
            prisma
        });
        return prisma.mutation.updateClub(
            {
                where: {
                    id
                },
                data
            },
            info
        );
    },
    addClubManager: async (
        parent,
        { clubId, userId },
        { request, prisma },
        info
    ) => {
        await clubMiddleware({
            method: UPDATE,
            clubId,
            request,
            prisma,
            operation: clubOperations.ADD_CLUB_MANAGER,
            opUserId: userId
        });
        return prisma.mutation.updateClub(
            {
                where: {
                    id: clubId
                },
                data: {
                    managers: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    removeClubManager: async (
        parent,
        { clubId, managerId },
        { request, prisma },
        info
    ) => {
        await clubMiddleware({
            method: UPDATE,
            clubId,
            request,
            prisma,
            operation: clubOperations.REMOVE_CLUB_MANAGER,
            opUserId: managerId
        });
        return prisma.mutation.updateClub(
            {
                where: {
                    id: clubId
                },
                data: {
                    managers: {
                        disconnect: {
                            id: managerId
                        }
                    }
                }
            },
            info
        );
    },
    joinClub: async (parent, { id }, { request, prisma }, info) => {
        const userId = getUserId(request);
        await clubMiddleware({
            method: UPDATE,
            clubId: id,
            request,
            prisma,
            operation: clubOperations.JOIN_CLUB
        });
        return prisma.mutation.updateClub(
            {
                where: {
                    id
                },
                data: {
                    members: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    leaveClub: async (parent, { id }, { request, prisma }, info) => {
        const userId = getUserId(request);
        await clubMiddleware({
            method: UPDATE,
            clubId: id,
            request,
            prisma,
            operation: clubOperations.LEAVE_CLUB
        });
        return prisma.mutation.updateClub(
            {
                where: {
                    id
                },
                data: {
                    members: {
                        disconnect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    removeClubMember: async (
        parent,
        { clubId, memberId },
        { request, prisma },
        info
    ) => {
        await clubMiddleware({
            method: UPDATE,
            clubId,
            request,
            prisma,
            operation: clubOperations.REMOVE_CLUB_MEMBER,
            opUserId: memberId
        });
        return prisma.mutation.updateClub(
            {
                where: {
                    id: clubId
                },
                data: {
                    members: {
                        disconnect: {
                            id: memberId
                        }
                    }
                }
            },
            info
        );
    },
    deleteClub: async (parent, { id }, { request, prisma }, info) => {
        await clubMiddleware({
            method: DELETE,
            clubId: id,
            request,
            prisma
        });
        return prisma.mutation.deleteClub(
            {
                where: {
                    id
                }
            },
            info
        );
    }
};
