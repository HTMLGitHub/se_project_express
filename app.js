require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mainRouter = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const {errors} = require('celebrate');
const ResourceNotFound = require('./routes/notFound');
const {requestLogger, errorLogger} = require('./middlewares/logger');

const {PORT} = require('./config');
const app = express();



app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  
    credentials: true
}));

// Connect to the wtwr database
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wtwr_db',
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

app.use(helmet());

app.use(requestLogger);

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
