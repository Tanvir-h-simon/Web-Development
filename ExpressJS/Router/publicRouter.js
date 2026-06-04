const express = require('express');


const publicRouter = express.Router();

publicRouter.all('*', (req, res) => {
    res.send('Home');
});

publicRouter.get('/', (req, res) => {
    res.send('This is the home page.');
});

publicRouter.get('/about', (req, res) => {
    res.send('This is the about page.');
});

module.exports = publicRouter;