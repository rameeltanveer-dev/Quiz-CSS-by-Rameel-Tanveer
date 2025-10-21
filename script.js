// ---------------------------
// CSS QUIZ by Rameel Tanveer
// ---------------------------

const totalQuizTime = 40 * 60; // 40 mins
const questionTime = 40;       // 40 sec per question
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = totalQuizTime;
let questionTimer;
let questionTimeLeft = questionTime;
let userName = "";
let userAnswers = [];

const webhookURL = document.getElementById("webhookInput")?.value || ""; 

const questions = [
  {question:"Which property is used to change the text color in CSS?", options:["font-color","color","text-color","background-color"], answer:"color"},
  {question:"Which CSS property controls the text size?", options:["font-size","text-style","text-size","font-weight"], answer:"font-size"},
  {question:"What is the correct CSS syntax to make all <p> elements bold?", options:["p {font-weight: bold;}","p {text:bold;}","p {style:bold;}","p {font:bold;}"], answer:"p {font-weight: bold;}"},
  {question:"Which property adds space inside an element’s border?", options:["margin","padding","spacing","border-spacing"], answer:"padding"},
  {question:"How do you make a list not display bullet points?", options:["list-type: none;","text-decoration: none;","list-style-type: none;","display: none;"], answer:"list-style-type: none;"}
];

// ===== Functions =====
document.getElementById("start-btn").addEventListener("click", startQuiz);

function startQuiz() {
  userName = document.getElementById("username").value.trim();
  if(!userName){ alert("Please enter your name"); return; }

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("quizApp").classList.remove("hidden");

  showQuestion();
  startMainTimer();
  startQuestionTimer();
}

function showQuestion(){
  const q = questions[currentQuestion];
  document.getElementById("questionText").innerText = q.question;

  const optionsContainer = document.getElementById("optionsList");
  optionsContainer.innerHTML = "";

  q.options.forEach(opt=>{
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = opt;
    btn.onclick = ()=>selectAnswer(opt, btn);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("progressText").innerText = `Question ${currentQuestion+1} / ${questions.length}`;
  questionTimeLeft = questionTime;
  document.getElementById("question-timer").innerText = questionTimeLeft+"s";
}

function selectAnswer(selected, btn){
  const correct = questions[currentQuestion].answer;
  if(selected === correct){ score++; btn.classList.add("correct"); }
  else btn.classList.add("wrong");
  Array.from(document.getElementById("optionsList").children).forEach(b=>b.disabled=true);
  
  userAnswers.push({question:questions[currentQuestion].question, selected, correct});

  setTimeout(()=> nextQuestion(), 800);
}

function nextQuestion(){
  currentQuestion++;
  if(currentQuestion < questions.length) showQuestion();
  else endQuiz();
}

function endQuiz(){
  clearInterval(timer);
  clearInterval(questionTimer);
  document.getElementById("quizApp").classList.add("hidden");
  document.getElementById("resultSection").classList.remove("hidden");

  document.getElementById("resName").innerText = userName;
  document.getElementById("resScore").innerText = `${score} / ${questions.length}`;
  document.getElementById("resPercent").innerText = ((score/questions.length)*100).toFixed(2);

  if(webhookURL){
    fetch(webhookURL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name:userName, score, total:questions.length, answers:userAnswers, date:new Date().toLocaleString()})
    }).catch(e=>console.log("Webhook error", e));
  }
}

// Timers
function startMainTimer(){
  timer = setInterval(()=>{
    timeLeft--;
    document.getElementById("main-timer").innerText = formatTime(timeLeft);
    if(timeLeft<=0) endQuiz();
  },1000);
}

function startQuestionTimer(){
  questionTimer = setInterval(()=>{
    questionTimeLeft--;
    document.getElementById("question-timer").innerText = questionTimeLeft+"s";
    if(questionTimeLeft<=0) nextQuestion();
  },1000);
}

function formatTime(sec){
  const m = Math.floor(sec/60);
  const s = sec%60;
  return `${m}:${s<10?"0"+s:s}`;
}
