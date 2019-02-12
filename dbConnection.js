var mongoose = require('mongoose');
var async = require("async");
var await = require('await');
// define Schema
var userConversationSchema = mongoose.Schema({
    UserID: String,
    userquery: String,
    queryresponse: String,
    userQueryTime: Object,
    queryResponseTime: Object
});
var scoreSchema = mongoose.Schema({
    userID:String,
    stress: Number,
    anxiety: Number,
    depression: Number,
    stresslevel: Object,
    anxietylevel: Object,
    depressionlevel: Object
});


// compile schema to model
const conversation_model1 = mongoose.model('Query', userConversationSchema, 'conversation_data');
// compile schema to model
const conversation_model2 = mongoose.model('Score', scoreSchema, 'score_record');
// get reference to database
var db = mongoose.connection;
//var user1;
var dbConnection =
{
connectToDb: async function () {

        console.log('In db connection');
        // make a connection
        await mongoose.connect('mongodb://chatbot:lilly1234@ds161074.mlab.com:61074/chatbot');

        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', function () {
            console.log("Connection Successful!");
        });
    },
insertInDb: async function (data) {
        console.log('[Response]', data.queryResponse);
// a document instance
userConversation = new conversation_model1({
    UserID: data.userID,
    userquery: data.userQuery,
    queryresponse: data.queryResponse,
    userQueryTime: {
        hours: data.userQueryTime.hours,
        minutes: data.userQueryTime.minutes,
        seconds: data.userQueryTime.seconds
    },
    queryResponseTime: {
        hours: data.userQueryTime.hours,
        minutes: data.queryResponseTime.minutes,
        seconds: data.queryResponseTime.seconds
    },
});
// save model to database
await userConversation.save(function (err, conversation_model1) {
    if (err) return console.error(err);
    console.log(userConversation.UserID + " saved to user collection.");
});
    },
storeScoreToDb: async function (userID,score,scoreResults) {
        var Score = new conversation_model2({
                userID:userID,
                stress: score.stress, 
                anxiety: score.anxiety, 
                depression: score.depression, 
                stresslevel: { 
                normal: scoreResults.stress.normal, 
                mild: scoreResults.stress.mild,
                moderate: scoreResults.stress.moderate,
                severe: scoreResults.stress.severe,
                extreme: scoreResults.stress.extreme
            },
            anxietylevel: {
                normal: scoreResults.anxiety.normal,
                mild: scoreResults.anxiety.mild,
                moderate: scoreResults.anxiety.moderate,
                severe: scoreResults.anxiety.severe,
                extreme: scoreResults.anxiety.extreme
            },
            depressionlevel: {
                normal: scoreResults.depression.normal,
                mild: scoreResults.depression.mild,
                moderate: scoreResults.depression.moderate,
                severe: scoreResults.depression.severe,
                extreme: scoreResults.depression.extreme
            }
    });
    await Score.save(function (err, conversation_model2) 
    {
        if (err) return console.error(err);
        console.log(Score.UserID + " saved to user collection.");
    });
    },
getChatHistory: async function (userid) {
    var response = [];
    console.log('UserID-:', userid);
    await conversation_model1.find({ UserID: userid },null,({sort:{"userQueryTime":1,}}),async function (err, res) {
        if (err) {
            console.error(err);
        }
        else {
            return res;
        }
    })
    .then(res =>{
        for (i = 0; i < res.length; i++) {
            var chatHistory = {
                UserID: userid,
                BOT: '',
                USER: '',
                userQueryTime:{
                    hours:0,
                    minutes:0,
                    seconds:0
                },
                queryResponseTime:{
                    hours:0,
                    minutes:0,
                    seconds:0
                }
            };
            chatHistory.UserID = res[i].UserID;
            chatHistory.BOT = res[i].queryresponse;
            chatHistory.USER = res[i].userquery;
            chatHistory.userQueryTime.hours = res[i].userQueryTime.hours;
            chatHistory.userQueryTime.minutes = res[i].userQueryTime.minutes;
            chatHistory.userQueryTime.seconds = res[i].userQueryTime.seconds;
            chatHistory.queryResponseTime.hours = res[i].queryResponseTime.hours;
            chatHistory.queryResponseTime.minutes = res[i].queryResponseTime.minutes;
            chatHistory.queryResponseTime.seconds = res[i].queryResponseTime.seconds;
            response[i] = (chatHistory);

        }
    })
    .catch(err => {
        console.error('ERROR:',err)
    });
    return response;
},
getUserScores: async function () {
    var response = [];
    await conversation_model2.find({}, function (err, res) {
        if (err) {
            console.error(err);
        }
        return res;
    })
    .then(res => {
        for (i = 0; i < res.length; i++) {
                
            console.log('[USER ID]', JSON.stringify(res[0]));
            var userScores = {
                UserID: 0,
                Stress: 0,
                Anxiety: 0,
                Depression: 0
            };
            userScores.UserID = (res[i].userID);
            userScores.Stress = (res[i].stress);
            userScores.Anxiety = (res[i].anxiety);
            userScores.Depression = (res[i].depression)
            response[i] = (userScores)
        }
    })
    .catch(err => {
        console.error('ERROR:',err)
    });
    return response;
}
}

module.exports = dbConnection;