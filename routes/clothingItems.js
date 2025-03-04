const router = require("express").Router();
const {getClothingItems, getClothingItem, createClothingItem, deleteClothingItem, likeItem, dislikeItem} = require("../controllers/clothingItems");
const auth = require('../middlewares/auth');

// Public Routes (No authentication required)
// Getting all clothing items
router.get("/", getClothingItems);

// Getting a clothing item by ID
router.get("/:itemId", getClothingItem);


// Protected Routes (Authentication required)
// POST a new clothing item
router.post("/", auth, createClothingItem);

// Delete a clothing item by ID
router.delete("/:itemId", auth, deleteClothingItem);

// Like a clothing item by ID
router.put("/:itemId/likes", auth, likeItem);

// Dislike a clothing item by ID
router.delete("/:itemId/likes", auth, dislikeItem);


module.exports = router;