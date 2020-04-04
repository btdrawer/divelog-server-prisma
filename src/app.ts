import server from "./server";

server()
    .listen({
        port: process.env.SERVER_PORT
    })
    .then(({ url }) => console.log(`Server listening on ${url}.`));
