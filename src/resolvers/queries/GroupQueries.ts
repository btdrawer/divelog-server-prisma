import { getUserId } from "../../authentication/authUtils";
import { formatQueryArgs } from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { Group } from "../../types/typeDefs";
import { GraphQLResolveInfo } from "graphql";

export const GroupQueries = {
    myGroups: async (
        parent: Group,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { request, prisma } = context;
        const userId = getUserId(request);
        return prisma.query.groups(
            await formatQueryArgs(args, {
                participants_some: {
                    id: userId
                }
            }),
            info
        );
    }
};
