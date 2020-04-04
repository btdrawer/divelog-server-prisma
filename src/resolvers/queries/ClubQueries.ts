import { formatQueryArgs } from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { Club } from "../../types/typeDefs";
import { GraphQLResolveInfo } from "graphql";

export const ClubQueries = {
    clubs: async (
        parent: Club,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        context.prisma.query.clubs(await formatQueryArgs(args), info)
};
