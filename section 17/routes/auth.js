const express = require('express');
const routes = express.Router();

const authController = require('../controllers/auth');

routes.get('/login', authController.getLogin);

routes.post('/login', authController.postLogin);

routes.post('/logout', authController.postLogout);

routes.get('/signup', authController.getSignup);

routes.post('/signup', authController.postSignup);

routes.get('/reset-pwd', authController.getResetPassword);

routes.post('/reset-pwd', authController.postResetPassword);

module.exports = routes;