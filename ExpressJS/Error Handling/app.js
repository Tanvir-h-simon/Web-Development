const express = require('express');

const app = express();

app.get('/', (req, res) => {
    // res.send('This is the home page.');
    throw new Error('Something went wrong!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use((req, res, next) => {
    res.status(404).send('Page not found!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
