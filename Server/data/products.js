var helper = require('./helper')
var async = require('async');
const SQL = require('sql-template-strings');

var productsData = {

    getAll: function (args, callback) {

        helper.query(` SELECT  
                            product_id,
                            product_code,
                            product_name,
                            product_desc,
                            product_price,
                            no_of_stocks
                        FROM products `,
            function (err, response) {
                response = response.rows && response.rows.length ? response.rows : [];
                callback(err, response)
            });
    },  

    getProducts: function (args, callback) {        
  
        let filterQuery =` `;
       
        if(args.search){
            filterQuery+=` AND product_name ilike '%${args.search}%' AND product_desc ilike '%${args.search}%' `;
        }

        const sql = SQL`SELECT 
                                product_id,
                                product_code,
                                product_name,
                                product_desc,
                                product_price,
                                no_of_stocks
                            FROM products 
                            WHERE 1=1 `
                            .append(filterQuery);

        helper.query(searchQuery.text,searchQuery.values,function (err, response) {
                response = response.rows && response.rows.length ? response.rows : [];
                callback(err, response)
            });
    }, 

    save: function (args, callback) {
       
        const sqlQuery = ` 
                            INSERT INTO products (
                                product_code,
                                product_name,
                                product_desc,
                                product_price,
                                no_of_stocks
                            )
                            VALUES (
                               $1,
                               $2,
                               $3,
                               $4,
                               $5 
                            )
                            RETURNING *                   
                                               `;

        helper.query(sqlQuery,[args.product_code, args.product_name, args.product_desc, args.product_price, args.no_of_stocks],
            function (err, response) {
                callback(err, response)
            });
    } 
}
module.exports = productsData;
