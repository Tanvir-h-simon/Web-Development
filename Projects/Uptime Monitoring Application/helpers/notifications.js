const https = require('https');
const config = require('../config');

const notifications = {};

notifications.sendTwilioSms = (phone, msg, callback) => {
    phone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    msg =
        typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600
            ? msg.trim()
            : false;

    if (phone && msg) {
        if (config.twilio.accountSid && config.twilio.authToken && config.twilio.fromPhone) {
            const payload = new URLSearchParams({
                From: config.twilio.fromPhone,
                To: `+88${phone}`,
                Body: msg,
            }).toString();

            const requestDetails = {
                protocol: 'https:',
                hostname: 'api.twilio.com',
                method: 'POST',
                path: `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
                auth: `${config.twilio.accountSid}:${config.twilio.authToken}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(payload),
                },
            };

            const req = https.request(requestDetails, (res) => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    callback(false);
                } else {
                    callback(`SMS request failed with status: ${res.statusCode}`);
                }
            });

            req.on('error', (e) => {
                callback(e.message);
            });

            req.write(payload);
            req.end();
        } else {
            // Twilio not configured — log instead of failing silently
            console.log(`[SMS NOT CONFIGURED] Would send to ${phone}: "${msg}"`);
            callback(false);
        }
    } else {
        callback('Invalid phone number or message');
    }
};

module.exports = notifications;
