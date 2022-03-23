var jwt = require('jsonwebtoken');
var secretKey =process.env.SECRET_KEY;

module.exports = {
    validateUser: async function (req, res, next) {
        await jwt.verify(req.headers['token'], secretKey, function (err, user) {
           if (err) {
                res.json({
                    status: "error",
                    message: err.message,
                    data: null
                }) ;
            } else {
                // add user id to request
                req.body.logged={
                    userid : user.id,
                    email : user.email,
                    isGranted :user.isGranted
                }
                next();
            }
        });
    },
   
    isGranted: async function (req, res, next) {
        if (req.body.logged.isGranted !== true) {
            res.json({
                status: "error",
                message: "error You are not allowed you'r access not granted yet",
                payload: null
            });
        } else {
            next();
        }
    },
  
    roles: {
        admin: "ADMIN",
        guest: "GUEST",
        user: "USER"
    }
}