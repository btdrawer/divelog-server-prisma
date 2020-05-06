import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import { RedisCache } from "apollo-server-cache-redis";

import prisma from "./prisma";
import { resolvers } from "./resolvers/index";
import getUserId from "./utils/getUserId";
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
        }),
        cache: new RedisCache({
            host: process.env.REDIS_HOST,
            port: parseInt(<string>process.env.REDIS_PORT) || 6379
        })
    });

export default server;
