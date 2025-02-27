const router = require("express").Router();
const {getClothingItems, getClothingItem, createClothingItem, deleteClothingItem} = require("../controllers/clothingItems");

// Getting all clothing items
router.get("/", getClothingItems);

// Getting a clothing item by ID
router.get("/:itemId", getClothingItem);

// POST a new clothing item
router.post("/", createClothingItem);


router.delete("/:itemId", deleteClothingItem);


module.exports = router;