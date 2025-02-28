const User = require("../models/user");
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, CONFLICT} = require("../utils/errors");

// Get all users
const getUsers = (req, res) => 
    User.find({})
        .then((users) => res.status(200).send(users))
        .catch((err) => 
            res
                .status(err.status || SERVER_ERROR)
                .send({ message: err.message || "Internal Server Error" })
        );

// GET user by ID
const getUser = (req, res) => 
    User.findById(req.params.userId)
        .orFail(() => res.status(NOT_FOUND).send({message: "User not found"}))
        .then((user) => res.status(200).send(user))
        .catch((err) => {
            if(err.name === "CastError") {
                return res.status(BAD_REQUEST).send({message: "Invalid User ID Format"});
            }
            
            return res
                .status(err.status || SERVER_ERROR)
                .send({message: err.message || "Internal Server Error"});
    });

// POST create a new user
const createUser = (req, res) => {
    const {name, avatar} = req.body;

    return User.create({name, avatar})
        .then((newUser) => res.status(201).send(newUser))
        .catch((err) => {
            // Mongoose Validation Error (e.g. required field missing)
            if(err.name === "ValidationError") {
                return res.status(BAD_REQUEST).send({message: "Invalid user data"});
            }

            // Duplicate key error (e.g. unique field conclicts)
            if(err.code === 11000) {
                return res.status(CONFLICT).send({message: "User already exists"});
            }

            return res.status(SERVER_ERROR).send({message: err.message});
        });
};

module.exports = {getUser, getUsers, createUser};