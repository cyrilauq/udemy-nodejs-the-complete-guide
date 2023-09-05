const express = require('express');

const Router = express.Router();

Router.get('/', (req, res, next) => {
    console.log('In another middlware');
    res.send('<h1>Hello from Express!</h1>');
});

module.exports = Router;