const router = require("express").Router();
const {createUser, loginUser} = require('../controllers/users');
const clothingItems = require("../controllers/clothingItems")
const itemRouter = require("./clothingItems");
const userRouter = require("./users");
const auth = require('../middlewares/auth');


// public Routes for Authentication
router.post("/signup", createUser); // Sign up a new user
router.post("/signin", loginUser);  // Sign in an existing user

// Other routes 
router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;