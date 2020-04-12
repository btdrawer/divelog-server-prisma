import { GraphQLResolveInfo } from "graphql";
import { combineResolvers } from "graphql-resolvers";
import moment from "moment";

import { isAuthenticated } from "../middleware";
import { isDiveUser } from "../middleware/diveMiddleware";

import { Context, FieldResolver } from "../../types";
import { Dive } from "../../types/typeDefs";
import { CreateDiveInput, UpdateDiveInput } from "../../types/inputs";

const processTime = (data: any): object => {
    let { timeIn, timeOut } = data;
    let diveTime: number = 0;
    if (timeIn) {
        timeIn = moment(timeIn).format("x");
    }
    if (timeOut) {
        timeOut = moment(timeOut).format("x");
    }
    if (timeIn && timeOut) {
        diveTime = (timeOut - timeIn) / 60000;
    }
    return {
        ...data,
        timeIn,
        timeOut,
        diveTime
    };
};

type DiveGearArgs = {
    id: string;
    gearId: string;
};

type DiveBuddyArgs = {
    id: string;
    buddyId: string;
};

export const DiveMutations = {
    createDive: combineResolvers(
        isAuthenticated,
        async (
            parent: Dive,
            args: {
                data: CreateDiveInput;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> => {
            const formattedData = { ...args.data };
            const { authUserId, prisma } = context;
            if (formattedData.club) {
                formattedData.club = {
                    connect: {
                        id: formattedData.club
                    }
                };
            }
            return prisma.mutation.createDive(
                {
                    data: {
                        ...processTime(formattedData),
                        user: {
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
    updateDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (
            parent: Dive,
            args: {
                id: string;
                data: UpdateDiveInput;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateDive(
                {
                    where: {
                        id: args.id
                    },
                    data: processTime(args.data)
                },
                info
            )
    ),
    addGearToDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (
            parent: Dive,
            args: DiveGearArgs,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateDive(
                {
                    where: {
                        id: args.id
                    },
                    data: {
                        gear: {
                            connect: {
                                id: args.gearId
                            }
                        }
                    }
                },
                info
            )
    ),
    removeGearFromDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (
            parent: Dive,
            args: DiveGearArgs,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateDive(
                {
                    where: {
                        id: args.id
                    },
                    data: {
                        gear: {
                            disconnect: {
                                id: args.gearId
                            }
                        }
                    }
                },
                info
            )
    ),
    addBuddyToDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (
            parent: Dive,
            args: DiveBuddyArgs,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateDive(
                {
                    where: {
                        id: args.id
                    },
                    data: {
                        buddies: {
                            connect: {
                                id: args.buddyId
                            }
                        }
                    }
                },
                info
            )
    ),
    removeBuddyFromDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (
            parent: Dive,
            args: DiveBuddyArgs,
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.updateDive(
                {
                    where: {
                        id: args.id
                    },
                    data: {
                        buddies: {
                            disconnect: {
                                id: args.buddyId
                            }
                        }
                    }
                },
                info
            )
    ),
    deleteDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (
            parent: Dive,
            args: {
                id: string;
            },
            context: Context,
            info: GraphQLResolveInfo
        ): Promise<FieldResolver> =>
            context.prisma.mutation.deleteDive(
                {
                    where: {
                        id: args.id
                    }
                },
                info
            )
    )
};
