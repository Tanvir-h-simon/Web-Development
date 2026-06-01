// All JavaScript values, except primitives, are objects. Ex: Functions, Arrays, Sets, Maps, Maths, Dates etc.
// Primitives: string, number, bigint, boolean, null, undefined, symbol
// Object literal
const person = {
  firstName: "Tanvir",
  lastName: "Hossain",
  age: 25,
};

const person = {};
// Properties = key: value 
person.firstName = "Tanvir"; // Dot notation
person.lastName = "Hossain";
person.age = 25;

const mobile = {
    brand: 'Apple',
    model: 'iPhone 17',
    price: 1099,
    features: ['5G', 'A17 Bionic chip','Battery life'],
    hasTelephotoCamera: true,
    'Front Camera': '12MP',
    // Method = key: function() {...}
    brandMobile: function() { 
        return `The brand of the mobile is ${this.brand} and model is ${this.model}.`; // this: refers to the current object
    }
};

// console.log(mobile);
console.log(mobile.brand); // Dot notation
console.log(mobile.model);
console.log(mobile.price);
console.log(mobile.features);
console.log(mobile.hasTelephotoCamera);
// console.log(mobile.Front Camera); // Error
console.log(mobile['Front Camera']); // Bracket notation: To access property with space

mobile.price = 999; // Discount price
console.log(mobile.price);
Object.freeze(mobile); // Prevent further modifications
mobile.price = 899; // Can't modify frozen object
console.log(mobile.price);

console.log(Object.keys(mobile));
console.log(Object.values(mobile));

// function brandMobile() {
//     return `The brand of the mobile is ${mobile.brand} and model is ${mobile.model}.`;
// }
// console.log(brandMobile());
console.log(mobile.brandMobile());

// Constructor 
// function Person() {
//     this.name = "Tanvir";
//     this.age = "Hossain";
//     this.greet = function() {
//         console.log(`Assalamoalikom, my name is ${this.name}, and I am ${this.age} years old.`);
//     }
// }

// const p1 = new Person();
// p1.greet();

function Person(name, age) {
    this.name = name;
    this.age = age;
    this.greet = function() {
        console.log(`Assalamoalikom, my name is ${this.name}, and I am ${this.age} years old.`);
    }
}

const p1 = new Person("Tanvir Hossain", 25);
const p2 = new Person("Israt Jahan", 23);
p1.greet();
p2.greet();