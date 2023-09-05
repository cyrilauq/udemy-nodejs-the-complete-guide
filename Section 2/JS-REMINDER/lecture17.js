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