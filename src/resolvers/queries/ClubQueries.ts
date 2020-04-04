import formatQueryArgs from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { Club } from "../../types/typeDefs";
import { GraphQLResolveInfo } from "graphql";

export const ClubQueries = {
    clubs: (
        parent: Club,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): FieldResolver => context.prisma.query.clubs(formatQueryArgs(args), info)
};
