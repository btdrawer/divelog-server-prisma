import { getUserId } from "../../authentication/authUtils";
import formatQueryArgs from "../../utils/formatQueryArgs";
import { Context, QueryArgs, FieldResolver } from "../../types";
import { Dive } from "../../types/typeDefs";
import { GraphQLResolveInfo } from "graphql";

export const DiveQueries = {
    dives: (
        parent: Dive,
        args: any,
        context: Context,
        info: GraphQLResolveInfo
    ): FieldResolver => {
        let where = {};
        if (args) {
            where = {
                ...args.where
            };
        }
        return context.prisma.query.dives(
            formatQueryArgs({
                ...args,
                where: {
                    ...where,
                    public: true,
                    user: {
                        id: args.userId
                    }
                }
            }),
            info
        );
    },
    myDives: (
        parent: Dive,
        args: QueryArgs,
        context: Context,
        info: GraphQLResolveInfo
    ): FieldResolver => {
        const { request, prisma } = context;
        const userId = getUserId(request);
        let where = {};
        if (args) {
            where = args.where;
        }
        return prisma.query.dives(
            formatQueryArgs({
                ...args,
                where: {
                    ...where,
                    user: {
                        id: userId
                    }
                }
            }),
            info
        );
    }
};
