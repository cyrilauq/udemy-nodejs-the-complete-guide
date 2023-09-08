const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const errorController = require('./controllers/error');

const DB_URI = 'mongodb+srv://cyrilauquier:fxEuaAgIUUds6CMy@cluster0.6036lkk.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'users_sessions'
});

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// We'll initialize the session and pass a js object to configure the session
// We can configure the session cookie by adding the "cookie" property to the object and give value to its properties too
// By giving a store we tell express where to store the session
app.use(session({
    secret: 'my secret', // Will be used to hache our data
    resave: false, // this means that the session will not be save on every request but only if something change in it
    saveUninitialized: false, // This means that the session will not be save for a request that doesn't need it,
    store: store
}));

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => {
            console.log(error);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(DB_URI)
    .then(() => {
        app.listen(3000, () => {
            console.log("Server started");
        })
    })
    .catch(error => {
        console.log(error);
    });