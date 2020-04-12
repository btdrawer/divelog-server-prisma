import { GraphQLResolveInfo } from "graphql";
import { skip } from "graphql-resolvers";

import { Context } from "../../types";
import { Group, User } from "../../types/typeDefs";

import { NOT_FOUND, FORBIDDEN } from "../../constants/errorCodes";

export const isGroupParticipant = async (
    parent: Group,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
): Promise<undefined> => {
    const { authUserId, prisma } = context;
    const group = await prisma.query.group(
        {
            where: {
                id: args.id
            }
        },
        "{ id participants { id } }"
    );
    if (!group) {
        throw new Error(NOT_FOUND);
    }
    if (
        !group.participants.some(
            (participant: User) => participant.id === authUserId
        )
    ) {
        throw new Error(FORBIDDEN);
    }
    return skip;
};
