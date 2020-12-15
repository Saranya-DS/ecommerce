//external libs for node
var express = require('express'),
    app = express(),
    pg = require('pg'),
    http = require('http').Server(app),
    config = require('./Server/config'),
    apiRoutes = require('./Server/routes/api'),
    path = require('path'),
    bodyParser = require('body-parser'),
    session = require('express-session');

//listening the configured ports
http.listen(config.port, function () {
    console.log('listening on *:' + "  " + config.port);
});

//post request getting in request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'bookapp1q2w3e4r5t' }));

//refer the route files
app.use(apiRoutes);

//need to get client side files
app.use(express.static(__dirname + '/../'));

//when type url in browser u get this initial load
app.get('/', function (req, res) {
    
    if (req.session && req.session['userid']) {
        return res.redirect('/books');
    }
    res.redirect('/login');
});

app.get('/books', function (req, res) {

    if (req.session && !req.session['userid']) {
        console.log('ghghg')
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname + '/book-index.html'));
});

app.get('/login', function (req, res) {
    if (req.session && req.session['userid']) {
        console.log('adfadsf');
        return res.redirect('/books');
    }
    res.sendFile(path.join(__dirname + '/login.html'));

});
app.get('/logout', function (req, res) {

    req.session.destroy(function (err) {
        if (err) {
            console.log(err + 'err');
        } else {
            console.log(err + 'success');

        }
    });
    return res.redirect('/login');

});






