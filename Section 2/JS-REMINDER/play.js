// Async function

// The synchronous code is always executed before running the asynchronous one, wich mean(here) 'Hello' and 'Hi' will appears before 'Timer is done!'
// Asynchronous code, cause it is not executed right now

const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done!');
        }, 1500);
    });
    return promise;
};

// Will perform the callback when the timer is done.
setTimeout(() => {
    console.log('Timer is done!');
    fetchData()
        .then(text => {
            console.log(text);
            return fetchData();
        })
        .then(text2 => {
            console.log(text2);
        })
}, 2000);

// Synchronous code, cause they're executing right now
console.log('Hello');
console.log('Hi');