import { seedDatabase, users } from "./utils/seedDatabase";
import {
    createUser,
    login,
    getUsers,
    getUser,
    getMe,
    updateUser,
    deleteUser
} from "./operations/userOperations";
import getClient from "./utils/getClient";
import prisma from "../src/prisma";

const client = getClient();

describe("Users", () => {
    beforeEach(async () => await seedDatabase());

    test("Should create new user", async () => {
        const variables = {
            data: {
                name: "User 4",
                username: "user4",
                email: "email4@example.com",
                password: "hjsat367"
            }
        };

        const { data } = await client.mutate({
            mutation: createUser,
            variables
        });

        expect(data.createUser.user.name).toEqual("User 4");
        expect(data.createUser.user.username).toEqual("user4");

        const userExists = await prisma.exists.User({
            id: data.createUser.user.id
        });

        expect(userExists).toEqual(true);
    });

    test("Should fail to create new user where username has been taken", async () => {
        const variables = {
            data: {
                name: "User 4",
                username: users[0].input,
                email: "email4@example.com",
                password: "hjsat367"
            }
        };

        await expect(
            client.mutate({
                mutation: createUser,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to create new user where email has been taken", async () => {
        const variables = {
            data: {
                name: "User 4",
                username: "user4",
                email: users[0].input.email,
                password: "hjsat367"
            }
        };

        await expect(
            client.mutate({
                mutation: createUser,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should successfully login", async () => {
        const variables = {
            username: users[0].input.username,
            password: users[0].unhashedPassword
        };

        const { data } = await client.mutate({
            mutation: login,
            variables
        });

        expect(data.login.user.name).toEqual(users[0].input.name);
        expect(data.login.user.username).toEqual(users[0].input.username);
    });

    test("Should fail to login with bad credentials", async () => {
        const variables = {
            username: "fakeusername",
            password: "djhfjkdsr3ywiueh"
        };

        await expect(
            client.mutate({
                mutation: login,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should return user by ID", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: users[1].output.id
        };

        const { data } = await authenticatedClient.query({
            query: getUser,
            variables
        });

        expect(data.user.id).toEqual(users[1].output.id);
    });

    test("Should return logged in user", async () => {
        const authenticatedClient = getClient(users[0].token);

        const { data } = await authenticatedClient.query({
            query: getMe
        });

        expect(data.me.id).toEqual(users[0].output.id);
    });

    test("Should return a list of users", async () => {
        const { data } = await client.query({
            query: getUsers
        });

        expect(data.users.length).toEqual(3);
    });

    test("Should only return emails for logged in users", async () => {
        const authenticatedClient = getClient(users[0].token);

        const { data } = await authenticatedClient.query({
            query: getUsers
        });

        expect(data.users[0].email).toEqual(users[0].input.email);
        expect(data.users[1].email).toEqual(null);
    });

    test("Should return one user by ID", async () => {
        const variables = {
            where: {
                id: users[1].output.id
            }
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(1);
        expect(data.users[0].name).toEqual(users[1].input.name);
    });

    test("Should return one user by other property", async () => {
        const variables = {
            where: {
                name: users[1].input.name
            }
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(1);
        expect(data.users[0].name).toEqual(users[1].input.name);
    });

    test("Should sort results", async () => {
        const variables = {
            sortBy: "name",
            sortOrder: "DESC"
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(3);
        expect(data.users[0].name).toEqual(users[2].input.name);
    });

    test("Should limit results", async () => {
        const variables = {
            limit: 2
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(2);
        expect(data.users[0].name).toEqual(users[0].input.name);
    });

    test("Should skip results", async () => {
        const variables = {
            skip: 1
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(2);
        expect(data.users[0].name).toEqual(users[1].input.name);
    });

    test("Should update user", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            data: {
                name: "User 1 updated",
                username: "user1updated"
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: updateUser,
            variables
        });

        expect(data.updateUser.name).toEqual("User 1 updated");
        expect(data.updateUser.username).toEqual("user1updated");
    });

    test("Should update user", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            data: {
                name: "User 1 updated",
                username: "user1updated"
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: updateUser,
            variables
        });

        expect(data.updateUser.name).toEqual("User 1 updated");
        expect(data.updateUser.username).toEqual("user1updated");
    });

    test("Should delete user", async () => {
        const authenticatedClient = getClient(users[0].token);

        await authenticatedClient.mutate({
            mutation: deleteUser
        });

        const userExists = await prisma.exists.User({
            id: users[0].output.id
        });

        expect(userExists).toBe(false);
    });
});
