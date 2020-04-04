import { GraphQLResolveInfo } from "graphql";
import { IFieldResolver } from "graphql-tools";

export interface Request {
    connection: {
        context: {
            Authorization: string;
        };
    };
    req: {
        headers: {
            authorization: string;
        };
    };
}

export interface Prisma {
    query: any;
    mutation: any;
    subscription: any;
    exists: any;
}

export interface Context {
    request: Request;
    prisma: Prisma;
}

export interface QueryArgs {
    where: object;
    sortBy: string;
    sortOrder: string;
    limit: string;
    skip: string;
}

export type FieldResolver = IFieldResolver<any, Context, GraphQLResolveInfo>;
