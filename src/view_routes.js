/**
 * Created by rohit on 14/9/16.
 */

var express = require('express');
var router = express.Router();

function getIndex(req, res){
    res.sendFile(__dirname+"/index.html");
}

router.get("/", getIndex);

module.exports = router;