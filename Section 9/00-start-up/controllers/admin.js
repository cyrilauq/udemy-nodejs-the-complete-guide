const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const reqData = req.body;
    const title = reqData.title;
    const imageUrl = reqData.imageUrl;
    const price = reqData.price;
    const description = reqData.description;
    const product = new Product(
        null,
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
    Product.findById(req.params.productId, (product) => {
        if(!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            prod: product,
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: true
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const reqData = req.body;
    const prodId = reqData.productId
    const title = reqData.title;
    const imageUrl = reqData.imageUrl;
    const price = reqData.price;
    const description = reqData.description;
    const product = new Product(
        prodId,
        title, 
        imageUrl,
        description,
        price
    );
    product.save();
    res.redirect('/');
};

exports.getDeleteProduct = (req, res, next) => {
    Product.findById(req.params.productId, (product) => {
        if(!product) {
            return res.redirect('/');
        }
        res.render('admin/confirm-delete', {
            prod: product,
            pageTitle: 'Delete product',
            path: '/admin/delete-product',
            editing: true
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const reqData = req.body;
    if(reqData.no) {
        return res.redirect('/admin/products');
    }
    Product.deleteById(reqData.productId);
    res.redirect('/admin/products');
};