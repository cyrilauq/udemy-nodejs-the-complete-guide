const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/products'
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/shop'
        });
    });
};

exports.getCart = (req, res, next) => {
    Product.fetchCartProducts((products) => {
        res.render('shop/cart', {
            prods: products,
            pageTitle: 'Your Cart',
            path: '/cart'
        });
    });
};

exports.getOrders = (req, res, next) => {
    Product.fetchCartProducts((products) => {
        res.render('shop/orders', {
            prods: products,
            pageTitle: 'Your orders',
            path: '/orders'
        });
    });
};

exports.getProductDetails = (req, res, next) => {
    Product.fetchProductByName(req.params.productName, (product) => {
        res.render('shop/product-details', {
            prod: product,
            pageTitle: 'See product information',
            path: '/'
        });
    });
};

exports.getCheckout = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/checkout', {
            prods: products,
            pageTitle: 'Checkout',
            path: '/products'
        });
    });
};