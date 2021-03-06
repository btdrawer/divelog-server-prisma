import { seedDatabase, users, gear } from "./utils/seedDatabase";
import {
    createGear,
    getGear,
    getGearById,
    updateGear,
    deleteGear
} from "./operations/gearOperations";
import getClient from "./utils/getClient";
import prisma from "../src/prisma";

const client = getClient();

describe("Gear", () => {
    beforeEach(
        async () =>
            await seedDatabase({
                gear: true
            })
    );

    test("Should create gear", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            data: {
                name: "B",
                brand: "C",
                model: "D",
                type: "E"
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: createGear,
            variables
        });

        expect(data.createGear.name).toEqual("B");
        expect(data.createGear.brand).toEqual("C");
        expect(data.createGear.model).toEqual("D");
        expect(data.createGear.type).toEqual("E");

        const gearExists = await prisma.exists.Gear({
            id: data.createGear.id
        });

        expect(gearExists).toEqual(true);
    });

    test("Should fail to create gear if not logged in", async () => {
        const variables = {
            data: {
                name: "B",
                brand: "C",
                model: "D",
                type: "E"
            }
        };

        await expect(
            client.mutate({
                mutation: createGear,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should return a list of users gear", async () => {
        const authenticatedClient = getClient(users[0].token);

        const { data } = await authenticatedClient.query({
            query: getGear
        });

        expect(data.gear.length).toEqual(2);
        expect(data.gear[0].name).toEqual(gear[0].input.name);
    });

    test("Should not return any gear if not logged in", async () => {
        await expect(
            client.query({
                query: getGear
            })
        ).rejects.toThrow();
    });

    test("Should return gear by ID", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: gear[0].output.id
        };

        const { data } = await authenticatedClient.query({
            query: getGearById,
            variables
        });

        expect(data.gearById.name).toEqual(gear[0].input.name);
    });

    test("Should fail to return gear by ID if not authenticated", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: gear[0].output.id
        };

        await expect(
            authenticatedClient.query({
                query: getGearById,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should return one gear by other property", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            where: {
                name: gear[0].input.name
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: getGear,
            variables
        });

        expect(data.gear.length).toEqual(1);
        expect(data.gear[0].name).toEqual(gear[0].input.name);
    });

    test("Should sort results", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            sortBy: "name",
            sortOrder: "DESC"
        };

        const { data } = await authenticatedClient.query({
            query: getGear,
            variables
        });

        expect(data.gear.length).toEqual(2);
        expect(data.gear[0].name).toEqual(gear[1].input.name);
    });

    test("Should limit results", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            limit: 1
        };

        const { data } = await authenticatedClient.query({
            query: getGear,
            variables
        });

        expect(data.gear.length).toEqual(1);
        expect(data.gear[0].name).toEqual(gear[0].input.name);
    });

    test("Should skip results", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            skip: 1
        };

        const { data } = await authenticatedClient.query({
            query: getGear,
            variables
        });

        expect(data.gear.length).toEqual(1);
        expect(data.gear[0].name).toEqual(gear[1].input.name);
    });

    test("Should update gear", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: gear[0].output.id,
            data: {
                name: "Updated name"
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: updateGear,
            variables
        });

        expect(data.updateGear.name).toEqual("Updated name");
    });

    test("Should fail to update gear if not logged in", async () => {
        const variables = {
            id: gear[0].output.id,
            data: {
                name: "Updated name"
            }
        };

        await expect(
            client.mutate({
                mutation: updateGear,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to update another users gear", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: gear[0].output.id,
            data: {
                name: "Updated name"
            }
        };

        await expect(
            authenticatedClient.mutate({
                mutation: updateGear,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should delete gear", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: gear[0].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: deleteGear,
            variables
        });

        expect(data.deleteGear.id).toEqual(gear[0].output.id);

        const gearExists = await prisma.exists.Gear({
            id: gear[0].output.id
        });

        expect(gearExists).toEqual(false);
    });

    test("Should fail to delete gear if not logged in", async () => {
        const variables = {
            id: gear[0].output.id
        };

        await expect(
            client.mutate({
                mutation: deleteGear,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to delete another users gear", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: gear[0].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: deleteGear,
                variables
            })
        ).rejects.toThrow();
    });
});
