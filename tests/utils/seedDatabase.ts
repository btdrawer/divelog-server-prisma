import prisma from "../../src/prisma";
import { signJwt, hashPassword } from "../../src/utils/authUtils";
import {
    AuthPayload,
    User,
    Dive,
    Club,
    Gear,
    Group
} from "../../src/types/typeDefs";
import {
    Input,
    CreateUserInput,
    CreateDiveInput,
    CreateClubInput,
    GearInput,
    CreateGroupInput
} from "../../src/types/inputs";

interface TestData<TInput = Input, TOutput = any> {
    input: TInput;
    output: TOutput | any;
    unhashedPassword?: string;
    token?: string;
}

type IdArray = {
    id: any;
}[];

export const users: TestData<CreateUserInput, User>[] = [
    {
        input: {
            name: "User 1",
            username: "user1",
            email: "user1@example.com",
            password: hashPassword("aafghd7675")
        },
        output: {},
        unhashedPassword: "aafghd7675",
        token: undefined
    },
    {
        input: {
            name: "User 2",
            username: "user2",
            email: "user2@example.com",
            password: hashPassword("jhhd6625")
        },
        output: {},
        unhashedPassword: "jhhd6625",
        token: undefined
    },
    {
        input: {
            name: "User 3",
            username: "user3",
            email: "user3@example.com",
            password: hashPassword("hd8y78rw4y")
        },
        output: {},
        unhashedPassword: "hd8y78rw4y",
        token: undefined
    }
];

export const dives: TestData<CreateDiveInput, Dive>[] = [
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
        output: {}
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
        output: {}
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
        output: {}
    }
];

export const clubs: TestData<CreateClubInput, Club>[] = [
    {
        input: {
            name: "A",
            location: "B",
            website: "example.com"
        },
        output: {}
    },
    {
        input: {
            name: "X",
            location: "Y",
            website: "example.co.uk"
        },
        output: {}
    }
];

export const gear: TestData<GearInput, Gear>[] = [
    {
        input: {
            name: "A",
            brand: "A",
            model: "B",
            type: "C"
        },
        output: {}
    },
    {
        input: {
            name: "X",
            brand: "Y",
            model: "Z",
            type: "W"
        },
        output: {}
    }
];

export const groups: TestData<CreateGroupInput, Group>[] = [
    {
        input: {
            name: "New Group",
            text: "Hi",
            participants: []
        },
        output: {}
    },
    {
        input: {
            name: "New Group 2",
            text: "Hi",
            participants: []
        },
        output: {}
    },
    {
        input: {
            name: "New Group 3",
            text: "Hi",
            participants: []
        },
        output: {}
    }
];

export const saveUser = async (index: number) => {
    const user = await prisma.mutation.createUser({
        data: users[index].input
    });
    users[index].output = user;
    users[index].token = signJwt(user.id);
    return user;
};

export const saveClub = async (
    index: number,
    managerIds: IdArray,
    memberIds: IdArray
) => {
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

export const saveGear = async (index: number, ownerId: string) => {
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

export const saveDive = async (
    index: number,
    userId: string,
    clubId: string | null,
    buddyIds: IdArray,
    gearIds: IdArray
) => {
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

export const saveGroup = async (
    index: number,
    myId: string,
    userIds: IdArray
) => {
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

export const seedDatabase = async (resources?: {
    clubs?: boolean;
    gear?: boolean;
    dives?: boolean;
    groups?: boolean;
}): Promise<void> => {
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

    if (resources) {
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
    }
};
