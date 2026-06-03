const { sampleHandler } = require('./handlers/sampleHandlers');
const userHandler = require('./handlers/userHandler');
const tokenHandler = require('./handlers/tokenHandler');
const checkHandler = require('./handlers/checkHandler');

const routes = {
    sample: sampleHandler,
    users: userHandler.users,
    tokens: tokenHandler.tokens,
    checks: checkHandler.checks,
};

module.exports = routes;
