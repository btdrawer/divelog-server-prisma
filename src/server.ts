import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";

import prisma from "./prisma";
import { resolvers } from "./resolvers/index";
import { getUserId } from "./utils/authUtils";
import { Request } from "./types";

const executableSchema = makeExecutableSchema({
    typeDefs: importSchema("src/schema.graphql"),
    resolvers
});

const server = (): ApolloServer =>
    new ApolloServer({
        schema: executableSchema,
        context: request => ({
            authUserId: getUserId(<Request>request),
            prisma
        })
    });

export default server;
