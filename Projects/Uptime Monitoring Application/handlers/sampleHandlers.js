const handlers = {};

handlers.sampleHandler = (requestProperties, callback) => {
    // console.log(requestProperties);
    // console.log('This is a sample handler');
    callback(200, {
        message: 'Sample handler called'
    }); // Send a response with status code 200 and a payload
};

module.exports = handlers;
