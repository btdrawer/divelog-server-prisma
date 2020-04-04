import { getUserId } from "../../authentication/authUtils";
import { formatQueryArgs } from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { Dive } from "../../types/typeDefs";
import { GraphQLResolveInfo } from "graphql";

export const DiveQueries = {
    dives: async (
        parent: Dive,
        args: any,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        context.prisma.query.dives(
            await formatQueryArgs(args, {
                public: true,
                user: {
                    id: args.userId
                }
            }),
            info
        ),
    myDives: async (
        parent: Dive,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { request, prisma } = context;
        const userId = getUserId(request);
        return prisma.query.dives(
            await formatQueryArgs(args, {
                user: {
                    id: userId
                }
            }),
            info
        );
    }
};
