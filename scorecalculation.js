function scoreCalculation(userResponses,message)
{
    var scoreQuestions = [];
    var stressScore = 0;
    var anxietyScore = 0;
    var depressionScore = 0;
    for(i = 0; i< userResponses.length;i++)
  if(i === (1||6||8||11||12||14||18))
  {
    if(userResponses === 'Never')
      stressScore = stressScore + 0;
    else if(userResponses === 'Sometimes')
      stressScore = stressScore + 1;
    else if(userResponses === 'Often')
      stressScore = stressScore + 2;
    else if(userResponses === 'Always')
      stressScore = stressScore + 3;
  }
  else if(i === (2||3||7||9||15||19||20))
  {
    if(userResponses === 'Never')
      anxietyScore = anxietyScore + 0;
    else if(userResponses === 'Sometimes')
    anxietyScore = anxietyScore + 1;
    else if(userResponses === 'Often')
    anxietyScore = anxietyScore + 2;
    else if(userResponses === 'Always')
    anxietyScore = anxietyScore + 3;
  }
  else
  {
    if(userResponses === 'Never')
      depressionScore = depressionScore + 0;
    else if(userResponses === 'Sometimes')
    depressionScore = depressionScore + 1;
    else if(userResponses === 'Often')
    depressionScore = depressionScore + 2;
    else if(userResponses === 'Always')
    depressionScore = depressionScore + 3;
  }

  console.log('Stress Score-:'+stressScore+' Anxiety score-:'+anxietyScore+' Depression Score-:'+depressionScore)
 scoreQuestions.push(anxietyScore);
 scoreQuestions.push(stressScore);
 scoreQuestions.push(depressionScore);

 return scoreQuestions;
}
