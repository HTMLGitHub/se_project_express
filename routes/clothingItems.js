const router = require("express").Router();
const {getClothingItems, getClothingItem, createClothingItem, deleteClothingItem, likeItem, dislikeItem} = require("../controllers/clothingItems");
const auth = require('../middlewares/auth');
const {validateClothingItem, validateIdParams} = require('../middlewares/validation');

// Public Routes (No authentication required)
// Getting all clothing items
router.get("/", getClothingItems);

// Getting a clothing item by ID
router.get("/:itemId", validateIdParams, getClothingItem);
// 
// Protected Routes (Authentication required)
// POST a new clothing item
router.post("/", auth, validateClothingItem, createClothingItem);

// Delete a clothing item by ID
router.delete("/:itemId", auth, validateIdParams, deleteClothingItem);

// Like a clothing item by ID
router.put("/:itemId/likes", auth, validateIdParams, likeItem);

// Dislike a clothing item by ID
router.delete("/:itemId/likes", auth, validateIdParams, dislikeItem);


module.exports = router;