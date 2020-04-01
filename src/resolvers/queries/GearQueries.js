const { getUserId } = require("../../authentication/authUtils");
const formatQueryArgs = require("../../utils/formatQueryArgs");

module.exports = {
    gear: async (parent, args, { request, prisma }, info) => {
        const userId = getUserId(request);
        args.where = {
            ...args.where,
            owner: {
                id: userId
            }
        };
        return prisma.query.gears(formatQueryArgs(args), info);
    }
};
