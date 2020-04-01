module.exports = ({ where, sortBy, sortOrder, limit, skip }) => {
    const args = {
        where,
        first: limit,
        skip
    };

    if (sortBy && sortOrder) {
        args.orderBy = `${sortBy}_${sortOrder}`;
    }

    return args;
};
