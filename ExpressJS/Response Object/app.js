const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('This is the home page!');
});

// app.get('/about', (req, res) => {
//     res.send('This is the about page');
// });

app.get('/about', (req, res) => {
    // res.send('This is the about page');
    // res.end();
    // console.log(res.headersSent);
    // res.render('pages/about', {
    //     title: 'About Us',
    //     description: 'This is the about page of our website.'
    // });
    // console.log(res.headersSent);
    res.json({
        title: 'About Us',
        description: 'This is the about page of our website.'
    });
    // res.status(200);
    // res.end();
    // res.status(200).end();
    // res.statusCode();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});