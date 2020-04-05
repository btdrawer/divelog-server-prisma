import {
    FORBIDDEN,
    NOT_FOUND,
    INVALID_ARGUMENT_ONLY_MANAGER,
    ALREADY_A_MANAGER,
    NOT_A_MANAGER,
    ALREADY_A_MEMBER,
    NOT_A_MEMBER
} from "../../constants/errorCodes";
import { getUserId } from "../authUtils";
import { UPDATE, DELETE } from "../../constants/methods";
import clubOperations from "../../constants/clubOperations";
import { Context } from "../../types";
import { User } from "../../types/typeDefs";

const clubMiddleware = async (input: {
    method: string;
    clubId: string;
    context: Context;
    operation?: string;
    opUserId?: string;
}) => {
    const {
        method,
        clubId,
        context: { request, prisma },
        operation,
        opUserId
    } = input;
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
            !club.managers.some((manager: User) => manager.id === userId) &&
            operation !== clubOperations.JOIN_CLUB &&
            operation !== clubOperations.LEAVE_CLUB
        ) {
            throw new Error(FORBIDDEN);
        }
        if (operation) {
            switch (operation) {
                case clubOperations.ADD_CLUB_MANAGER:
                    if (
                        club.managers.some(
                            (manager: User) => manager.id === opUserId
                        )
                    ) {
                        throw new Error(ALREADY_A_MANAGER);
                    }
                    break;
                case clubOperations.REMOVE_CLUB_MANAGER:
                    if (
                        !club.managers.some(
                            (manager: User) => manager.id === opUserId
                        )
                    ) {
                        throw new Error(NOT_A_MANAGER);
                    }
                    if (club.managers.length < 2) {
                        throw new Error(INVALID_ARGUMENT_ONLY_MANAGER);
                    }
                    break;
                case clubOperations.JOIN_CLUB:
                    if (
                        club.members.some(
                            (member: User) => member.id === userId
                        )
                    ) {
                        throw new Error(ALREADY_A_MEMBER);
                    }
                    break;
                case clubOperations.LEAVE_CLUB:
                    if (
                        !club.members.some(
                            (member: User) => member.id === userId
                        )
                    ) {
                        throw new Error(NOT_A_MEMBER);
                    }
                    break;
                case clubOperations.REMOVE_CLUB_MEMBER:
                    if (
                        !club.members.some(
                            (member: User) => member.id === opUserId
                        )
                    ) {
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

export default clubMiddleware;
