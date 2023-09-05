const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin products',
            path: 'admin/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};

exports.getCart = (req, res, next) => {
    Product.fetchCartProducts((products) => {
        res.render('shop/cart', {
            prods: products,
            pageTitle: 'Cart',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};

exports.getEditProduct = (req, res, next) => {
    console.log(req.params.productName);
    Product.fetchProductByName(req.params.productName, (product) => {
        console.log(product);
        res.render('admin/edit-product', {
            prod: product,
            pageTitle: 'Edit product',
            path: '/',
            activeShop: true,
            productCSS: true
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProductDetails = (req, res, next) => {
    Product.fetchProductByName(req.params.productName, (product) => {
        res.render('shop/product-details', {
            prod: product,
            pageTitle: 'See product information',
            path: '/',
            activeShop: true,
            productCSS: true
        });
    });
};