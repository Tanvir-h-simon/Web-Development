// const path = require('path');
// const myPath = 'E:/Coding/Web Development/NodeJS/app.js'
// const os = require('os');
// const fs = require('fs');
const EventEmitter = require('events');
const emitter = new EventEmitter();
const School = require('./school');

// Listen for the event
// emitter.on('bellRing', () => {
//     console.log('The bell has rung!');
// });
// emitter.on('bellRing', (period) => {
//     console.log(`The bell has rung! ${period} ended!`);
// });

// // Raise an event
// // emitter.emit('bellRing');
// setTimeout(() => {
//     emitter.emit('bellRing', 'First period');
// }, 2000);

const school = new School('Greenwood');
school.on('classStarted', (schoolName) => {
    console.log(`Received event: Class started at ${schoolName} school.`);
});

school.startClass();

// console.log(path.dirname(myPath));
// console.log(path.extname(myPath));
// console.log(path.basename(myPath));
// console.log(path.parse(myPath));

// console.log(os.platform());
// console.log(os.arch());
// console.log(os.freemem()); // Free memory (in bytes)
// console.log(os.totalmem()); // Total memory (in bytes)
// console.log(os.cpus());

// fs.writeFileSync('example.txt', 'Hello, this is an example file!');
// fs.appendFileSync('example.txt', '\nThis line is appended to the file.');

// const fileContent = fs.readFileSync('example.txt');
// // console.log(fileContent); // print the buffer content, which is not human-readable
// console.log(fileContent.toString());

// const data = fs.readFile('example.txt', (err, data) => {
//     console.log(data.toString());
// });
