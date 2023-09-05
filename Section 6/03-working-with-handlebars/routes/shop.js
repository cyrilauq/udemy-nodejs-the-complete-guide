const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const adminData = require('./admin');

const Router = express.Router();

Router.get('/', (req, res, next) => {
    const products = adminData.products;
    console.log('shop.js', products);
    // Will let us use and return the pug template
    // We can add a second argument to pass data to the template (key - value pairs and you can name the key whatever you want) and then use it in the template
    res.render('shop', {
        prods: products,
        docTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        productCSS: true,
        activeShop: true,
    });
});

module.exports = Router;