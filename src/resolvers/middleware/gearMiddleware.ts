import { Gear } from "../../types/typeDefs";
import hasAccess from "../../utils/hasAccess";

export const isGearOwner = hasAccess(
    "gear",
    "{ id owner { id } }",
    (gear: Gear, authUserId: string) => gear.owner.id === authUserId
);
