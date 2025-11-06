// ===== Elements =====
const greetingModal = document.getElementById("greeting-modal");
const startBtn = document.getElementById("start-btn");
const quizInput = document.getElementById("quiz-input");
const generateBtn = document.getElementById("generate-btn");
const convertBtn = document.createElement("button");
convertBtn.textContent = "Convert ✅";
convertBtn.className = "btn";
generateBtn.parentNode.insertBefore(convertBtn, generateBtn.nextSibling);

const quizPage = document.getElementById("quiz-page");
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const timerText = document.getElementById("timer");
const sidebar = document.getElementById("sidebar");
const resultBox = document.getElementById("result-box");
const resultTitle = document.getElementById("result-title");
const scoreText = document.getElementById("score-text");
const restartBtn = document.getElementById("restart-btn");
const themeToggle = document.getElementById("theme-toggle");

// ===== Background Floating Text =====
const bgContainer = document.querySelector(".bg-animation");
const floatText = ["Question", "?", "Quiz", "?", "Answer", "?", "Score", "Option", "Challenge", "Test", "Brain"];

for (let i = 0; i < 30; i++) {
  const span = document.createElement("span");
  span.textContent = floatText[Math.floor(Math.random() * floatText.length)];
  span.style.left = Math.random() * 100 + "vw";
  span.style.fontSize = (12 + Math.random() * 24) + "px";
  span.style.animationDuration = (15 + Math.random() * 15) + "s";
  bgContainer.appendChild(span);
}

// ===== Variables =====
let currentSet = [], currentIndex = 0, score = 0, timer, timeLeft = 15, answered = [];

// ===== Greeting Modal =====
startBtn.addEventListener("click", () => {
  greetingModal.style.display = "none";
  quizInput.classList.remove("hidden");
  sidebar.classList.add("hidden");
});

// ===== Convert to Quiz Format =====
convertBtn.addEventListener("click", () => {
  const raw = document.getElementById("questions-text").value.trim();
  if (!raw) return alert("Please paste your questions!");

  const lines = raw.split("\n").map(l => l.trim()).filter(l => l);
  const formatted = [];
  let tempQuestion = "", tempOptions = [], tempAnswer = null;

  lines.forEach(line => {
    if (/^Q\d+\./i.test(line)) {
      if (tempQuestion) {
        formatted.push({
          question: tempQuestion,
          options: tempOptions,
          answer: tempAnswer
        });
      }
      tempQuestion = line.replace(/^Q\d+\.\s*/, "");
      tempOptions = [];
      tempAnswer = null;
    } else if (/^[A-D]\./i.test(line)) {
      tempOptions.push(line.replace(/^[A-D]\.\s*/, ""));
    } else if (/^Answer:/i.test(line)) {
      const letter = line.match(/[A-D]/i)[0].toLowerCase();
      tempAnswer = { a: 0, b: 1, c: 2, d: 3 }[letter];
    }
  });

  if (tempQuestion) {
    formatted.push({ question: tempQuestion, options: tempOptions, answer: tempAnswer });
  }

  if (!formatted.length) return alert("No valid questions found to convert!");

  const newText = formatted.map((q, i) => {
    const optText = q.options.map((o, j) => String.fromCharCode(65 + j) + ") " + o).join("\n");
    const ansLetter = Object.keys({ a: 0, b: 1, c: 2, d: 3 }).find(k => ({ a: 0, b: 1, c: 2, d: 3 }[k] === q.answer));
    return `Question: ${q.question}\n${optText}\nAnswer: ${ansLetter}`;
  }).join("\n\n");

  document.getElementById("questions-text").value = newText;
  alert("✅ Converted to Quiz Format! Now click 'Generate Quiz'");
});

// ===== Parse input and generate quiz =====
generateBtn.addEventListener("click", () => {
  const raw = document.getElementById("questions-text").value.trim();
  if (!raw) return alert("Please paste your questions!");

  const blocks = raw.split(/\n\s*\n/);
  const quizData = [];

  for (let block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(l => l);
    if (lines.length < 2) continue;

    const ansLine = lines.find(l => /^answer\s*:/i.test(l));
    if (!ansLine) continue;

    const match = ansLine.match(/answer\s*:\s*([a-d])/i);
    if (!match) continue;
    const answerLetter = match[1].toLowerCase();

    const letterMap = { a: 0, b: 1, c: 2, d: 3 };
    const answerIndex = letterMap[answerLetter];

    const questionLine = lines.find(l => /^question\s*:/i.test(l)) || lines[0];
    const question = questionLine.replace(/^question\s*:\s*/i, "");

    const options = lines
      .filter(l => /^[a-d]\)/i.test(l))
      .map(l => l.replace(/^[a-d]\)\s*/i, ""));

    if (options.length && answerIndex < options.length) {
      quizData.push({ question, options, answer: answerIndex });
    }
  }

  if (!quizData.length) return alert("⚠️ No valid questions found!");

  currentSet = quizData;
  currentIndex = 0;
  score = 0;
  answered = new Array(currentSet.length).fill(false);

  quizInput.style.display = "none";
  quizPage.classList.remove("hidden");
  sidebar.classList.remove("hidden");

  buildSidebar();
  loadQuestion();
});

// ===== Load Question (No random order) =====
function loadQuestion() {
  const q = currentSet[currentIndex];
  questionText.textContent = q.question;
  optionsBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.classList.add("option");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i, btn);
    optionsBox.appendChild(btn);
  });

  highlightSidebar();
  resetTimer();

  if (currentIndex === currentSet.length - 1) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }
}

// ===== Check Answer =====
function checkAnswer(selected, element) {
  const q = currentSet[currentIndex];
  const options = document.querySelectorAll(".option");
  options.forEach(opt => opt.style.pointerEvents = "none");

  if (selected === q.answer) {
    element.classList.add("correct");
    score++;
  } else {
    element.classList.add("wrong");
    options[q.answer].classList.add("correct");
  }

  answered[currentIndex] = true;
  lockSidebarButton(currentIndex);
}

// ===== Sidebar / Navigation =====
const sidebarToggle = document.getElementById("sidebar-toggle");
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
  sidebarToggle.textContent = sidebar.classList.contains("show") ? "⬅️" : "➡️";
});

function nextQuestion() {
  if (!answered[currentIndex]) {
    answered[currentIndex] = true;
    lockSidebarButton(currentIndex);
  }
  if (currentIndex < currentSet.length - 1) currentIndex++;
  loadQuestion();
}

function submitQuiz() {
  clearInterval(timer);
  document.getElementById("question-box").classList.add("hidden");
  resultBox.classList.remove("hidden");
  sidebar.classList.add("hidden");

  const percent = Math.round((score / currentSet.length) * 100);
  scoreText.textContent = `You scored ${score}/${currentSet.length} (${percent}%)`;

  const resultImg = document.getElementById("result-image");
  if (percent >= 80) {
    resultTitle.textContent = "🎉 Great Job!";
    resultImg.src = "assets/q.jpg";
    resultImg.alt = "Great Job";
  } else {
    resultTitle.textContent = "😢 Better Luck Next Time!";
    resultImg.src = "assets/Untitled.jpg";
    resultImg.alt = "Better Luck";
  }

  restartBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  submitBtn.classList.add("hidden");
}

function resetQuiz() {
  currentIndex = 0;
  score = 0;
  answered = new Array(currentSet.length).fill(false);

  const buttons = sidebar.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    btn.disabled = false;
    btn.classList.remove("answered", "active");
    btn.textContent = i + 1;
  });

  resultBox.classList.add("hidden");
  document.getElementById("question-box").classList.remove("hidden");
  restartBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
  submitBtn.classList.add("hidden");
  sidebar.classList.remove("hidden");
  loadQuestion();
}

// ===== Timer =====
function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerText.textContent = `Time Left: ${timeLeft}s`;
  timerText.classList.remove("warning");

  timer = setInterval(() => {
    timeLeft--;
    timerText.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 5) timerText.classList.add("warning");
    else timerText.classList.remove("warning");

    if (timeLeft <= 0) {
      clearInterval(timer);
      if (!answered[currentIndex]) {
        answered[currentIndex] = true;
        lockSidebarButton(currentIndex);
      }
      if (currentIndex < currentSet.length - 1) currentIndex++;
      else submitQuiz();
      loadQuestion();
    }
  }, 1000);
}

// ===== Sidebar =====
function buildSidebar() {
  sidebar.innerHTML = "";
  for (let i = 0; i < currentSet.length; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.title = currentSet[i].question.slice(0, 30) + "...";
    btn.onclick = () => { if (!answered[i] && i === currentIndex) loadQuestion(); };
    sidebar.appendChild(btn);
  }
}

function highlightSidebar() {
  const buttons = sidebar.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    btn.classList.remove("active");
    if (answered[i]) {
      btn.classList.add("answered");
      btn.disabled = true;
      btn.textContent = `${i + 1} 🔒`;
    }
    if (i === currentIndex) btn.classList.add("active");
  });
}

function lockSidebarButton(index) {
  const buttons = sidebar.querySelectorAll("button");
  const btn = buttons[index];
  btn.disabled = true;
  btn.classList.add("answered");
  btn.textContent = `${index + 1} 🔒`;
}

// ===== Event Listeners =====
nextBtn.addEventListener("click", nextQuestion);
submitBtn.addEventListener("click", submitQuiz);
restartBtn.addEventListener("click", resetQuiz);
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
