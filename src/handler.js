/**
 * Created by rohit on 12/9/16.
 */

var response = require('./responseHandler');

function handler(model) {
    var self = this;
    self.getList = function(req, res) {
        var query = {};
        for(var column in req.query){
            query[column] = {$regex:req.query[column], $options:'i'};
        }
        model.find(query, function (err, data) {
            if (err) {
                response.send500(res, err);
            }
            if (data) {
                response.sendData(res, data);
            } else {
                response.send404(res);
            }
        });
    };

    self.get = function(req, res) {
        model.findById(req.params.id, function (err, data) {
            if (err) {
                response.send500(res, err);
            }
            if (data) {
                response.sendData(res, data);
            } else {
                response.send404(res);
            }
        });
    };

    self.post = function(req, res) {
        var newData = model(req.body);
        newData.save(function (err) {
            if (err) {
                response.send500(res, err);
            } else {
                model.findById(newData._id, function (err, data) {
                    if (err) {
                        response.send404(res);
                    } else {
                        response.sendData(res, data);
                    }
                });
            }
        });
    };

    self.put = function(req, res) {
        model.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true},
            function (err, data) {
                if (err) {
                    response.send500(res, err)
                }
                if (data) {
                    response.sendData(res, data);
                } else {
                    response.send404(res);
                }
            }
        );
    };

    self.handleDelete = function(req, res) {
        model.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                response.send500(res, err);
            } else {
                response.sendSuccess(res);
            }
        });
    };
}

module.exports = handler;