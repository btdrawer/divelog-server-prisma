import { getUserId } from "../../authentication/authUtils";
import gearMiddleware from "../../authentication/middleware/gearMiddleware";
import { UPDATE, DELETE } from "../../constants/methods";
import { Gear, GearInput } from "../../types/schema";
import { Context, FieldResolver } from "../../types";
import { GraphQLResolveInfo } from "graphql";

export const GearMutations = {
    createGear: async (
        parent: Gear,
        args: { data: GearInput },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { request, prisma } = context;
        const userId = getUserId(request);
        return prisma.mutation.createGear(
            {
                data: {
                    ...args.data,
                    owner: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    updateGear: async (
        parent: Gear,
        args: { id: string; data: GearInput },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { id, data } = args;
        await gearMiddleware({
            method: UPDATE,
            gearId: id,
            context
        });
        return context.prisma.mutation.updateGear(
            {
                where: {
                    id: id
                },
                data
            },
            info
        );
    },
    deleteGear: async (
        parent: Gear,
        args: { id: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { id } = args;
        await gearMiddleware({
            method: DELETE,
            gearId: id,
            context
        });
        return context.prisma.mutation.deleteGear(
            {
                where: {
                    id
                }
            },
            info
        );
    }
};
