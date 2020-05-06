import { GraphQLResolveInfo } from "graphql";
import { skip } from "graphql-resolvers";
import { errorCodes } from "@btdrawer/divelog-server-utils";
import { Context } from "../../types";
import { Group, User } from "../../types/typeDefs";

const { NOT_FOUND, FORBIDDEN } = errorCodes;

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
