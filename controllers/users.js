const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, CONFLICT} = require("../utils/errors");

// Get all users
const getUsers = (req, res) => 
    User.find({})
        .then((users) => res.status(200).json(users))
        .catch(() => 
            res.status(SERVER_ERROR).json({ message: "Internal Server Error" })
        );

// GET user by ID
const getUser = (req, res) => {
    if (!req.params.userId) {
        return res.status(BAD_REQUEST).json({message: "User ID is required"});
    }

    if(!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(BAD_REQUEST).json({message: "Invalid User ID Format"});
    }

    return User.findById(req.params.userId)
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
    const {name, avatar} = req.body;

    return User.create({name, avatar})
        .then((newUser) => res.status(201).json(newUser))
        .catch((err) => {
            // Mongoose Validation Error (e.g. required field missing)
            if(err.name === "ValidationError") {
                return res.status(BAD_REQUEST).json({message: "Invalid user data"});
            }

            // Duplicate key error (e.g. unique field conclicts)
            if(err.code === 11000) {
                return res.status(CONFLICT).json({message: "User already exists"});
            }

            return res.status(SERVER_ERROR).json({message: err.message});
        });
};

module.exports = {getUser, getUsers, createUser};