import { extractFragmentReplacements } from "prisma-binding";
import { IResolvers } from "graphql-tools";

import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Subscription } from "./Subscription";

import { Dive } from "./types/Dive";
import { User } from "./types/User";
import { Club } from "./types/Club";
import { Group } from "./types/Group";

export const resolvers: IResolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Club,
    Dive,
    Group
};

export const fragmentReplacements = extractFragmentReplacements(resolvers);
