const { getUserId } = require("../../authentication/authUtils");
const { NOT_FOUND, FORBIDDEN } = require("../../constants/errorCodes");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = async ({ method, diveId, request, prisma }) => {
    if (method === UPDATE || method === DELETE) {
        const userId = getUserId(request);
        const dive = await prisma.query.dive(
            {
                where: {
                    id: diveId
                }
            },
            "{ id user { id } }"
        );
        if (!dive) {
            throw new Error(NOT_FOUND);
        }
        if (dive.user.id !== userId) {
            throw new Error(FORBIDDEN);
        }
    }
    return undefined;
};
