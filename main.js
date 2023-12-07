async function getQuestion({level, category}) {
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

async function isCorrect({ selectedAnswer, correctAnswer, game}){

  if (selectedAnswer.id === correctAnswer){
    selectedAnswer.classList.remove('selected');
    selectedAnswer.classList.add('correctAnswer');
    game.answerCount++;
    if (game.answerCount == 5){
      game.level = 'medium';
    }
    if (game.answerCount >= 10){
      game.level = 'hard';
    }
    if (game.answerCount == 15){
      console.log('se acabó el juego');
      return;
    }
    console.log('corrected answers',game.answerCount);
    console.log('level', game.level);
    const newQuestion = await getQuestion({level:game.level, category:game.category});
    game.question = newQuestion;
    // game.category = newQuestion.category;
    printQuestion({ game });
    const validAnswer = document.querySelector('.answer.correctAnswer');
    // console.log(validAnswer.innerHTML);
    validAnswer.classList.remove('correctAnswer');
    printAnswers({ game });



  } else {
    selectedAnswer.classList.remove('selected');
    selectedAnswer.classList.add('incorrectAnswer');
  }

}

function selectedAnswer({event, game}) {
  const selectedAnswer = event.target;
  const validAnswer = document.querySelector('.answer.correctAnswer');
  const invalidAnswer = document.querySelector('.answer.incorrectAnswer');

  if (validAnswer || invalidAnswer) {
    return;
  }
  const answers = document.querySelectorAll('.answer');
  // console.log('answers',answers);
  // console.log('selectedAnswer',selectedAnswer.id);
  const correctAnswer = game.question.correctAnswer;
  console.log('correctAnswer',correctAnswer);
  console.log('category', game.category);
  if (selectedAnswer.classList.contains('selected')) {
    return isCorrect({selectedAnswer, correctAnswer, game});
  }
  answers.forEach(answers => answers.classList.remove('selected'));
  selectedAnswer.classList.add('selected');
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
    answer.addEventListener ('click', (event) => selectedAnswer({event,game}));
    answersPanel.appendChild(answer);
  }
  return answersPanel;

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
  const category = 'html';
  const answerCount = 0;
  const question = await getQuestion({level, category});
  const game = {
    level,
    category,
    question,
    answerCount,
  };
  createPage({game});
  printQuestion({game});
  printAnswers({game});
}

initPage();