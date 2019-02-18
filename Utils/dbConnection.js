var mongoose = require('mongoose');
var async = require("async");
var await = require('await');
var universalfunction = require('./UniversalFunctions')
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

var userDataSchema = mongoose.Schema({
    userID:String,
    firstname: String,
            lastname:String,
            phone: Number,
            email: String,
            password:String,
            usertype:String
});
mongoose.Promise = global.Promise
// compile schema to model
const conversation_model1 = mongoose.model('Query', userConversationSchema, 'conversation_data');
// compile schema to model
const conversation_model2 = mongoose.model('Score', scoreSchema, 'score_record');

const user_model = mongoose.model('Registration',userDataSchema,'users') 
//var user1;
var dbConnection =
{
connectToDb: async function () {

        // get reference to database
        var db = mongoose.connection;
        console.log('In db connection');
        // make a connection
        await mongoose.connection.openUri('mongodb://chatbot:lilly1234@ds161074.mlab.com:61074/chatbot');

        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', function () {
            console.log("Connection Successful!");
        });
    },
login: async function(email,password)
{
    var login = {
        loginstatus: false,
        usertype:''
    };
    await user_model.find({email:email},function(err,res)
    {
        console.log('[DBRESPONSE] : '+ res);
        if(err)
        {
            login.loginstatus = false;
        }
        else{
            if(universalfunction.CryptData(password)===res[0].password)
            {
                console.log('[MATCHED]')
                login.loginstatus = true;
                login.usertype = res[0].usertype
            }
        }
    });
    return login;
},
createUser: async function(userData)
{
    if(userData.usertype === 'ADMIN')
    {
        createUser = new user_model({
            userID:'',
            firstname: userData.firstname,
            lastname: userData.lastname,
            phone: userData.phone,
            email: userData.email,
            password: userData.password,
            usertype:'ADMIN'
    
        });
    }
    else
    {
        createUser = new user_model({
            userID:'',
            firstname: userData.firstname,
            lastname: userData.lastname,
            phone: userData.phone,
            email: userData.email,
            password: userData.password,
            usertype:'USER'
    
        });
    }
    await createUser.save(function(err, user_model){
        if(err) return console.error(err)
        else console.log('New User created');
        
    })
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
    else
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
                value: scoreResults.stress.value
            },
            anxietylevel: {
                value: scoreResults.anxiety.value
            },
            depressionlevel: {
                value: scoreResults.depression.value
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