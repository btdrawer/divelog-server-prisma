import { GraphQLResolveInfo } from "graphql";
import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated } from "../middleware";

import { Context, QueryArgs, FieldResolver } from "../../types";
import { User } from "../../types/typeDefs";

import { formatQueryArgs } from "../../utils/formatQueryArgs";

export const UserQueries = {
    users: (
        parent: any,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        context.prisma.query.users(formatQueryArgs(args), info),
    me: combineResolvers(
        isAuthenticated,
        (
            parent: User,
            args: QueryArgs,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.query.user(
                {
                    where: {
                        id: context.authUserId
                    }
                },
                info
            )
    )
};
