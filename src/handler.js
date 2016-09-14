/**
 * Created by rohit on 12/9/16.
 */

var response = require('./responseHandler');

function handler(options) {
    var self = this;
    var model = options.model;
    var operation, request;
    self.getList = function(req, res) {
        operation = "get-list";
        request = req;
        var query = {};
        for(var column in req.query){
            query[column] = {$regex:req.query[column], $options:'i'};
        }
        model.find(query, function (err, data) {
            if (err) {
                response.send500(res, err);
            }
            if (data) {
                data = callback(data);
                response.sendData(res, data);
            } else {
                response.send404(res);
            }
        });
    };

    self.get = function(req, res) {
        operation = "get";
        request = req;
        model.findById(req.params.id, function (err, data) {
            if (err) {
                response.send500(res, err);
            }
            if (data) {
                data = callback(data);
                response.sendData(res, data);
            } else {
                response.send404(res);
            }
        });
    };

    self.post = function(req, res) {
        operation = "post";
        request = req;
        var newData = model(preSave(req.body));
        newData.save(function (err) {
            if (err) {
                response.send500(res, err);
            } else {
                model.findById(newData._id, function (err, data) {
                    if (err) {
                        response.send404(res);
                    } else {
                        data = callback(data);
                        response.sendData(res, data);
                    }
                });
            }
        });
    };

    self.put = function(req, res) {
        operation = 'put';
        request = req;
        model.findByIdAndUpdate(
            req.params.id,
            {$set: preSave(req.body)},
            {new: true},
            function (err, data) {
                if (err) {
                    response.send500(res, err)
                }
                if (data) {
                    data = callback(data);
                    response.sendData(res, data);
                } else {
                    response.send404(res);
                }
            }
        );
    };

    self.handleDelete = function(req, res) {
        operation = 'del';
        request = req;
        model.findByIdAndRemove(req.params.id, function (err, data) {
            if (err) {
                response.send500(res, err);
            } else {
                callback(data);
                response.sendSuccess(res);
            }
        });
    };

    function callback(data){
        data = transformData(data);
        if(options.ccb){
            options.ccb(operation, data);
        }
        return data;
    }

    function preSave(data){
        if(options.preSave){
            return options.preSave(request, data, operation);
        }else{
            return data;
        }
    }

    function transformData(data){
        if(options.transformData){
            return options.transformData(data);
        }else{
            return data;
        }
    }
}

module.exports = handler;