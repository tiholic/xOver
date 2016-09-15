/**
 * Created by rohit on 12/9/16.
 */

function send404(res){
    console.log("NA404");
    res.send({
        "status": {
            "status_code": 404,
            "success": false,
            "message": "Not Found"
        }
    });
}

function send500(res, err) {
    console.log("INTERNAL ERROR", err);
    res.send({
        "status": {
            "status_code": 500,
            "success": false,
            "message": "Internal Server Error",
            "detail": err
        }
    });
}

function sendSuccess(res) {
    res.send({
        "status": {
            "status_code": 200,
            "success": true,
            "message": "Success"
        }
    });
}

function sendData(res, data) {
    res.send({
        "data": data,
        "status": {
           "status_code": 200,
            "success": true,
            "message": "success"
        }
    });
}

module.exports = {
    send404: send404,
    send500: send500,
    sendSuccess: sendSuccess,
    sendData: sendData
};