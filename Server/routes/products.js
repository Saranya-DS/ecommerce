var products = require('../controller/products'),
    express = require('express'),
    app = module.exports = express();

app.post('/save', function(req,res){
    products.save(req,function(err,data){
        res.send(data);
    });
});

app.get('/getAll',function(req,res){
    products.getAll(req, function(err,data){
        res.send(data);
    });
});



app.get('/getProducts',function(req,res){
    products.getProducts(req.query, function(err,data){
        res.send(data);
    });
});








