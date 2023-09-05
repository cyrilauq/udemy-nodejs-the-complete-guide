const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/products/:productId', shopController.getProduct);

router.get('/checkout', shopController.getCheckout);

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteItem);

module.exports = router;
