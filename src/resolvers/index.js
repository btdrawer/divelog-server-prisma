const { extractFragmentReplacements } = require("prisma-binding");

const Query = require("./Query");
const Mutation = require("./Mutation");
const Subscription = require("./Subscription");

const Dive = require("./types/Dive");
const User = require("./types/User");
const Club = require("./types/Club");
const Group = require("./types/Group");

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Club,
    Dive,
    Group
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

module.exports = {
    resolvers,
    fragmentReplacements
};
