import { gql, DocumentNode } from "apollo-boost";

export const createUser: DocumentNode = gql`
    mutation($data: CreateUserInput!) {
        createUser(data: $data) {
            user {
                id
                name
                username
                email
            }
            token
        }
    }
`;

export const login: DocumentNode = gql`
    mutation($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            user {
                id
                name
                username
                email
            }
            token
        }
    }
`;

export const getUsers: DocumentNode = gql`
    query(
        $where: UserWhereInput
        $sortBy: UserSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $skip: Int
    ) {
        users(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
            id
            name
            username
            email
        }
    }
`;

export const getUser: DocumentNode = gql`
    query($id: ID!) {
        user(id: $id) {
            id
            name
            username
            email
        }
    }
`;

export const getMe: DocumentNode = gql`
    query {
        me {
            id
            name
            username
            email
        }
    }
`;

export const updateUser: DocumentNode = gql`
    mutation($data: UpdateUserInput!) {
        updateUser(data: $data) {
            id
            name
            username
            email
        }
    }
`;

export const deleteUser: DocumentNode = gql`
    mutation {
        deleteUser {
            id
        }
    }
`;
