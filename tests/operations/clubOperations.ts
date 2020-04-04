import { gql, DocumentNode } from "apollo-boost";

export const createClub: DocumentNode = gql`
    mutation($data: CreateClubInput!) {
        createClub(data: $data) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

export const getClubs: DocumentNode = gql`
    query(
        $where: ClubWhereInput
        $sortBy: ClubSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $skip: Int
    ) {
        clubs(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

export const updateClub: DocumentNode = gql`
    mutation($id: ID!, $data: UpdateClubInput!) {
        updateClub(id: $id, data: $data) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

export const addClubManager: DocumentNode = gql`
    mutation($clubId: ID!, $userId: ID!) {
        addClubManager(clubId: $clubId, userId: $userId) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

export const removeClubManager: DocumentNode = gql`
    mutation($clubId: ID!, $managerId: ID!) {
        removeClubManager(clubId: $clubId, managerId: $managerId) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

export const joinClub: DocumentNode = gql`
    mutation($id: ID!) {
        joinClub(id: $id) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

export const leaveClub: DocumentNode = gql`
    mutation($id: ID!) {
        leaveClub(id: $id) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

export const removeClubMember: DocumentNode = gql`
    mutation($clubId: ID!, $memberId: ID!) {
        removeClubMember(clubId: $clubId, memberId: $memberId) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

export const deleteClub: DocumentNode = gql`
    mutation($id: ID!) {
        deleteClub(id: $id) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;
