/**
 * Created by rohit on 13/9/16.
 */

var tio;

function listen(io){
    tio = io;
    io.on("connection", function(socket){
        console.log("user connected");
    });
}

function newDonor(data){
    tio.sockets.emit('donors-add', data);
}

function donorUpdated(data){
    tio.sockets.emit('donors-update', data);
}

function donorRemoved(data){
    tio.sockets.emit('donors-delete', data);
}

module.exports = {
    post: newDonor,
    put: donorUpdated,
    del: donorRemoved,
    listen: listen
};