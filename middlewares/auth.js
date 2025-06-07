/* eslint-disable no-console */
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("..config");
const UNAUTHORIZEDERRROR = require("../errors/Unauthorized");

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization || !authorization.startsWith('Bearer ')) {
        const err = new UNAUTHORIZEDERRROR("Authorization Error");

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
        console.error(`Error: ${err.message}`);

        return next(new UNAUTHORIZEDERRROR("Invalid or expired token")); // Send to centralized error handler
    }
};