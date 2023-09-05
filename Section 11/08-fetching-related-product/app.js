const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Use user in every request
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {
    through: CartItem
});
// The second argument, tell Sequelize where to store the association
Product.belongsToMany(Cart, {
    through: CartItem
});

sequelize
    .sync({
        force: true
    })
    .then(result => {
        // Retrieve user
        return User.findByPk(1);
    })
    .then(user => {
        // Check if the user exist
        if(!user) {
            User.create({
                name: "Auquier",
                firstname: "Cyril",
                mail: "cyrilauquier@gmail.com",
                pseudo: "touka_ki",
                imageUrl: ""
            });
        }
        return user;
    })
    .then(user => {
        // console.log(user);
        app.listen(3000);
    })
    .catch(err => console.error(err));
