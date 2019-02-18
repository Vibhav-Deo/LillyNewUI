const dbConnection = require('../Utils/dbConnection')
var Config = require('../Config');
var universalFunctions = require('../Utils/UniversalFunctions')
var validator = require('validator')
var userConversation = {
    method: 'GET',
    path: '/userConversation/{userId}',
    handler: async (request, response) => {
        console.log('[GET]-:Hello')
        var chatHistory;
        var userid = request.params.userId;
        chatHistory = await dbConnection.getChatHistory(userid);
        response.response(chatHistory);

    },
    config: {
        description: 'Gets chat history for particular user',
        //auth: 'userAuth',
        tags: ['api', 'user'],
        plugins: {
            'hapi-swagger': {
                responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}

var userInfo = {
    method: 'GET',
    path: '/userInfo',
    handler: async (request, response) => {
        var userScores;
        userScores = await dbConnection.getUserScores();
        console.log('[Sending to client]', JSON.stringify(userScores));
        response.response(userScores);
    },
    config: {
        description: 'Gets all users',
        //auth: 'userAuth',
        tags: ['api', 'user'],
        plugins: {
            'hapi-swagger': {
                responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}
var createUser = {
    method: 'POST',
    path: '/register',
    handler: async (request, response) => {
        var validationflag;
        var protectPaswword;
        var messageToUser;
        console.log('[REQUEST]', request.payload)
        for (var key in request.payload) {
            console.log('[Value]', request.payload[key])
            if (universalFunctions.isEmpty(request.payload[key]) === true) {
                var error = {
                    statuscode: 400,
                    custommessage: `${key} field was empty`
                };
                messageToUser = universalFunctions.sendError(error)
                validationflag = 1;
                break;
            }
            else {
                validationflag = 0;
            }
            if (universalFunctions.validateString(request.payload[key], '/[A-Z]/[a-z]/g') === false) {
                var error = {
                    statuscode: 400,
                    custommessage: `${key} field is in wrong format`
                };
                messageToUser += universalFunctions.sendError(error)
                validationflag = 1;
                break;
            }
            else {
                validationflag = 0;
            }
            if (universalFunctions.verifyEmailFormat(request.payload.email) === true) {
                validationflag = 0;
            }
            else {
                var error = {
                    statuscode: 400,
                    custommessage: `${request.payload.email} has wrong format`
                };
                messageToUser += universalFunctions.sendError(error)
                validationflag = 1;
            }

        }
        if (validationflag === 0) {
            console.log('USERTYPE : ',request.payload.usertype);
            protectPaswword = universalFunctions.CryptData(request.payload.password)
            var createUser = {
                firstname: request.payload.firstname,
                lastname: request.payload.lastname,
                phone: request.payload.phone,
                email: request.payload.email,
                password: protectPaswword,
                usertype:''
            }
            if(request.payload.usertype === 'ADMIN')
            {
                createUser.usertype = 'ADMIN'
            }
            else
            {
                createUser.usertype = 'USER'
            }
            await dbConnection.createUser(createUser);
            var success = {
                statuscode: 201,
                custommessage: 'User Created'
            };
            messageToUser = universalFunctions.sendSuccess(success)
        }
        response.response(messageToUser);
    },
    config: {
        description: 'Create User',
        //auth: 'userAuth',
        tags: ['api', 'user'],
        plugins: {
            'hapi-swagger': {
                responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}
var login = {
    method: 'POST',
    path: '/login',
    handler: async (request, response) => {
        var login = {
            loginstatus:false,
            usertype:''
        }
        var email = request.payload.email
        var password = request.payload.password
        var success = {
            custommessage: 'Found User'
        };
        var error = {
            custommessage: 'Authentication failure'
        };
        login = await dbConnection.login(email,password);
        console.log('[LOGIN STATUS]',login.loginstatus)
        if(login.loginstatus === true)
        response.response(universalFunctions.sendSuccess(success,login.usertype));
        else
        {
            response.response(universalFunctions.sendError(error))
        }
    },
    config: {
        description: 'Login',
        //auth: 'userAuth',
        tags: ['api', 'user'],
        plugins: {
            'hapi-swagger': {
                responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}
var depBot = [
    userConversation,
    userInfo,
    createUser,
    login
]
module.exports = depBot;