const dass21Profiles = require('./dass21Profiles')
var profileUser = function(scoreResults)
{
    var messageToUser;
    for(i = 0; i < dass21Profiles.stress.length ; i++)
    {
        if((dass21Profiles.stress[i] === scoreResults.stress.value) && (dass21Profiles.anxiety[i] === scoreResults.anxiety.value) && (dass21Profiles.depression[i] === scoreResults.depression.values))
        {
            messageToUser = `That's great, you are doing absolutely fine`
        }
    }
    return messageToUser;
}

module.exports = profileUser;