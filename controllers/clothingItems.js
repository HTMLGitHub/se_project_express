const ClothingItem = require('../models/clothingItem');
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, CONFLICT} = require("../utils/errors");

// Get all clothing items
const getClothingItems = async (req, res) => {
    ClothingItem.find({})
    .then(clothing => {
        res.status(200).send(clothing);
    })
    .catch(err => {
        res.status(err.status || SERVER_ERROR).send({ message: err.message || "An error has occurred on the server."});
    });
}

// Get a clothing item by ID
const getClothingItem = async (req, res) => {
    const {itemId} = req.params;
    ClothingItem.findById(itemId)
    .orFail(() => {
        const error = Error("Clothing item not found");
        error.status = NOT_FOUND;
        throw error;
    })
    .then(clothing => {
        res.status(200).send(clothing);
    })
    .catch(err => {
        res.status(err.status || SERVER_ERROR).send({ message: err.message || "An error has occurred on the server." });
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
        let statusCode = SERVER_ERROR; // Default to Internal Server Error

            // Mongoose Validation Error (e.g. required field missing)
            if(err.name === "ValidationError") {
                statusCode = BAD_REQUEST;
            }

            // Duplicate key error (e.g. unique field conclicts)
            if(err.code === 11000) {
                statusCode = CONFLICT;
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
        res.status(err.status || SERVER_ERROR).send({ message: err.message || "Internal Server Error" });
    });
}

module.exports = { getClothingItems, getClothingItem, createClothingItem, deleteClothingItem };
module.exports.creatreClothingItem = (res, req) => {console.log(req.user._id)};