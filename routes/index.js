const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const {createUser, loginUser} = require('../controllers/users');

// Other routes 
router.use("/users", userRouter);
router.use("/items", itemRouter);

// public Routes for Authentication
router.post("/signup", createUser); // Sign up a new user
router.post("/signin", loginUser);  // Sign in an existing user

module.exports = router;