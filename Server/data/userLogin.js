var helper = require('./helper')

var userLoginData = {
    //get the user login success
    get: function (args, res) {
        var args = args.body;
    
        const sql = `SELECT id AS user_id from users where email = $1 AND password = $2`;        
        
        helper.query(sql, [args.email, args.password], function (err, response) {
            
            response = response.rows && response.rows.length ? response.rows : [];
            if (err)
                return res(err, {
                    'status': 'Failed to login'
                });
            if (response.length) {
                return res(err, {
                    'response': response,
                    'status': 'Login Success'
                })
            } else {
                return res(err, {
                    'status': 'Failed to login'
                });
            }
        });
    },

    register: function(args, res){
        const sql = ` 
            INSERT INTO users1 (
                user_name,
                email,
                password
            )
            SELECT 
                $1,
                $2,
                $3            
            RETURNING * `;

        helper.query(sql,[args.user_name, args.email, args.password],function (err, response) {
            response = response.rows && response.rows.length ? response.rows : [];
            callback(err, response)
        });
    }
}
module.exports = userLoginData;
