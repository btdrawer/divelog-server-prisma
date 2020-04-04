import { getUserId } from "../../authentication/authUtils";
import clubMiddleware from "../../authentication/middleware/clubMiddleware";
import { UPDATE, DELETE } from "../../constants/methods";
import clubOperations from "../../constants/clubOperations";
import { Context, FieldResolver } from "../../types";
import { Club } from "../../types/typeDefs";
import { GraphQLResolveInfo } from "graphql";

export const ClubMutations = {
    createClub: async (
        parent: Club,
        args: { data: object },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { request, prisma } = context;
        const userId = getUserId(request);
        return prisma.mutation.createClub(
            {
                data: {
                    ...args.data,
                    managers: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    updateClub: async (
        parent: Club,
        args: { id: string; data: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { id, data } = args;
        await clubMiddleware({
            method: UPDATE,
            clubId: args.id,
            context
        });
        return context.prisma.mutation.updateClub(
            {
                where: {
                    id
                },
                data
            },
            info
        );
    },
    addClubManager: async (
        parent: Club,
        args: { clubId: string; userId: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { clubId, userId } = args;
        await clubMiddleware({
            method: UPDATE,
            clubId,
            context,
            operation: clubOperations.ADD_CLUB_MANAGER,
            opUserId: userId
        });
        return context.prisma.mutation.updateClub(
            {
                where: {
                    id: clubId
                },
                data: {
                    managers: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    removeClubManager: async (
        parent: Club,
        args: { clubId: string; managerId: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { clubId, managerId } = args;
        await clubMiddleware({
            method: UPDATE,
            clubId,
            context,
            operation: clubOperations.REMOVE_CLUB_MANAGER,
            opUserId: managerId
        });
        return context.prisma.mutation.updateClub(
            {
                where: {
                    id: clubId
                },
                data: {
                    managers: {
                        disconnect: {
                            id: managerId
                        }
                    }
                }
            },
            info
        );
    },
    joinClub: async (
        parent: Club,
        args: { id: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { id } = args;
        const { request, prisma } = context;
        const userId = getUserId(request);
        await clubMiddleware({
            method: UPDATE,
            clubId: id,
            context,
            operation: clubOperations.JOIN_CLUB
        });
        return prisma.mutation.updateClub(
            {
                where: {
                    id
                },
                data: {
                    members: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    leaveClub: async (
        parent: Club,
        args: { id: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { id } = args;
        const { request, prisma } = context;
        const userId = getUserId(request);
        await clubMiddleware({
            method: UPDATE,
            clubId: id,
            context,
            operation: clubOperations.LEAVE_CLUB
        });
        return prisma.mutation.updateClub(
            {
                where: {
                    id
                },
                data: {
                    members: {
                        disconnect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    removeClubMember: async (
        parent: Club,
        args: { clubId: string; memberId: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { clubId, memberId } = args;
        await clubMiddleware({
            method: UPDATE,
            clubId,
            context,
            operation: clubOperations.REMOVE_CLUB_MEMBER,
            opUserId: memberId
        });
        return context.prisma.mutation.updateClub(
            {
                where: {
                    id: clubId
                },
                data: {
                    members: {
                        disconnect: {
                            id: memberId
                        }
                    }
                }
            },
            info
        );
    },
    deleteClub: async (
        parent: Club,
        args: { id: string },
        context: Context,
        info: GraphQLResolveInfo
    ): Promise<FieldResolver> => {
        const { id } = args;
        await clubMiddleware({
            method: DELETE,
            clubId: id,
            context
        });
        return context.prisma.mutation.deleteClub(
            {
                where: {
                    id
                }
            },
            info
        );
    }
};
