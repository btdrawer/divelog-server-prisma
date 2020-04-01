const formatQueryArgs = require("../../utils/formatQueryArgs");

module.exports = {
    clubs: (parent, args, { prisma }, info) =>
        prisma.query.clubs(formatQueryArgs(args), info)
};
