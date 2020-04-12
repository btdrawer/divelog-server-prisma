import { GraphQLResolveInfo } from "graphql";

import { formatQueryArgs } from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { Club } from "../../types/typeDefs";

export const ClubQueries = {
    clubs: (
        parent: Club,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        context.prisma.query.clubs(formatQueryArgs(args), info)
};
