const router = require("express").Router();
const {getCurrentUser, updateUser} = require("../controllers/users");
const auth = require("../middlewares/auth");
const {validateUserUpdate} = require("../middlewares/validation");

// Protected Routes (authentication required)
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateUser);

module.exports = router;