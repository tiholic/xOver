/**
 * Created by rohit on 17/9/16.
 */


var crypto = require("crypto");
var sockets = require('../sockets/ti.socket.io');
var LONGITUDE_MAX = 180;
var LATITUDE_MAX = 90;
var responseHandler = require('../responseHandler');

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

function validate(data){
    var latCheck = true;
    var lonCheck = true;
    if(data.coordinates){
        latCheck = ((0 <= data.coordinates.latitude)&&(data.coordinates.latitude <= LATITUDE_MAX*2));
        lonCheck = ((0 <= data.coordinates.longitude)&&(data.coordinates.longitude <= LONGITUDE_MAX*2));
    }else{
        latCheck = lonCheck = false;
    }
    var numCheck = (/^(00|\+)[0-9]{12}$/.test(data.contact_number));
    var emailCheck = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email));
    var bgCheck = data.blood_group?(/^(a|b|o|ab)(\+|\-)$/.test(data.blood_group.toLowerCase())):false;
    var nameChk = data.name && data.name.first && true;
    var errors = [];
    if(!latCheck){errors.push('invalid latitude')}
    if(!lonCheck){errors.push('invalid longitude')}
    if(!numCheck){errors.push('invalid contact number')}
    if(!emailCheck){errors.push('invalid email id')}
    if(!bgCheck){errors.push('blood group')}
    if(!nameChk){errors.push('name.first')}
    if(errors.length){
        return {valid:false, detail:errors};
    }
    return {valid:true};
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
            new_query.private_id = request.query.donor_private;
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
            if(bounds.min.longitude > bounds.max.longitude){
                var longitudeQuery = {"coordinates.longitude":{$gte: 0, $lte: 2*LONGITUDE_MAX}};
            }else {
                var longitudeQuery = {"coordinates.longitude":{$gte: bounds.min.longitude, $lte: bounds.max.longitude}};
            }
            var latitudeQuery = {"coordinates.latitude":{$gte: bounds.min.latitude, $lte: bounds.max.latitude}};
            new_query.$and = [
                longitudeQuery,
                latitudeQuery
            ];
            return new_query;
        }
    }
    return {};
}

module.exports = {
    ccb: broadcastOtherUsers,
    preSave: preSave,
    transformData: transformData,
    queryHandler: queryHandler,
    validate:validate
};
