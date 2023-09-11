const mongoose = require('mongoose');

const Product = require('../models/product');
const Order = require('../models/order');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product', // tells that it is related to a particular Product
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
    },
});

// We'll add new function to our schema with method properties, wich allows us to add function to our schema
userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items === undefined ? -1 : this.cart.items.findIndex(item => item.productId.toString() === product._id.toString());
    let quantity = (cartProductIndex > -1 ? this.cart.items[cartProductIndex].quantity : 1);
    const updatedCartItems = [...this.cart.items];
    if(cartProductIndex > -1) {
        updatedCartItems[cartProductIndex].quantity++;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity
        });
    }
    const updatedCart = { 
        items: updatedCartItems
    }
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.getCart = function() {
    return this.populate('cart.items.productId')
        .then(user => user.cart);
};

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart.items = [];
    return this.save();
};

module.exports = mongoose.model('User', userSchema);