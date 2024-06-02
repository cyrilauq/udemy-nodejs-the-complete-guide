const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middlewares/is-auth');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', 
    isAuth,
    [
        body('title')
            .notEmpty()
            .withMessage("The field 'title' should not be empty.")
            .isLength({ min: 5, max: 150 })
            .withMessage("The field 'title' must have at least 5 characters and maximum 150 characters.")
            .isString()
            .withMessage("The field 'title' should be a valid string.")
            .trim(),
        body('imageUrl')
            .notEmpty()
            .withMessage("The field 'imageUrl' should not be empty.")
            .isURL()
            .withMessage("The field 'imageUrl' should be a valid URL.")
            .trim(),
        body('price')
            .notEmpty()
            .withMessage("The field 'price' should not be empty.")
            .isFloat()
            .trim(),
        body('description')
            .notEmpty()
            .withMessage("The field 'description' should not be empty.")
            .isLength({ min: 5, max: 250 })
            .withMessage("The field 'title' must have at least 5 characters and maximum 250 characters.")
            .trim(),
    ],
    adminController.postAddProduct
);

router.get(
    '/edit-product/:productId', 
    isAuth, 
    adminController.getEditProduct
);

router.post(
    '/edit-product', 
    isAuth, 
    [
        body('title')
            .notEmpty()
            .isLength({ min: 5, max: 150 })
            .isAlphanumeric()
            .trim(),
        body('imageUrl')
            .notEmpty()
            .isURL()
            .trim(),
        body('price')
            .notEmpty()
            .isFloat()
            .trim(),
        body('description')
            .notEmpty()
            .isLength({ min: 5, max: 250 })
            .trim(),
    ],
    adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
