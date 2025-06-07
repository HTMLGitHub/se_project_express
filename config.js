// config.js
require("dotenv").config();

const {
    PORT = 3000, 
    JWT_SECRET = "super-strong-secret",
    MONGO_URI = "mongodb://127.0.0.1:27017/wtwr_db"
} = process.env;

module.exports = {
    PORT,
    JWT_SECRET,
    MONGO_URI   
};
