import { skip } from "graphql-resolvers";
import { GraphQLResolveInfo } from "graphql";
import { errorCodes } from "@btdrawer/divelog-server-utils";
import { Context } from "../../types";
import { Club, User } from "../../types/typeDefs";

const { NOT_FOUND, FORBIDDEN } = errorCodes;

export const isClubManager = async (
    parent: Club,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
): Promise<undefined> => {
    const { authUserId, prisma } = context;
    const club = await prisma.query.club(
        {
            where: {
                id: args.id
            }
        },
        "{ id managers { id } }"
    );
    if (!club) {
        throw new Error(NOT_FOUND);
    }
    if (!club.managers.some((manager: User) => manager.id === authUserId)) {
        throw new Error(FORBIDDEN);
    }
    return skip;
};

export const isClubMember = async (
    parent: Club,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
): Promise<undefined> => {
    const { authUserId, prisma } = context;
    const club = await prisma.query.club(
        {
            where: {
                id: args.id
            }
        },
        "{ id members { id } }"
    );
    if (!club) {
        throw new Error(NOT_FOUND);
    }
    if (!club.members.some((member: User) => member.id === authUserId)) {
        throw new Error(FORBIDDEN);
    }
    return skip;
};
