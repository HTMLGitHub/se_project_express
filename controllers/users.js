const User = require("../models/user");

// Get all users
const getUsers = async(req, res) => {
    User.find({})
        .then(users => {
            res.status(200).send(users);
        })
        .catch(err => {
            res.status(err.status || 500).send({ message: err.message || "Internal Server Error" });
        });
};

// GET user by ID
const getUser = async (req, res) => {
    const {userId} = req.params;

    User.findById(userId)
        .then(user => {
            if(!user) {
                return res.status(400).send({message: "User not found"});
            }
            res.status(200).send(user);
        })
        .catch(err => {
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
            let statusCode = 500; // Default to Internal Server Error

            // Mongoose Validation Error (e.g. required field missing)
            if(err.name === "ValidationError") {
                statusCode = 400;
            }

            // Duplicate key error (e.g. unique field conclicts)
            if(err.code === 11000) {
                statusCode = 409;
                err.message = "User already exists";
            }

            res.status(statusCode).send({message: err.message});
        });
};

module.exports = {getUser, getUsers, createUser};