import { seedDatabase, users, dives, gear } from "./utils/seedDatabase";
import {
    createDive,
    getDives,
    getMyDives,
    getDive,
    updateDive,
    addGearToDive,
    removeGearFromDive,
    addBuddyToDive,
    removeBuddyFromDive,
    deleteDive
} from "./operations/diveOperations";
import getClient from "./utils/getClient";
import prisma from "../src/prisma";

const client = getClient();

describe("Dives", () => {
    beforeEach(async () =>
        seedDatabase({
            dives: true,
            clubs: true,
            gear: true
        })
    );

    test("Should create dive", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            data: {
                timeIn: "2020-01-01T11:00:00",
                timeOut: "2020-01-01T11:25:00",
                bottomTime: 22.0,
                safetyStopTime: 3.0,
                maxDepth: 17.3,
                location: "Sample location",
                description: "Dive description",
                public: true
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: createDive,
            variables
        });

        expect(data.createDive.diveTime).toEqual(25); // bottomTime + safetyStopTime
        expect(data.createDive.user.id).toEqual(users[0].output.id);
        expect(data.createDive.public).toEqual(true);

        const diveExists = await prisma.exists.Dive({
            id: data.createDive.id
        });

        expect(diveExists).toEqual(true);
    });

    test("Should fail to create dive if not logged in", async () => {
        const variables = {
            data: {
                timeIn: "2020-01-01T11:00:00",
                timeOut: "2020-01-01T11:25:00",
                bottomTime: 22.0,
                safetyStopTime: 3.0,
                maxDepth: 17.3,
                location: "Sample location",
                description: "Dive description",
                public: true
            }
        };

        await expect(
            client.mutate({
                mutation: createDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should return a users public dives", async () => {
        const variables = {
            userId: users[0].output.id
        };

        const { data } = await client.query({
            query: getDives,
            variables
        });

        expect(data.dives.length).toEqual(2);
    });

    test("Should return a dive by its ID", async () => {
        const variables = {
            id: dives[0].output.id
        };

        const { data } = await client.query({
            query: getDive,
            variables
        });

        expect(data.dive.description).toEqual(dives[0].input.description);
    });

    test("Should return a private dive by its ID if authenticated", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: dives[1].output.id
        };

        const { data } = await authenticatedClient.query({
            query: getDive,
            variables
        });

        expect(data.dive.description).toEqual(dives[1].input.description);
    });

    test("Should fail to return a private dive by its ID if logged in as different user", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: dives[1].output.id
        };

        await expect(
            authenticatedClient.query({
                query: getDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to return a private dive by its ID if not logged in", async () => {
        const variables = {
            id: dives[1].output.id
        };

        await expect(
            client.query({
                query: getDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should limit results", async () => {
        const variables = {
            userId: users[0].output.id,
            limit: 1
        };

        const { data } = await client.query({
            query: getDives,
            variables
        });

        expect(data.dives.length).toEqual(1);
        expect(data.dives[0].id).toEqual(dives[0].output.id);
    });

    test("Should skip results", async () => {
        const variables = {
            userId: users[0].output.id,
            skip: 1
        };

        const { data } = await client.query({
            query: getDives,
            variables
        });

        expect(data.dives.length).toEqual(1);
        expect(data.dives[0].id).toEqual(dives[2].output.id);
    });

    test("Should return all dives for the authenticated user", async () => {
        const authenticatedClient = getClient(users[0].token);

        const { data } = await authenticatedClient.query({
            query: getMyDives
        });

        expect(data.myDives.length).toEqual(3);
    });

    test("Should fail to retrieve users dives if user is not authenticated", async () => {
        await expect(
            client.query({
                query: getMyDives
            })
        ).rejects.toThrow();
    });

    test("Should limit results", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            userId: users[0].output.id,
            limit: 2
        };

        const { data } = await authenticatedClient.query({
            query: getMyDives,
            variables
        });

        expect(data.myDives.length).toEqual(2);
        expect(data.myDives[0].id).toEqual(dives[0].output.id);
    });

    test("Should skip results", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            userId: users[0].output.id,
            skip: 2
        };

        const { data } = await authenticatedClient.query({
            query: getMyDives,
            variables
        });

        expect(data.myDives.length).toEqual(1);
        expect(data.myDives[0].id).toEqual(dives[2].output.id);
    });

    test("Should update dive", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: dives[0].output.id,
            data: {
                timeIn: "2020-01-04T12:30:00",
                timeOut: "2020-01-04T13:05:00",
                bottomTime: 32.0,
                safetyStopTime: 3.0
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: updateDive,
            variables
        });

        expect(data.updateDive.diveTime).toEqual(35);
    });

    test("Should fail to update another users dive", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: dives[0].output.id,
            data: {
                timeIn: "2020-01-04T12:30:00",
                timeOut: "2020-01-04T13:05:00",
                bottomTime: 32.0,
                safetyStopTime: 3.0
            }
        };

        await expect(
            authenticatedClient.mutate({
                mutation: updateDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to update another users dive if not logged in", async () => {
        const variables = {
            id: dives[0].output.id,
            data: {
                timeIn: "2020-01-04T12:30:00",
                timeOut: "2020-01-04T13:05:00",
                bottomTime: 32.0,
                safetyStopTime: 3.0
            }
        };

        await expect(
            client.mutate({
                mutation: updateDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should add gear to dive", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: dives[2].output.id,
            gearId: gear[0].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: addGearToDive,
            variables
        });

        expect(data.addGearToDive.gear.length).toEqual(1);
        expect(data.addGearToDive.gear[0].id).toEqual(gear[0].output.id);
    });

    test("Should fail to add gear to another users dive", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: dives[2].output.id,
            gearId: gear[0].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: addGearToDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to add gear to another users dive if not logged in", async () => {
        const variables = {
            id: dives[2].output.id,
            gearId: gear[0].output.id
        };

        await expect(
            client.mutate({
                mutation: addGearToDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should remove gear from dive", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: dives[0].output.id,
            gearId: gear[0].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: removeGearFromDive,
            variables
        });

        expect(data.removeGearFromDive.gear.length).toEqual(0);
    });

    test("Should fail to remove gear from another users dive", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: dives[0].output.id,
            gearId: gear[0].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: removeGearFromDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to remove gear from another users dive if not logged in", async () => {
        const variables = {
            id: dives[0].output.id,
            gearId: gear[0].output.id
        };

        await expect(
            client.mutate({
                mutation: removeGearFromDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should add buddy to dive", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: dives[2].output.id,
            buddyId: users[2].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: addBuddyToDive,
            variables
        });

        expect(data.addBuddyToDive.buddies.length).toEqual(1);
        expect(data.addBuddyToDive.buddies[0].id).toEqual(users[2].output.id);
    });

    test("Should fail to add buddy to another users dive", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: dives[2].output.id,
            buddyId: users[2].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: addBuddyToDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to add buddy to another users dive if not logged in", async () => {
        const variables = {
            id: dives[2].output.id,
            buddyId: users[2].output.id
        };

        await expect(
            client.mutate({
                mutation: addBuddyToDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should remove buddy from dive", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: dives[0].output.id,
            buddyId: users[1].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: removeBuddyFromDive,
            variables
        });

        expect(data.removeBuddyFromDive.buddies.length).toEqual(0);
    });

    test("Should fail to remove buddy from another users dive", async () => {
        const authenticatedClient = getClient(users[2].token);

        const variables = {
            id: dives[0].output.id,
            buddyId: users[1].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: removeBuddyFromDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to add buddy to another users dive if not logged in", async () => {
        const variables = {
            id: dives[0].output.id,
            buddyId: users[1].output.id
        };

        await expect(
            client.mutate({
                mutation: removeBuddyFromDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should delete dive", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: dives[0].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: deleteDive,
            variables
        });

        expect(data.deleteDive.id).toEqual(dives[0].output.id);
    });

    test("Should fail to delete another users dive", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: dives[0].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: deleteDive,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to delete dive if not logged in", async () => {
        const variables = {
            id: dives[0].output.id
        };

        await expect(
            client.mutate({
                mutation: deleteDive,
                variables
            })
        ).rejects.toThrow();
    });
});
