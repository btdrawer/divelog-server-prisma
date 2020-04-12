import { GraphQLResolveInfo } from "graphql";
import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated } from "../middleware";

import { Context, QueryArgs, FieldResolver } from "../../types";
import { Group } from "../../types/typeDefs";

import { formatQueryArgs } from "../../utils/formatQueryArgs";

export const GroupQueries = {
    myGroups: combineResolvers(
        isAuthenticated,
        (
            parent: Group,
            args: QueryArgs,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.query.groups(
                formatQueryArgs(args, {
                    participants_some: {
                        id: context.authUserId
                    }
                }),
                info
            )
    )
};
