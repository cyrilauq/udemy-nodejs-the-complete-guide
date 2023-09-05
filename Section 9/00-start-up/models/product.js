const fs = require('fs');
const path = require('path');

const rootPath = require('../util/path');

const Cart = require('./cart');

const productsFilePath = path.join(rootPath, 
    'data', 
    'products.json'
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

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if(this.id) {
                const exisitingProductIndex = products.findIndex(({ id }) => {
                    return id === this.id
                });
                const updatedProduct = [...products];
                updatedProduct[exisitingProductIndex] = this;
                fs.writeFile(productsFilePath, JSON.stringify(updatedProduct), (err) => {
                    console.error(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
                    console.error(err);
                });
            }
        });
    }

    static deleteById(productId) {
        getProductsFromFile(products => {
            const productIndex = products.findIndex(product => product.id === productId);
            const product = products[productIndex];
            products.splice(productIndex, 1);
            fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
                if(!err) {
                    Cart.deletProduct(productId, product.price);
                } else {
                    console.error(err);
                }
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

    static fetchProductByName(productName, cb) {
        getProductsFromFile(products => {
            cb(products.find(prod => prod.title.localeCompare(productName) === 0));
        });
    }

    static findById(prodId, cb) {
        getProductsFromFile(products => {
            cb(products.find(({ id }) => {
                return id === prodId
            }));
        });
    }
}