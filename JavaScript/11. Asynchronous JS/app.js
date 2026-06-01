/*
Asynchronous JavaScript means JavaScript can start a task that takes time (such as 
fetching data from a server, reading a file, or waiting for a timer) and continue 
executing other code instead of waiting for that task to finish.
Why is it needed?
JavaScript is single-threaded, meaning it executes one statement at a time. 
If it waited for every slow operation to complete, the webpage would freeze.

A Web API is a feature provided by the browser, not by JavaScript itself.
┌──────────────────────────────────────┐
│               Browser                │
│                                      │
│   ┌───────────┐   ┌───────────────┐  │
│   │   JS      │ + │   Web APIs    │  │
│   │ Engine(V8)|   │(browser tools)│  │
│   └───────────┘   └───────────────┘  │
└──────────────────────────────────────┘
*/

// Categories of Web APIs:
// —————1. DOM API — selecting, modifying, creating HTML elements.—————
document.querySelector("h1").style.color = "steelblue";
document.querySelector("h1").style.fontSize = "2.5rem";
document.querySelector("body").style.fontFamily = "sans-serif";

// —————2. Events API: React to user actions — clicks, typing, scrolling, etc.—————
const button = document.getElementById("learn-btn");

// button.addEventListener('click', function() {
//   console.log("Button clicked!");
// });
button.addEventListener("click", () => {
  console.log("Button clicked!");
});

// —————3. Console API—————
console.log("info");
console.warn("warning");
console.error("error");
console.table([{name: "Tanvir", age: 25}]);

// —————4. Timers API — Run code after a delay or repeatedly.—————
console.log("This runs immediately");

// setTimeout(function() {
//     console.log("This runs after 2 seconds");
// }, 2000);
setTimeout(() => {
    console.log("This runs after 2 seconds");
}, 2000);

// setInterval(() => {
//   console.log("This runs every 1 second");
// }, 1000);

// Promises
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Data loaded");
        reject("Failed to load data");
    }, 1500);
});
promise.then(data => console.log("Promise resolved:", data))
       .catch(err => console.error("Promise rejected:", err));

// async/await is a modern way to work with Promises in JavaScript. 
// function generalFunction() {
//     return Promise.resolve("Data loaded");
// }
// console.log(generalFunction());
async function asyncFunction() {
    return "Data loaded";
}
console.log(asyncFunction());

// —————5. Fetch API — Make HTTP requests — talk to servers, load data.—————
// function fetchData() {
//     fetch("https://api.api-ninjas.com/v2/randomuser?count=1", { // Generates fake random user data
//         headers: {
//             "X-Api-Key": config.apiKey
//         }
//     })
//         /*
//         // .then (function(res) {
//         //     return res.json();
//         // })
//         .then(res => res.json())
//         // .then(function(data) {
//         //     console.log("User data:", data);
//         // })
//         .then(data => console.log("User data:", data))
//         // .catch(function(err) {
//         //     console.error("Fetch failed:", err);
//         // });
//         .catch(err => console.error("Fetch failed:", err)); */
//         .then(res => res.json())
//         .then(data => {
//             // const user = data;
//             const user = data[0];
//             const card = document.createElement("div");
//             card.style.cssText = "border:1px solid #ccc; border-radius:8px; padding:16px; max-width:300px; margin:20px auto; font-family:sans-serif;";
//             card.innerHTML = `
//                 <h2 style="text-align:center; margin:0 0 8px;">${user.first_name} ${user.last_name}</h2>
//                 <p><strong>Email:</strong> ${user.email}</p>
//                 <p><strong>Phone:</strong> ${user.phone}</p>
//                 <p><strong>Country:</strong> ${user.country}</p>
//             `;
//             document.body.appendChild(card);
//         })
//         .catch(err => console.error("Fetch failed:", err));
// }

// fetchData();

async function fetchData() {
    try {
        let res = await fetch("https://api.api-ninjas.com/v2/randomuser?count=1", { // fetch() sends a request and returns a Promise, and await waits for the response Promise.
            headers: {
                "X-Api-Key": config.apiKey
            }
        });
        let data = await res.json();
        const user = data[0];
        const card = document.createElement("div");
        card.style.cssText = "border:1px solid #ccc; border-radius:8px; padding:16px; max-width:300px; margin:20px auto; font-family:sans-serif;";
        card.innerHTML = `
            <h2 style="text-align:center; margin:0 0 8px;">${user.first_name} ${user.last_name}</h2>
            <p><strong>Email:</strong> ${user.email}</p>    
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Country:</strong> ${user.country}</p>
        `;
        document.body.appendChild(card);
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

fetchData();

// —————6. Storage API Save data in the browser.—————
// localStorage: persists even after browser closes (Permanent storage)
// window.localStorage.setItem("username", "Tanvir");
localStorage.setItem("username", "Tanvir");
localStorage.getItem("username");
console.log("Username from localStorage:", localStorage.getItem("username"));
localStorage.removeItem("username");

localStorage.setItem("user", JSON.stringify({ name: "Tanvir", age: 25 }));
const user = JSON.parse(localStorage.getItem("user"));
console.log("User object from localStorage:", user);

// sessionStorage: cleared when tab closes (Temporary storage)
sessionStorage.setItem("token", "abc123");
sessionStorage.getItem("token");
// sessionStorage.removeItem("token");
sessionStorage.clear(); // Clears all session storage data

// cookies: small pieces of data sent to server with each request (for authentication, preferences, etc.)
document.cookie = "username=Tanvir; expires=Fri, 05 Jun 2026 23:59:59 GMT; path=/";
console.log("Cookies:", document.cookie);

// —————7. Geolocation API: Get the user's physical location (asks permission first).——————
// navigator.geolocation.getCurrentPosition(function(pos) {
//   console.log("Latitude:", pos.coords.latitude);
//   console.log("Longitude:", pos.coords.longitude);
// });
navigator.geolocation.getCurrentPosition((pos) => {
  console.log(pos.coords.latitude, pos.coords.longitude);
});

// —————8. Canvas API: Draw graphics, animations, games directly on a <canvas> element.——————
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.fillStyle = "blue";
ctx.fillRect(100, 50, 100, 50);  // Draw a blue rectangle

// —————9. History & URL API: Control browser navigation without reloading.——————
const historyBtn = document.getElementById("history-btn");

historyBtn.addEventListener("click", () => {
    history.pushState({}, "", "/about"); // changes URL silently
    console.log("Current URL:", window.location.href);  // current URL
});

// —————10. Notification API: Show desktop notifications (asks permission first).—————
// Notification.requestPermission().then(function(permission) {
//     if (permission === "granted") {
//         new Notification("Hello!", {
//             body: "You have a new message"
//         });
//     }
// });

Notification.requestPermission().then(() => {
    new Notification("Hey!", { 
        body: "You have a new message" 
    });
});
