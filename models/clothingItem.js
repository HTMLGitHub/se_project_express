const mongoose = require('mongoose');
const validator = require('validator');

const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: [true, "Name field is required"]
    },
    weather: {
        type: String,
        enum: ['hot', 'warm', 'cold'],
        required: [true, "You need to pick a weather type"]
    },
    imageUrl: {
        type: String,
        required: [true, "Clothing Item image is required"],
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "You must enter a valid URL",
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Every clothing item must have an owner"],
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("item", clothingItemSchema);