const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/details/:productName', shopController.getProductDetails);

router.get('/checkout', shopController.getCheckout);

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

module.exports = router;
