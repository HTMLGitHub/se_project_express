const  mongoose = require("mongoose");
const User = require("../models/user");
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, CONFLICT, UNAUTHORIZED} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken'); // Import JWT library
const {JWT_SECRET} = require("../utils/config"); // Import secret key

// Get all users
const getUsers = (req, res) => 
    User.find({})
        .then((users) => res.status(200).json(users))
        .catch(() => 
            res.status(SERVER_ERROR).json({ message: "Internal Server Error" })
        );

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
    return bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
            name: req.body.name,
            avatar: req.body.avatar,
            email: req.body.email,
            password: hash
        }))
        .then((user) => {
            const userObj = user.toObject();    // Convert to plain object
            delete userObj.password;            // Removes password field
            res.status(201).json(userObj);      // Send response without the password
        })
        .catch((err) => {
            if(err.code === 11000) {
                return res.status(CONFLICT).json({message: "Email already exists"});
            }

            if(err.name === "ValidationError") {
                return res.status(BAD_REQUEST).json({message: "Invalid user data"});
            }

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
    .then((updatedUser) => res.status(200).json(updateUser))
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

    return User.findUserByCredentials(email, password)
        .then((user) => {
            // Create JWT token
            const token = jwt.sign({_id: user._id}, JWT_SECRET, {
                expiresIn: "7d", // Token valid for 7 days
            });
            
            // Send token to the client
            res.status(200).json({token});
        })
        .catch(() => res.status(UNAUTHORIZED).json({message: "Incorrect email or password"}));
};

module.exports = {getCurrentUser, getUsers, createUser, updateUser, loginUser};