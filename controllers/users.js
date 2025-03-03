const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, CONFLICT, UNAUTHORIZED} = require("../utils/errors");
const bcrypt = require("bcryptjs");

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
    return bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
            name: req.body.name,
            avatar: req.body.avatar,
            email: req.body.email,
            password: hash
        }))
        .then((user) => res.status(201).json(user))
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

// Login a user
const loginUser = (req, res) => {
    const {email, password} = req.body;

    return User.findUserByCredentials(email, password)
        .then((user) => res.status(200).json(user))
        .catch(() => res.status(UNAUTHORIZED).json({message: "Incorrect email or password"}));
};

module.exports = {getUser, getUsers, createUser};