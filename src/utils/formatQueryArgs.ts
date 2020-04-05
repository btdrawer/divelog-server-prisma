import { WhereField, QueryArgs } from "../types";

export const formatQueryArgs = async (
    input: QueryArgs,
    requiredWhereFields?: WhereField
): Promise<object> => {
    const { where, sortBy, sortOrder, limit, skip } = input;
    const args = {
        where,
        first: limit,
        skip
    };
    if (where && requiredWhereFields) {
        Object.keys(where).forEach(field => {
            if (requiredWhereFields[field]) {
                delete where[field];
            }
        });
        args.where = {
            ...args.where,
            ...requiredWhereFields
        };
    } else if (requiredWhereFields) {
        args.where = {
            ...requiredWhereFields
        };
    }
    if (sortBy && sortOrder) {
        return {
            ...args,
            orderBy: `${sortBy}_${sortOrder}`
        };
    }
    return args;
};
