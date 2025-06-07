/* eslint-disable no-console */
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const {errors} = require('celebrate');
const mainRouter = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const ResourceNotFound = require('./routes/notFound');
const {requestLogger, errorLogger} = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter'); // Import rate limiter middleware
const {PORT} = require('./config');

const app = express();



app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  
    credentials: true
}));

// Connect to the wtwr database
mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wtwr_db",
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => {
        console.log("Connected to wtwr database");
        console.log("Database URI:", process.env.MONGO_URI);
    })
    .catch(() => {
        console.error("Error connecting to wtwr database");
    });
    
app.use(express.json());
app.use(rateLimiter); // Apply rate limiting middleware
app.use(helmet());

app.use(requestLogger);

// Crash test route - require for Sprint 15 code review
// remove afterwards
app.get('/crash-test', () => {
    setTimeout(() => {
        throw new Error('Server will crash now');
    }, 0);
});

app.use("/", mainRouter);

app.use(ResourceNotFound);

// enabling the error logger
app.use(errorLogger);

// Celebrate error handler
app.use(errors());

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log("Up and running");
});
