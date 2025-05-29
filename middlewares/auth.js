const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../utils/config");
const {UNAUTHORIZED} = require("../utils/errors")

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization || !authorization.startsWith('Bearer ')) {
        const err = new Error("Authorization Error");
        err.statusCode = UNAUTHORIZED;

        console.error(`Error: ${err.message}`);

        return next(err); // Send to centralized error handler        
    }

    const token = extractBearerToken(authorization);

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;

        console.log(`User Authenticated: ${req.user}`);

        return next(); // Proceed to the next middleware or route handler
    } catch(err) {
        err.statusCode = UNAUTHORIZED;
        console.error(`Error: ${err.message}`);

        return next(err); // Send to centralized error handler
    }
};