const express = require('express');
const router = express.Router();

const errorController = require('../controllers/error');

router.get('/403', errorController.get403);

router.use(errorController.get404);

module.exports = router;