const mongodbId = require('mongodb').ObjectId;

const getDb = require('../util/database').getDb;

module.exports = class User {

    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();

        return db.collection('users')
            .insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items === undefined ? -1 : this.cart.items.findIndex(item => item.productId.toString() === product._id.toString());
        let quantity = (cartProductIndex > -1 ? this.cart.items[cartProductIndex].quantity : 1);
        const updatedCartItems = [...this.getCartItems()];
        if(cartProductIndex > -1) {
            updatedCartItems[cartProductIndex].quantity++;
        } else {
            updatedCartItems.push({
                productId: new mongodbId(product._id),
                quantity
            });
        }
        const updatedCart = { 
            items: updatedCartItems
        }
        const db = getDb();
        // By writing cart property, we tell mongodb to update only one field of the user in the database, instead of updating everything
        return db.collection('users')
            .updateOne(
                { _id: new mongodbId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }


    deleteFromCart(productId) {
        const updatedCartItems = this.getCartItems().filter(item => item.productId.toString() !== productId.toString());
        const db = getDb();
        // By writing cart property, we tell mongodb to update only one field of the user in the database, instead of updating everything
        return db.collection('users')
            .updateOne(
                { _id: new mongodbId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            );
    }

    getCart() {
        // by using $in, we'll retrieve all the product wich has an id that match one of the given ones.
        const db = getDb()
        return db.collection('products')
            .find({ 
                _id: {
                    $in: this.getCartItems().map(item => item.productId)
                } 
            })
            .toArray()
            .then(products => {
                if(products.length !== this.getCartItems().length) {
                    this.cart.items = this.getCartItems().filter(item => products.findIndex(product => product._id.toString() === item.productId.toString()) != -1);
                }
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.getQuantityFor(product._id)
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    getCartItems() {
        return this.cart.items ? this.cart.items : [];
    }

    getQuantityFor(productId) {
        return this.cart.items.find(item => item.productId.toString() === productId.toString()).quantity;
    }

    addOrder() {
        const db = getDb()
        return this.getCart()
            .then(products => {
                const order = {
                    items: products.map(product => {
                        return {
                            ...product,
                            quantity: this.getQuantityFor(product._id)
                        }
                    }),
                    user: {
                        _id: new mongodbId(this._id),
                        username: this.username,
                        email: this.email
                    }
                }
                return db.collection('orders')
                    .insertOne(order)
            })
            .then(() => {
                this.cart.items = [];
                return db.collection('users')
                    .updateOne(
                        { _id: new mongodbId(this._id) },
                        { $set: { cart: [] } }
                    );
            });
    }

    getOrders() {
        const db = getDb()
        return db.collection('orders')
            .find({ 'user._id': new mongodbId(this._id) })
            .toArray();
    }

    static findById(userId) {
        const db = getDb();

        return db.collection('users')
            .findOne({ _id: new mongodbId(userId) });
    }

};
