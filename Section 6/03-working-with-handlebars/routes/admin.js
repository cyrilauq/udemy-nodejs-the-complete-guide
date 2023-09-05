const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const Router = express.Router();

const products = [];

Router.get('/add-product', (req, res, next) => {
    console.log('In another middlware');
    res.render('add-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
    });
});

Router.post('/add-product', (req, res, next) => {
    const body = req.body;
    products.push({
        title: body.title,
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
    });
    res.redirect('/');
});

exports.products = products;