const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://cyrilauquier:fxEuaAgIUUds6CMy@cluster0.6036lkk.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log("Connected!");
            _db = client.db();
            callback(client);
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found';
}

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;
