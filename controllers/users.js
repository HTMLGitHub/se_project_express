const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken'); // Import JWT library
const  mongoose = require("mongoose");
const User = require("../models/user");
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, CONFLICT, DUPLICATE_EMAIL_ERROR} = require("../utils/errors");
const {JWT_SECRET} = require("../utils/config"); // Import secret key

// GET user by ID
const getCurrentUser = (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(BAD_REQUEST).json({message: "User ID is required"});
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(BAD_REQUEST).json({message: "Invalid User ID Format"});
    }

    return User.findById(userId)
        .orFail(() => {throw new Error("NotFound")})
        .then((user) => res.status(200).json(user))
        
        .catch((err) => {
            if(err.name === "CastError") {
                return res.status(BAD_REQUEST).json({message: "Invalid User ID Format"});
            }

            if(err.message === "NotFound") {
                return res.status(NOT_FOUND).json({message: "User not found"});
            }

            return res.status(SERVER_ERROR).json({message: "Internal Server Error"});
    });
};

// POST create a new user
const createUser = (req, res) => {
   if(!req.body.email) {
    return res.status(BAD_REQUEST).json({message: "Email is required"});
   }

   const user = new User({
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: req.body.password,
   });

    return bcrypt.hash(user.password, 10)
        .then((hash) => {
            user.password = hash;
            return user.save();
        })
        .then((newUser) => {
            const userObj = newUser.toObject();    // Convert to plain object
            delete userObj.password;            // Removes password field
            return res.status(201).json(userObj);      // Send response without the password
        })
        .catch((err) => {
            console.error(`Error in createUser: \n${err}\n`)

            if(err.code === DUPLICATE_EMAIL_ERROR) {
                console.error(`Email exists: ${req.body.email}`);
                return res.status(CONFLICT).json({message: "Email already exists"});
            }

            if(err.name === "ValidationError") {
                console.error(`Validation Error`);
                return res.status(BAD_REQUEST).json({message: "Invalid user data"});
            }
            console.error("Server Error");
            return res.status(SERVER_ERROR).json({message: err.message});
        });
    };

// Update current user's profile (name & avatar)
const updateUser = (req, res) => {
    const userId = req.user._id;        // Extract user Id from verified token
    const {name, avatar} = req.body;    // Extract name and avatar from request body

    // Update user with validation
    return User.findByIdAndUpdate(
        userId,
        {name, avatar},
        {new: true, runValidators: true} // Return updated user and validate input based on schema
    )
    .orFail(() => {throw new Error("NotFound");})
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => {
        if(err.name === "ValidationError") {
            return res.status(BAD_REQUEST).json({message: "Invalid user data"});
        }

        if(err.message === "NotFound") {
            return res.status(NOT_FOUND).json({message: "User not found"});
        }

        return res.status(SERVER_ERROR).json({message: "Internal Server Error"});
    });
};

// Login a user
const loginUser = (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        console.error("Missing email or password");
        return res.status(BAD_REQUEST).json({message: "Email and password are required"});
    }

    return User.findUserByCredentials(email, password)
        .then((user) => {
            // Create JWT token
            const token = jwt.sign({_id: user._id}, JWT_SECRET, {
                expiresIn: "7d", // Token valid for 7 days
            });
            
            // Send token to the client
            res.status(200).json({token});
        })
        .catch(() => res.status(SERVER_ERROR).json({message: "Internal Server Error"}));
};

module.exports = {getCurrentUser, createUser, updateUser, loginUser};