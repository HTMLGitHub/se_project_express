const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');
const {NOT_FOUND,SERVER_ERROR} = require('./utils/errors');

const {PORT = 3001} = process.env;
const app = express();

// Connect to the wtwr database
mongoose
    .connect('mongodb://127.0.0.1:27017/wtwr_db',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to wtwr database");
    })
    .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
    req.user = {
        _id: '67bf183d474d88fd7542c773'
    };
    next();
});

app.use("/", mainRouter);

// Handle non-existent resoureces (404 Not Found)
app.use((req, res, next) => {
    res.status(NOT_FOUND).json(
        {
            message: "Request resource not found"
        });
});

// Global error handler (Fixes 500 HTML response)
app.use((err, req, res, next) => {
    console.error(`Unhandled Error: ${err}`);
    res.status(err.status || SERVER_ERROR).json(
        {
            message: err.message || "Internal Server Error"
        });
});

app.listen(PORT, () => {
    console.log("Up and running");
});
