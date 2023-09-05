// If something never change make it const else make it let

const name = 'Max';
let age = 29;
const hasHobbies = true;

age = 30;

console.log(name);

const summarizeUser = (userName, userAge, userHasHobby) => {
    return ('Name is ' + userName + 
    ', age is ' + userAge + 
    ' and the user has hobbied: ' + userHasHobby);
}

const add = (a, b) => a + b;
const addOne = a => a++;
const addRandom = () => 1 + 2;

console.log('add: ' + add(1, 2));
console.log('addOne: ' + addOne(2));
console.log('addRandom: ' + addRandom());

console.log(summarizeUser(name, age, hasHobbies));