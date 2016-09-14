/**
 * Created by rohit on 14/9/16.
 */
var express = require('express');
var Handler = require('../handler');
var model = require('../models/donors');
var sockets = require('../sockets/ti.socket.io');
var router = express.Router();

var handler = new Handler({model:model, ccb:broadcastOtherUsers, preSave:preSave, transformData:transformData});
router.get("/", handler.getList);
router.get("/:id", handler.get);
router.post("/", handler.post);
router.put("/:id", handler.put);
router.delete("/:id", handler.handleDelete);

function broadcastOtherUsers(operation, data){
    if(operation=="post"||operation=="put"||operation=="del") {
        sockets[operation](data);
    }
}

function preSave(req, data){
    data.ip_address = req.ip;
    return data;
}

function transformData(data){
    function transform(d){
        d.ip_address = undefined;
    }
    if(data instanceof Array){
        for(var d in data){
            transform(data[d]);
        }
    }else{
        transform(data);
    }
    return data;
}

module.exports = router;