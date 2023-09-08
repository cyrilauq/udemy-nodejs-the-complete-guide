const express = require('express');
const routes = express.Router();

const authController = require('../controllers/auth');

routes.get('/login', authController.getLogin);

module.exports = routes;