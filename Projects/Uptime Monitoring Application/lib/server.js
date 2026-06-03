const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const config = require('../config');

const server = {};

server.createServer = () => {
    const httpServer = http.createServer(handleReqRes);
    httpServer.listen(config.httpPort, () => {
        console.log(`Server is listening on port ${config.httpPort} [${config.envName}]`);
    });
    httpServer.on('error', (err) => {
        console.error('Server error:', err.message);
        process.exit(1);
    });
};

server.init = () => {
    server.createServer();
};

module.exports = server;
