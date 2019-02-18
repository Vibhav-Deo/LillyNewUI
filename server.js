/**
 * Created by Navit
 */

'use strict';
//External Dependencies
const Hapi = require('hapi');

//Internal Dependencies
const Config = require('./Config');
const Plugins = require('./Plugins');
const SocketManager = require('./Lib/SocketManager');
const dbConnection = require('./Utils/dbConnection')
const Routes = require('./Routes')
//Create Server
var server = new Hapi.Server({
    app: {
        name: Config.APP_CONSTANTS.SERVER.appName
    }
});

server.connection({
    port: Config.APP_CONSTANTS.SERVER.PORTS.HAPI,
    routes: {cors: true}
});

//Register All Plugins
server.register(Plugins, function (err) {
if (err){
    server.error('Error while loading plugins : ' + err)
}else {
    server.log('info','Plugins Loaded')
}
});

//Default Routes
server.route(
    {
        method: 'GET',
        path: '/',
        handler: function (req, res) {
            res.view('welcome')
        }
    }
);

server.route(Routes);

//Adding Views
server.views({
    engines: {
        html: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views'
});

SocketManager.connectSocket(server);

server.on('response', function (request) {
    console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
    console.log('Request payload:', request.payload);
});


//Start Server
server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
    dbConnection.connectToDb();
});

