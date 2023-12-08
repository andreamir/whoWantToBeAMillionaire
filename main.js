async function getQuestion({level}) {
  const categories = ['html', 'css','javascript'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  // console.log('Category en getQuestion', category);
  const response = await fetch(`https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`);
  const formattedResponse = await response.json();
  console.log('async/await', formattedResponse);
  return formattedResponse;
}

function printQuestion({ game }) {
  const questionDescription = game.question.description;
  document.querySelector('.question').innerText = questionDescription;

}

function printAnswers({ game }) {
  const answers = Object.values(game.question.answers);
  const answerElements = document.querySelectorAll('.answer');
  for (let i = 0; i < answerElements.length; i++) {
    const answerElement = answerElements[i];
    answerElement.innerText = answers[i];
  }
  return answers;
}

async function updateGameLevel({ game }) {
  if (game.answerCount === 5) {
    game.level = 'medium';
  }
  if (game.answerCount >= 10) {
    game.level = 'hard';
  }
}

function answerIsIncorrect({ selectedAnswer, game }){
  console.log(`Game over. You have answered ${game.answerCount} questions correctly.`);
  selectedAnswer.classList.remove('selected');
  selectedAnswer.classList.add('incorrectAnswer');
  const correctAnswerId = game.question.correctAnswer;
  const correctAnswerElement = document.getElementById(correctAnswerId);
  correctAnswerElement.classList.add('correctAnswer');
}
async function getNewQuestion({game}){
  const newQuestion = await getQuestion({level:game.level, category:game.category});
  game.question = newQuestion;
}

function finishedGame({answerProgress}){
  answerProgress[0].classList.add('correctAnswer');
  console.log('YOU WON!!');
}

function removeCorrectAnswer(){
  const validAnswer = document.querySelector('.answer.correctAnswer');
  validAnswer.classList.remove('correctAnswer');
}

function addProgress({answerProgress, game}){
  for (let i = 0; i < answerProgress.length; i++) {
    if (game.answerCount == answerProgress[i].innerText){
      answerProgress[i].classList.remove('selected');
      answerProgress[i].classList.add('correctAnswer');
    }
  }
}

async function answerIsCorrect({ selectedAnswer, game }){
  selectedAnswer.classList.remove('selected');
  selectedAnswer.classList.add('correctAnswer');
  game.answerCount++;
  const answerProgress = document.querySelectorAll('.round');
  await updateGameLevel({ game });
  if (game.answerCount == 15){
    return finishedGame({answerProgress});
  }
  addProgress({answerProgress, game});
  // console.log('corrected answers',game.answerCount);
  // console.log('level', game.level);
  await getNewQuestion({game});
  printQuestion({ game });
  removeCorrectAnswer(),
  printAnswers({ game });
}

async function isCorrect({ selectedAnswer, correctAnswer, game}){

  if (selectedAnswer.id === correctAnswer){
    answerIsCorrect({ selectedAnswer, correctAnswer, game });
  } else {
    answerIsIncorrect({ selectedAnswer, game });
  }
}

function selectedAnswer({event, game}) {
  const selectedAnswer = event.target;
  // const answerProgress = document.querySelectorAll('.round');
  // answerProgress[13].classList.add('selected');
  const validAnswer = document.querySelector('.answer.correctAnswer');
  const invalidAnswer = document.querySelector('.answer.incorrectAnswer');
  if (validAnswer || invalidAnswer) {
    return;
  }
  const answers = document.querySelectorAll('.answer');
  const correctAnswer = game.question.correctAnswer;
  console.log('correctAnswer',correctAnswer);
  if (selectedAnswer.classList.contains('selected')) {
    return isCorrect({selectedAnswer, correctAnswer, game});
  }
  answers.forEach(answers => answers.classList.remove('selected'));
  selectedAnswer.classList.add('selected');
}

// function gifResponse(){
//   const videoElement = document.createElement('video');
//   videoElement.url = 'https://i.giphy.com/5bDeJPwBfNTENexhEQ.mp4';
//   videoElement.width = 640; // Ancho del video
//   videoElement.height = 360; // Alto del video
//   videoElement.controls = true; // Mostrar controles del reproductor
//   return videoElement;
// }

function lifeline50({ game }) {
  const answers = Object.entries(game.question.answers);
  const correctAnswer = game.question.correctAnswer;
  console.log('correctAnswer', correctAnswer);
  console.log('answers entries', answers);
  const incorrectAnswers = answers.filter(entry => entry[0] !== correctAnswer);
  console.log('incorrectAnswers', incorrectAnswers);
  const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
  const selectedIncorrectAnswer = incorrectAnswers[randomIndex];
  console.log('selectedIncorrectAnswer', selectedIncorrectAnswer);
  console.log(selectedIncorrectAnswer[0]);
  console.log(correctAnswer);
  console.log('You are trying to use the 50/50 lifeline');
  return selectedIncorrectAnswer[0];


  // const correctIndex = answers.indexOf(correctAnswer);
  // console.log('correctIndex', correctIndex);
  // const incorrectAnswers = answers.filter(answer => answer !== correctAnswer);
  // const correctIndex1 = answers.findIndex(entry => entry[0] === correctAnswer);
  // console.log('incorrectAnswers', incorrectAnswers);
  // console.log('correctIndex', correctIndex1);
  // for (let i = 0; i < answers.length; i++) {
  //  if (answers[i].id == correctAnswer){
  //   answers
  //  }
  //   answers.
  // console.log('correct answer from lifeline is:', correctAnswer);

}

function lifelinePhone(){
  return console.log('You are tying to use the Phone a Friend lifeline');
}

function lifelineAudience(){
  return console.log('You are tying to use the Ask the Audience lifeline');
}

function selectedLifeline({event,lifelines, game}){
  const selectedLifeline = event.target;
  const correctAnswer = game.question.correctAnswer;

  if (selectedLifeline.id === lifelines[0] && lifeline50){
    const incorrectAnswer = lifeline50({game});
    // correctAnswer.classList.add('yellow');
    const allAnswers = document.querySelectorAll('.answer');
    allAnswers.forEach(answer => {
      if (answer.id === incorrectAnswer) {
        answer.classList.add('yellow');
      }
      if (answer.id === correctAnswer)
        answer.classList.add('yellow');
    });
    game.lifeline50 = false;
  }
  
  if (selectedLifeline.id === lifelines[1]){
    return lifelinePhone();
  }
  if (selectedLifeline.id === lifelines[2]){
    lifelineAudience();
  }
}


// function selectedLifeline({event,lifelines, game}){
//   const selectedLifeline = event.target;
//   const correctAnswer = game.question.correctAnswer;
//   const validAnswer = document.querySelectorAll('.answer');
//   console.log('validAnswer',validAnswer);
//   console.log(validAnswer, correctAnswer);
//   if (selectedLifeline.id === lifelines[0]){
//     const incorrectAnswer = lifeline50({game});
//     console.log('The 50/50 lifeline is giving you', incorrectAnswer, 'and ', correctAnswer);
//     const allAnswers = document.querySelectorAll('.answer');
//     allAnswers.forEach(answer => {
//       answer.classList.add('yellow');});
//   }
//   if (selectedLifeline.id === lifelines[1]){
//     return lifelinePhone();
//   }
//   if (selectedLifeline.id === lifelines[2]){
//     lifelineAudience();
//   }
// }

// function createVideoPanel(){
//   const gif = document.createElement('div');
//   gif.classList.add('gif');
//   return gif;
// }

function createPanel(){
  const panel = document.createElement('div');
  panel.classList.add('panel');
  return panel;
}

function createQuestionsPanel() {
  const questionsPanel = document.createElement('div');
  questionsPanel.classList.add('questionsPanel');
  const question = document.createElement('div');
  question.classList.add('question');
  question.innerText = 'Question?';
  questionsPanel.appendChild(question);
  return questionsPanel;
}

function createAnswersPanel({game}){
  const answersPanel = document.createElement('div');
  answersPanel.classList.add('answersPanel');
  const optionsKeys = ['a','b','c','d'];
  for (let i = 0; i < 4; i++) {
    const answer = document.createElement('div');
    answer.classList.add('answer');
    // answer.addEventListener ('click', selectedAnswer);
    answer.id = optionsKeys[i];
    // answer.classList.add(optionsKeys[i]);
    answer.addEventListener ('click', (event) => selectedAnswer({event,game}));
    answersPanel.appendChild(answer);
  }
  return answersPanel;

}


function createLifelines({game}){
  const lifelinePanel = document.createElement('div');
  lifelinePanel.classList.add('lifelinePanel');
  const lifelines = ['50/50', 'Phone', 'Change'];
  for (let i = 0; i < 3; i++) {
    const lifeline = document.createElement('div');
    lifeline.classList.add('lifeline');
    lifeline.id = lifelines[i];
    lifeline.innerText = lifelines[i];
    lifeline.addEventListener('click', (event) => selectedLifeline({event, game, lifelines}));
    lifelinePanel.appendChild(lifeline);
  }
  return lifelinePanel;
}

function createPanelProgress(){
  const panelProgress = document.createElement('div');
  panelProgress.classList.add('panelProgress');
  for (let i = 15; i > 0; i--) {
    const round = document.createElement('div');
    round.classList.add('round');
    round.innerText = i;
    panelProgress.appendChild(round);
  }
  return panelProgress;
}

function createPage({game}) {
  const root = document.getElementById('root');
  const container = document.createElement('div');
  container.classList.add('container');
  const lifelines = createLifelines({game});
  container.appendChild(lifelines);

  // const gifResponse = createVideoPanel();
  // container.appendChild(gifResponse);

  // const videoResponse = gifResponse();
  // gifResponse.appendChild(videoResponse);

  const panel = createPanel();
  container.appendChild(panel);


  const questionsPanel = createQuestionsPanel();
  panel.appendChild(questionsPanel);

  const answersPanel = createAnswersPanel({game});
  panel.appendChild(answersPanel);

  const panelProgress = createPanelProgress();
  container.appendChild(panelProgress);

  root.appendChild(container);
}


async function initPage() {
  console.log('initPage');
  const level = 'easy';
  // const category = 'html';
  const panelProgressCount = 14;
  const answerCount = 0;
  const question = await getQuestion({level});
  let lifeline50 = true;
  const game = {
    level,
    // category,
    question,
    answerCount,
    panelProgressCount,
    lifeline50,
  };
  createPage({game});
  printQuestion({game});
  printAnswers({game});
}

initPage();