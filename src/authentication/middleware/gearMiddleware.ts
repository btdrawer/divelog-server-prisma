import { NOT_FOUND } from "../../constants/errorCodes";
import { getUserId } from "../authUtils";
import { UPDATE, DELETE } from "../../constants/methods";
import { Context } from "../../types";

const gearMiddleware = async (input: {
    method: string;
    gearId: string;
    context: Context;
}) => {
    const {
        method,
        gearId,
        context: { request, prisma }
    } = input;
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

export default gearMiddleware;
