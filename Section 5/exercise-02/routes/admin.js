const path = require('path');

const router = require('express').Router();

const rootDir = require('../utils/path');

router.get('/add-user', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'add-user.html'));
});

module.exports = router;