const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/products'
        });
    });
};
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        console.log(`Product id: ${prodId}`);
        console.log(product);
        res.render('shop/product-details', {
            prod: product,
            pageTitle: product ? product.title : prodId,
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
    Cart.fetchCartProducts(cart => {
        const cartProducts = [];
        Product.fetchAll(products => {
            products.forEach(prod => {
                const foundProduct = cart.products.find(cardProduct => cardProduct.id === prod.id);
                if(foundProduct) {
                    cartProducts.push({
                        productData: { ...prod },
                        qty: foundProduct.qty
                    });
                }
            });
            res.render('shop/cart', {
                prods: cartProducts,
                totalPrice: cart.totalPrice,
                pageTitle: 'Your Cart',
                path: '/cart'
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    // I use destructuring so I only get the price of the product
    Product.findById(productId, ({ price }) => {
        Cart.addProduct(productId, price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteItem = (req, res, next) => {
    Product.findById(req.body.productId, product => {
        Cart.deletProduct(product.id, product.price);
        res.redirect('/cart');
    })
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