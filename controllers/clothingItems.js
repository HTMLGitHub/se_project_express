const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');
const {UNAUTHORIZED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR, FORBIDDEN} = require("../utils/errors");

// Get all clothing items
const getClothingItems = (req, res) =>
    ClothingItem.find({})
    .then((clothing) => res.status(200).json(clothing))
    .catch(() => 
        res.status(SERVER_ERROR).json({ message: "An error has occurred on the server."})
    );

// Get a clothing item by ID
const getClothingItem = (req, res) =>
    ClothingItem.findById(req.params.itemId)
    .orFail(() => {throw new Error("NotFound")})
    .then((clothing) => res.status(200).json(clothing))
    .catch((err) => {
        if(err.name === "CastError") {
            return res.status(BAD_REQUEST).json({ message: "Invalid Clothing Item ID Format" });
        }

        if(err.message === "NotFound") {
            return res.status(NOT_FOUND).json({ message: "Clothing item not found" });
        }

        return res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    });

// Create a new clothing item
const createClothingItem = (req, res) => {
    if(!req.user?._id) {
        return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const {name, weather, imageUrl} = req.body;
    
    const newClothes = new ClothingItem({name, weather, imageUrl, owner: req.user._id});

    return newClothes.save()
    .then((newItem) => res.status(201).json(newItem))
    .catch((err) => {
        if(err.name === "ValidationError") {
            return res.status(BAD_REQUEST).json({message: "Invalid clothing item data"});
        }

        return res.status(SERVER_ERROR).json({message: err.message});
    });
}

// Delete a clothing item
const deleteClothingItem = (req, res) => {
    const {itemId} = req.params.itemId;
    const userId = req.user._id;
    
    if(!userId) {
        return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    // Check if itemId is a valid OjectId
    if(!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
        return res.status(BAD_REQUEST).json({ message: "Invalid Clothing Item ID Format" });
    }

    return ClothingItem.findById(itemId)
    .then((item) => {
        if(!item) {
            return res.status(NOT_FOUND).json({message: "Clothing item not found"});
        }

        if(item.owner.toString() !== userId) {
            return res.status(FORBIDDEN).json({message: "You do not have permission to delete this item"});
        }

        return ClothingItem.findByIdAndDelete(itemId)
        .then((deletedItem)=> {
            if(!deletedItem) {
                console.error("Failed to delete item");
                return res.status(SERVER_ERROR).json({message: "Failed to delete item"})
            }

            console.log("Item deleted successfully");
            return ClothingItem.find()
            .then((items)=>
                res.status(200).json(items)
            );
        });
    })
    .catch((err) => {
        console.error("Error deleting item", err.message);
        return res.status(SERVER_ERROR).json({message: "Internal Server Error"});
    });
};

// Like a clothing item
const likeItem = (req, res) => {
    if(!req.user?._id) {
        return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
    }    

    return ClothingItem.findByIdAndUpdate(
        req.params.itemId, 
        {
            $addToSet: 
            {
                likes: req.user._id,
            },
        },
        { new: true }
    )
        .orFail(() => {throw new Error("NotFound")})
        .then((updatedItem) => res.status(200).json(updatedItem))
        .catch((err) => {
            if(err.name === "CastError") {
                return res.status(BAD_REQUEST).json({ message: "Invalid Clothing Item ID Format" });
            }

            if(err.message === "NotFound") {
                return res.status(NOT_FOUND).json({ message: "Clothing item not found" });
            }

            return res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
        });
    };

    const dislikeItem = async (req, res) => {
        try {
            if(!req.user?._id) {
                return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
            }    

            if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
                return res.status(BAD_REQUEST).json({ message: "Invalid Clothing Item ID Format" });
            }
    
           const item = await ClothingItem.findById(req.params.itemId);
           if (!item) {
               return res.status(NOT_FOUND).json({ message: "Clothing item not found" });
           }

           const updatedItem = await ClothingItem.findByIdAndUpdate(
               req.params.itemId,
               {
                   $pull: 
                   {
                       likes: req.user._id,
                   },
               },
               { new: true }
           );

           if(!updatedItem) {
                return res.status(SERVER_ERROR).json({ message: "Failed to remove Like" });
           }

           return res.status(200).json(updatedItem);
        }
        catch(err) {
            if(err.name === "CastError") {
                return res.status(BAD_REQUEST).json({ message: "Invalid Clothing Item ID Format" });
            }

            return res.status(err.status || SERVER_ERROR).json({ message: err.message || "An error has occurred on the server." });
        }
    }
    

module.exports = { getClothingItems, getClothingItem, createClothingItem, deleteClothingItem, likeItem, dislikeItem };