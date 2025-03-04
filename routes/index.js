const router = require("express").Router();
const {createUser, loginUser} = require('../controllers/users');
const itemRouter = require("./clothingItems");
const userRouter = require("./users");
const clothingItems = require("../controllers/clothingItems")
const {createUser, loginUser} = require('../controllers/users');
const auth = require('../middlewares/auth');


// Other routes 
router.use("/users", auth, userRouter);
router.use("/items", auth, itemRouter);

// public Routes for Authentication
router.post("/signup", createUser); // Sign up a new user
router.post("/signin", loginUser);  // Sign in an existing user
router.get("/items", clothingItems.getClothingItems);

module.exports = router;