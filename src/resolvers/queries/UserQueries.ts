import { getUserId } from "../../authentication/authUtils";
import { formatQueryArgs } from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { User } from "../../types/typeDefs";
import { GraphQLResolveInfo } from "graphql";

export const UserQueries = {
    users: async (
        parent: any,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        context.prisma.query.users(await formatQueryArgs(args), info),
    me: (
        parent: User,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): FieldResolver => {
        const { request, prisma } = context;
        const userId = getUserId(request);
        return prisma.query.user(
            {
                where: {
                    id: userId
                }
            },
            info
        );
    }
};
