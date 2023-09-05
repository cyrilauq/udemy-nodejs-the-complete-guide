const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
    console.log("Oh! You're trying to find some users? That's cool cause you're in the right place!");
    res.send('The users page will come soon!');
});

app.use('/', (req, res, next) => {
    console.log("Oh! You're trying to find the home page? That's cool cause you're in the right place!");
    res.send('The home page will come soon!');
});

app.listen(3000);