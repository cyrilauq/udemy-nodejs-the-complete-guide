const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const Router = express.Router();

const products = [];

Router.get('/add-product', (req, res, next) => {
    console.log('In another middlware');
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

Router.post('/add-product', (req, res, next) => {
    const body = req.body;
    products.push({
        title: body.title
    });
    res.redirect('/');
});

exports.routes = Router;
exports.products = products;