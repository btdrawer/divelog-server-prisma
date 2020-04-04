import { gql, DocumentNode } from "apollo-boost";

export const createGear: DocumentNode = gql`
    mutation($data: GearInput!) {
        createGear(data: $data) {
            id
            name
            brand
            model
            type
        }
    }
`;

export const getGear: DocumentNode = gql`
    query(
        $where: GearWhereInput
        $sortBy: GearSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $skip: Int
    ) {
        gear(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
            id
            name
            brand
            model
            type
        }
    }
`;

export const updateGear: DocumentNode = gql`
    mutation($id: ID!, $data: GearInput!) {
        updateGear(id: $id, data: $data) {
            id
            name
            brand
            model
            type
        }
    }
`;

export const deleteGear: DocumentNode = gql`
    mutation($id: ID!) {
        deleteGear(id: $id) {
            id
        }
    }
`;
