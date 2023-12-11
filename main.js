// -- COMENTARIOS IMPORTANTES --
// log async/await getQuestion

async function getQuestion({level}) {
  const categories = ['html', 'css','javascript'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  // console.log('Category en getQuestion', category);
  // const answers = document.querySelectorAll('.answer');
  // answers.forEach(answer => answer.classList.remove('hidden'));
  const response = await fetch(`https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`);
  const formattedResponse = await response.json();
  // console.log('async/await', formattedResponse);
  return formattedResponse;
}

function printQuestion({ game }) {
  const questionDescription = game.question.description;
  document.querySelector('.question').innerText = questionDescription;
  actualRound({game});

}

// function shuffleAnswers({answers}) {
//   const shuffledAnswers = [...answers];

//   for (let i = shuffledAnswers.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
//   }

//   return shuffledAnswers;
// }

// function printAnswers({ game }) {
//   const answers = Object.values(game.question.answers);
//   const shuffledAnswers = shuffleAnswers({answers});
//   const answerElements = document.querySelectorAll('.answer');

//   for (let i = 0; i < answerElements.length; i++) {
//     const answerElement = answerElements[i];
//     answerElement.innerText = shuffledAnswers[i];
//   }

//   return shuffledAnswers;
// }

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

function blockedLifelines({game}){
  game.lifeline50 = false;
  game.lifelineChange = false;
  game.lifelinePhone = false;
}

function answerIsIncorrect({ selectedAnswer, game }){
  console.log('EntroLifeline answerIsIncorrect');
  console.log(`Game over. You have answered ${game.answerCount} questions correctly.`);
  // game.question.question = `Game over. You have answered ${game.answerCount} questions correctly.`;
  // game.question.description = `Game over. You have answered ${game.answerCount} questions correctly.`;
  blockedLifelines({game});
  selectedAnswer.classList.remove('selected');
  selectedAnswer.classList.add('incorrectAnswer');
  const correctAnswerId = game.question.correctAnswer;
  const correctAnswerElement = document.getElementById(correctAnswerId);
  correctAnswerElement.classList.add('correctAnswer');

  const rounds = document.querySelectorAll('.round');
  for (let i = 0; i < rounds.length; i++) {
    const roundElement = rounds[i];

    if (roundElement.classList.contains('yellow')) {
      roundElement.classList.remove('yellow');
      roundElement.classList.add('incorrectAnswer');
    }
  }}
async function getNewQuestion({game}){
  const newQuestion = await getQuestion({level:game.level, category:game.category});
  game.question = newQuestion;
  const rounds = document.querySelectorAll('.round');
  const hasCorrectAnswer = Array.from(rounds).some(round => round.classList.contains('correctAnswer'));

  if (hasCorrectAnswer) {
    game.actualRound++;
    actualRound({ game });
  }
}
function finishedGame({answerProgress, game}){
  console.log('finishedgame');
  answerProgress[0].classList.add('correctAnswer');
  blockedLifelines({game});
  console.log('YOU WON!!');
}

function removeCorrectAnswer(){
  const validAnswer = document.querySelector('.answer.correctAnswer');
  validAnswer.classList.remove('correctAnswer');
}

function addProgress({answerProgress, game}){
  for (let i = 0; i < answerProgress.length; i++) {
    // console.log(`game.answerCount ${game.answerCount} and answersProgress.innertext ${answerProgress[i].innerText}`);
    if (game.answerCount == answerProgress[i].innerText){
      answerProgress[i].classList.remove('selected');
      answerProgress[i].classList.add('correctAnswer');
    }
  }
}

function actualRound({game}){
  const rounds = document.querySelectorAll('.round');
  // console.log(`rounds from actualRound ${rounds}`);
  // console.log(rounds.length);
  for (let i = 0; i < rounds.length; i++) {
    if (game.actualRound == rounds[i].id){
      console.log(`game.actualRound = ${game.actualRound} game.roundsId = ${rounds[i].id}`);
      rounds[i].classList.add('yellow');
    }
    else {
      rounds[i].classList.remove('yellow');
    }
  }
}

async function answerIsCorrect({ selectedAnswer, game }){
  // console.log('EntroLifeline answerIsCorrect');
  // console.log(selectedAnswer.innerText);
  selectedAnswer.classList.remove('selected');
  selectedAnswer.classList.add('correctAnswer');
  game.answerCount++;
  const answerProgress = document.querySelectorAll('.round');
  await updateGameLevel({ game });
  if (game.answerCount == 15){
    return finishedGame({answerProgress, game});
  }
  // console.log('answerProgress fron answerisCorrect',answerProgress);
  addProgress({answerProgress, game});
  await getNewQuestion({game});
  printQuestion({ game });
  removeCorrectAnswer(),
  printAnswers({ game });
}

async function isCorrect({ selectedAnswer, correctAnswer, game}){
  // console.log('EntroLifeline isCorrect');
  const allAnswers = document.querySelectorAll('.answer');
  allAnswers.forEach(answer => answer.classList.remove('phoneFriend'));
  let hasInnerText = false;

  allAnswers.forEach(answer => {
    if (answer.innerText.trim() !== '') {
      hasInnerText = true;
    }
  });
  if (hasInnerText) {
    if (selectedAnswer.id === correctAnswer){
      answerIsCorrect({ selectedAnswer, correctAnswer, game });
    } else {
      answerIsIncorrect({ selectedAnswer, game });
    }
  }}

function selectedAnswer({event, game}) {
  // console.log('EntroLifeline selectedAnswer');
  const selectedAnswer = event.target;
  const validAnswer = document.querySelector('.answer.correctAnswer');
  const invalidAnswer = document.querySelector('.answer.incorrectAnswer');

  if (validAnswer || invalidAnswer || selectedAnswer.classList.contains('correctAnswer') || selectedAnswer.classList.contains('incorrectAnswer')) {
    return;
  }
  if (!selectedAnswer.innerText.trim()) {
    return;
  }

  const answers = document.querySelectorAll('.answer');
  answers.forEach(answers => answers.classList.remove('fiftyfifty'));
  const correctAnswer = game.question.correctAnswer;

  if (selectedAnswer.classList.contains('selected')) {
    isCorrect({selectedAnswer, correctAnswer, game});
  }
  else {
    answers.forEach(answers => answers.classList.remove('selected'));
    selectedAnswer.classList.add('selected');
  }
}

function handleIncorrectAnswerForFifty({ game }) {
  const answers = Object.entries(game.question.answers);
  const correctAnswer = game.question.correctAnswer;
  // console.log('correctAnswer', correctAnswer);
  // console.log('answers entries', answers);
  const incorrectAnswers = answers.filter(entry => entry[0] !== correctAnswer);
  // console.log('incorrectAnswers', incorrectAnswers);
  const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
  const selectedIncorrectAnswer = incorrectAnswers[randomIndex];
  // console.log('selectedIncorrectAnswer', selectedIncorrectAnswer);
  // console.log(selectedIncorrectAnswer[0]);
  // console.log(correctAnswer);
  // console.log('You are trying to use the 50/50 lifeline');
  return selectedIncorrectAnswer[0];

}

function lifelineFifty({game, correctAnswer}){
  // console.log('Entro en lifelineFifty');
  const usedLifeline = document.getElementById('50/50');
  usedLifeline.classList.add('used');
  const incorrectAnswer = handleIncorrectAnswerForFifty({game});
  const allAnswers = document.querySelectorAll('.answer');
  const incorrectAnswerElement = document.getElementById(incorrectAnswer);
  incorrectAnswerElement.classList.add('fiftyfifty');
  const correctAnswerElement = document.getElementById(correctAnswer);
  correctAnswerElement.classList.add('fiftyfifty');

  game.lifeline50 = false;

  allAnswers.forEach(answer => {
    if (!answer.classList.contains('fiftyfifty')) {
      answer.innerText = '';
    }});

}

function lifelinePhone({game, correctAnswer}){
  const usedLifeline = document.getElementById('Phone');
  usedLifeline.classList.add('used');
  // console.log('correctanswer', correctAnswer);
  game.lifelinePhone = false;
  const probabilities = {
    correctAnswer: 0.7,
    otherAnswers: 0.1,
  };
  const randomNumber = Math.random();
  if (randomNumber <= probabilities.correctAnswer) {
    const phoneSelected = document.getElementById(correctAnswer);
    phoneSelected.classList.add('phoneFriend');
    console.log('Phone a Friend: The correct answer is', correctAnswer);
  } else {
    const answersEntries = Object.entries(game.question.answers);
    const incorrectAnswers = answersEntries.filter(entry => entry[0] !== correctAnswer);
    // console.log(incorrectAnswers, 'incorrectAnswers');
    const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    const selectedIncorrectAnswer = incorrectAnswers[randomIndex];
    const phoneSelected = document.getElementById(selectedIncorrectAnswer[0]);
    phoneSelected.classList.add('phoneFriend');
    // console.log(phoneSelected);
    console.log('Phone a Friend: The correct answer is not', selectedIncorrectAnswer[0]);

    // const incorrectAnswers = Object.values(game.question.answers).filter(answer => answer.id !== correctAnswer);
    // console.log(incorrectAnswers, 'incorrectAnswers');
    // const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    // const selectedIncorrectAnswer = incorrectAnswers[randomIndex];
    // const phoneSelected = document.getElementById(incorrectAnswers[randomIndex]);
    // console.log(phoneSelected);
    // console.log('Phone a Friend: The correct answer is not', selectedIncorrectAnswer);
  }
}

async function lifelineChange({game}){
  const usedLifeline = document.getElementById('Change');
  usedLifeline.classList.add('used');
  await getNewQuestion({ game });

  printQuestion({ game });
  printAnswers({ game });
  game.lifelineChange = false;

}

function selectedLifeline({event,lifelines, game}){
  const selectedLifeline = event.target;
  const correctAnswer = game.question.correctAnswer;
  if (selectedLifeline.id === lifelines[0] && game.lifeline50){
    lifelineFifty({game, correctAnswer});

  }
  if (selectedLifeline.id === lifelines[1] && game.lifelinePhone){
    lifelinePhone({game, correctAnswer});
  }
  if (selectedLifeline.id === lifelines[2] && game.lifelineChange){
    lifelineChange({game});
  }
}


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

function createPanelProgress({game}){
  const panelProgress = document.createElement('div');
  panelProgress.classList.add('panelProgress');
  for (let i = 15; i > 0; i--) {
    const round = document.createElement('div');
    round.classList.add('round');
    round.innerText = i;
    round.id = i;
    panelProgress.appendChild(round);
  }
  actualRound({game});
  return panelProgress;
}

function createPage({game}) {
  const root = document.getElementById('root');
  const container = document.createElement('div');
  container.classList.add('container');
  const lifelines = createLifelines({game});
  container.appendChild(lifelines);


  const panel = createPanel();
  container.appendChild(panel);


  const questionsPanel = createQuestionsPanel();
  panel.appendChild(questionsPanel);

  const answersPanel = createAnswersPanel({game});
  panel.appendChild(answersPanel);

  const panelProgress = createPanelProgress({game});
  container.appendChild(panelProgress);

  root.appendChild(container);
}


async function initPage() {
  console.log('initPage');
  const level = 'easy';
  // const category = 'html';
  // const panelProgressCount = 14;
  // const answerCount = 0;
  // const actualRound = 1;
  const question = await getQuestion({level});
  // const lifeline50 = true;
  // const lifelineChange = true;
  // const lifelinePhone = true;
  const game = {
    level,
    question,
    answerCount: 0,
    panelProgressCount: 14,
    lifeline50: true,
    lifelineChange: true,
    lifelinePhone: true,
    actualRound: 1,
    askedQuestions: [],
  };
  createPage({game});
  printQuestion({game});
  printAnswers({game});
}

initPage();