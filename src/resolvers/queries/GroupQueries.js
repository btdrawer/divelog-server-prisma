const { getUserId } = require("../../authentication/authUtils");
const formatQueryArgs = require("../../utils/formatQueryArgs");

module.exports = {
    myGroups: (parent, args, { request, prisma }, info) => {
        const userId = getUserId(request);
        return prisma.query.groups(
            formatQueryArgs({
                ...args,
                participants_some: userId
            }),
            info
        );
    }
};
