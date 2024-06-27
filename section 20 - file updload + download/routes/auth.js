const express = require('express');

const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const routes = express.Router();

const authController = require('../controllers/auth');

const User = require('./../models/user');

routes.get('/login', authController.getLogin);

routes.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom(async (value, { req }) => {
                const foundUser = await User.findOne({ email: value});
                if(!foundUser) {
                    throw new Error(`The email "${value}" is not related to any user.`);
                }
                return true;
            })
            .normalizeEmail(),
        body('password')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .withMessage('Please enter a password with only numbers and text and with at leat 5 characters.')
            .trim(),
        body([ 'password', 'email' ])
            .trim()
            .custom(async (value, { req }) => {
                const login = req.body.email;
                const password = req.body.password;
                const user = await User.findOne({ email: login });
                if(!user) {
                    return false;
                }
                const doMatch = await bcrypt.compare(password, user.password);
                if(!doMatch) {
                    throw new Error('No user found for the given credentials.');
                }
                return doMatch;
            })
    ],
    authController.postLogin
);

routes.post('/logout', authController.postLogout);

routes.get('/signup', authController.getSignup);

routes.post(
    '/signup', 
    [
        body('name')
            .isLength({ min:5 })
            .trim(),
        check('email') // will check the field "email" whereve it is (it can be in header, body, cookie, ...)
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom(async (value, { req }) => {
                const foundUser = await User.findOne({ email: value});
                if(foundUser) {
                    throw new Error(`The email "${value}" is already taken.`);
                }
                return true;
            })
            .normalizeEmail(),
        body(
            'password',
            'Please enter a password with only numbers and text and with at leat 5 characters.'
        ) // check the field named "password" and that is in the request body and give an error message if validation failed
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if(value !== req.body.password) {
                    throw new Error('Passwords has to match!');
                }
                return true;
            })
    ],
    authController.postSignup
);

routes.get('/reset-pwd', authController.getResetPassword);

routes.post('/reset-pwd', authController.postResetPassword);

routes.get('/reset-pwd/:token', authController.getNewPassword);

routes.post('/new-pwd', authController.postNewPassword);

module.exports = routes;