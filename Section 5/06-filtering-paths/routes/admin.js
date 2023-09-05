const path = require('path');

const express = require('express');

const Router = express.Router();

Router.get('/add-product', (req, res, next) => {
    console.log('In another middlware');
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

Router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = Router;