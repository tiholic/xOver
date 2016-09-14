/**
 * Created by rohit on 13/9/16.
 */

var sockets = {};

function addConnections(io){
    io.on('connection', function(socket){
        sockets[socket.id] = socket;
        console.log("=========================================================================== user connected :)");
        socket.on('disconnect', function(){
            delete sockets[socket.id];
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX user disconnected :(');
        });
        socket.on('sockets message', function(obj){
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> received message O_o');
            console.log('message:', obj.msg, 'to:', obj.to);
            sockets[obj.to].emit('sockets message', obj);
            socket.emit('delivered', obj.id);
        });
        socket.broadcast.emit('new user', socket.id);
        var sockIds = Object.keys(sockets);
        for(var i=0; i<sockIds.length;i++){
            if(sockIds[i] != socket.id){
                socket.emit("new user", sockIds[i]);
            }
        }
        //this line is equivalent to
        /*Object.keys(sockets).forEach(function(socketId){
            sockets[socketId].emit('user online', socket.id);
        });*/
    });
    io.emit("notification", { for : 'everyone' })
}

module.exports = addConnections;