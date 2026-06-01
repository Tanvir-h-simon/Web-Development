// Array
const array = [1, 2, 3, 4, 5];
console.log("Array:", array);
console.log("Array length:", array.length);
console.log("Array element at index 0:", array[0]);

// Set
const set = new Set([1, 2, 3, 3, 4]);
console.log("Set:", set);
console.log("Set size:", set.size);
console.log("Set has value 3:", set.has(3));

// Map
const map = new Map();
map.set('name', 'John');
map.set('age', 30);
map.set('city', 'New York');

console.log("Map:", map);
console.log("Map size:", map.size);
console.log("Map get 'name':", map.get('name'));
console.log("Map has 'age':", map.has('age'));
