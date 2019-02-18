var schema = require('./schema')
var scoreCalculation = function (data,scoreResults,score) {
  for (i = 0; i < schema.questions.stress.length; i++) 
  {
    if (data.queryResponse.includes(schema.questions.stress[i])) 
    {
      if (data.userQuery === 'Never')
       score.stress = schema.responses.never + score.stress;
      else if (data.userQuery === 'Sometimes')
       score.stress = schema.responses.sometimes + score.stress;
      else if (data.userQuery === 'Often')
     score.stress = schema.responses.often + score.stress;
      else if (data.userQuery === 'Always') 
      {
       score.stress = schema.responses.always + score.stress;
      }
      else
      {
        console.log('NO match found',data.queryResponse)
        console.log('Stress score-:',score.stress)
      }
    }
    
    if (data.queryResponse.includes(schema.questions.anxiety[i])) 
    {
      if (data.userQuery === 'Never')
       score.anxiety = schema.responses.never + score.anxiety;
      else if (data.userQuery === 'Sometimes')
     score.anxiety = schema.responses.sometimes + score.anxiety;
      else if (data.userQuery === 'Often')
     score.anxiety = schema.responses.often + score.anxiety;
      else if (data.userQuery === 'Always') 
      {
       score.anxiety = schema.responses.always + score.anxiety;
      }
      else
      {
        console.log('Anxiety score-:',score.anxiety)
      }
    }
    
    if (data.queryResponse.includes(schema.questions.depression[i])) 
    {
      console.log('Anxiety question-:',schema.questions.depression[i]);
      if (data.userQuery === 'Never')
       score.depression  = schema.responses.never + score.depression;
      else if (data.userQuery === 'Sometimes')
       score.depression  = schema.responses.sometimes + score.depression;
      else if (data.userQuery === 'Often')
       score.depression  = schema.responses.often + score.depression;
      else if (data.userQuery === 'Always') {
       score.depression  = schema.responses.always + score.depression;
      }
      else
      {
        console.log('Depression score-:',score.depression)
      }
    }
    if ((score.stress <= 7)) {
      scoreResults.stress.value = 'Normal';
  }
  else if ((score.stress >= 8 && score.stress <= 9)) {
      scoreResults.stress.value = 'Mild'
  }
  else if ((score.stress >= 10 && score.stress <= 12)) {
      scoreResults.stress.value = 'Moderate'
  }
  else if ((score.stress >= 13 && score.stress <= 16)) {
     scoreResults.stress.value = 'Severe'
  }
  else if ((score.stress >= 17)) {
      scoreResults.stress.value = 'Extremely Severe'
  }
  
  if ((score.anxiety <= 3))
  {
    scoreResults.anxiety.value = 'Normal'
  }
  else if ((score.anxiety >= 4 && score.anxiety <= 5))
  {
    scoreResults.anxiety.value = 'Mild'
  }
  else if ((score.anxiety >= 6  && score.anxiety <= 7))
  {
    scoreResults.anxiety.value = 'Moderate'
  }
  else if ((score.anxiety >= 8 && score.anxiety <= 9))
  {
    scoreResults.anxiety.value = 'Severe'
  }
  else if ((score.anxiety >= 10))
  {
    scoreResults.anxiety.value = 'Extremely Severe'
  }
  
  
  if ((score.depression <= 4))
  {
    scoreResults.stress.value = 'Normal'
  }
  else if ((score.depression >= 5 && score.depression <= 6))
  {
    scoreResults.stress.value = 'Mild'
  }
  else if ((score.depression >= 7 && score.depression <= 10))
  {
    scoreResults.stress.value = 'Moderate'
  }
  else if ((score.depression >= 11 && score.depression <= 13))
  {
    scoreResults.stress.value = 'Severe'
  }
  else if ((score.depression >= 14))
  {
    scoreResults.stress.value = 'Extremely severe'
  }
}
}
module.exports = scoreCalculation;