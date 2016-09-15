/**
 * Created by rohit on 14/9/16.
 */
var express = require('express');
var Handler = require('../handler');
var model = require('../models/donors');
var sockets = require('../sockets/ti.socket.io');
var router = express.Router();
var crypto = require("crypto");

var handler = new Handler({
    model:model,
    ccb:broadcastOtherUsers,
    preSave:preSave,
    transformData:transformData,
    queryHandler: queryHandler
});
router.get("/", handler.getList);
router.get("/:id", handler.get);
router.get("/:id/:private_id", handler.get);
router.post("/", handler.post);
router.put("/:id/:private_id", handler.put);
router.delete("/:id", handler.handleDelete);

function broadcastOtherUsers(operation, data){
    if(operation=="post"||operation=="put"||operation=="del") {
        sockets[operation](data);
    }
}

function preSave(req, data, operation){
    data.ip_address = req.ip;
    console.log(data);
    if(data.coordinates){
        adjustCoordinates(data.coordinates, 'set');
    }
    if(operation=='post'){
        data.private_id = crypto.randomBytes(20).toString('hex');
    }
    return data;
}

function transformData(request, data, operation){
    function transform(d){
        d.ip_address = undefined;
        if(operation!='put' && operation!='post' && !request.params.private_id){
            console.log('in');
            d.private_id = undefined;
        }
        adjustCoordinates(d.coordinates, 'get');
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

function adjustCoordinates(coords, type){
    if(type=='set'){
        // coords.latitude = +coords.latitude;
        // coords.longitude = +coords.longitude;
        coords.latitude += 90;
        coords.longitude += 180;
    }else{
        coords.latitude -= 90;
        coords.longitude -= 180;
    }
}

function queryHandler(request, operation){
    var query = request.query;
    if(operation=='get'){
        var new_query = {_id:request.params.id};
        if(request.params.private_id){
            new_query.private_id = request.params.private_id
        }else if(operation=='put'){
            throw new Error('Not Authenticated/Improper Url');
        }
        return new_query;
    }else if(operation=='get-list') {
        if (query.bounds) {
            var bounds = JSON.parse(query.bounds);
            var skip = {latidude:false, longitude:false};
            /*if(Math.abs(bounds.min.latitude - bounds.max.latitude)>178){
                skip.latidude = true;
            }
            if(Math.abs(bounds.min.longitude - bounds.max.longitude)>178){
                skip.longitude = true;
            }*/
            adjustCoordinates(bounds.min, 'set');
            adjustCoordinates(bounds.max, 'set');
            var new_query = {};
            if(!skip.longitude) {
                new_query["coordinates.longitude"] = {$gt: bounds.min.longitude, $lt: bounds.max.longitude};
            }
            if(!skip.latidude){
                new_query["coordinates.latitude"]= {$gt: bounds.min.latitude, $lt: bounds.max.latitude};
            }
            console.log(new_query);
            return new_query;
        }
    }
    return {};
}

module.exports = router;