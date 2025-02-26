const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: [true, "You must enter your name"]
    },
    avatar: {
        type: String,
        required: [true, "The avatar field is required"],
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "You must enter a valid URL",
        }
    }
});

module.exports = mongoose.model("user", userSchema);