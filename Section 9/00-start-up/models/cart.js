const fs = require('fs');
const path = require('path');

const rootPath = require('../util/path');

    'data', 
    'cart.json'
);

const getCartFromFile = cb => {
    fs.readFile(cartFilePath, (err, data) => {
        let cart = { products:[], totalPrice: 0 };
        if(!err) {
            cart = JSON.parse(data);
        }
        cb(cart);
    });
};

module.exports = class Cart {
    static addProduct(prodId, productPrice) {
        getCartFromFile(cart => {
            const existingProductIndex = cart.products.findIndex(({ id }) => id === prodId);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {
                    id: prodId,
                    qty: 1
                };
                cart.products = [...cart.products, updatedProduct];
            }
            // We're adding a "+" symbol to convert it into a number
            cart.totalPrice += +productPrice;
            this.saveCart(cart);
        });
    }

    static saveCart(cart) {
        fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
            console.log(err);
        });
    }

    static fetchCartProducts(cb) {
        getCartFromFile(cb);
    }

    static deletProduct(id, productPrice) {
        getCartFromFile(cart => {
            const productIndex = cart.products.findIndex(product => product.id === id);
            if(productIndex === -1) {
                return;
            }
            const product = cart.products[productIndex];
            cart.products.splice(productIndex, 1);
            cart.totalPrice -= product.qty * productPrice;
            this.saveCart(cart);
        });
    }
}