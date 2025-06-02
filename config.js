// config.js
const { PORT = 3000, JWT_SECRET = "super-strong-secret" } = process.env;

module.exports = {
    JWT_SECRET,
    PORT,
};

console.log("PORT:", PORT);
