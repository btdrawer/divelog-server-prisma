import { Club, User } from "../../types/typeDefs";
import hasAccess from "../../utils/hasAccess";

export const isClubManager = hasAccess(
    "club",
    "{ id managers { id } }",
    (club: Club, authUserId: string) =>
        club.managers.some((manager: User) => manager.id === authUserId)
);

export const isClubMember = hasAccess(
    "club",
    "{ id members { id } }",
    (club: Club, authUserId: string) =>
        club.members.some((member: User) => member.id === authUserId)
);
