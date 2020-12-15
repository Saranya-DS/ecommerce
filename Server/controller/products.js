var data = require('../data/products');

var controller = {

    save: function (req, res) {
        data.save(req, function (err, data) {
            res(err, data)
        });
    },

    getAll: function(req,callback){
        data.getAll(req, function (err, data) {
            callback(err, data)
        });
    },
    getProducts: function(req,callback){
        booksModel.getProducts(req, function (err, data) {
            callback(err, data)
        });
    }


}
module.exports = controller;