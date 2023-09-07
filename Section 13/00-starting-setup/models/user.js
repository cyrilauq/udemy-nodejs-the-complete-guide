const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                re: 'Product', // tells that it is related to a particular Product
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
    },
});

module.exports = mongoose.model('User', userSchema);