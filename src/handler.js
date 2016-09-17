/**
 * Created by rohit on 12/9/16.
 */

var responseHandler = require('./responseHandler');

function handler(options) {
    var self = this;
    var model = options.model;
    var operation, request, response;
    self.getList = function(req, res) {
        try {
            operation = "get-list";
            request = req;
            response = res;
            model.find(getQuery(), function (err, data) {
                if (err) {
                    responseHandler.send500(res, err);
                }
                if (data) {
                    data = callback(data);
                    responseHandler.sendData(res, data);
                } else {
                    responseHandler.send404(res);
                }
            });
        }catch (e){
            responseHandler.send500(res, e);
        }
    };

    self.get = function(req, res) {
        try {
            operation = "get";
            request = req;
            response = res;
            model.findOne(getQuery(), function (err, data) {
                if (err) {
                    responseHandler.send500(res, err);
                }
                if (data) {
                    data = callback(data);
                    responseHandler.sendData(res, data);
                } else {
                    responseHandler.send404(res);
                }
            });
        }catch (e){
            responseHandler.send500(res, e);
        }
    };

    self.post = function(req, res) {
        try{
            operation = "post";
            request = req;
            response = res;
            var data = preSave();
            if(data) {
                var newData = model(data);
                newData.save(function (err) {
                    if (err) {
                        responseHandler.send500(res, err);
                    } else {
                        model.findById(newData._id, function (err, data) {
                            if (err) {
                                responseHandler.send404(res);
                            } else {
                                data = callback(data);
                                responseHandler.sendData(res, data);
                            }
                        });
                    }
                });
            }
        }catch (e){
            responseHandler.send500(res, e);
        }
    };

    self.put = function(req, res) {
        try{
            operation = 'put';
            request = req;
            response = res;
            var data = preSave();
            if(data) {
                model.findOneAndUpdate(
                    getQuery(),
                    {$set: data},
                    {new: true},
                    function (err, data) {
                        if (err) {
                            responseHandler.send500(res, err)
                        }
                        if (data) {
                            data = callback(data);
                            responseHandler.sendData(res, data);
                        } else {
                            responseHandler.send404(res);
                        }
                    }
                );
            }
        }catch (e){
            responseHandler.send500(res, e);
        }
    };

    self.handleDelete = function(req, res) {
        try {
            operation = 'del';
            request = req;
            response = res;
            model.findByIdAndRemove(req.params.id, function (err, data) {
                if (err) {
                    responseHandler.send500(res, err);
                } else {
                    callback(data, false);
                    responseHandler.sendSuccess(res);
                }
            });
        }catch (e){
            responseHandler.send500(res, e);
        }
    };

    function callback(data, transform){
        if(transform!=false) {
            data = transformData(data, operation);
        }
        if(options.handler.ccb){
            options.handler.ccb(operation, data);
        }
        return data;
    }

    function preSave(){
        var data = request.body;
        if(options.handler.preSave){
            data = options.handler.preSave(request, data, operation);
        }
        if(options.handler.validate){
            var validationRes = options.handler.validate(data);
            if(validationRes.valid){
                return data;
            }else{
                responseHandler.sendError(response, validationRes.detail);
            }
        }else{
            return data;
        }
    }

    function transformData(data){
        if(options.handler.transformData){
            return options.handler.transformData(request, data, operation);
        }else{
            return data;
        }
    }

    function getQuery(){
        if(options.handler.queryHandler){
            return options.handler.queryHandler(request, operation);
        }
        if(operation=='get'){
            return {_id:req.params.id};
        }
        var constuctedQuery = {};
        for(var column in request.query){
            constuctedQuery[column] = {$regex:query[column], $options:'i'};
        }
        return query;
    }
}

module.exports = handler;