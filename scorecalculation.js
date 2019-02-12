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
        console.log('Stress score-:',data.score.stress)
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
        console.log('Anxiety score-:',data.score.anxiety)
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
    if ((score.stress < 7)) {
      scoreResults.stress.normal = 'Normal';
      scoreResults.stress.mild = '';
      scoreResults.stress.moderate = '';
      scoreResults.stress.severe = '';
      scoreResults.stress.extreme = '';
  }
  else if ((score.stress > 7 && score.stress < 10)) {
      scoreResults.stress.mild = 'Mild';
      scoreResults.stress.normal = '';
      scoreResults.stress.moderate = '';
      scoreResults.stress.severe = '';
      scoreResults.stress.extreme = '';
  }
  else if ((score.stress > 9 && score.stress < 13)) {
      scoreResults.stress.moderate = 'Moderate';
      scoreResults.stress.normal = '';
      scoreResults.stress.mild = '';
      scoreResults.stress.severe = '';
      scoreResults.stress.extreme = '';
  }
  else if ((score.stress > 12 && score.stress <= 17)) {
      scoreResults.stress.severe = 'Severe';
      scoreResults.stress.normal = '';
      scoreResults.stress.mild = '';
      scoreResults.stress.moderate = '';
      scoreResults.stress.extreme = '';
  }
  else if ((score.stress >= 16)) {
      scoreResults.stress.extreme = 'Extremely Severe';
      scoreResults.stress.normal = '';
      scoreResults.stress.mild = '';
      scoreResults.stress.moderate = '';
      scoreResults.stress.severe = '';
  }
  
  if ((score.anxiety <= 3))
  {
    scoreResults.anxiety.normal = 'Normal';
    scoreResults.anxiety.mild = '';
    scoreResults.anxiety.moderate = '';
    scoreResults.anxiety.severe = '';
    scoreResults.anxiety.extreme = '';
  }
  else if ((score.anxiety >= 4 && score.anxiety <= 5))
  {
    scoreResults.anxiety.mild = 'Mild';
    scoreResults.anxiety.normal = '';
    scoreResults.anxiety.moderate = '';
    scoreResults.anxiety.severe = '';
    scoreResults.anxiety.extreme = '';
  }
  else if ((score.anxiety >= 6  && score.anxiety <= 7))
  {
    scoreResults.anxiety.normal = '';
    scoreResults.anxiety.mild = '';
    scoreResults.anxiety.moderate = 'Moderate';
    scoreResults.anxiety.severe = '';
    scoreResults.anxiety.extreme = '';
  }
  else if ((score.anxiety >= 8 && score.anxiety <= 9))
  {
    scoreResults.anxiety.normal = '';
    scoreResults.anxiety.mild = '';
    scoreResults.anxiety.moderate = '';
    scoreResults.anxiety.severe = 'Severe';
    scoreResults.anxiety.extreme = '';
  }
  else if ((score.anxiety >= 10))
  {
    scoreResults.anxiety.normal = '';
    scoreResults.anxiety.mild = '';
    scoreResults.anxiety.moderate = '';
    scoreResults.anxiety.severe = '';
    scoreResults.anxiety.extreme = 'Extremely Severe';
  }
  
  
  if ((score.depression < 5))
  {
    scoreResults.depression.normal = 'Normal';
    scoreResults.depression.mild ='';
    scoreResults.depression.moderate = '';
    scoreResults.depression.severe = '';
    scoreResults.depression.extreme = ' ';
  }
  else if ((score.depression > 4 && score.depression < 8))
  {
    scoreResults.depression.mild = 'Mild';
    scoreResults.depression.normal = '';
    scoreResults.depression.moderate = '';
    scoreResults.depression.severe = '';
    scoreResults.depression.extreme = ' ';
  }
  else if ((score.depression > 7 && score.depression < 11))
  {
    scoreResults.depression.moderate = 'Moderate';
    scoreResults.depression.normal = '';
    scoreResults.depression.mild ='';
    scoreResults.depression.severe = '';
    scoreResults.depression.extreme = ' ';
  }
  else if ((score.depression > 10 && score.depression < 14))
  {
    scoreResults.depression.normal = '';
    scoreResults.depression.mild ='';
    scoreResults.depression.moderate = '';
    scoreResults.depression.severe = 'Severe';
    scoreResults.depression.extreme = ' ';
  }
  else if ((score.depression > 13))
  {
    scoreResults.depression.normal = '';
    scoreResults.depression.mild ='';
    scoreResults.depression.moderate = '';
    scoreResults.depression.severe = '';
    scoreResults.depression.extreme = 'Extremely Severe';
  }
  console.log('Score-:',JSON.stringify(score))
  console.log('Scale-:',JSON.stringify(scoreResults))
}
}
module.exports = scoreCalculation;