const router = require("express").Router();
const {getClothingItems, createClothingItem, deleteClothingItem} = require("../controllers/clothingItems");

// Getting all clothing items
router.get("/", getClothingItems);

// POST a new clothing item
router.post("/", createClothingItem);


router.delete("/:itemId", deleteClothingItem);


module.exports = router;