let btn      = document.getElementById('fetch-btn');
let factText = document.getElementById('fact-text');
let statusEl = document.getElementById('status'); // renamed to avoid conflict with window.status (deprecated browser property)

let API_URL = 'https://catfact.ninja/fact';

// using .then() and .catch() (Promise chaining):
// function getCatFact() {
//     btn.disabled           = true;
//     statusEl.textContent     = 'Fetching fact...';
//     factText.textContent   = '...';
//
//     fetch(API_URL)
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(data) {
//             factText.textContent = data.fact;
//             statusEl.textContent   = 'Fact length: ' + data.length + ' characters';
//             btn.disabled = false;
//         })
//         .catch(function(error) {
//             factText.textContent = 'Could not load a fact. Check your connection.';
//             statusEl.textContent   = 'Error: ' + error.message;
//             btn.disabled = false;
//         });
// }

// using async/await
// async tells JS this function will do something that takes time (an API call)
async function getCatFact() {
    btn.disabled           = true;
    statusEl.textContent   = 'Fetching fact...';
    factText.textContent   = '...';

    try {
        let response = await fetch(API_URL);

        let data = await response.json();

        factText.textContent = data.fact;
        statusEl.textContent = 'Fact length: ' + data.length + ' characters';
    } catch (error) {
        factText.textContent = 'Could not load a fact. Check your connection.';
        statusEl.textContent = 'Error: ' + error.message;
    }

    btn.disabled = false;
}

btn.addEventListener('click', getCatFact);