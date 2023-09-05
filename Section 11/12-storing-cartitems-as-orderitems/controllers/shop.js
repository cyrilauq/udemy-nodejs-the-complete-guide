const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.findAll({
        order: [ ['title', 'ASC'] ]
    })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
	.catch(err => console.error(err));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findByPk(prodId)
		.then(product => {
			res.render('shop/product-detail', {
				prod: product,
				pageTitle: product.title,
				path: '/products'
			});
		})
		.catch(err => console.error(err));
};

exports.getIndex = (req, res, next) => {
    Product.findAll({
        order: [ ['title', 'ASC'] ]
    })
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'All Products',
                path: '/'
            });
        })
        .catch(err => console.error(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        prods: products
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fectchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fectchedCart = cart;
            return cart.getProducts({
                    where: {
                        id: prodId
                    }
                })
                .then(products => {
                    let product;
                    if(products.length > 0) {
                        product = products[0];                        
                    }
                    if(product) {
                        const olQty = product.cartItem.quantity;
                        newQuantity += olQty;
                        return product;
                    }
                    return Product.findByPk(prodId);
                })
                .then(product => {
                    return fectchedCart.addProduct(product, {
                        through: {
                            quantity: newQuantity
                        }
                    });
                })
                .then(() => {
                    res.redirect('/cart');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
        return cart.getProducts({
                where: {
                    id: prodId
                }
            })
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({
        include: ['products']
    })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders
            });
        })
        .catch(err => console.log(err));
};

exports.postOrders = (req, res, next) => {
    let fectchedCart;
    req.user.getCart()
        .then(cart => {
            fectchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.orderItem = {
                            quantity: product.cartItem.quantity
                        };
                        return product;
                    }))
                })
                .catch(err => console.log(err));
        })
        .then(result => fectchedCart.setProducts(null))
        .then(result => res.redirect('/orders'))
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};