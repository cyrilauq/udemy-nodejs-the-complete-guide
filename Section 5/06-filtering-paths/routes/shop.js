const path = require('path');

const express = require('express');

const Router = express.Router();

Router.get('/', (req, res, next) => {
    console.log('In another middlware');
    // __dirname is a global variable made by node js that holds the absolute path of the directory where the file using it is located
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = Router;