import { getUserId } from "../../authentication/authUtils";
import formatQueryArgs from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { Group } from "../../types/schema";
import { GraphQLResolveInfo } from "graphql";

export const GroupQueries = {
    myGroups: (
        parent: Group,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): FieldResolver => {
        const { request, prisma } = context;
        const userId = getUserId(request);
        let where = {};
        if (args) {
            where = {
                ...args.where
            };
        }
        return prisma.query.groups(
            formatQueryArgs({
                ...args,
                where: {
                    ...where,
                    participants_some: userId
                }
            }),
            info
        );
    }
};
