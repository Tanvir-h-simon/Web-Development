const handlers = {};

handlers.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Not found'
    }); // Send a response with status code 404 and a payload
};

module.exports = handlers;
