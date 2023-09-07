const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
    User.findById("64f9a4caa0b3495535d49017")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

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