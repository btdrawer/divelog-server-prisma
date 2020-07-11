import { Dive } from "../../types/typeDefs";
import hasAccess from "../../utils/hasAccess";

export const isDiveUser = hasAccess(
    "dive",
    "{ id user { id } }",
    (dive: Dive, authUserId: string) => dive.user && dive.user.id === authUserId
);

export const isUserOrDiveIsPublic = hasAccess(
    "dive",
    "{ id user { id } public }",
    (dive: Dive, authUserId: string) =>
        dive.user && (dive.user.id == authUserId || dive.public)
);
