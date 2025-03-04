const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');
const {SERVER_ERROR} = require('./utils/errors');
const ResourceNotFound = require('./routes/notFound');
const auth = require('./middlewares/auth');

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

app.use(auth);

app.use("/", mainRouter);

app.use(ResourceNotFound);

// Global error handler (Fixes 500 HTML response)
app.use((err, req, res, next) => {
    res.status(err.status || SERVER_ERROR).json(
        {
            message: err.message || "Internal Server Error"
        });

        next();
});

app.listen(PORT, () => {
    console.log("Up and running");
});
