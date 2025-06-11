const router = require('express').Router();
const NOTFOUNDERROR = require('../errors/NotFound');

// Handle non-existent resoureces (404 Not Found)
router.use((req, res, next) => {
    next(new NOTFOUNDERROR('Requested resource not found'));
});

module.exports = router;