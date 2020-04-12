import { GraphQLResolveInfo } from "graphql";
import { IFieldResolver } from "graphql-tools";
import { Prisma } from "prisma-binding";

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

export interface Context {
    authUserId: String;
    prisma: Prisma;
}

export type QueryArgs = {
    where?: WhereField;
    sortBy?: string;
    sortOrder?: string;
    limit?: string;
    skip?: string;
};

export type WhereField = {
    [key: string]: any;
};

export type FieldResolver = IFieldResolver<any, Context, GraphQLResolveInfo>;
