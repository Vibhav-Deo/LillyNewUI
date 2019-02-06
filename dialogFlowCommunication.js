require('dotenv').config({ path: 'variables.env' });
const dialogflow = require('dialogflow');
const scoreCalculation = require('./scoreCalculation')
//console.log('In communication channel')
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
var scoreResult = {
    "anxiety": 0,
    "stress": 0,
    "depression": 0
}
function waitForUser(message,result)
{
    if(message === 'Always'||'Never'||'Sometimes'||'Often')
    {
        socket.emit('lilybot', result);
        scoreResult = scoreCalculation(result, message, scoreResult);
    }
}
var dialogFlowCommunication = function (message, socket) {
    // console.log('In dialogFlowCommunication')
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
            //console.log('Query Response' + result.fulfillmentText);
            console.log("In dialogflow communication channel");
            //console.log('Messages-:' + result.fulfillmentMessages[0].text.text[0])
            for (i = 0; i < result.fulfillmentMessages.length; i++) {
                 if(result.fulfillmentText.includes('Question') && message === 'Always'||'Never'||'Sometimes'||'Often')
                 {
                    socket.emit('lilybot', result.fulfillmentMessages[i].text.text[0]);
                    scoreResult = scoreCalculation(result, message, scoreResult);
                 }
                 else
                 {
                     waitForUser(message,result.fulfillmentMessages[i].text.text[0]);
                     message = '';
                 }
             }

            return result;
        })
        .then(result => {
                       if (message === 'Get Results')
                socket.emit('lilybot', JSON.stringify(scoreResult))

        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}

module.exports = dialogFlowCommunication;