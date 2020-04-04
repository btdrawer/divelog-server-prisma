import { getUserId } from "../../authentication/authUtils";
import { formatQueryArgs } from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { Gear } from "../../types/typeDefs";
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
        return prisma.query.gears(
            await formatQueryArgs(args, {
                owner: {
                    id: userId
                }
            }),
            info
        );
    }
};
