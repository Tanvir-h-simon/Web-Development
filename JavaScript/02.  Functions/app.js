/* // Standard function
function add(a, b) {
    return a + b;
}

let result = add(5, 3);
console.log(result);
*/

/* // Function expression 
// let add = function(a, b) {
//     return a + b;
// };
const add = function(a, b) {
    return a + b;
};
console.log(add(5, 3)); */

/* const add = function(a, b) {
    return a + b;
};

alert(add(5, 3)); */

/* // Arrow function
// Anonymous function
// const add = function (a, b) {return a + b};
const add = (a, b) => a + b;
console.log(add(5, 3)); 
// const hello = () => "Hello World!"; 
// const hello = (value) => "Hello " + value;*/

/* function isSubscribed() {
    console.log("Subscribed!");
}

// document.getElementById("btn").addEventListener("click", isSubscribed);
document.querySelector("button").addEventListener("click", isSubscribed); */

// Self-invoking function
(function() {
    document.querySelector("button").addEventListener("click", function() {
        console.log("Subscribed!");
    });
})();