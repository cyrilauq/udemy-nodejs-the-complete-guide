const Product = require('../models/product');

const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        hasError: false,
        editing: false,
        userAuthenticated: req.session.userLoggedIn,
        validationErrors: []
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            userAuthenticated: req.session.userLoggedIn,
            prod: {
                title: title,
                price: price,
                imageUrl: "",
                description: description
            },
            validationErrors: errors.array().map(e => { return { field: e.path, error: e.msg } })
        });
    }
    
    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId: req.user._id
    });
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            // return res.status(500).render('admin/edit-product', {
            //     pageTitle: 'Add Product',
            //     path: '/admin/add-product',
            //     editing: false,
            //     hasError: true,
            //     userAuthenticated: req.session.userLoggedIn,
            //     prod: {
            //         title: title,
            //         price: price,
            //         imageUrl: imageUrl,
            //         description: description
            //     },
            //     errorMessage: 'Database operation failed, please try again.',
            //     validationErrors: []
            // });
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
    Product
        .findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                hasError: false,
                editing: editMode,
                prod: product,
                userAuthenticated: req.session.userLoggedIn,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
    
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/add-product',
          editing: true,
          hasError: true,
          userAuthenticated: req.session.userLoggedIn,
          prod: {
              title: updatedTitle,
              price: updatedPrice,
              imageUrl: updatedImageUrl,
              description: updatedDesc,
              _id: prodId
          },
          validationErrors: errors.array().map(e => { return { field: e.path, error: e.msg } })
      });
  }

  Product.findById(prodId)
    .then(product => {
        // We're need to apply the toString() method to both, because without it it will not work.
        // Because the type of the two data is a special one and comes from mongodb 
        if(product.userId.toString() !== req.user._id.toString()) {
            return res.status(401).redirect('/');
        }
        // We just need to update the product info and call the save method, and mongoose will update the product all by itself
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save()
            .then(result => {
                console.log('UPDATED PRODUCT!');
                res.redirect('/admin/products');
            });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getProducts = (req, res, next) => {
    console.log(req.user._id);
    Product
        .find({
            userId: req.user._id
        })
        // .select('title price -_id') // Let us choose wich field we want to select, by adding '-' in front of a field, we exclude him from the query
        // .populate('userId', 'name') // Will put into userId, all the information of the user related to the product, the second argument let us choose wich field from the user we will take
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({
        _id: prodId,
        userId: req.user._id
    })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
