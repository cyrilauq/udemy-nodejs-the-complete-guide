const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { csrfSync } = require('csrf-sync');
const flash = require('connect-flash');

const User = require('./models/user');

const errorsHandler = require('./middlewares/errors-handler');

const DB_URI = 'mongodb+srv://cyrilauquier:fxEuaAgIUUds6CMy@cluster0.6036lkk.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'users_sessions'
});

const { csrfSynchronisedProtection } = csrfSync({
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromState: (req) => {
      return req.session.csrfToken;
    }, // Used to retrieve the token from state.
    getTokenFromRequest: (req) =>  {
      return req.body.csrfToken;
    }, // Used to retrieve the token submitted by the request from headers
    storeTokenInState: (req, token) => {
      req.session.csrfToken = token;
    }, // Used to store the token in state.
    size: 128, // The size of the generated tokens in bits
});

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoutes = require('./routes/error');

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

// We'll use the csrf protection after the session initialisation cause it will need id.
app.use(csrfSynchronisedProtection);

app.use(flash());

app.use((req, res, next)=> {
    // Check if the request is for an image based on the Content-Type header
    const contentType = req.get('Content-Type');

    if (contentType && contentType.startsWith('image/')) {
        // If the request is for an image, skip the middleware and move to the next middleware/route
        return next();
    }
    // Check if the request path is for an image (you can adjust this check based on your image file extensions)
    if (req.path.endsWith('.jpg') || req.path.endsWith('.png') || req.path.endsWith('.jpeg') || req.path.endsWith('.gif')) {
        // If the request is for an image, skip the middleware and move to the next middleware/route
        return next();
    }
    // We tell express that we need these data in every views we render
    // To do so, we use "res.locals"
    res.locals.userAuthenticated = req.session.userLoggedIn;
    res.locals.csrfToken = req.csrfToken(true);
    console.log(typeof res.locals.csrfToken);
    next();
});

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(error => {
            next(new Error(error))
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use(errorsHandler);

mongoose.connect(DB_URI)
    .then(() => {
        app.listen(3000, () => {
            console.log("Server started");
        })
    })
    .catch(error => {
        console.log(error);
    });