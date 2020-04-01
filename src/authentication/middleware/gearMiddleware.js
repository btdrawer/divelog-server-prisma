const { NOT_FOUND } = require("../../constants/errorCodes");
const { getUserId } = require("../authUtils");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = async ({ method, gearId, request, prisma }) => {
    if (method === UPDATE || method === DELETE) {
        const userId = getUserId(request);
        const gearExists = await prisma.exists.Gear({
            id: gearId,
            owner: {
                id: userId
            }
        });
        if (!gearExists) {
            throw new Error(NOT_FOUND);
        }
    }
    return undefined;
};
