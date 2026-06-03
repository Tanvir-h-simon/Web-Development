const _data = require('../helpers/fileData');
const { createHash, createRandomString } = require('../helpers/hash');

const tokenHandler = {};

tokenHandler.tokens = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.includes(requestProperties.method)) {
        tokenHandler._tokens[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, { error: 'Method not allowed' });
    }
};

tokenHandler._tokens = {};

// POST /tokens — login, returns a new token
tokenHandler._tokens.post = (requestProperties, callback) => {
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

    if (!phone || !password) {
        return callback(400, { error: 'Missing required fields: phone, password' });
    }

    _data.read('users', phone, (err, userData) => {
        if (err || !userData) {
            return callback(400, { error: 'User not found' });
        }

        const hashedPassword = createHash(password);
        if (hashedPassword !== userData.hashedPassword) {
            return callback(400, { error: 'Incorrect password' });
        }

        const tokenId = createRandomString(20);
        const expires = Date.now() + 60 * 60 * 1000; // 1 hour from now
        const tokenObject = { id: tokenId, phone, expires };

        _data.create('tokens', tokenId, tokenObject, (err) => {
            if (!err) {
                callback(200, tokenObject);
            } else {
                callback(500, { error: 'Could not create token' });
            }
        });
    });
};

// GET /tokens?id=xxx
tokenHandler._tokens.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id.trim()
            : false;

    if (!id) {
        return callback(400, { error: 'Missing required field: id' });
    }

    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            callback(200, tokenData);
        } else {
            callback(404, { error: 'Token not found' });
        }
    });
};

// PUT /tokens — extend expiry by 1 hour
tokenHandler._tokens.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id.trim()
            : false;

    const extend =
        typeof requestProperties.body.extend === 'boolean' &&
        requestProperties.body.extend === true
            ? true
            : false;

    if (!id || !extend) {
        return callback(400, { error: 'Missing required fields: id, extend' });
    }

    _data.read('tokens', id, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(404, { error: 'Token not found' });
        }

        if (tokenData.expires <= Date.now()) {
            return callback(400, { error: 'Token has already expired and cannot be extended' });
        }

        tokenData.expires = Date.now() + 60 * 60 * 1000;
        _data.update('tokens', id, tokenData, (err) => {
            if (!err) {
                callback(200, { message: 'Token extended successfully', expires: tokenData.expires });
            } else {
                callback(500, { error: 'Could not update token' });
            }
        });
    });
};

// DELETE /tokens?id=xxx — logout
tokenHandler._tokens.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id.trim()
            : false;

    if (!id) {
        return callback(400, { error: 'Missing required field: id' });
    }

    _data.read('tokens', id, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(404, { error: 'Token not found' });
        }

        _data.delete('tokens', id, (err) => {
            if (!err) {
                callback(200, { message: 'Token deleted successfully' });
            } else {
                callback(500, { error: 'Could not delete token' });
            }
        });
    });
};

// Internal helper — not a route
tokenHandler._tokens.verifyToken = (id, phone, callback) => {
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData && tokenData.phone === phone && tokenData.expires > Date.now()) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

module.exports = tokenHandler;
