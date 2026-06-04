const express = require('express');

const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
    res.send('Welcome to the admin dashboard.');
});

adminRouter.get('/users', (req, res) => {
    res.send('Here you can manage users.');
});

adminRouter.get('/settings', (req, res) => {
    res.send('Here you can manage settings.');
});

module.exports = adminRouter;