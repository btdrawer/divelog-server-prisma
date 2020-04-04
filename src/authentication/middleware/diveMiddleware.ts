import { getUserId } from "../../authentication/authUtils";
import { NOT_FOUND, FORBIDDEN } from "../../constants/errorCodes";
import { UPDATE, DELETE } from "../../constants/methods";
import { Context } from "../../types";

async function diveMiddleware(input: {
    method: string;
    diveId: string;
    context: Context;
}) {
    const {
        method,
        diveId,
        context: { request, prisma }
    } = input;
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
}

export default diveMiddleware;
