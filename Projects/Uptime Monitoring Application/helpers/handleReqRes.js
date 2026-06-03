// const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes');
const {notFoundHandler} = require('../handlers/notFoundHandler');

const handler = {};

handler.handleReqRes = (req, res) => {
    // Handle requests
    // const parsedUrl = url.parse(req.url, true);
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    // console.log(parsedUrl);
    const path = parsedUrl.pathname;
    // console.log(path);
    const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // Remove leading and trailing slashes
    // console.log(trimmedPath);
    const method = req.method.toLowerCase(); // Get the HTTP method
    // const queryStringObject = parsedUrl.query;
    const queryStringObject = Object.fromEntries(parsedUrl.searchParams); // Get the query string as an object
    const headersObject = req.headers; // Get the request headers as an object

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        try {
            requestProperties.body = realData.length > 0 ? JSON.parse(realData) : {};
        } catch (e) {
            requestProperties.body = {};
        }

        const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payload) === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;