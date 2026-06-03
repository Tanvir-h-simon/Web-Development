const _data = require('../helpers/fileData');
const { createHash } = require('../helpers/hash');
const tokenHandler = require('./tokenHandler');

const userHandler = {};

userHandler.users = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.includes(requestProperties.method)) {
        userHandler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, { error: 'Method not allowed' });
    }
};

userHandler._users = {};

// POST /users — create a new user
userHandler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName.trim()
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName.trim()
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone.trim()
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password.trim()
            : false;

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement === true;

    if (!firstName || !lastName || !phone || !password || !tosAgreement) {
        return callback(400, {
            error: 'Missing required fields: firstName, lastName, phone, password, tosAgreement',
        });
    }

    // Check for duplicate phone number
    _data.read('users', phone, (err) => {
        if (!err) {
            return callback(400, { error: 'A user with that phone number already exists' });
        }

        const hashedPassword = createHash(password);
        if (!hashedPassword) {
            return callback(500, { error: 'Could not hash the password' });
        }

        const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement,
            checks: [],
        };

        _data.create('users', phone, userObject, (err) => {
            if (!err) {
                callback(201, { message: 'User created successfully' });
            } else {
                callback(500, { error: 'Could not create new user' });
            }
        });
    });
};

// GET /users?phone=xxx — requires valid token
userHandler._users.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone.trim()
            : false;

    if (!phone) {
        return callback(400, { error: 'Missing required query param: phone' });
    }

    const token =
        typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;

    tokenHandler._tokens.verifyToken(token, phone, (isValid) => {
        if (!isValid) {
            return callback(403, { error: 'Authentication failed: missing or invalid token' });
        }

        _data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                delete userData.hashedPassword;
                callback(200, userData);
            } else {
                callback(404, { error: 'User not found' });
            }
        });
    });
};

// PUT /users — update one or more fields, requires valid token
userHandler._users.put = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone.trim()
            : false;

    if (!phone) {
        return callback(400, { error: 'Missing required field: phone' });
    }

    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName.trim()
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName.trim()
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password.trim()
            : false;

    if (!firstName && !lastName && !password) {
        return callback(400, { error: 'Must provide at least one field to update' });
    }

    const token =
        typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;

    tokenHandler._tokens.verifyToken(token, phone, (isValid) => {
        if (!isValid) {
            return callback(403, { error: 'Authentication failed: missing or invalid token' });
        }

        _data.read('users', phone, (err, userData) => {
            if (err || !userData) {
                return callback(404, { error: 'User not found' });
            }

            if (firstName) userData.firstName = firstName;
            if (lastName) userData.lastName = lastName;
            if (password) userData.hashedPassword = createHash(password);

            _data.update('users', phone, userData, (err) => {
                if (!err) {
                    callback(200, { message: 'User updated successfully' });
                } else {
                    callback(500, { error: 'Could not update user' });
                }
            });
        });
    });
};

// DELETE /users?phone=xxx — requires valid token; also deletes all associated checks
userHandler._users.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone.trim()
            : false;

    if (!phone) {
        return callback(400, { error: 'Missing required query param: phone' });
    }

    const token =
        typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;

    tokenHandler._tokens.verifyToken(token, phone, (isValid) => {
        if (!isValid) {
            return callback(403, { error: 'Authentication failed: missing or invalid token' });
        }

        _data.read('users', phone, (err, userData) => {
            if (err || !userData) {
                return callback(404, { error: 'User not found' });
            }

            _data.delete('users', phone, (err) => {
                if (err) {
                    return callback(500, { error: 'Could not delete user' });
                }

                const userChecks =
                    typeof userData.checks === 'object' && Array.isArray(userData.checks)
                        ? userData.checks
                        : [];

                if (userChecks.length === 0) {
                    return callback(200, { message: 'User deleted successfully' });
                }

                let checksDeleted = 0;
                let deletionErrors = false;

                userChecks.forEach((checkId) => {
                    _data.delete('checks', checkId, (err) => {
                        if (err) deletionErrors = true;
                        checksDeleted++;
                        if (checksDeleted === userChecks.length) {
                            if (deletionErrors) {
                                callback(500, {
                                    error: 'User deleted but some checks could not be removed',
                                });
                            } else {
                                callback(200, { message: 'User and all checks deleted successfully' });
                            }
                        }
                    });
                });
            });
        });
    });
};

module.exports = userHandler;
