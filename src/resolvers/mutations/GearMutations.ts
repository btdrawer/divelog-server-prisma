import { GraphQLResolveInfo } from "graphql";
import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated } from "../middleware";
import { isGearOwner } from "../middleware/gearMiddleware";

import { Gear } from "../../types/typeDefs";
import { Context, FieldResolver } from "../../types";
import { GearInput } from "../../types/inputs";

export const GearMutations = {
    createGear: combineResolvers(
        isAuthenticated,
        async (
            parent: Gear,
            args: {
                data: GearInput;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const { authUserId, prisma } = context;
            return prisma.mutation.createGear(
                {
                    data: {
                        ...args.data,
                        owner: {
                            connect: {
                                id: authUserId
                            }
                        }
                    }
                },
                info
            );
        }
    ),
    updateGear: combineResolvers(
        isAuthenticated,
        isGearOwner,
        async (
            parent: Gear,
            args: {
                id: string;
                data: GearInput;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateGear(
                {
                    where: {
                        id: args.id
                    },
                    data: args.data
                },
                info
            )
    ),
    deleteGear: combineResolvers(
        isAuthenticated,
        isGearOwner,
        async (
            parent: Gear,
            args: {
                id: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.deleteGear(
                {
                    where: {
                        id: args.id
                    }
                },
                info
            )
    )
};
