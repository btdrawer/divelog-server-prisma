import { getUserId } from "../../authentication/authUtils";
import diveMiddleware from "../../authentication/middleware/diveMiddleware";
import { UPDATE, DELETE } from "../../constants/methods";
import moment from "moment";
import { Context, FieldResolver } from "../../types";
import { Dive, CreateDiveInput, UpdateDiveInput } from "../../types/schema";
import { GraphQLResolveInfo } from "graphql";

const processTime = (data: CreateDiveInput | UpdateDiveInput) => {
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

const updateOperationTemplate = async (input: {
    diveId: string;
    data: object;
    context: Context;
    info: GraphQLResolveInfo;
}): Promise<FieldResolver> => {
    const { diveId, data, context, info } = input;
    await diveMiddleware({
        method: UPDATE,
        diveId,
        context
    });
    return context.prisma.mutation.updateDive(
        {
            where: {
                id: diveId
            },
            data
        },
        info
    );
};

export const DiveMutations = {
    createDive: async (
        parent: Dive,
        args: {
            data: CreateDiveInput;
        },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const formattedData = { ...args.data };
        const { request, prisma } = context;
        if (formattedData.club) {
            formattedData.club = {
                connect: {
                    id: formattedData.club
                }
            };
        }
        const userId = getUserId(request);
        return prisma.mutation.createDive(
            {
                data: {
                    ...processTime(formattedData),
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    updateDive: (
        parent: Dive,
        data: { id: string; data: UpdateDiveInput },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        updateOperationTemplate({
            diveId: data.id,
            data: processTime(data.data),
            context,
            info
        }),
    addGearToDive: (
        parent: Dive,
        data: { diveId: string; gearId: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        updateOperationTemplate({
            diveId: data.diveId,
            data: {
                gear: {
                    connect: {
                        id: data.gearId
                    }
                }
            },
            context,
            info
        }),
    removeGearFromDive: (
        parent: Dive,
        data: { diveId: string; gearId: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        updateOperationTemplate({
            diveId: data.diveId,
            data: {
                gear: {
                    disconnect: {
                        id: data.gearId
                    }
                }
            },
            context,
            info
        }),
    addBuddyToDive: (
        parent: Dive,
        data: { diveId: string; buddyId: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        updateOperationTemplate({
            diveId: data.diveId,
            data: {
                buddies: {
                    connect: {
                        id: data.buddyId
                    }
                }
            },
            context,
            info
        }),
    removeBuddyFromDive: (
        parent: Dive,
        data: { diveId: string; buddyId: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> =>
        updateOperationTemplate({
            diveId: data.diveId,
            data: {
                buddies: {
                    disconnect: {
                        id: data.buddyId
                    }
                }
            },
            context,
            info
        }),
    deleteDive: async (
        parent: Dive,
        data: { id: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        await diveMiddleware({
            method: DELETE,
            diveId: data.id,
            context
        });
        return context.prisma.mutation.deleteDive(
            {
                where: {
                    id: data.id
                }
            },
            info
        );
    }
};
