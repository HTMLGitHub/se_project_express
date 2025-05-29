const winston = require('winston');
const expressWinston = require('express-winston');
const { NODE_ENV, LOG_LEVEL } = process.env;
const { combine, timestamp, printf } = winston.format;
const path = require('path');
const { format } = require('winston');
const fs = require('fs');
const { LOG_DIR } = require('../utils/config');
const logDir = path.join(__dirname, '../logs');

const messageFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
        (
            {
                level, message, meta, timestamp
            }
        ) => `${timestamp} ${level}: ${meta.error?.stack || message}`
    )
);

const requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            format: messageFormat
        }),
        new winston.transports.File({
            filename: "request.log",
            format: winston.format.json(),
        }),
    ],
});

const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.File({filename: "error.log"}),
    ],
    format: winston.format.json(),
});

module.exports = {
    requestLogger,
    errorLogger,
};