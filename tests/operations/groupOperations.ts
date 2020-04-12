import { gql, DocumentNode } from "apollo-boost";

export const createGroup: DocumentNode = gql`
    mutation($data: CreateGroupInput!) {
        createGroup(data: $data) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
                sender {
                    id
                }
            }
        }
    }
`;

export const getMyGroups: DocumentNode = gql`
    query(
        $where: GroupWhereInput
        $sortBy: GroupSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $skip: Int
    ) {
        myGroups(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
            }
        }
    }
`;

export const getGroup: DocumentNode = gql`
    query($id: ID!) {
        group(id: $id) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
            }
        }
    }
`;

export const renameGroup: DocumentNode = gql`
    mutation($id: ID!, $name: String!) {
        renameGroup(id: $id, name: $name) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
            }
        }
    }
`;

export const sendMessage: DocumentNode = gql`
    mutation($id: ID!, $text: String!) {
        sendMessage(id: $id, text: $text) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
                sender {
                    id
                }
            }
        }
    }
`;

export const addGroupParticipant: DocumentNode = gql`
    mutation($id: ID!, $userId: ID!) {
        addGroupParticipant(id: $id, userId: $userId) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
            }
        }
    }
`;

export const leaveGroup: DocumentNode = gql`
    mutation($id: ID!) {
        leaveGroup(id: $id) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
            }
        }
    }
`;
