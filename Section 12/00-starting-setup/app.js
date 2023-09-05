const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const { mongoConnect } = require("./util/database");

const User = require('./models/user');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("64f09a95f6d8400ec6a248fa")
        .then(user => {
            req.user = new User(
                user.username,
                user.mail,
                user.cart,
                user._id
            );
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000, () => {
        console.log("Server started");
    })
});