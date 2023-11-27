async function getQuestion({level, category}) {
  const response = await fetch(`https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`);
  const formattedResponse = await response.json();
  console.log('async/await', formattedResponse);
  return formattedResponse;
}

function printQuestion({ question }) {
  const questionDescription = question.description;
  document.querySelector('.question').innerText = questionDescription;

}

function printAnswers({ question }) {
  const answers = Object.values(question.answers);
  const answerElements = document.querySelectorAll('.answer');

  for (let i = 0; i < answerElements.length; i++) {
    const answerElement = answerElements[i];
    answerElement.innerText = answers[i];
  }
  return answers;
}

function selectedAnswer({event, question}) {
  console.log('class', event.target);
  const selectedAnswer = event.target;
  if (selectedAnswer.classList.contains('selected')) {
    selectedAnswer.classList.remove('selected');
    selectedAnswer.classList.add('finalAnswer');
  } else {
    const answers = document.querySelectorAll('.answer');
    answers.forEach(answers => answers.classList.remove('selected'));
    selectedAnswer.classList.add('selected');
  }

  const correctAnswer = question.correctAnswer;
  console.log(selectedAnswer.innerText);
  console.log(correctAnswer.id);
  console.log(selectedAnswer.innerText === correctAnswer);
  // if (selectedAnswer.innerText === correctAnswer){
  //   const answers = document.querySelectorAll('.answer');
  //   answers.forEach(answers => answers.classList.remove('selected'));
  //   selectedAnswer.classList.add('selected');
  // }
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

function createAnswersPanel({question}){
  const answersPanel = document.createElement('div');
  answersPanel.classList.add('answersPanel');
  const optionsKeys = ['a','b','c','d'];
  for (let i = 0; i < 4; i++) {
    const answer = document.createElement('div');
    answer.classList.add('answer');
    // answer.addEventListener ('click', selectedAnswer);
    answer.id = optionsKeys[i];
    answer.addEventListener ('click', (event) => selectedAnswer({event,question}));
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

function createPage({question}) {
  const root = document.getElementById('root');
  const container = document.createElement('div');
  container.classList.add('container');

  const panel = createPanel();
  container.appendChild(panel);

  const questionsPanel = createQuestionsPanel();
  panel.appendChild(questionsPanel);

  const answersPanel = createAnswersPanel({question});
  panel.appendChild(answersPanel);

  const panelProgress = createPanelProgress();
  container.appendChild(panelProgress);

  root.appendChild(container);
}

async function initPage() {
  console.log('initPage');
  const level = 'easy';
  const category = 'html';
  const question = await getQuestion({level, category});
  createPage({question});
  printQuestion({question});
  printAnswers({question});
}

initPage();