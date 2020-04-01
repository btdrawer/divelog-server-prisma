const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const prisma = require("./prisma");
const { resolvers } = require("./resolvers/index");

const executableSchema = makeExecutableSchema({
    typeDefs: importSchema("src/schema.graphql"),
    resolvers
});

module.exports = () =>
    new ApolloServer({
        schema: executableSchema,
        context: request => ({
            request,
            prisma
        })
    });
