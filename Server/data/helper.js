var pg = require('pg');
const usePgPool = true;

// connection string
var config = {
    user: 'postgres',
    host: 'localhost',
    database: 'shopping_cart',
    password: 'postgres',
    port: 5432,
  }
const pgPool = new pg.Pool(config);

var dbHelper = {

    initializeConnection: function ( callback ) {
        if ( usePgPool ) {
            pgPool.connect(function ( err, client, done ) {
                if ( err ) {
                    console.error('PG POOL:', err.message, err.stack);
                    return callback(err, null);
                }
                callback(null, client, done);
            });
        }else{
            var client =  new pg.Client(config);

            client.connect(function ( err ) {
                var done = function () {
                    client.end();
                };
                if ( err ) {
                    callback(err, null);
                    return;
                }
                callback(null, client, done);
            });
        }
       
    },
    query: function ( pgQuery, args, callback, options ){
        var self = this;
        console.log(pgQuery, args);
        var defaultResponse = { 'rows': [] };
        if ( typeof args === "function" ) {
            options = callback || {};
            callback = args;
            args = [];
        }
        else if ( Array.isArray(args) && args.length > 0 ) {
            var regInvalid = /NaN|undefined(?!')/;
            var isInvalid = [ pgQuery ].concat(args).some(arg => {
                return regInvalid.test(String(arg)) && (arg === null);
            });
            if ( isInvalid ) {
                let errorMsg = `
                ERROR: Query/arguments contained an NaN or undefined value so it was cancelled before failing `;
                
                if ( config.get(config.keys.debug) === true ) {
                    return callback(errorMsg, defaultResponse);
                }
            }
        }

        self.initializeConnection(function(err, client){
            if ( err ) {
                return callback(err, null);
            }
            client.query(pgQuery, args, (err, res) => {
                callback(null, res);
              });
        })
    }
};

module.exports = dbHelper;