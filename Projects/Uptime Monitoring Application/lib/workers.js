const http = require('http');
const https = require('https');
const _data = require('../helpers/fileData');
const { sendTwilioSms } = require('../helpers/notifications');

const workers = {};

workers.gatherAllChecks = () => {
    _data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach((check) => {
                _data.read('checks', check, (err, checkData) => {
                    if (!err && checkData) {
                        workers.validateCheckData(checkData);
                    } else {
                        console.error(`Workers: Error reading check data for "${check}"`);
                    }
                });
            });
        } else {
            console.log('Workers: No checks to process');
        }
    });
};

workers.validateCheckData = (checkData) => {
    checkData = typeof checkData === 'object' && checkData !== null ? checkData : {};

    checkData.id =
        typeof checkData.id === 'string' && checkData.id.trim().length === 20
            ? checkData.id.trim()
            : false;

    checkData.userPhone =
        typeof checkData.userPhone === 'string' && checkData.userPhone.trim().length === 11
            ? checkData.userPhone.trim()
            : false;

    checkData.protocol =
        typeof checkData.protocol === 'string' && ['http', 'https'].includes(checkData.protocol)
            ? checkData.protocol
            : false;

    checkData.url =
        typeof checkData.url === 'string' && checkData.url.trim().length > 0
            ? checkData.url.trim()
            : false;

    checkData.method =
        typeof checkData.method === 'string' &&
        ['get', 'post', 'put', 'delete'].includes(checkData.method)
            ? checkData.method
            : false;

    checkData.successCodes =
        typeof checkData.successCodes === 'object' &&
        Array.isArray(checkData.successCodes) &&
        checkData.successCodes.length > 0
            ? checkData.successCodes
            : false;

    checkData.timeoutSeconds =
        typeof checkData.timeoutSeconds === 'number' &&
        checkData.timeoutSeconds % 1 === 0 &&
        checkData.timeoutSeconds >= 1 &&
        checkData.timeoutSeconds <= 5
            ? checkData.timeoutSeconds
            : false;

    // Set defaults for state tracking fields if missing
    checkData.state =
        typeof checkData.state === 'string' && ['up', 'down'].includes(checkData.state)
            ? checkData.state
            : 'down';

    checkData.lastChecked =
        typeof checkData.lastChecked === 'number' && checkData.lastChecked > 0
            ? checkData.lastChecked
            : false;

    const allFieldsValid =
        checkData.id &&
        checkData.userPhone &&
        checkData.protocol &&
        checkData.url &&
        checkData.method &&
        checkData.successCodes &&
        checkData.timeoutSeconds;

    if (allFieldsValid) {
        workers.performCheck(checkData);
    } else {
        console.error(`Workers: Check "${checkData.id}" has invalid data — skipping`);
    }
};

workers.performCheck = (checkData) => {
    let checkOutcome = {
        error: false,
        responseCode: false,
    };
    let outcomeSent = false;

    const parsedUrl = new URL(`${checkData.protocol}://${checkData.url}`);
    const hostname = parsedUrl.hostname;
    const urlPath = parsedUrl.pathname + parsedUrl.search;

    const requestDetails = {
        protocol: checkData.protocol + ':',
        hostname,
        method: checkData.method.toUpperCase(),
        path: urlPath,
        timeout: checkData.timeoutSeconds * 1000,
    };

    const protocolModule = checkData.protocol === 'https' ? https : http;

    const req = protocolModule.request(requestDetails, (res) => {
        checkOutcome.responseCode = res.statusCode;
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error', (e) => {
        checkOutcome.error = { error: true, value: e.message };
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('timeout', () => {
        checkOutcome.error = { error: true, value: 'timeout' };
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.end();
};

workers.processCheckOutcome = (checkData, checkOutcome) => {
    const state =
        !checkOutcome.error &&
        checkOutcome.responseCode &&
        checkData.successCodes.includes(checkOutcome.responseCode)
            ? 'up'
            : 'down';

    // Only alert if this isn't the very first check AND the state actually changed
    const alertNeeded = checkData.lastChecked && checkData.state !== state;

    const updatedCheckData = { ...checkData, state, lastChecked: Date.now() };

    console.log(
        `Workers: [${checkData.protocol}://${checkData.url}] → ${state.toUpperCase()}` +
            (checkOutcome.responseCode ? ` (HTTP ${checkOutcome.responseCode})` : ' (no response)')
    );

    _data.update('checks', updatedCheckData.id, updatedCheckData, (err) => {
        if (!err) {
            if (alertNeeded) {
                workers.alertUserToStatusChange(updatedCheckData);
            }
        } else {
            console.error(`Workers: Could not save outcome for check "${updatedCheckData.id}"`);
        }
    });
};

workers.alertUserToStatusChange = (checkData) => {
    const msg = `Alert: Your check [${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url}] is now ${checkData.state.toUpperCase()}`;
    sendTwilioSms(checkData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`Workers: SMS alert sent to ${checkData.userPhone}`);
        } else {
            console.error(`Workers: Failed to send SMS alert to ${checkData.userPhone} — ${err}`);
        }
    });
};

workers.loop = () => {
    setInterval(() => {
        workers.gatherAllChecks();
    }, 1000 * 60); // every 1 minute
};

workers.init = () => {
    // Run immediately on start, then every minute
    workers.gatherAllChecks();
    workers.loop();
};

module.exports = workers;
