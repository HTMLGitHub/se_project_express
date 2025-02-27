const User = require("../models/user");
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, CONFLICT} = require("../utils/errors");

// Get all users
const getUsers = async(req, res) => {
    User.find({})
        .then(users => {
            res.status(200).send(users);
        })
        .catch(err => {
            console.error(err.name, err.message);
            res.status(err.status || SERVER_ERROR).send({ message: err.message || "Internal Server Error" });
        });
};

// GET user by ID
const getUser = async (req, res) => {
    const {userId} = req.params;

    User.findById(userId)
        .orFail(() => {
            const error = Error("User not found");
            error.status = NOT_FOUND;
            throw error;
        })
        .then(user => {
            res.status(200).send(user);
        })
        .catch(err => {
            console.error(err.name, err.message);
            res.status(err.status || 500).send({message: err.message || "Internal Server Error"});
        });
};

// POST create a new user
const createUser = async (req, res) => {
    const {name, avatar} = req.body;

    User.create({name, avatar})
        .then(newUser => {
            res.status(201).send(newUser);
        })
        .catch(err => {
            let statusCode = SERVER_ERROR; // Default to Internal Server Error

            // Mongoose Validation Error (e.g. required field missing)
            if(err.name === "ValidationError") {
                statusCode = BAD_REQUEST;
            }

            // Duplicate key error (e.g. unique field conclicts)
            if(err.code === 11000) {
                statusCode = CONFLICT;
                err.message = "User already exists";
            }

            res.status(statusCode).send({message: err.message});
        });
};

module.exports = {getUser, getUsers, createUser};