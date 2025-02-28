const router = require("express").Router();
const {getUser, getUsers, createUser} = require("../controllers/users");

// Public Routes (No authentication required)
router.get("/", getUsers);
router.get("/:userId", getUser);

// Protected Routes (Authentication required)
router.post("/", createUser);

module.exports = router;