/* eslint-disable no-console */
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken'); // Import JWT library
const  mongoose = require("mongoose");
const User = require("../models/user");
const NotFound = require("../errors/NotFound");
const BadRequest = require("../errors/BadRequest");
const DuplicateEmail = require("../errors/DuplicateEmail");
const Unauthorized = require("../errors/Unauthorized");
const {JWT_SECRET} = require("../utils/config"); // Import secret key

// GET user by ID
const getCurrentUser = (req, res, next) => {
    const userId = req.user._id;

    if (!userId) {
        return next(new BadRequest("User ID is required"));
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new BadRequest("Invalid User ID format"));
    }

    return User.findById(userId)
        .orFail(() => new NotFound("User not found"))
        .then((user) => res.status(200).json(user))
        .catch((err) => {
            if(err.name === "CastError") {
                return next(new BadRequest("Invalid User ID format"));
            }

            return next(err);
        });
};

// POST create a new user
const createUser = (req, res, next) => {
    console.log("Creating user");
    console.log(req.body);

    const {name, avatar, email, password} = req.body;

   if(!email) {
    return next(new BadRequest("Email is required"));
   }

   const user = new User({name, avatar, email, password});

    return bcrypt
        .hash(password, 10)
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

            if(err.code === 11000) {
                console.error(`Email exists: ${req.body.email}`);
                return next(new DuplicateEmail("Email already exists"));
            }

            if(err.name === "ValidationError") {
                console.error(`Validation Error`);
                return new(BadRequest("Invalid user data"));
            }
            return next(err);
        });
    };

// Update current user's profile (name & avatar)
const updateUser = (req, res, next) => {                            
    const userId = req.user._id;                                                    // Extract user Id from verified token
    const {name, avatar} = req.body;                                                // Extract name and avatar from request body

    // Update user with validation
    return User.findByIdAndUpdate(
        userId,
        {name, avatar},
        {new: true, runValidators: true}                                            // Return updated user and validate input based on schema
    )
    .orFail(() => new NotFound("User not found"))                                   // If user not found, throw NotFound error
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => {
        if(err.name === "ValidationError") {
            return next(new BadRequest("Invalid user data"));
        }

        return next(err);
    });
};

// Login a user
const loginUser = (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        console.error("Missing email or password");
        return next(new BadRequest("Email and password are required"));
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
        .catch((err) => {
            if(err.message === "Incorrect email or password") {
                return next(new Unauthorized(err.message));
            }

            return next(err);
        });
};

module.exports = {getCurrentUser, createUser, updateUser, loginUser};