/* eslint-disable no-console */
const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');
const BADREQUEST = require("../errors/BadRequest");
const NOTFOUND = require("../errors/NotFound");
const FORBIDDEN = require("../errors/Forbidden");
const SERVERERROR = require("../errors/ServerError");
const UNAUTHORIZED = require("../errors/Unauthorized");


// Get all clothing items
const getClothingItems = (req, res, next) =>
    ClothingItem.find({})
    .then((clothing) => res.status(200).json(clothing))
    .catch(() => {
        next(new SERVERERROR("An error has occurred on the server."));
    });

// Get a clothing item by ID
const getClothingItem = (req, res, next) =>
    ClothingItem.findById(req.params.itemId)
    .orFail(() => {throw new Error("NotFound")})
    .then((clothing) => res.status(200).json(clothing))
    .catch((err) => {
        if(err.name === "CastError") { next(new BADREQUEST("Invalid Clothing Item ID Format" )); }

        if(err.message === "NotFound") { next(new NOTFOUND("Clothing item not found")); }

        next(new SERVERERROR("An error has occurred on the server."));
    });

// Create a new clothing item
const createClothingItem = (req, res, next) => {
    if(!req.user?._id) { next(new UNAUTHORIZED("Unauthorized"));}

    const {name, weather, imageUrl} = req.body;
    
    const newClothes = new ClothingItem({name, weather, imageUrl, owner: req.user._id});

    return newClothes.save()
    .then((newItem) => res.status(201).json(newItem))
    .catch((err) => {
        if(err.name === "ValidationError") { next(new BADREQUEST("Invalid clothing item data")); }

        next(new SERVERERROR(err.message));
    });
}

// Delete a clothing item
const deleteClothingItem = (req, res, next) => {
    const {itemId} = req.params;
    const userId = req.user?._id;
    
    if(!userId) { next(new UNAUTHORIZED("Unauthorized")); }

    // Check if itemId is a valid OjectId
    if(!mongoose.Types.ObjectId.isValid(itemId)) { next(new BADREQUEST("Invalid Clothing Item ID Format")); }

    return ClothingItem.findById(itemId)
    .then((item) => {
        if(!item) {
            return next (new NOTFOUND("Clothing item not found"));
        }

        if(item.owner.toString() !== userId) { return next (new FORBIDDEN("You do not have permission to delete this item")); }
            
        return ClothingItem.findByIdAndDelete(itemId)
        .then((deletedItem)=> {
            if(!deletedItem) {
                console.error("Failed to delete item");
                next(new NOTFOUND("Failed to delete item"));
            }

            console.log("Item deleted successfully");
            
            return res.status(200).json({message: "Item deleted successfully"});
        });
    })
    .catch((err) => {
        console.error("Error deleting item", err.message);
        next(new SERVERERROR("Internal Server Error"));
    });
};

// Like a clothing item
const likeItem = (req, res, next) => {
    if(!req.user?._id) { next(new UNAUTHORIZED("Unauthorized")); }    

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
            if(err.name === "CastError") { next(new BADREQUEST("Invalid Clothing Item ID Format")); }
            
            if(err.message === "NotFound") { next(new NOTFOUND("Clothing item not found")); }

            next(new SERVERERROR("An error has occurred on the server."));
        });
    };

    const dislikeItem = async (req, res, next) => {
        try {
            if(!req.user?._id) { return next(new UNAUTHORIZED("Unauthorized")); }
                
            if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
                return next(new BADREQUEST("Invalid Clothing Item ID Format")); 
            }
    
           const item = await ClothingItem.findById(req.params.itemId);
           if (!item) { return next(new NOTFOUND("Clothing item not found")); }
               
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

           if(!updatedItem) { return next(new SERVERERROR("Failed to remove Like")); }

           return res.status(200).json(updatedItem);
        }
        catch(err) {
            if(err.name === "CastError") { return next(new BADREQUEST("Invalid Clothing Item ID Format")); }

            return next(err);
        }
    }
    

module.exports = { getClothingItems, getClothingItem, createClothingItem, deleteClothingItem, likeItem, dislikeItem };