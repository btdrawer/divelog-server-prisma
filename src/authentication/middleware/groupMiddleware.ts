import { NOT_FOUND, FORBIDDEN } from "../../constants/errorCodes";
import { getUserId } from "../authUtils";
import { Context } from "../../types";
import { Group } from "../../types/typeDefs";

async function groupMiddleware(input: {
    groupId: string;
    context: Context;
    isSubscription?: boolean;
}) {
    const {
        groupId,
        context: { request, prisma },
        isSubscription = false
    } = input;
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
    if (!group.participants.some((group: Group) => group.id === userId)) {
        throw new Error(FORBIDDEN);
    }
    return undefined;
}

export default groupMiddleware;
