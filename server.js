const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dialogFlowCommunication = require('./dialogFlowCommunication');

io.on('connection', function (socket) {
   // console.log('a user connected');
    socket.on('lilybot', function (message) {
        dialogFlowCommunication(message, socket);
    });
});


http.listen(8003, function () {
    console.log('Sever Started on: 8003');
});