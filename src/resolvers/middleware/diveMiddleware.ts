import { GraphQLResolveInfo } from "graphql";
import { skip } from "graphql-resolvers";
import { errorCodes } from "@btdrawer/divelog-server-utils";
import { Context } from "../../types";
import { Dive } from "../../types/typeDefs";

const { NOT_FOUND, FORBIDDEN } = errorCodes;

export const isDiveUser = async (
    parent: Dive,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
): Promise<undefined> => {
    const { authUserId, prisma } = context;
    const dive = await prisma.query.dive(
        {
            where: {
                id: args.id
            }
        },
        "{ id user { id } }"
    );
    if (!dive) {
        throw new Error(NOT_FOUND);
    }
    if (dive.user.id !== authUserId) {
        throw new Error(FORBIDDEN);
    }
    return skip;
};

export const isUserOrDiveIsPublic = async (
    parent: Dive,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
): Promise<undefined> => {
    const { authUserId, prisma } = context;
    const dive = await prisma.query.dive(
        {
            where: {
                id: args.id
            }
        },
        "{ id user { id } public }"
    );
    if (!dive) {
        throw new Error(NOT_FOUND);
    }
    if (dive.user.id !== authUserId && !dive.public) {
        throw new Error(FORBIDDEN);
    }
    return skip;
};
