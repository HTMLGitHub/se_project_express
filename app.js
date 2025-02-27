const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const mainRouter = require('./routers/index.js');
const {NOT_FOUND} = require('./utils/errors.js');

const {PORT = 3001, BASE_PATH} = process.env;
const app = express();

// Connect to the wtwr database
mongoose
    .connect('mongodb://127.0.0.1:27017/wtwr_db')
    .then(() => {
        console.log("Connected to wtwr database");
    })
    .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);
app.use((req, res, next) => {
    req.user = {
        id: '67bf183d474d88fd7542c773'
    };
    next();
});

// Handle non-existent resoureces (404 Not Found)
app.use((req, res) => {
    res.status(NOT_FOUND).json(
        {
            message: "Request resource not found"
        });
});

app.listen(PORT, () => {
    console.error("Up and running");
});
