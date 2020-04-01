# divelog-server-prisma

Another version of my `divelog-server` project, this time using the Prisma ORM. Functionally very similar to [`divelog-server-graphql`](https://github.com/btdrawer/divelog-server-graphql), with some minor schema changes to make it work better with Prisma. This project was designed to run with MongoDB, but only some minor changes will be required to implement it using a relational database (as long as it is supported by Prisma).

I learned about GraphQL, Prisma, and how to implement it into NodeJS from the Udemy course [The Modern GraphQL Bootcamp (with Node.js and Apollo)](https://www.udemy.com/course/graphql-bootcamp/).

## Requirements

-   NodeJS
-   NPM
-   MongoDB (SQL databases will require some changes to `datamodel.graphql`)
-   Prisma
-   Docker

## How to run

From the root folder, type `npm i` to install the necessary dependencies.

You will also need to install **Prisma** globally: `npm i -g prisma`

Add a `.env` file to the `config` folder, with the following variables:

-   `MONGODB_URL`: The URL of your MongoDB database.
-   `MONGODB_SCHEMA`: The name of your MongoDB schema.
-   `JWT_KEY`: The secret key that your JSON Web Tokens will be signed with.
-   `SERVER_PORT`: The port that the server should listen on.
-   `PRISMA_ENDPOINT`: The endpoint that your Prisma server should be hosted on.
-   `PRISMA_SECRET`: The secret required to access your Prisma server.

To set up your Prisma server, `cd` into the `prisma` folder in the root of the repository, and run `prisma init`. The wizard will guide you through the setup.

Then, with Docker running, run `docker-compose up -d` and then `prisma deploy -e ../config/.env`.

Then, you can run the program by typing:
`npm start`

GraphQL playground will be available on localhost at `SERVER_PORT`. From there, you will have access to all possible mutations and queries.

## Unit tests

To setup unit tests, add a `.test.env` file to the `config` folder with the same variables described above, and then set up a test Prisma endpoint by running `prisma deploy -e ../config/.test.env` from the `prisma` folder.

Once you have completed this setup, run `npm test`.

You can also watch the tests: `npm run test:watch`.
