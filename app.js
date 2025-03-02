const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');
const {NOT_FOUND,SERVER_ERROR} = require('./utils/errors');

const {PORT = 3001} = process.env;
const app = express();

// Connect to the wtwr database
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wtwr_db',
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => {
        console.log("Connected to wtwr database");
    })
    .catch(() => {
        console.error("Error connecting to wtwr database");
    });

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

    next();
});

// Global error handler (Fixes 500 HTML response)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    res.status(err.status || SERVER_ERROR).json(
        {
            message: err.message || "Internal Server Error"
        });
});

app.listen(PORT, () => {
    console.log("Up and running");
});
