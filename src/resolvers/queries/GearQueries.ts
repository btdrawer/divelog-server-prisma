import { getUserId } from "../../authentication/authUtils";
import formatQueryArgs from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { Gear } from "../../types/schema";
import { GraphQLResolveInfo } from "graphql";

export const GearQueries = {
    gear: async (
        parent: Gear,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { request, prisma } = context;
        const userId = getUserId(request);
        args.where = {
            ...args.where,
            owner: {
                id: userId
            }
        };
        return prisma.query.gears(formatQueryArgs(args), info);
    }
};
