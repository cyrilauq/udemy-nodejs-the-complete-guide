const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./models/user');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// We'll initialize the session and pass a js object to configure the session
// We can configure the session cookie by adding the "cookie" property to the object and give value to its properties too
app.use(session({
    secret: 'my secret', // Will be used to hache our data
    reseave: false, // this means that the session will not be save on every request but only if something change in it
    saveUninitialized: false, // This means that the session will not be save for a request that doesn't need it
}));

app.use((req, res, next) => {
    User.findById("64f9a4caa0b3495535d49017")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://cyrilauquier:fxEuaAgIUUds6CMy@cluster0.6036lkk.mongodb.net/shop?retryWrites=true&w=majority')
    .then(() => {
        User.findOne()
            .then(user => {
                if(!user) {                
                    const user = new User({
                        name: 'Cyril',
                        email: 'cyril@text.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            })
            .catch(error => {
                console.log(error);
            });
        app.listen(3000, () => {
            console.log("Server started");
        })
    })
    .catch(error => {
        console.log(error);
    });