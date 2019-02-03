var schema = require('./schema')
var scoreCalculation = function (result, message,scoreResult) {
  for (i = 0; i < schema.questions.stress.length; i++) 
  {
    if (result.indexOf(schema.questions.stress[i])) 
    {
      console.log('Stress question-:',schema.questions.stress[i]);
      if (message === 'Never')
       scoreResult.stress = schema.responses.never + scoreResult.stress;
      else if (message === 'Sometimes')
       scoreResult.stress = schema.responses.sometimes + scoreResult.stress;
      else if (message === 'Often')
       scoreResult.stress = schema.responses.often + scoreResult.stress;
      else if (message === 'Always') 
      {
       scoreResult.stress = schema.responses.always + scoreResult.stress;
       console.log('Stress Result-:', scoreResult.stress);
      }
      else
      {
        console.log('Message-:'+message);
        console.log('No match found',result)
      }
    }
    else if (result.indexOf(schema.questions.anxiety[i])) 
    {
      console.log('Anxiety question-:',schema.questions.anxiety[i]);
      if (message === 'Never')
       scoreResult.anxiety = schema.responses.never + scoreResult.anxiety;
      else if (message === 'Sometimes')
       scoreResult.anxiety = schema.responses.sometimes + scoreResult.anxiety;
      else if (message === 'Often')
       scoreResult.anxiety = schema.responses.often + scoreResult.anxiety;
      else if (message === 'Always') 
      {
       scoreResult.anxiety = schema.responses.always + scoreResult.anxiety;
       console.log('Anxiety Result-:', scoreResult.anxiety)
      }
    }
    else if (result.indexOf(schema.questions.depression[i])) 
    {
      console.log('Anxiety question-:',schema.questions.depression[i]);
      if (message === 'Never')
       scoreResult.depression  = schema.responses.never + scoreResult.depression;
      else if (message === 'Sometimes')
       scoreResult.depression  = schema.responses.sometimes + scoreResult.depression;
      else if (message === 'Often')
       scoreResult.depression  = schema.responses.often + scoreResult.depression;
      else if (message === 'Always') {
       scoreResult.depression  = schema.responses.always + scoreResult.depression;
      }
    }
    return scoreResult;
  }
}

module.exports = scoreCalculation;