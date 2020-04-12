import { GraphQLResolveInfo } from "graphql";
import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated } from "../middleware";
import { isUserOrDiveIsPublic } from "../middleware/diveMiddleware";

import { Context, QueryArgs, FieldResolver } from "../../types";
import { Dive } from "../../types/typeDefs";

import { formatQueryArgs } from "../../utils/formatQueryArgs";

interface DiveQueryArgs extends QueryArgs {
    userId: string;
}

export const DiveQueries = {
    dives: (
        parent: Dive,
        args: DiveQueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        context.prisma.query.dives(
            formatQueryArgs(args, {
                public: true,
                user: {
                    id: args.userId
                }
            }),
            info
        ),
    myDives: combineResolvers(
        isAuthenticated,
        (
            parent: Dive,
            args: QueryArgs,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.query.dives(
                formatQueryArgs(args, {
                    user: {
                        id: context.authUserId
                    }
                }),
                info
            )
    ),
    dive: combineResolvers(
        isUserOrDiveIsPublic,
        (
            parent: Dive,
            args: {
                id: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.query.dive(
                {
                    where: {
                        id: args.id
                    }
                },
                info
            )
    )
};
