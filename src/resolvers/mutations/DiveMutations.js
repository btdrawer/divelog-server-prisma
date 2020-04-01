const { getUserId } = require("../../authentication/authUtils");
const diveMiddleware = require("../../authentication/middleware/diveMiddleware");
const { UPDATE, DELETE } = require("../../constants/methods");
const moment = require("moment");

const processTime = data => {
    let { timeIn, timeOut } = data;
    let diveTime = null;
    if (timeIn) {
        timeIn = moment(timeIn).format("x");
    }
    if (timeOut) {
        timeOut = moment(timeOut).format("x");
    }
    if (timeIn && timeOut) {
        diveTime = (timeOut - timeIn) / 60000;
    }
    return {
        ...data,
        timeIn,
        timeOut,
        diveTime
    };
};

const updateOperationTemplate = async ({
    diveId,
    data,
    request,
    prisma,
    info
}) => {
    await diveMiddleware({
        method: UPDATE,
        diveId,
        request,
        prisma
    });
    return prisma.mutation.updateDive(
        {
            where: {
                id: diveId
            },
            data
        },
        info
    );
};

module.exports = {
    createDive: async (parent, { data }, { request, prisma }, info) => {
        if (data.club) {
            data.club = {
                connect: {
                    id: data.club
                }
            };
        }
        const userId = getUserId(request);
        return prisma.mutation.createDive(
            {
                data: {
                    ...processTime(data),
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    updateDive: (parent, { id, data }, { request, prisma }, info) =>
        updateOperationTemplate({
            diveId: id,
            data: processTime(data),
            request,
            prisma,
            info
        }),
    addGearToDive: (parent, { diveId, gearId }, { request, prisma }, info) =>
        updateOperationTemplate({
            diveId,
            data: {
                gear: {
                    connect: {
                        id: gearId
                    }
                }
            },
            request,
            prisma,
            info
        }),
    removeGearFromDive: (
        parent,
        { diveId, gearId },
        { request, prisma },
        info
    ) =>
        updateOperationTemplate({
            diveId,
            data: {
                gear: {
                    disconnect: {
                        id: gearId
                    }
                }
            },
            request,
            prisma,
            info
        }),
    addBuddyToDive: (parent, { diveId, buddyId }, { request, prisma }, info) =>
        updateOperationTemplate({
            diveId,
            data: {
                buddies: {
                    connect: {
                        id: buddyId
                    }
                }
            },
            request,
            prisma,
            info
        }),
    removeBuddyFromDive: (
        parent,
        { diveId, buddyId },
        { request, prisma },
        info
    ) =>
        updateOperationTemplate({
            diveId,
            data: {
                buddies: {
                    disconnect: {
                        id: buddyId
                    }
                }
            },
            request,
            prisma,
            info
        }),
    deleteDive: async (parent, { id }, { request, prisma }, info) => {
        await diveMiddleware({
            method: DELETE,
            diveId: id,
            request,
            prisma
        });
        return prisma.mutation.deleteDive(
            {
                where: {
                    id
                }
            },
            info
        );
    }
};
