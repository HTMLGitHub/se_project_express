const ClothingItem = require('../models/clothingItem');

// Get all clothing items
const getClothingItems = async (req, res) => {
    ClothingItem.find({})
    .then(clothing => {
        res.status(200).json(clothing);
    })
    .catch(err => {
        res.status(err.status || 500).send({ message: err.message || "Internal Server Error" });
    });
}

// Create a new clothing item
const createClothingItem = async (req, res) => {
    const {name, weather, imageUrl, owner, likes, createdAt} = req.body;
    ClothingItem.create({name, weather, imageUrl, owner, likes, createdAt})
    .then(newItem => {
        res.status(201).send(newItem);
    })
    .catch(err => {
        let statusCode = 500; // Default to Internal Server Error

            // Mongoose Validation Error (e.g. required field missing)
            if(err.name === "ValidationError") {
                statusCode = 400;
            }

            // Duplicate key error (e.g. unique field conclicts)
            if(err.code === 11000) {
                statusCode = 409;
                err.message = "User already exists";
            }

            res.status(statusCode).send({message: err.message});
    });
}

// Delete a clothing item
const deleteClothingItem = async (req, res) => {
    const {itemId} = req.params;
    ClothingItem.findByIdAndDelete(itemId)
    .then(() => {
        res.status(200).send({ message: "Clothing item deleted successfully" });
    })
    .catch(err => {
        res.status(err.status || 500).send({ message: err.message || "Internal Server Error" });
    });
}

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
module.exports.creatreClothingItem = (res, req) => {console.log(req.user._id)};