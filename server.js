const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
var async = require("async");
var await = require('await');
const dbConnection = require('./dbConnection');
const dialogFlowCommunication = require('./dialogFlowCommunication');

app.use(cors());
io.on('connection', async function (socket) {
    // console.log('a user connected');
    socket.on('lilybot', async function (message) {
        await dialogFlowCommunication(message, socket);
    });
});

dbConnection.connectToDb();
app.get('/userConversation/:userId', async function (req, res) 
{
    var chatHistory;
    var userid = req.params.userId;
    chatHistory = await dbConnection.getChatHistory(userid);
    res.send(chatHistory);
});
app.get('/userInfo', async function (req, res) {
    var userScores;
    userScores = await dbConnection.getUserScores();
    console.log('[Sending to client]',JSON.stringify(userScores));
    res.send(userScores);
});
http.listen(8003, function () {
    console.log('Sever Started on: 8003');
});