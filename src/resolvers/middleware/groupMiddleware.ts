import { Group, User } from "../../types/typeDefs";
import hasAccess from "../../utils/hasAccess";

export const isGroupParticipant = hasAccess(
    "group",
    "{ id participants { id } }",
    (group: Group, authUserId: string) =>
        group.participants.some(
            (participant: User) => participant.id === authUserId
        )
);
