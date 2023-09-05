// Destructuring an object

const person = {
    name: 'Max', 
    age: 29,
    greet() {
        console.log('Hi, I am ' + this.name);
    }
}

// Will get the "name" property of the given object and store it in a variable called "name", we can do this to access multiple properties of the given object
const printName = ({ name }) => {
    console.log(name);
};

printName(person);

// Will create two constants called "name" and "age" and put the corresponding value of the object "person" in them
const { name, age } = person;

console.log(name , age);

// Destructuring an array

const hobbies = ['Sports', 'Cooking'];

let [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);;