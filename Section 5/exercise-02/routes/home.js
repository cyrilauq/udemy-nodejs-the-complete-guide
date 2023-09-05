const path = require('path');

const router = require('express').Router();

const rootDir = require('../utils/path');

router.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'home.html'));
});

module.exports = router;