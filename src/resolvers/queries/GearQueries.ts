import { GraphQLResolveInfo } from "graphql";
import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated } from "../middleware";
import { isGearOwner } from "../middleware/gearMiddleware";

import { Context, QueryArgs, FieldResolver } from "../../types";
import { Gear } from "../../types/typeDefs";

import { formatQueryArgs } from "../../utils/formatQueryArgs";

export const GearQueries = {
    gear: combineResolvers(
        isAuthenticated,
        (
            parent: Gear,
            args: QueryArgs,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.query.gears(
                formatQueryArgs(args, {
                    owner: {
                        id: context.authUserId
                    }
                }),
                info
            )
    ),
    gearById: combineResolvers(
        isAuthenticated,
        isGearOwner,
        (
            parent: Gear,
            args: {
                id: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.query.gear(
                {
                    where: {
                        id: args.id
                    }
                },
                info
            )
    )
};
