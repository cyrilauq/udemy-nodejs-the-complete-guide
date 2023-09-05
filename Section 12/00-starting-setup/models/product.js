const mongodbId = require('mongodb').ObjectId;

const getDb = require('../util/database').getDb;

module.exports = class Product {

    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodbId(id) : null;
        this.userId = userId;
    }

    save() {
        // updateOne take as a first parameter a filter to choose the element to update and as a second parameter the new value we want to assigne to it we can also give an object with all the key we want to upadate and their value
        const db = getDb();
        let dbOp;
        if(this._id) {
            let { _id, ...data } = this;
            dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: data });
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp;
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray();
    }

    static findById(productId) {
        // We use .next method because if we don't we'll got a cursor that contains all products even if we just need one
        const db = getDb();
        return db.collection('products')
            .find({ _id: new mongodbId(productId) })
            .next();
    }

    static deleteById(productId) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new mongodbId(productId) });
    }

};
