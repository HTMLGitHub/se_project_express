const router = require("express").Router();
const {getClothingItems, getClothingItem, createClothingItem, deleteClothingItem, likeItem, dislikeItem} = require("../controllers/clothingItems");

// Public Routes (No authentication required)
// Getting all clothing items
router.get("/", getClothingItems);

// Getting a clothing item by ID
router.get("/:itemId", getClothingItem);


// Protected Routes (Authentication required)
// POST a new clothing item
router.post("/", createClothingItem);

// Delete a clothing item by ID
router.delete("/:itemId", deleteClothingItem);

// Like a clothing item by ID
router.put("/:itemId/likes", likeItem);

// Dislike a clothing item by ID
router.delete("/:itemId/likes", dislikeItem);


module.exports = router;