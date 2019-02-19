const dialogflow = require('dialogflow');
const scoreCalculation = require('./scoreCalculation');
const dbconnection = require('./dbConnection');
const uuid = require('uuid');
const profileUser = require('./profileUser')
var Config = require('../Config');
var sessionId = 0;
const languageCode = 'en-US';
var sessionClient;
var sessionPath;
var date;
var messageToUser;
var data = {
    userId: 0,
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
        value:''
    },
    anxiety: {
        value:''
    },
    depression: {
        value:''
    }
}
var dialogFlowCommunication = async function (message, io,socket) {
    console.log('[SOCKET ID]',socket.id)
    if (data.userId === 0)
        {
            data.userId = uuid.v1();
            sessionId = uuid.v4();
            sessionClient = new dialogflow.SessionsClient(Config.APP_CONSTANTS.DIALOGFLOW_CONFIG);
            sessionPath = sessionClient.sessionPath(Config.APP_CONSTANTS.PROJECT_ID, sessionId);
        }
        
        console.log('[USER ID]',data.userId);
        date = new Date();
        data.userQueryTime.hours = date.getHours();
        data.userQueryTime.minutes = date.getMinutes();
        data.userQueryTime.seconds = date.getSeconds();
        // console.log('In dialogFlowCommunication')
        if (message === "")
        io.sockets.connected[socket.id].emit('lilybot', "Can you say that one more time?")
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
                    if (data.queryResponse.includes('completing the questionnaire')) 
            {
                dbconnection.storeScoreToDb(data.userId, score, scoreResults);
                messageToUser = ("Stress-:"+scoreResults.stress.value+" Anxiety-:"+scoreResults.anxiety.value+" Depression-:"+scoreResults.depression.value)
                io.sockets.connected[socket.id].emit('lilybot', messageToUser + profileUser(scoreResults));
            }
            else{
                io.sockets.connected[socket.id].emit('lilybot', result.fulfillmentText);
            }
                })
                .catch(err => {
                    console.error('ERROR:', err);
                });
            }
            await scoreCalculation(data, scoreResults, score);
            await dbconnection.insertInDb(data);
            if(data.userQuery.toLowerCase === 'stop')
            {
                data = {
                    userId: 0,
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
                        value:''
                    },
                    anxiety: {
                        value:''
                    },
                    depression: {
                        value:''
                    }
                }
            }



    }

module.exports = dialogFlowCommunication;