const jwt = require('jsonwebtoken');
var secretKey =process.env.SECRET_KEY;


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secretKey);
        const userId = decodedToken.id;
        req.auth = { userId };  
        if (req.body.userId && req.body.userId !== userId) {
            console.log(userId,req.body.userId);
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};


// const jwt = require("jsonwebtoken");

// const config = process.env;

// const verifyToken = (req, res, next) => {
//     const token = req.body.token || req.query.token || req.headers["x-access-token"];

//     if (!token) {
//         return res.status(403).send("A token is required for authentication");
//     }
//     try {
//         const decoded = jwt.verify(token, config.TOKEN_KEY);
//         req.user = decoded;
//     } catch (err) {
//         return res.status(401).send("Invalid Token");
//     }
//     return next();
// };

// module.exports = verifyToken;