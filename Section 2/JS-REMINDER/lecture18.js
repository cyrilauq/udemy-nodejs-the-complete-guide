const person = {
    name: 'Max', 
    age: 29,
    greet() {
        console.log('Hi, I am ' + this.name);
    }
}

const hobbies = ['Sports', 'Cooking'];

// for(let hobby of hobbies) {
//     console.log(hobby);
// }
// In short give: 
hobbies.forEach(h => console.log(h));

console.log(hobbies.map(hobby => 'Hobby : ' + hobby));
console.log(hobbies);

// Adding an element to the array
hobbies.push('Programming');
console.log(hobbies);

// Copie an array/object
// Retrieve all the value of hobbies and put them in an array
const copiedArray = [...hobbies];
console.log(copiedArray);

// Same thing but with an object
const copiedPerson = {...person};
console.log(person);

// Retrieve all the given arguments
const toArray = (...args) => {
    return args;
}

console.log(toArray(1, 2, 3, 5));