const inputQueue = [];
let inputClosed = false;

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  const lines = chunk.split(/\r?\n/);
  lines.forEach((line) => {
    if (line !== '') {
      inputQueue.push(line);
    }
  });
});

process.stdin.on('end', () => {
  inputClosed = true;
});

function prompt(message) {
  return new Promise((resolve) => {
    const tryRead = () => {
      if (inputQueue.length > 0) {
        const nextLine = inputQueue.shift();
        resolve(nextLine);
        return;
      }

      if (inputClosed) {
        resolve('');
        return;
      }

      setTimeout(tryRead, 50);
    };

    process.stdout.write(message);
    tryRead();
  });
}

const questionBank = [
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['A. Venus', 'B. Mars', 'C. Jupiter', 'D. Saturn'],
    answer: 'B',
    explanation: 'Mars looks red because its surface is rich in iron oxide, commonly called rust.'
  },
  {
    question: 'Which language is primarily used to style web pages?',
    options: ['A. HTML', 'B. CSS', 'C. JavaScript', 'D. Python'],
    answer: 'B',
    explanation: 'CSS controls layout, colors, spacing, and visual styling in web pages.'
  },
  {
    question: 'What does JSON stand for?',
    options: ['A. JavaScript Object Notation', 'B. Java Source Output Number', 'C. JavaScript Over Node', 'D. Java Standard Output Name'],
    answer: 'A',
    explanation: 'JSON is a lightweight format for storing and exchanging data using JavaScript object syntax.'
  },
  {
    question: 'Which HTML tag is used to create a hyperlink?',
    options: ['A. <img>', 'B. <link>', 'C. <a>', 'D. <button>'],
    answer: 'C',
    explanation: 'The anchor tag <a> is used to link pages or resources in HTML.'
  },
  {
    question: 'Which operator compares both value and type in JavaScript?',
    options: ['A. ==', 'B. =', 'C. ===', 'D. !='],
    answer: 'C',
    explanation: 'The strict equality operator === checks both the value and the data type.'
  }
];

const validAnswers = ['A', 'B', 'C', 'D'];
const questionTimeLimit = 15;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function showOverview() {
  const overview = questionBank.map((question, index) => `${index + 1}. ${question.question}`);
  console.log('\nQuiz Overview');
  console.log('========================');
  console.log(overview.join('\n'));
  console.log('========================');
}

async function startCountdown() {
  console.log('\nThe quiz will begin in:');
  for (let seconds = 3; seconds > 0; seconds--) {
    console.log(`${seconds}...`);
    await delay(1000);
  }
  console.log('Go!\n');
}

async function askQuestion(question, index) {
  console.log(`\nQuestion ${index} of ${questionBank.length}`);
  console.log('------------------------');
  console.log(question.question);
  question.options.forEach((option) => console.log(option));
  console.log(`Time limit: ${questionTimeLimit} seconds.`);

  let answer = '';
  while (!validAnswers.includes(answer)) {
    const timerId = setTimeout(() => {
      if (!inputQueue.length) {
        inputQueue.push('TIMEOUT');
      }
    }, questionTimeLimit * 1000);

    const answerInput = await Promise.race([
      prompt('Choose A, B, C, or D: '),
      new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), questionTimeLimit * 1000))
    ]);

    clearTimeout(timerId);

    if (answerInput === 'TIMEOUT') {
      console.log(`\nTime's up! The correct answer was ${question.answer}.`);
      return 'TIMEOUT';
    }

    answer = answerInput.trim().toUpperCase();

    if (!validAnswers.includes(answer)) {
      console.log('Please enter only A, B, C, or D.');
    }
  }

  return answer;
}

function evaluateAnswer(userAnswer, question) {
  const isCorrect = userAnswer === question.answer;
  const resultMessage = isCorrect
    ? `Correct! ${question.explanation}`
    : `Incorrect. ${question.explanation}`;

  return { isCorrect, resultMessage };
}

async function announceGameOver(score, totalQuestions, elapsedSeconds) {
  console.log('\n========================');
  console.log('Game Over!');
  console.log(`You scored ${score} out of ${totalQuestions}.`);
  console.log(`Total time: ${elapsedSeconds} seconds.`);

  if (score === totalQuestions) {
    console.log('Amazing job! You answered every question correctly.');
  } else if (score >= totalQuestions / 2) {
    console.log('Great effort! You are on your way to becoming a trivia champion.');
  } else {
    console.log('Nice try! A quick review of the concepts will help you improve next time.');
  }

  console.log('========================\n');
}

async function runQuiz() {
  console.log('Welcome to the JavaScript Trivia Challenge!');
  showOverview();
  await startCountdown();

  let score = 0;
  const startTime = Date.now();

  for (let index = 0; index < questionBank.length; index++) {
    const question = questionBank[index];
    const userAnswer = await askQuestion(question, index + 1);

    if (userAnswer === 'TIMEOUT') {
      console.log(`The correct answer is ${question.answer}.`);
      console.log(`${question.explanation}`);
    } else {
      const result = evaluateAnswer(userAnswer, question);

      if (result.isCorrect) {
        score += 1;
      }

      console.log(result.resultMessage);
    }

    if (index < questionBank.length - 1) {
      console.log('Loading the next question...');
      await delay(1200);
    }
  }

  const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
  await announceGameOver(score, questionBank.length, elapsedSeconds);
}

async function mainMenu() {
  console.log('=== Trivia Game Menu ===');
  console.log('1. Start Quiz');
  console.log('2. Exit');

  const choice = (await prompt('Choose an option: ')).trim();

  if (choice === '1') {
    await runQuiz();
  } else if (choice === '2') {
    console.log('Thanks for playing!');
    process.exit(0);
  } else {
    console.log('Invalid option. Please select 1 or 2.');
    await mainMenu();
    return;
  }

  const playAgain = (await prompt('Would you like to play again? (Y/N): ')).trim().toUpperCase();
  if (playAgain === 'Y') {
    await mainMenu();
  } else {
    console.log('Thanks for playing!');
    process.exit(0);
  }
}

mainMenu().catch((error) => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
