var mongoose = require('mongoose');
var logger = require('morgan');
var debug = require('debug')('mean.ti:server');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');            //parses information from POST
var express = require('express');
var http = require('http');
var socket = require('socket.io');
var sock = require('./src/sockets/ti.socket.io');
var api_routes = require('./src/api_routes');
var view_routes = require('./src/view_routes');
/*  Imports complete    */

mongoose.connect("mongodb://localhost/mean-ti");
var db = mongoose.connection;
var server, app, io = undefined;
console.log("Trying to connect to database");
db.on("error", function(){console.log("**************cannot connect to database****************")});
db.on("open", function(){
    console.log("___________________________|\\");
    console.log("db connection established    }");
    console.log("_____________________________}");
    app = express();
    app.use(favicon(path.join(__dirname, 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(__dirname));

    var methodOverride = require('method-override');    //used to manipulate POST
    app.use(methodOverride(function(req, res){
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    // API routes
    app.use("/api/", api_routes);
    // common route to return index.html
    app.use("/", view_routes);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        console.log("in catch 404");
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    debug("process.env.PORT : "+process.env.PORT);
    port = normalizePort(process.env.PORT || '3000');
    server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    io = socket(server, {});
});

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    sock.listen(io);
    var address = server.address();
    var bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
    console.log('App running at ' + bind);
    debug('Listening on ' + bind);
}

module.exports = io;