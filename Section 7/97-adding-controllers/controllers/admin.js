const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res, next) => {
    const reqData = req.body;
    const title = reqData.title;
    const imageUrl = reqData.imageUrl;
    const price = reqData.price;
    const description = reqData.description;
    const product = new Product(
        title, 
        imageUrl,
        description,
        price
    );
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin products',
            path: '/admin/products'
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
            path: '/admin/edit-product'
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};