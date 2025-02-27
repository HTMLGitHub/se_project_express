const { default: mongoose } = require('mongoose');
const ClothingItem = require('../models/clothingItem');
const {UNAUTHORIZED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR, CONFLICT, createError} = require("../utils/errors");

// Get all clothing items
const getClothingItems = (req, res) => {
    return ClothingItem.find({})
    .then(clothing => res.status(200).send(clothing))
    .catch(err => res.status(err.status || SERVER_ERROR).send({ message: err.message || "An error has occurred on the server."}));
};

// Get a clothing item by ID
const getClothingItem = (req, res) => {
    const {itemId} = req.params;
    ClothingItem.findById(itemId)
    .orFail(() => {
        throw createError("Clothing item not found", NOT_FOUND);
    })
    .then(clothing => {
        res.status(200).send(clothing);
    })
    .catch(err => {
        if(err.name === "CastError") {
            return res.status(BAD_REQUEST).send({ message: "Invalid Clothing Item ID Format" });
        }

        res.status(err.status || SERVER_ERROR).send({ message: err.message || "An error has occurred on the server." });
    });
}

// Create a new clothing item
const createClothingItem = (req, res) => {
    console.log(`"Create Clothing Item"\nIncoming Request: ${JSON.stringify(req.body, null, 2)}\n\n`);

    if(!req.user || !req.user._id) {
        return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
    }

    const {name, weather, imageUrl} = req.body;

    return ClothingItem.create({name, weather, imageUrl, owner: req.user._id})
    .then(newItem => res.status(201).send(newItem))
    .catch(err => {
       console.error("Create Item Error: ", err);

        // Mongoose Validation Error (e.g. required field missing)
        if(err.name === "ValidationError") {
            return res.status(BAD_REQUEST).send({message: "Invalid clothing item data"});
        }

        // Duplicate key error (e.g. unique field conclicts)
        if(err.code === 11000) {
            return res.status(CONFLICT).send({message: "Clothing item already exists"});
        }

        res.status(SERVER_ERROR).send({message: err.message});
    });
}

// Delete a clothing item
const deleteClothingItem = (req, res) => {
    const {itemId} = req.params;
    ClothingItem.findByIdAndDelete(itemId)
    .then(() => {
        res.status(200).send({ message: "Clothing item deleted successfully" });
    })
    .catch(err => {
        if(err.name === "CastError") {
            return res.status(BAD_REQUEST).send({ message: "Invalid Clothing Item ID Format" });
        }

        res.status(err.status || SERVER_ERROR).send({ message: err.message || "Internal Server Error" });
    });
}

// Like a clothing item
const likeItem = (req, res) => {
    console.log(`Like request for Item ID: ${req.params.itemId}`);

    if(!req.user || !req.user._id) {
        return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
    }    

    ClothingItem.findByIdAndUpdate(req.params.itemId, {
        $addToSet: {
            likes: req.user._id
        }}, { new: true })
        .orFail(() => {
           throw createError("Clothing item not found", NOT_FOUND);
        })
        .then(updatedItem => res.status(200).send(updatedItem))
        .catch(err=> {
            if(err.name === "CastError") {
                return res.status(BAD_REQUEST).send({ message: "Invalid Clothing Item ID Format" });
            }

            res.status(err.status || SERVER_ERROR).send({ message: err.message || "An error has occurred on the server." });
        });
    };

    // Dislike (unlike) a clothing item
    const dislikeItem = (req, res) => {
        console.log(`UnLike request for Item ID: ${req.params.itemId}`);
        console.log(`User ID: ${req.user ? req.user._id : "No user"}`);

        if(!req.user || !req.user._id) {
            return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
        }

        // Check if itemId is a valid OjectId
        if(!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
            return res.status(BAD_REQUEST).send({ message: "Invalid Clothing Item ID Format" });
        }

        // Step 1: Check if the item exists before trying to delete it
        ClothingItem.findById(req.params.itemId)
        .then(item => {
            if(!item) {
                console.log("Clothing item not found");
                return res.status(NOT_FOUND).send({ message: "Clothing item not found" });
            }

            // Step 2: Now delete it, since we confirmed it exists
            return ClothingItem.findByIdAndUpdate(req.params.itemId, {
                $pull: {
                    likes: req.user._id
                }},
                { new: true }
            );            
        })
        .then(updatedItem => {
            if(!updatedItem) {
                console.log("Failed to delete clothing item");
                return res.status(NOT_FOUND).send({ message: "Clothing item not found" });
            }

            res.status(200).send(updatedItem);
        })
        .catch(err => {
            if(err.name === "CastError") {
                return res.status(BAD_REQUEST).send({ message: "Invalid Clothing Item ID Format" });
            }

            res.status(err.status || SERVER_ERROR).send({ message: err.message || "An error has occurred on the server." });
        });            
    }

module.exports = { getClothingItems, getClothingItem, createClothingItem, deleteClothingItem, likeItem, dislikeItem };
module.exports.creatreClothingItem = (res, req) => {console.log(req.user._id)};