import { GraphQLResolveInfo } from "graphql";

import { Context, QueryArgs, FieldResolver } from "../../types";
import { Club } from "../../types/typeDefs";

import { formatQueryArgs } from "../../utils/formatQueryArgs";

export const ClubQueries = {
    clubs: (
        parent: Club,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        context.prisma.query.clubs(formatQueryArgs(args), info),
    club: (
        parent: Club,
        args: {
            id: string;
        },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        context.prisma.query.club(
            {
                where: {
                    id: args.id
                }
            },
            info
        )
};
