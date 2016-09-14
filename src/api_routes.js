var express = require('express');
var router = express.Router();

// Import all routes
var userRoutes = require('./routes/users');
var donorRoutes = require('./routes/donors');

// Assign resource locators to routes
router.use("/users", userRoutes);
router.use("/donors", donorRoutes);

module.exports = router;