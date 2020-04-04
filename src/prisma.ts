import { Prisma } from "prisma-binding";
import { fragmentReplacements } from "./resolvers/index";
import { Prisma as PrismaType } from "./types";

export const prisma: PrismaType = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
});
