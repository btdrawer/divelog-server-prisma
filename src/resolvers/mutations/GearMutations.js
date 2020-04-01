const { getUserId } = require("../../authentication/authUtils");
const gearMiddleware = require("../../authentication/middleware/gearMiddleware");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = {
    createGear: async (parent, { data }, { request, prisma }, info) => {
        const userId = getUserId(request);
        return prisma.mutation.createGear(
            {
                data: {
                    ...data,
                    owner: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    updateGear: async (parent, { id, data }, { request, prisma }, info) => {
        await gearMiddleware({
            method: UPDATE,
            gearId: id,
            request,
            prisma
        });
        return prisma.mutation.updateGear(
            {
                where: {
                    id
                },
                data
            },
            info
        );
    },
    deleteGear: async (parent, { id }, { request, prisma }, info) => {
        await gearMiddleware({
            method: DELETE,
            gearId: id,
            request,
            prisma
        });
        return prisma.mutation.deleteGear(
            {
                where: {
                    id
                }
            },
            info
        );
    }
};
