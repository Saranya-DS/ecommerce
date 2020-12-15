var express = require('express'),
    app = module.exports = express(),
    userLogin = require('./userLogin'),
    products = require('./products') 

//use the route files
app.use(userLogin);
app.use(products);
