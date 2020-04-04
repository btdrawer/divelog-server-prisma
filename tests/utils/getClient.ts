import ApolloClient from "apollo-boost";

export const getClient = (jwt?: string) =>
    new ApolloClient({
        uri: `http://localhost:${process.env.SERVER_PORT}`,
        request: operation => {
            if (jwt) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
            }
        }
    });
