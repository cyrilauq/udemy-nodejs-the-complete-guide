const fs = require('fs');
const path = require('path');

const rootPath = require('../util/path');

const productsFilePath = path.join(rootPath, 
    'data', 
    'products.json'
);

const cartFilePath = path.join(rootPath, 
    'data', 
    'cart.json'
);

const getProductsFromFile = cb => {
    fs.readFile(productsFilePath, (err, data) => {
        let products = [];
        if(!err) {
            products = JSON.parse(data);
        }
        cb(products);
    });
};

const getCartFromFile = cb => {
    fs.readFile(cartFilePath, (err, data) => {
        let products = [];
        if(!err) {
            products = JSON.parse(data);
        }
        cb(products);
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    /**
     * 
     * Execute a callback when the job is done.
     * 
     * @param {*} cb 
     */
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    addToCart() {
        getCartFromFile(products => {
            products.push(this);
            fs.writeFile(cartFilePath, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchCartProducts(cb) {
        getCartFromFile(cb);
    }

    static fetchProductByName(productName, cb) {
        getProductsFromFile(products => {
            cb(products.find(prod => prod.title.localeCompare(productName) === 0));
        });
    }
}