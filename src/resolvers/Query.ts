import { UserQueries } from "./queries/UserQueries";
import { DiveQueries } from "./queries/DiveQueries";
import { ClubQueries } from "./queries/ClubQueries";
import { GearQueries } from "./queries/GearQueries";
import { GroupQueries } from "./queries/GroupQueries";

export const Query = {
    ...UserQueries,
    ...DiveQueries,
    ...ClubQueries,
    ...GearQueries,
    ...GroupQueries
};
