const { getUserId } = require("../../authentication/authUtils");
const formatQueryArgs = require("../../utils/formatQueryArgs");

module.exports = {
    dives: (parent, { userId, ...args }, { prisma }, info) => {
        let where = {};
        if (args) {
            where = {
                ...args.where
            };
        }
        return prisma.query.dives(
            formatQueryArgs({
                ...args,
                where: {
                    ...where,
                    public: true,
                    user: {
                        id: userId
                    }
                }
            }),
            info
        );
    },
    myDives: (parent, args, { request, prisma }, info) => {
        const userId = getUserId(request);
        let where = {};
        if (args) {
            where = {
                ...args.where
            };
        }
        return prisma.query.dives(
            formatQueryArgs({
                ...args,
                where: {
                    ...where,
                    user: {
                        id: userId
                    }
                }
            }),
            info
        );
    }
};
