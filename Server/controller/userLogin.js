var userLoginModel = require('../data/userLogin');

var userLoginController = {
    get: function (req, res) {
        userLoginModel.get(req, function (err, data) {
            res(err, data)
        });
    },
    register: function(req, res){
        userLoginModel.register(req, function(err, data){
            res(err, data);
        })
    }
}
module.exports = userLoginController;