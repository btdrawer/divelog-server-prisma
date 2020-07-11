import { skip } from "graphql-resolvers";
import { GraphQLResolveInfo } from "graphql";
import { errorCodes } from "@btdrawer/divelog-server-utils";
import { Context } from "../types";
import { TypeDef } from "../types/typeDefs";

const { NOT_FOUND, FORBIDDEN } = errorCodes;

const hasAccess = (
    resource: string,
    accessInfo: string,
    predicate: Function
) => async (
    parent: TypeDef,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
): Promise<undefined> => {
    const { authUserId, prisma } = context;
    const result = await prisma.query[resource](
        {
            where: {
                id: args.id
            }
        },
        accessInfo
    );
    if (!result) {
        throw new Error(NOT_FOUND);
    }
    if (!predicate(result, authUserId)) {
        throw new Error(FORBIDDEN);
    }
    return skip;
};

export default hasAccess;
