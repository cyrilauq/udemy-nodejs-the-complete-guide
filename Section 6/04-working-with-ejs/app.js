const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// Tell express which template engine to use
app.set('view engine', 'ejs');
// Tell express where to find the views
app.set('views', 'views');

app.use(bodyParser.urlencoded({
    extended: false
}));
// We'll let the user(and page) use the file in the public folder
// The public folder will look like as if it was the root folder so we don't have to add public in the url
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.render('404', {
        docTitle: '404 - Not Found',
        path: '/404'
    });
});

app.listen(3000);