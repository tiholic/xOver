/**
 * Created by rohit on 17/9/16.
 */


var crypto = require("crypto");
var sockets = require('../sockets/ti.socket.io');
var LONGITUDE_MAX = 180;
var LATITUDE_MAX = 90;

function broadcastOtherUsers(operation, data){
    if(operation=="post"||operation=="put"||operation=="del") {
        sockets[operation](data);
    }
}

function preSave(req, data, operation){
    data.ip_address = req.ip;
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
        coords.latitude = +coords.latitude;
        coords.longitude = +coords.longitude;
        coords.latitude += LATITUDE_MAX;
        coords.longitude += LONGITUDE_MAX;
    }else{
        coords.latitude -= LATITUDE_MAX;
        coords.longitude -= LONGITUDE_MAX;
    }
}

function queryHandler(request, operation){
    var query = request.query;
    if(operation=='get'||operation=='put'){
        var new_query = {_id:request.params.id};
        if(request.query.donor_private){
            new_query.private_id = request.query.donor_private
        }else if(operation=='put'){
            throw new Error('Not Authenticated/Improper Url');
        }
        return new_query;
    }else if(operation=='get-list') {
        if (query.bounds) {
            var bounds = JSON.parse(query.bounds);
            adjustCoordinates(bounds.min, 'set');
            adjustCoordinates(bounds.max, 'set');
            var new_query = {};
            console.log((bounds.min.longitude > bounds.max.longitude));
            if(bounds.min.longitude > bounds.max.longitude){
                // var longitudeQuery = {$or:[
                //     {"coordinates.longitude":{$gte: bounds.min.longitude, $lte: LONGITUDE_MAX+LONGITUDE_MAX}},
                //     {"coordinates.longitude":{$gte: -(LONGITUDE_MAX-LONGITUDE_MAX), $lte:bounds.max.longitude}}
                // ]};
                var longitudeQuery = {"coordinates.longitude":{$gte: 0, $lte: 2*LONGITUDE_MAX}};
            }else {
                var longitudeQuery = {"coordinates.longitude":{$gte: bounds.min.longitude, $lte: bounds.max.longitude}};
            }
            var latitudeQuery = {"coordinates.latitude":{$gte: bounds.min.latitude, $lte: bounds.max.latitude}};
            new_query.$and = [
                longitudeQuery,
                latitudeQuery
            ];
            console.log(JSON.stringify(new_query));
            return new_query;
        }
    }
    return {};
}

module.exports = {
    ccb: broadcastOtherUsers,
    preSave: preSave,
    transformData: transformData,
    queryHandler: queryHandler
};