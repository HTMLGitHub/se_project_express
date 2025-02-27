const router = require("express").Router();
const {getClothingItems, getClothingItem, createClothingItem, deleteClothingItem, likeItem, dislikeItem} = require("../controllers/clothingItems");

// Getting all clothing items
router.get("/", getClothingItems);

// Getting a clothing item by ID
router.get("/:itemId", getClothingItem);

// POST a new clothing item
router.post("/", createClothingItem);

// Delete a clothing item by ID
router.delete("/:itemId", deleteClothingItem);

// Like a clothing item by ID
router.post("/:itemId/likes", likeItem);

// Dislike a clothing item by ID
router.delete("/:itemId/likes", dislikeItem);


module.exports = router;