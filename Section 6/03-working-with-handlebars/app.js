const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// Use an non built in template engine
app.engine('hbs', expressHbs({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs',
}));
// Tell express which template engine to use
app.set('view engine', 'hbs');
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
    });
});

app.listen(3000);