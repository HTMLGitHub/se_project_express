const router = require('express').Router();
const { NOT_FOUND } = require('../utils/errors');

// Handle non-existent resoureces (404 Not Found)
router.use((req, res) => {
    res.status(NOT_FOUND).json(
        {
            message: "Request resource not found"
        });
});

module.exports = router;