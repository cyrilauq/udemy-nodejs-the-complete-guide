const http = require('http');

const express = require('express');

const routes = require('./routes');

const app = express();

app.use((req, res, next) => {
    console.log('In the middleware!');
    next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
    console.log('In another middlware');
    res.send('<h1>Hello from Express!</h1>');
    // If you don't send a response, you need to use the next() method to allow the request to continue to the next middleware in line otherwise it will hang
});

app.listen(3000);