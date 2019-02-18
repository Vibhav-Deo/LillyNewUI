var SocketIO = require('socket.io');
const dialogFlowCommunication = require('../Utils/dialogFlowCommunication');
var messageToUser;
exports.connectSocket = function (server) {
    var io = SocketIO.listen(server.listener);
    console.log("socket server started");
    io.on('connection', function (socket) {
        //socket.emit('message', {message: {type:'connection',statusCode:200,statusMessage:'WELCOME TO DEAKIN NODE BOILERPLATE',data:""}});
        //io.to(`${socket.id}`).emit('message', {message: {type:'connection',statusCode:200,statusMessage:'New Connection',data:""}});
        socket.on('lilybot', async function (message) {
            console.log("[SOCKET ID]",socket.id);
            await dialogFlowCommunication(message,io,socket);
        });
    })
}
