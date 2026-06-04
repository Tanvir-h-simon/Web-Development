// Middleware: A function that has access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. 
// The next middleware function is commonly denoted by a variable named next.
const express = require('express');

const app = express();

const adminRouter = express.Router();

adminRouter.get('/dashboard', (req, res) => {
    res.send('Admin Dashboard');
});


// const middleware = (req, res, next) => {
//     console.log('Middleware function executed');
//     next(); // If don't call next(), the request will be left hanging and the response will not be sent.
// };

// app.use(middleware);

const loggerMiddleware = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} - ${req.url}`);
    next();
}

// app.use(loggerMiddleware);
adminRouter.use(loggerMiddleware);
app.use('/admin', adminRouter);

// app.get('/', (req, res) => {
//     res.send('This is the home page.');
// });

app.get('/about', (req, res) => {
    res.send('This is the about page.');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});