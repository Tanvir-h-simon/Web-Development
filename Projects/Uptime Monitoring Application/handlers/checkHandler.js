const _data = require('../helpers/fileData');
const { createRandomString } = require('../helpers/hash');
const tokenHandler = require('./tokenHandler');
const config = require('../config');

const checkHandler = {};

checkHandler.checks = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.includes(requestProperties.method)) {
        checkHandler._checks[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, { error: 'Method not allowed' });
    }
};

checkHandler._checks = {};

// POST /checks — create a new uptime check, requires valid token
checkHandler._checks.post = (requestProperties, callback) => {
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].includes(requestProperties.body.protocol)
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url.trim()
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['get', 'post', 'put', 'delete'].includes(requestProperties.body.method)
            ? requestProperties.body.method
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        Array.isArray(requestProperties.body.successCodes) &&
        requestProperties.body.successCodes.length > 0
            ? requestProperties.body.successCodes
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (!protocol || !url || !method || !successCodes || !timeoutSeconds) {
        return callback(400, {
            error: 'Missing or invalid fields: protocol, url, method, successCodes, timeoutSeconds',
        });
    }

    const token =
        typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;

    // Look up the token to find the owner's phone number
    _data.read('tokens', token, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(403, { error: 'Authentication failed: missing or invalid token' });
        }

        const userPhone = tokenData.phone;

        tokenHandler._tokens.verifyToken(token, userPhone, (isValid) => {
            if (!isValid) {
                return callback(403, { error: 'Authentication failed: token expired' });
            }

            _data.read('users', userPhone, (err, userData) => {
                if (err || !userData) {
                    return callback(403, { error: 'User not found' });
                }

                const userChecks =
                    typeof userData.checks === 'object' && Array.isArray(userData.checks)
                        ? userData.checks
                        : [];

                if (userChecks.length >= config.maxChecks) {
                    return callback(400, {
                        error: `Maximum check limit of ${config.maxChecks} reached`,
                    });
                }

                const checkId = createRandomString(20);
                const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                    state: 'down',
                    lastChecked: false,
                };

                _data.create('checks', checkId, checkObject, (err) => {
                    if (err) {
                        return callback(500, { error: 'Could not create the check' });
                    }

                    userData.checks = [...userChecks, checkId];
                    _data.update('users', userPhone, userData, (err) => {
                        if (!err) {
                            callback(201, checkObject);
                        } else {
                            callback(500, { error: 'Could not update user with new check' });
                        }
                    });
                });
            });
        });
    });
};

// GET /checks?id=xxx — requires valid token that owns the check
checkHandler._checks.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id.trim()
            : false;

    if (!id) {
        return callback(400, { error: 'Missing required query param: id' });
    }

    _data.read('checks', id, (err, checkData) => {
        if (err || !checkData) {
            return callback(404, { error: 'Check not found' });
        }

        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._tokens.verifyToken(token, checkData.userPhone, (isValid) => {
            if (!isValid) {
                return callback(403, { error: 'Authentication failed: missing or invalid token' });
            }
            callback(200, checkData);
        });
    });
};

// PUT /checks — update a check, requires valid token that owns the check
checkHandler._checks.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id.trim()
            : false;

    if (!id) {
        return callback(400, { error: 'Missing required field: id' });
    }

    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].includes(requestProperties.body.protocol)
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url.trim()
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['get', 'post', 'put', 'delete'].includes(requestProperties.body.method)
            ? requestProperties.body.method
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        Array.isArray(requestProperties.body.successCodes) &&
        requestProperties.body.successCodes.length > 0
            ? requestProperties.body.successCodes
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (!protocol && !url && !method && !successCodes && !timeoutSeconds) {
        return callback(400, { error: 'Must provide at least one field to update' });
    }

    _data.read('checks', id, (err, checkData) => {
        if (err || !checkData) {
            return callback(404, { error: 'Check not found' });
        }

        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._tokens.verifyToken(token, checkData.userPhone, (isValid) => {
            if (!isValid) {
                return callback(403, { error: 'Authentication failed: missing or invalid token' });
            }

            if (protocol) checkData.protocol = protocol;
            if (url) checkData.url = url;
            if (method) checkData.method = method;
            if (successCodes) checkData.successCodes = successCodes;
            if (timeoutSeconds) checkData.timeoutSeconds = timeoutSeconds;

            _data.update('checks', id, checkData, (err) => {
                if (!err) {
                    callback(200, checkData);
                } else {
                    callback(500, { error: 'Could not update check' });
                }
            });
        });
    });
};

// DELETE /checks?id=xxx — requires valid token; also removes check from user's list
checkHandler._checks.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id.trim()
            : false;

    if (!id) {
        return callback(400, { error: 'Missing required query param: id' });
    }

    _data.read('checks', id, (err, checkData) => {
        if (err || !checkData) {
            return callback(404, { error: 'Check not found' });
        }

        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._tokens.verifyToken(token, checkData.userPhone, (isValid) => {
            if (!isValid) {
                return callback(403, { error: 'Authentication failed: missing or invalid token' });
            }

            _data.delete('checks', id, (err) => {
                if (err) {
                    return callback(500, { error: 'Could not delete check' });
                }

                _data.read('users', checkData.userPhone, (err, userData) => {
                    if (err || !userData) {
                        return callback(500, { error: 'Could not find user to update check list' });
                    }

                    userData.checks = (userData.checks || []).filter((checkId) => checkId !== id);

                    _data.update('users', checkData.userPhone, userData, (err) => {
                        if (!err) {
                            callback(200, { message: 'Check deleted successfully' });
                        } else {
                            callback(500, { error: 'Check deleted but could not update user record' });
                        }
                    });
                });
            });
        });
    });
};

module.exports = checkHandler;
