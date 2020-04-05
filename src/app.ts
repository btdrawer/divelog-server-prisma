import server from "./server";

server()
    .listen({
        port: process.env.SERVER_PORT
    })
    .then((config: { url: string }) =>
        console.log(`Server listening on ${config.url}.`)
    );
