const dbConnection = require('../Utils/dbConnection')
var Config = require('../Config');
var universalFunctions = require('../Utils/UniversalFunctions')
var error;
var success;
var userConversation = {
    method: 'GET',
    path: '/api/userConversation/{userId}',
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
    path: '/api/user/userScores',
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
    path: '/api/user',
    handler: async (request, response) => {
        var nullValidation;
        var stringValidation;
        var emailValidation;
        var protectPaswword;
        var messageToUser = {};
        var createstatus;
        //console.log('[REQUEST]', request.payload)
        for (var key in request.payload) {
            console.log('[Value]', request.payload[key])
            if (universalFunctions.isEmpty(request.payload[key]) === true) {
                error = Config.APP_CONSTANTS.STATUS_MSG.ERROR.DEFAULT
                messageToUser = universalFunctions.sendError(error)
                nullValidation = 1;
                break;
            }
            else {
                nullValidation = 0;
            }
            if (universalFunctions.validateString(request.payload[key], '/[A-Z]/[a-z]/g') === false) {
                error = Config.APP_CONSTANTS.STATUS_MSG.ERROR.DEFAULT
                messageToUser = universalFunctions.sendError(error)
                stringValidation = 1;
                break;
            }
            else {
                stringValidation = 0;
            }

        }
        if (universalFunctions.verifyEmailFormat(request.payload.email) === true) {
            emailValidation = 0;
        }
        else {
            error = Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT
            messageToUser = universalFunctions.sendError(error)
            emailValidation = 1;
        }
        if (nullValidation === 0 && stringValidation === 0 && emailValidation === 0) {
            console.log('USERTYPE : ',request.payload.userRole);
            protectPaswword = universalFunctions.CryptData(request.payload.password)
            var createUser = {
                firstname: request.payload.firstname,
                lastname: request.payload.lastname,
                phone: request.payload.phone,
                email: request.payload.email,
                password: protectPaswword,
                userRole:''
            }
            if(request.payload.userRole === 'ADMIN')
            {
                createUser.userRole = 'ADMIN'
            }
            else
            {
                createUser.userRole = 'USER'
            }
            createstatus = await dbConnection.createUser(createUser);
            console.log('[Create Status] : ',createstatus)
            if(createstatus === 'created')
            {
                success = Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED
                messageToUser = universalFunctions.sendSuccess(success)
            }
            else if(createstatus === 'user exits')
            {
                error = Config.APP_CONSTANTS.STATUS_MSG.ERROR.USER_ALREADY_REGISTERED
                messageToUser = await universalFunctions.sendError(error)
            }
            else
            {
                messageToUser = universalFunctions.sendError(createstatus)
            }
        }
        console.log('[Response from send error] : ',JSON.stringify(messageToUser))
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
    path: '/api/user/login',
    handler: async (request, response) => {
        var login = {
            loginstatus:false,
            userRole:'',
            userId:'',
            name:''
        }
        var messageToUser = {};
        var email = request.payload.email
        var password = request.payload.password
        login = await dbConnection.login(email,password);
        console.log('[LOGIN STATUS]',login.loginstatus)
        if(login.loginstatus === true)
        {
            success = Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT;
            messageToUser = universalFunctions.sendSuccess(success,login)
        }
        else
        {
            error = Config.APP_CONSTANTS.STATUS_MSG.ERROR.USER_NOT_FOUND;
            messageToUser = universalFunctions.sendError(error)
        }
        response.response(messageToUser)
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