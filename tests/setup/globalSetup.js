const server = require("../../src/server");

module.exports = async () => {
    global.httpServer = server();
    await global.httpServer
        .listen({
            port: process.env.SERVER_PORT
        })
        .then(({ url }) => console.log(`Server started on ${url}.`));
};
