const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const adminData = require('./admin');

const Router = express.Router();

Router.get('/', (req, res, next) => {
    console.log('shop.js', adminData.products);
    // __dirname is a global variable made by node js that holds the absolute path of the directory where the file using it is located
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = Router;