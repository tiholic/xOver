/**
 * Created by rohit on 7/9/16.
 */
var express = require('express');
var Handler = require('../handler');
var model = require('../models/user');
var router = express.Router();

var handler = new Handler(model);
router.get("/", handler.getList);
router.get("/:id", handler.get);
router.post("/", handler.post);

module.exports = router;