// ---------------------------
// CSS QUIZ by Rameel Tanveer
// ---------------------------

// ========== CONFIG ==========
const totalQuizTime = 40 * 60; // 40 minutes in seconds
const questionTime = 40; // 40 seconds per question
const webhookURL = "https://hkdk.events/rwg40ssbdqadlg"; // Webhook URL
// ============================

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = totalQuizTime;
let questionTimer;
let questionTimeLeft = questionTime;
let userName = "";
let userAnswers = [];
let quizStarted = false;

// ======== QUIZ QUESTIONS ========
const questions = [
  {
    question: "Which property is used to change the text color in CSS?",
    options: ["font-color", "color", "text-color", "background-color"],
    answer: "color"
  },
  {
    question: "Which CSS property controls the text size?",
    options: ["font-size", "text-style", "text-size", "font-weight"],
    answer: "font-size"
  },
  {
    question: "What is the correct CSS syntax to make all <p> elements bold?",
    options: ["p {font-weight: bold;}", "p {text:bold;}", "p {style:bold;}", "p {font:bold;}"],
    answer: "p {font-weight: bold;}"
  },
  {
    question: "Which property adds space inside an element’s border?",
    options: ["margin", "padding", "spacing", "border-spacing"],
    answer: "padding"
  },
  {
    question: "How do you make a list not display bullet points?",
    options: ["list-type: none;", "text-decoration: none;", "list-style-type: none;", "display: none;"],
    answer: "list-style-type: none;"
  }
];

// ======== FUNCTIONS ========

// Start quiz after entering name
function startQuiz() {
  const nameInput = document.getElementById("username");
  userName = nameInput.value.trim();

  if (!userName) {
    alert("Please enter your name to start the quiz!");
    return;
  }

  if (localStorage.getItem(userName)) {
    alert("⚠️ You have already attempted this quiz!");
    return;
  }

  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".quiz-screen").style.display = "block";

  quizStarted = true;
  localStorage.setItem(userName, "attempted");

  showQuestion();
  startMainTimer();
  startQuestionTimer();
}

// Show question
function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").innerText = q.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(opt);
    optionsContainer.appendChild(btn);
  });

  questionTimeLeft = questionTime;
}

// Handle answer
function selectAnswer(selected) {
  const correct = questions[currentQuestion].answer;
  userAnswers.push({ question: questions[currentQuestion].question, selected, correct });

  if (selected === correct) score++;

  nextQuestion();
}

// Go to next question or finish quiz
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// End quiz
function endQuiz() {
  clearInterval(timer);
  clearInterval(questionTimer);
  document.querySelector(".quiz-screen").style.display = "none";
  document.querySelector(".result-screen").style.display = "block";

  const percentage = ((score / questions.length) * 100).toFixed(2);
  document.getElementById("result").innerHTML = `
    <h2>🎉 Quiz Completed!</h2>
    <p><b>Name:</b> ${userName}</p>
    <p><b>Score:</b> ${score} / ${questions.length}</p>
    <p><b>Percentage:</b> ${percentage}%</p>
  `;

  // Send result to webhook
  sendToWebhook(userName, score, questions.length, percentage, userAnswers);
}

// Timer (40 minutes)
function startMainTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("main-timer").innerText = formatTime(timeLeft);
    if (timeLeft <= 0) endQuiz();
  }, 1000);
}

// Per-question timer (40 sec)
function startQuestionTimer() {
  questionTimer = setInterval(() => {
    questionTimeLeft--;
    document.getElementById("question-timer").innerText = questionTimeLeft + "s";
    if (questionTimeLeft <= 0) nextQuestion();
  }, 1000);
}

// Format seconds → mm:ss
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" + s : s}`;
}

// Send data to webhook
function sendToWebhook(name, score, total, percent, answers) {
  const payload = {
    name,
    score,
    total,
    percentage: percent + "%",
    answers,
    date: new Date().toLocaleString()
  };

  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(() => console.log("✅ Data sent to webhook"))
    .catch(err => console.error("❌ Webhook Error:", err));
}
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index'); 
    .setTitle('CSS Quiz — Rameel Tanveer');
}
const webhookURL = "https://script.google.com/macros/s/AKfycbx5mPGLMUXGsCcADkSD09ryOJcZEI9LHsJKMfwU_DCNNWrfdBUVUTyawCL1YVl_rpPS/exec";

