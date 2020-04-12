import { skip } from "graphql-resolvers";

import { Context } from "../../types";
import { TypeDef } from "../../types/typeDefs";

import { INVALID_AUTH } from "../../constants/errorCodes";

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
