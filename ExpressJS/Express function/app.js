// const http = require('http');

// const server = http.createServer((req, res) => {
//     if (req.url === '/') {
//         res.write("This is the home page");
//         res.end();
//     } else if (req.url === '/about' && req.method === 'GET') {
//         res.write("This is the about page");
//         res.end();
//     } else {
//         res.write("Page not found");
//         res.end();
//     }
// });

// server.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

const express = require('express');

const app = express();

// app.use(express.json()); // Middleware to parse JSON bodies
// app.use(express.raw()); // Middleware to parse raw bodies
const router = express.Router();
app.use(router); // Use the router for handling routes

// app.get('/', (req, res) => {
//     res.send("This is the home page");
// });
router.get('/', (req, res) => {
    res.send("This is the home page");
});

// app.get('/about', (req, res) => {
//     // console.log(req.body); // Log the request body to the console
//     // console.log(typeof req.body);
//     // console.log(req.body.toString()); // Convert the raw buffer to a string and log it
//     res.send("This is the about page");
// });
router.get('/about', (req, res) => {
    res.send("This is the about page");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});