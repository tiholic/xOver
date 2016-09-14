var express = require('express');
var router = express.Router();

// Import all routes
var donorRoutes = require('./routes/donors');

// Assign resource locators to routes
router.use("/donors", donorRoutes);

module.exports = router;