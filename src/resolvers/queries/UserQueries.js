const { getUserId } = require("../../authentication/authUtils");
const formatQueryArgs = require("../../utils/formatQueryArgs");

module.exports = {
    users: (parent, args, { prisma }, info) =>
        prisma.query.users(formatQueryArgs(args), info),
    me: (parent, args, { request, prisma }, info) => {
        const userId = getUserId(request);
        return prisma.query.user(
            {
                where: {
                    id: userId
                }
            },
            info
        );
    }
};
