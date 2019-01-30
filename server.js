var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const dialogflow = require('dialogflow');
require('dotenv').config({ path: 'variables.env' });
const config = {
    credentials: {
        private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
        client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
    }
};
const projectId = 'greetings-e8c46';
const sessionId = '123456';
const languageCode = 'en-US';
const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
io.on('connection', function (socket) {
    console.log('a user connected');
    console.log('User Query'+message)
    socket.on('lilybot', function (message) {
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: languageCode,
                },
            },
        };
        sessionClient
            .detectIntent(request)
            .then(responses => {
                const result = responses[0].queryResult;
                console.log('Query Response'+result.fulfillmentText)
                //return res.status(200).send(result.fulfillmentText);
            })
            .then(() => {
                var userResponses = [];
                var scoreQuestions = [];
                if(message === ('Sometimes'||'Never'||'Always'||'Often'))
                {
                    userResponses.push(message)
                }
                if(message === ('Get Results' || 'get results' || 'getresults' ||'GetResults'))
                {
                    scoreQuestions = scoreCalculation(userResponses,message)
                }
                return [socket.emit('lilybot', result.fulfillmentText),socket.emit('lilybot',scoreQuestions[0])];
            })
            .catch(err => {
                console.error('ERROR:', err);
            });

    });
});


http.listen(8003, function () {
    console.log('Sever Started on: 8003');
});