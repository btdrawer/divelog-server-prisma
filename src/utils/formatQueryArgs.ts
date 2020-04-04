import { QueryArgs } from "../types";

async function formatQueryArgs(input: QueryArgs) {
    const { where, sortBy, sortOrder, limit, skip } = input;
    const args = {
        where,
        first: limit,
        skip
    };
    if (sortBy && sortOrder) {
        return {
            ...args,
            orderBy: `${sortBy}_${sortOrder}`
        };
    }
    return args;
}

export default formatQueryArgs;
