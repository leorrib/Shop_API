const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.JWT_TOKEN_KEY;

exports.securityToken = async (user) => {
    const secToken = jwt.sign( {data: user}, secret, {expiresIn: '1h'} );
    try {
        return secToken;
    } 
    catch (err) {
        console.log(err)
        user.json('Unable to generate token')
    }
}

exports.verification = (req, res, next) => {
    
    const token = req.header('auth-token');
    if(!token) {
        res.status(400).json('Token not provided in auth-token header');
    }
    try {
        jwt.verify(token, secret);
        console.log('verify token successfull')
    }
    catch (err) {
        console.log(err);
        res.status(400).json("Wrong token")
    }
    next();
}