const express = require('express');

// const app = express();
// app.locals.title = 'Express Application Object';
// app.get('/', (req, res) => {
//     res.send(`Welcome to ${app.locals.title}`);
// });

// app.listen(3000, () => {
//     console.log(`${app.locals.title} is running on port 3000`);
// }); 

// const app = express();
// const admin = express();

// // app.get('/', (req, res) => {
// //     res.send("This is the home page.");
// // });

// // admin.get('/', (req, res) => {
// //     res.send("This is the admin dashboard.");
// // });

// // app.listen(3000, () => {
// //     console.log("Main app is running on port 3000");
// // });

// // admin.listen(3001, () => {
// //     console.log("Admin app is running on port 3001");
// // });

// admin.on('mount', (parent) => {
//     console.log('Admin mounted on parent app');
//     console.log(parent); // The parent app instance
// });

// admin.get('/dashboard', (req, res) => {
//     console.log(admin.mountpath);
//     res.send("This is the admin dashboard.");
// });

// app.get('/', (req, res) => {
//     res.send("This is the home page.");
// });

// app.use('/admin', admin);

// app.listen(3000, () => {
//     console.log("Main app is running on port 3000");
// });

const app = express();

app.get('/', (req, res) => {
    res.send("Welcome to the home page.");
});

// app.all('/', (req, res) => {
//     res.send(`Received a ${req.method} request at the home page.`);
// });

app.enable('case sensitive routing');

app.get('/about', (req, res) => {
    res.send("This is the about page.");
});

app.listen(3000, () => {
    console.log("App is running on port 3000");
});