/**
 * Created by rohit on 12/9/16.
 */

function send404(res){
    res.send({
        "status": {
            "status_code": 404,
            "message": "Not Found"
        }
    });
}

function send500(res, err) {
    res.send({
        "status": {
            "status_code": 500,
            "message": "Internal Server Error",
            "detail": err.message
        }
    });
}

function sendSuccess(res) {
    res.send({
        "status": {
            "status_code": 200,
            "message": "Success"
        }
    });
}

function sendData(res, data) {
    res.send({
        "data": data,
        "status": {
           "status_code": 200,
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