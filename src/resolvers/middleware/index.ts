import { skip } from "graphql-resolvers";
import { errorCodes } from "@btdrawer/divelog-server-utils";
import { Context } from "../../types";
import { TypeDef } from "../../types/typeDefs";

const { INVALID_AUTH } = errorCodes;

export const isAuthenticated = async (
    parent: TypeDef,
    args: any,
    context: Context
): Promise<undefined> => {
    if (!context.authUserId) {
        throw new Error(INVALID_AUTH);
    }
    return skip;
};
