import { UserMutations } from "./mutations/UserMutations";
import { DiveMutations } from "./mutations/DiveMutations";
import { ClubMutations } from "./mutations/ClubMutations";
import { GearMutations } from "./mutations/GearMutations";
import { GroupMutations } from "./mutations/GroupMutations";

export const Mutation = {
    ...UserMutations,
    ...DiveMutations,
    ...ClubMutations,
    ...GearMutations,
    ...GroupMutations
};
