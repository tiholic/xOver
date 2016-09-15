/**
 * Created by rohit on 12/9/16.
 */

var response = require('./responseHandler');

function handler(options) {
    var self = this;
    var model = options.model;
    var operation, request;
    self.getList = function(req, res) {
        try {
            operation = "get-list";
            request = req;
            model.find(getQuery(), function (err, data) {
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
        }catch (e){
            response.send500(res, e);
        }
    };

    self.get = function(req, res) {
        try {
            operation = "get";
            request = req;
            model.findOne(getQuery(), function (err, data) {
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
        }catch (e){
            response.send500(res, e);
        }
    };

    self.post = function(req, res) {
        try{
            operation = "post";
            request = req;
            var newData = model(preSave());
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
        }catch (e){
            response.send500(res, e);
        }
    };

    self.put = function(req, res) {
        try{
            operation = 'put';
            request = req;
            model.findOneAndUpdate(
                getQuery(),
                {$set: preSave()},
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
        }catch (e){
            response.send500(res, e);
        }
    };

    self.handleDelete = function(req, res) {
        try {
            operation = 'del';
            request = req;
            model.findByIdAndRemove(req.params.id, function (err, data) {
                if (err) {
                    response.send500(res, err);
                } else {
                    callback(data, false);
                    response.sendSuccess(res);
                }
            });
        }catch (e){
            response.send500(res, e);
        }
    };

    function callback(data, transform){
        if(transform!=false) {
            data = transformData(data, operation);
        }
        if(options.ccb){
            options.ccb(operation, data);
        }
        return data;
    }

    function preSave(){
        var data = request.body;
        if(options.preSave){
            return options.preSave(request, data, operation);
        }else{
            return data;
        }
    }

    function transformData(data){
        if(options.transformData){
            return options.transformData(request, data, operation);
        }else{
            return data;
        }
    }

    function getQuery(){
        if(options.queryHandler){
            return options.queryHandler(request, operation);
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