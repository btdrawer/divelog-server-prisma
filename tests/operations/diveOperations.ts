import { gql, DocumentNode } from "apollo-boost";

export const createDive: DocumentNode = gql`
    mutation($data: CreateDiveInput!) {
        createDive(data: $data) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const getDives: DocumentNode = gql`
    query(
        $userId: ID!
        $where: DiveWhereInput
        $sortBy: DiveSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $skip: Int
    ) {
        dives(
            userId: $userId
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const getMyDives: DocumentNode = gql`
    query(
        $where: MyDiveWhereInput
        $sortBy: DiveSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $skip: Int
    ) {
        myDives(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const updateDive: DocumentNode = gql`
    mutation($id: ID!, $data: UpdateDiveInput!) {
        updateDive(id: $id, data: $data) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const addGearToDive: DocumentNode = gql`
    mutation($diveId: ID!, $gearId: ID!) {
        addGearToDive(diveId: $diveId, gearId: $gearId) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const removeGearFromDive: DocumentNode = gql`
    mutation($diveId: ID!, $gearId: ID!) {
        removeGearFromDive(diveId: $diveId, gearId: $gearId) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const addBuddyToDive: DocumentNode = gql`
    mutation($diveId: ID!, $buddyId: ID!) {
        addBuddyToDive(diveId: $diveId, buddyId: $buddyId) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const removeBuddyFromDive: DocumentNode = gql`
    mutation($diveId: ID!, $buddyId: ID!) {
        removeBuddyFromDive(diveId: $diveId, buddyId: $buddyId) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const deleteDive: DocumentNode = gql`
    mutation($id: ID!) {
        deleteDive(id: $id) {
            id
        }
    }
`;
