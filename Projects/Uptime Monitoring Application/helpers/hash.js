const crypto = require('crypto');
const config = require('../config');

const hash = {};

hash.createHash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.secretKey).update(str).digest('hex');
    }
    return false;
};

hash.createRandomString = (strLength) => {
    strLength = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for (let i = 0; i < strLength; i++) {
            const randomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            str += randomCharacter;
        }
        return str;
    }
    return false;
};

module.exports = hash;
