const express = require('express');

const app = express();

const adminRoute = express.Router();

adminRoute.get('/dashboard', (req, res) => {
    console.log(req.baseUrl);
    res.send('This is the admin Dashboard');
});

app.use('/admin', adminRoute);

app.get('/user/:id', (req, res) => {
    console.log(req.baseUrl);
    // console.log(req.params);
    // console.log(req.query);
    // console.log(req.headers);
    // console.log(req.body);
    // console.log(req.method);
    // console.log(req.path);
    // console.log(req.url); 
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});