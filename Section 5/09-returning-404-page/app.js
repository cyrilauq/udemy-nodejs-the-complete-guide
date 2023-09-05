const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
// We'll let the user(and page) use the file in the public folder
// The public folder will look like as if it was the root folder so we don't have to add public in the url
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'page-not-found.html'));
});

app.listen(3000);