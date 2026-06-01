// const quotes = [
//     { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
//     { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
//     { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
//     { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
//     { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
//     { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
//     { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
//     { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
// ];

const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const button = document.getElementById('generate-quote');

// button.addEventListener('click', function () {
//     const random = quotes[Math.floor(Math.random() * quotes.length)];
//     quoteElement.textContent = random.text;
//     authorElement.textContent = random.author;
// });

const url = 'https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom';
const key = config.apiKey;
const getQuote = () => {
      fetch(url, {
        headers: { 'X-Api-Key': key },
      })
        .then(data => data.json())
        .then(quotes => {
        quoteElement.textContent = quotes[0].quote;
        authorElement.textContent = quotes[0].author;
      }).catch(error => {
        quoteElement.textContent = 'An error occurred while fetching the quote.';
        authorElement.textContent = '';
        console.error('Error fetching quote:', error);
      });
};

button.addEventListener('click', getQuote);