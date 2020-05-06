import { skip } from "graphql-resolvers";
import { GraphQLResolveInfo } from "graphql";
import { errorCodes } from "@btdrawer/divelog-server-utils";
import { Context } from "../../types";
import { Gear } from "../../types/typeDefs";

const { NOT_FOUND, FORBIDDEN } = errorCodes;

export const isGearOwner = async (
    parent: Gear,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
) => {
    const { authUserId, prisma } = context;
    const gear = await prisma.query.gear(
        {
            where: {
                id: args.id
            }
        },
        "{ id owner { id } }"
    );
    if (!gear) {
        throw new Error(NOT_FOUND);
    }
    if (gear.owner.id !== authUserId.toString()) {
        throw new Error(FORBIDDEN);
    }
    return skip;
};
