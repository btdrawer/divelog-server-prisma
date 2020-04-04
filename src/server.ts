import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import prisma from "./prisma";
import { resolvers } from "./resolvers/index";

const executableSchema = makeExecutableSchema({
    typeDefs: importSchema("src/schema.graphql"),
    resolvers
});

const server = () =>
    new ApolloServer({
        schema: executableSchema,
        context: request => ({
            request,
            prisma
        })
    });

export default server;
