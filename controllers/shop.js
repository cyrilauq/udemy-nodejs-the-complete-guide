const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            userAuthenticated: req.session.userLoggedIn
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                prod: product,
                pageTitle: product.title,
                path: '/products',
                userAuthenticated: req.session.userLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            console.log(cart.items);
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                prods: cart.items,
                userAuthenticated: req.session.userLoggedIn
            });
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => req.user.addToCart(product))
        .then(() => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postOrder = (req, res, next) => {
    const user = req.user;
    user.getCart()
        .then(cart => {
            const order = new Order({
                user: {
                    username: user.name,
                    _id: user._id,
                    email: user.email
                },
                items: cart.items.map(item => {
                    return { 
                        quantity: item.quantity,
                        product: { ...item.productId._doc }
                    }
                })
            });
            return order.save();
        })
        .then(result => {
            return user.clearCart();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(error => {
            console.error(error);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({
        "user._id": req.user._id
    })
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders,
            userAuthenticated: req.session.userLoggedIn
        });
    })
    .catch(err => console.log(err));
};
