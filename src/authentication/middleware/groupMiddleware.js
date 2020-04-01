const { NOT_FOUND, FORBIDDEN } = require("../../constants/errorCodes");
const { getUserId } = require("../authUtils");

module.exports = async ({
    groupId,
    request,
    prisma,
    isSubscription = false
}) => {
    const userId = getUserId(request, isSubscription);
    const group = await prisma.query.group(
        {
            where: {
                id: groupId
            }
        },
        "{ id participants { id } }"
    );
    if (!group) {
        throw new Error(NOT_FOUND);
    }
    if (!group.participants.some(({ id }) => id === userId)) {
        throw new Error(FORBIDDEN);
    }
    return undefined;
};
