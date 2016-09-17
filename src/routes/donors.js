/**
 * Created by rohit on 14/9/16.
 */
var express = require('express');
var Handler = require('../handler');
var model = require('../models/donors');
var router = express.Router();
var donorHandler = require('../handlers/donors');

var handler = new Handler({
    model:model,
    handler: donorHandler
});
router.get("/", handler.getList);
router.get("/:id", handler.get);
router.get("/:id/:private_id", handler.get);
router.post("/", handler.post);
router.patch("/:id", handler.put);
router.delete("/:id", handler.handleDelete);

module.exports = router;