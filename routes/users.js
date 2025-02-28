const router = require("express").Router();
const auth = require("../middleware/auth");
const {getUser, getUsers, createUser} = require("../controllers/users");

// Public Routes (No authentication required)
router.get("/", getUsers);
router.get("/:userId", getUser);

// Protected Routes (Authentication required)
router.post("/",auth, createUser);

module.exports = router;