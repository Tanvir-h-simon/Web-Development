const express = require('express');
const adminRouter = require('./adminRouter');
const publicRouter = require('./publicRouter');

const app = express();
app.use('/admin', adminRouter);
app.use('/', publicRouter);

// app.all('*', (req, res) => {
//     res.status(404).send('Page not found');
// });

// app.get('/', (req, res) => {
//     res.send('This is the home page.');
// });

// app.get('/about', (req, res) => {
//     res.send('This is the about page.');
// });

// app.get('/contact', (req, res) => {
//     res.send('This is the contact page.');
// });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});