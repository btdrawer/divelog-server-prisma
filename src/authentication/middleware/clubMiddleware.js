const {
    FORBIDDEN,
    NOT_FOUND,
    INVALID_ARGUMENT_ONLY_MANAGER,
    ALREADY_A_MANAGER,
    NOT_A_MANAGER,
    ALREADY_A_MEMBER,
    NOT_A_MEMBER
} = require("../../constants/errorCodes");
const { getUserId } = require("../authUtils");
const { UPDATE, DELETE } = require("../../constants/methods");
const clubOperations = require("../../constants/clubOperations");

module.exports = async ({
    method,
    clubId,
    request,
    prisma,
    operation,
    opUserId
}) => {
    if (method === UPDATE || method === DELETE) {
        const userId = getUserId(request);
        const club = await prisma.query.club(
            {
                where: {
                    id: clubId
                }
            },
            "{ id members { id } managers { id } }"
        );
        if (!club) {
            throw new Error(NOT_FOUND);
        }
        if (
            !club.managers.some(({ id }) => id === userId) &&
            operation !== clubOperations.JOIN_CLUB &&
            operation !== clubOperations.LEAVE_CLUB
        ) {
            throw new Error(FORBIDDEN);
        }
        if (operation) {
            switch (operation) {
                case clubOperations.ADD_CLUB_MANAGER:
                    if (club.managers.some(({ id }) => id === opUserId)) {
                        throw new Error(ALREADY_A_MANAGER);
                    }
                    break;
                case clubOperations.REMOVE_CLUB_MANAGER:
                    if (!club.managers.some(({ id }) => id === opUserId)) {
                        throw new Error(NOT_A_MANAGER);
                    }
                    if (club.managers.length < 2) {
                        throw new Error(INVALID_ARGUMENT_ONLY_MANAGER);
                    }
                    break;
                case clubOperations.JOIN_CLUB:
                    if (club.members.some(({ id }) => id === userId)) {
                        throw new Error(ALREADY_A_MEMBER);
                    }
                    break;
                case clubOperations.LEAVE_CLUB:
                    if (!club.members.some(({ id }) => id === userId)) {
                        throw new Error(NOT_A_MEMBER);
                    }
                    break;
                case clubOperations.REMOVE_CLUB_MEMBER:
                    if (!club.members.some(({ id }) => id === opUserId)) {
                        throw new Error(NOT_A_MEMBER);
                    }
                    break;
                default:
                    break;
            }
        }
    }
    return undefined;
};
