const res = require('express/lib/response');
const ClothingItem = require('../models/clothingItem');
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, CONFLICT} = require("../utils/errors");

// Get all clothing items
const getClothingItems = async (req, res) => {
    ClothingItem.find({})
    .then(clothing => {
        res.status(200).send(clothing);
    })
    .catch(err => {
        console.error(`Error Name: ${err.name}\nCode ${err.status}\nMessage ${err.message}`);
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
        console.error(`Error Name: ${err.name}\nCode ${err.status}\nMessage ${err.message}`);
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
        console.error(`Error Name: ${err.name}\nCode ${err.status}\nMessage ${err.message}`);
        res.status(err.status || SERVER_ERROR).send({ message: err.message || "Internal Server Error" });
    });
}

// Like a clothing item
const likeItem = (req, res) => {
    ClothingItem.findByIdAndUpdate(req.params.itemId, {
        $addToSet: {
            likes: req.user._id
        }}, { new: true })
        .orFail(() => {
            const error = Error("Clothing item not found");
            error.status = NOT_FOUND;
            throw error;
        })
        .then(updatedItem => res.status(200).send(updatedItem))
        .catch(err=> {
            console.error(`Error Name: ${err.name}\nCode ${err.status}\nMessage ${err.message}`);
            res.status(err.status || SERVER_ERROR).send({ message: err.message || "An error has occurred on the server." });
        });
    };

    // Dislike (unlike) a clothing item
    const dislikeItem = (req, res) => {
        ClothingItem.findByIdAndUpdate(req.params.itemId, {
            $pull: {
                likes: req.user._id
            }}, { new: true })
            .orFail(() => {
                const error = Error("Clothing item not found");
                error.status = NOT_FOUND;
                throw error;
            })
            .then(updatedItem => res.status(200).send(updatedItem))
            .catch(err=> {
                console.error(`Error Name: ${err.name}\nCode ${err.status}\nMessage ${err.message}`);
                res.status(err.status || SERVER_ERROR).send({ message: err.message || "An error has occurred on the server." });
            });
    }

module.exports = { getClothingItems, getClothingItem, createClothingItem, deleteClothingItem, likeItem, dislikeItem };
module.exports.creatreClothingItem = (res, req) => {console.log(req.user._id)};