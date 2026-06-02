const http = require('http');

// const server = http.createServer();

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write("Hello Programmers");
        res.write("\nWelcome to NodeJS");
        res.end();
    } else if (req.url === '/about') {
        res.write("This is the about page");
        res.end();
    } else {
        res.write("Page not found");
        res.end();
    }
});

server.listen(3000);
console.log('Server is listening on port 3000');

// server.on('connection', (socket) => {
//     console.log('New connection');
// });
