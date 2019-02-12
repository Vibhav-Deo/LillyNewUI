require('dotenv').config({ path: 'variables.env' });
const dialogflow = require('dialogflow');
const scoreCalculation = require('./scoreCalculation');
const dbconnection = require('./dbConnection');
const uuid = require('uuid/v1')
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
var date;
var data = {
    userID: 0,
    userQuery: '',
    queryResponse: '',
    userQueryTime: {
        hours: '',
        minutes: '',
        seconds: ''
    },
    queryResponseTime: {
        hours: '',
        minutes: '',
        seconds: ''
    }
}
var score = {
    anxiety: 0,
    stress: 0,
    depression: 0
}
var scoreResults = {
    stress: {
        normal: '',
        mild: '',
        moderate: '',
        severe: '',
        extreme: '',
    },
    anxiety: {
        normal: '',
        mild: '',
        moderate: '',
        severe: '',
        extreme: '',
    },
    depression: {
        normal: '',
        mild: '',
        moderate: '',
        severe: '',
        extreme: '',
    }
}
var dialogFlowCommunication = async function (message, socket) {

    if (data.userID === 0)
        data.userID = uuid();

        date = new Date();
        data.userQueryTime.hours = date.getHours();
        data.userQueryTime.minutes = date.getMinutes();
        data.userQueryTime.seconds = date.getSeconds();
        // console.log('In dialogFlowCommunication')
        if (message === "")
            socket.emit('lilybot', "Can you say that one more time?")
        else {
            data.userQuery = message
            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: data.userQuery,
                        languageCode: languageCode,
                    },
                },
            };
            sessionClient
                .detectIntent(request)
                .then(responses => {
                    date = new Date();
                    data.queryResponseTime.hours = date.getHours();
                    data.queryResponseTime.minutes = date.getMinutes();
                    data.queryResponseTime.seconds = date.getSeconds();
                    const result = responses[0].queryResult;
                    data.queryResponse = result.fulfillmentText;
                    console.log("In dialogflow communication channel");
                    socket.emit('lilybot', result.fulfillmentText);
                })
                .catch(err => {
                    console.error('ERROR:', err);
                });
            console.log('Score Dialogflow-:', JSON.stringify(data.score));
            await scoreCalculation(data, scoreResults, score);
            await dbconnection.insertInDb(data);
            if (data.queryResponse.includes('completing the questionnaire')) {
                dbconnection.storeScoreToDb(data.userID, score, scoreResults)
                socket.emit('lilybot', JSON.stringify(score));
                data = {
                    userID: 0,
                    userQuery: '',
                    queryResponse: '',
                    userQueryTime: {
                        hours: '',
                        minutes: '',
                        seconds: ''
                    },
                    queryResponseTime: {
                        hours: '',
                        minutes: '',
                        seconds: ''
                    }
                }
                score = {
                    anxiety: 0,
                    stress: 0,
                    depression: 0
                }
                scoreResults = {
                    stress: {
                        normal: '',
                        mild: '',
                        moderate: '',
                        severe: '',
                        extreme: '',
                    },
                    anxiety: {
                        normal: '',
                        mild: '',
                        moderate: '',
                        severe: '',
                        extreme: '',
                    },
                    depression: {
                        normal: '',
                        mild: '',
                        moderate: '',
                        severe: '',
                        extreme: '',
                    }
               }
            }
        }

    }

module.exports = dialogFlowCommunication;