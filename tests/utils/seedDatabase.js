const prisma = require("../../src/prisma");
const { signJwt, hashPassword } = require("../../src/authentication/authUtils");

const users = [
    {
        input: {
            name: "User 1",
            username: "user1",
            email: "user1@example.com",
            password: hashPassword("aafghd7675")
        },
        unhashedPassword: "aafghd7675",
        output: undefined,
        token: undefined
    },
    {
        input: {
            name: "User 2",
            username: "user2",
            email: "user2@example.com",
            password: hashPassword("jhhd6625")
        },
        unhashedPassword: "jhhd6625",
        output: undefined,
        token: undefined
    },
    {
        input: {
            name: "User 3",
            username: "user3",
            email: "user3@example.com",
            password: hashPassword("hd8y78rw4y")
        },
        unhashedPassword: "hd8y78rw4y",
        output: undefined,
        token: undefined
    }
];

const dives = [
    {
        input: {
            timeIn: "2020-01-01T11:00:00",
            timeOut: "2020-01-01T11:25:00",
            bottomTime: 22.0,
            safetyStopTime: 3.0,
            maxDepth: 17.3,
            location: "Sample location",
            description: "Dive description",
            public: true
        },
        output: undefined
    },
    {
        input: {
            timeIn: "2020-01-02T11:00:00",
            timeOut: "2020-01-02T11:22:00",
            bottomTime: 19.0,
            safetyStopTime: 3.0,
            maxDepth: 15.5,
            location: "Sample location",
            description: "Dive description",
            public: false
        },
        output: undefined
    },
    {
        input: {
            timeIn: "2020-01-03T11:00:00",
            timeOut: "2020-01-03T11:22:00",
            bottomTime: 19.0,
            safetyStopTime: 3.0,
            maxDepth: 15.9,
            location: "Sample location 2",
            description: "Dive description 2",
            public: true
        },
        output: undefined
    }
];

const clubs = [
    {
        input: {
            name: "A",
            location: "B",
            website: "example.com"
        },
        output: undefined
    },
    {
        input: {
            name: "X",
            location: "Y",
            website: "example.co.uk"
        },
        output: undefined
    }
];

const gear = [
    {
        input: {
            name: "A",
            brand: "A",
            model: "B",
            type: "C"
        },
        output: undefined
    },
    {
        input: {
            name: "X",
            brand: "Y",
            model: "Z",
            type: "W"
        },
        output: undefined
    }
];

const groups = [
    {
        input: {
            name: "New Group",
            text: "Hi"
        },
        output: undefined
    },
    {
        input: {
            name: "New Group 2",
            text: "Hi"
        },
        output: undefined
    },
    {
        input: {
            name: "New Group 3",
            text: "Hi"
        },
        output: undefined
    }
];

const saveUser = async index => {
    const user = await prisma.mutation.createUser({
        data: users[index].input
    });
    users[index].output = user;
    users[index].token = signJwt(user.id);
    return user;
};

const saveClub = async (index, managerIds, memberIds) => {
    clubs[index].input.managers = {
        connect: managerIds
    };
    clubs[index].input.members = {
        connect: memberIds
    };
    const club = await prisma.mutation.createClub(
        {
            data: clubs[index].input
        },
        "{ id name location website managers { id } members { id } }"
    );
    clubs[index].output = club;
    return club;
};

const saveGear = async (index, ownerId) => {
    gear[index].input.owner = {
        connect: {
            id: ownerId
        }
    };
    const savedGear = await prisma.mutation.createGear({
        data: gear[index].input
    });
    gear[index].output = savedGear;
    return savedGear;
};

const saveDive = async (index, userId, clubId, buddyIds, gearIds) => {
    dives[index].input.user = {
        connect: {
            id: userId
        }
    };
    if (clubId) {
        dives[index].input.club = {
            connect: {
                id: clubId
            }
        };
    }
    if (buddyIds.length > 0) {
        dives[index].input.buddies = {
            connect: buddyIds
        };
    }
    if (gearIds.length > 0) {
        dives[index].input.gear = {
            connect: gearIds
        };
    }

    const dive = await prisma.mutation.createDive({
        data: dives[index].input
    });

    dives[index].output = dive;
    return dive;
};

const saveGroup = async (index, myId, userIds) => {
    const { input } = groups[index];

    const group = await prisma.mutation.createGroup({
        data: {
            name: input.name,
            participants: {
                connect: userIds
            },
            messages: {
                create: [
                    {
                        text: input.text,
                        sender: {
                            connect: {
                                id: myId
                            }
                        }
                    }
                ]
            }
        }
    });

    groups[index].output = group;
    return group;
};

const seedDatabase = async ({ resources = {} } = {}) => {
    await prisma.mutation.deleteManyGroups();
    await prisma.mutation.deleteManyMessages();
    await prisma.mutation.deleteManyDives();
    await prisma.mutation.deleteManyGears();
    await prisma.mutation.deleteManyClubs();
    await prisma.mutation.deleteManyUsers();

    // Example users
    await saveUser(0);
    await saveUser(1);
    await saveUser(2);

    // Example clubs
    if (resources.clubs) {
        await saveClub(
            0,
            [{ id: users[0].output.id }],
            [{ id: users[1].output.id }]
        );
        await saveClub(
            1,
            [{ id: users[1].output.id }, { id: users[2].output.id }],
            [{ id: users[0].output.id }]
        );
    }

    // Example gear
    if (resources.gear) {
        await saveGear(0, users[0].output.id);
        await saveGear(1, users[0].output.id);
    }

    // Example dives
    if (resources.dives) {
        await saveDive(
            0,
            users[0].output.id,
            clubs[0].output.id,
            [{ id: users[1].output.id }],
            [{ id: gear[0].output.id }]
        );
        await saveDive(
            1,
            users[0].output.id,
            null,
            [{ id: users[1].output.id }, { id: users[2].output.id }],
            [{ id: gear[0].output.id }, { id: gear[1].output.id }]
        );
        await saveDive(2, users[0].output.id, null, [], []);
    }

    // Example groups
    if (resources.groups) {
        await saveGroup(0, users[0].output.id, [
            { id: users[0].output.id },
            { id: users[1].output.id }
        ]);
        await saveGroup(1, users[0].output.id, [
            { id: users[0].output.id },
            { id: users[1].output.id }
        ]);
        await saveGroup(2, users[0].output.id, [
            { id: users[0].output.id },
            { id: users[1].output.id }
        ]);
    }
};

module.exports = {
    seedDatabase,
    users,
    dives,
    clubs,
    gear,
    groups
};
