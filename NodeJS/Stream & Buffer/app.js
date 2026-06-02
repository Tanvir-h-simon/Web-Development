const http = require('http'); // HTTP module
const fs = require('fs'); // File System module

// Create a readable stream
// const readStream = fs.createReadStream(`${__dirname}/data.txt`);
// // readStream.on('data', (chunk) => {
// //     console.log(chunk);
// //     console.log(`Received chunk: ${chunk.length} bytes`);
// // }); 
// readStream.on('data', (chunk) => {
//     console.log(chunk.toString());
//     console.log(`Received chunk: ${chunk.length} bytes`);
// });
// const readStream = fs.createReadStream(`${__dirname}/data.txt`, 'utf-8');
// readStream.on('data', (chunk) => {
//     console.log(chunk);
//     console.log(`Received chunk: ${chunk.length} bytes`);
// });

// Create a writable stream
// const writeStream = fs.createWriteStream(`${__dirname}/output.txt`);
// readStream.on('data', (chunk) => {
//     writeStream.write(chunk);
// });

// readStream.pipe(writeStream); // Pipe the readable stream to the writable stream 

const server = http.createServer((req, res) => {
    const readStream = fs.createReadStream(`${__dirname}/data.txt`, 'utf-8');
    readStream.pipe(res);
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});