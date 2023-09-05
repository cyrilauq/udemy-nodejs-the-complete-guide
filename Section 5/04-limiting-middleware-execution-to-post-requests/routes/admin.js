const express = require('express');

const Router = express.Router();

Router.get('/add-product', (req, res, next) => {
    console.log('In another middlware');
    res.send('<h1>The "Add Product" Page</h1><form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

Router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = Router;