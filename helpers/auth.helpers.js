const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;


function generateMeAToken(user) {
    return jwt.sign({
        id: user._id,
        email: user.email,
    }, secretKey, {
        expiresIn: '365d'
    });
}

function comparePassword(givenPassword, userPassword) {
    return bcrypt.compareSync(givenPassword, userPassword)
}

module.exports={
    generateMeAToken,
    comparePassword
}