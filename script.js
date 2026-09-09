const gameData = {
  playerName: "",
  score: 0,
  lives: 3,
  timeLeft: 30,
  timerId: null,
  missionIndex: 0,
  totalMissions: 5,
  unlockedMission: 1,
  completedMissions: 0,
  correctAnswers: 0,
  gameStarted: false,
  audioEnabled: true,
  mission2Index: 0,
  mission3Step: 0,
  mission5SelectedItem: null,
  mission5Selection: {},
  finalChallengeIndex: 0,
  finalChallengeScore: 0,
  holdContinue: false,
  missionStatus: {},
  reviewItems: [
    "Algorithm = Steps used to solve a problem",
    "Sequential = Steps in order",
    "Conditional = Makes a choice",
    "Loop = Repeats a process",
    "Search = Finds an item",
    "Sorting = Puts data in order",
    "Machine Learning = Learns from data",
    "Deep Learning = Uses Neural Networks",
    "Traditional Algorithm = Fixed steps",
    "AI Algorithm = Learns from data and examples"
  ]
};

const finalChallenge = {
  title: "Traditional vs AI",
  instruction: "Choose whether each example is a Traditional Algorithm or an AI Algorithm.",
  points: 20,
  examples: [
    { text: "Uses fixed steps written by humans.", answer: "Traditional Algorithm" },
    { text: "Learns from data and examples.", answer: "AI Algorithm" },
    { text: "Can improve with training.", answer: "AI Algorithm" },
    { text: "Follows predefined steps.", answer: "Traditional Algorithm" }
  ]
};

const missionTemplates = [
  {
    title: "Algorithm Builder",
    instruction: "Help the Robot make a cup of tea. Put the steps in the correct order.",
    type: "order",
    points: 10,
    correctText: "Excellent! You built a Sequential Algorithm.",
    wrongText: "Almost! Check the order of the steps.",
    answer: ["Boil the water", "Put tea in the cup", "Pour hot water", "Add sugar", "Drink the tea"]
  },
  {
    title: "Algorithm Hunter",
    instruction: "Choose the correct algorithm type for each situation.",
    type: "question",
    points: 5,
    questions: [
      { question: "Print Hello 5 times.", options: ["Loop", "Search", "Sorting", "Conditional"], answer: "Loop" },
      { question: "Find number 10 in a list.", options: ["Conditional", "Search", "Loop", "Sequential"], answer: "Search" },
      { question: "Put numbers from smallest to largest.", options: ["Loop", "Sorting", "Conditional", "Sequential"], answer: "Sorting" },
      { question: "Check if a number is positive or negative.", options: ["Conditional", "Search", "Loop", "Sorting"], answer: "Conditional" },
      { question: "Enter your name, then print Hello + your name.", options: ["Sequential", "Sorting", "Loop", "Search"], answer: "Sequential" }
    ]
  },
  {
    title: "Loop Factory",
    instruction: "Choose how many times the robot should repeat the message.",
    type: "loop",
    points: 10,
    firstChallenge: { question: "Repeat Hello 5 times.", options: [1, 3, 5, 10], answer: 5 },
    secondChallenge: { question: "Which one is useful when we need to repeat the same process?", options: ["Loop", "Search", "Sorting", "Conditional"], answer: "Loop" }
  },
  {
    title: "AI Detective",
    instruction: "Train the AI by recognizing spam and normal emails.",
    type: "detective",
    points: 10,
    examples: [
      { email: "Congratulations! You won a free prize!", category: "Spam" },
      { email: "Tomorrow's school meeting is at 9 AM.", category: "Normal" },
      { email: "Click here to get your free gift!", category: "Spam" },
      { email: "Please send me the homework.", category: "Normal" }
    ],
    prediction: { email: "You have won a free gift! Click now!", options: ["Spam", "Normal"], answer: "Spam" }
  },
  {
    title: "ML vs DL",
    instruction: "Match the ideas to the correct AI type.",
    type: "mlvdl",
    points: 10,
    cards: [
      { text: "Learning from data", group: "Machine Learning" },
      { text: "Uses Neural Networks", group: "Deep Learning" },
      { text: "Advanced Machine Learning", group: "Deep Learning" },
      { text: "Recognizing images", group: "Deep Learning" },
      { text: "Learning from examples", group: "Machine Learning" }
    ],
    finalQuestion: { question: "Which type of AI uses Neural Networks?", options: ["Machine Learning", "Deep Learning"], answer: "Deep Learning" }
  }
];

const elements = {
  startScreen: document.getElementById("startScreen"),
  missionScreen: document.getElementById("missionScreen"),
  finalScreen: document.getElementById("finalScreen"),
  reviewScreen: document.getElementById("reviewScreen"),
  progressSection: document.getElementById("progressSection"),
  scoreLabel: document.getElementById("scoreLabel"),
  livesLabel: document.getElementById("livesLabel"),
  timeLabel: document.getElementById("timeLabel"),
  missionLabel: document.getElementById("missionLabel"),
  progressBar: document.getElementById("progressBar"),
  missionNumber: document.getElementById("missionNumber"),
  missionTitle: document.getElementById("missionTitle"),
  missionInstruction: document.getElementById("missionInstruction"),
  missionContent: document.getElementById("missionContent"),
  feedbackBox: document.getElementById("feedbackBox"),
  continueButton: document.getElementById("continueButton"),
  startButton: document.getElementById("startButton"),
  playerName: document.getElementById("playerName"),
  levelList: document.getElementById("levelList"),
  robotBubble: document.getElementById("robotBubble"),
  muteButton: document.getElementById("muteButton"),
  finalName: document.getElementById("finalName"),
  finalScore: document.getElementById("finalScore"),
  finalStars: document.getElementById("finalStars"),
  finalMissions: document.getElementById("finalMissions"),
  finalCorrect: document.getElementById("finalCorrect"),
  finalLives: document.getElementById("finalLives"),
  rankTitle: document.getElementById("rankTitle"),
  rankMessage: document.getElementById("rankMessage"),
  playAgainButton: document.getElementById("playAgainButton"),
  reviewButton: document.getElementById("reviewButton"),
  reviewList: document.getElementById("reviewList"),
  backToMenuButton: document.getElementById("backToMenuButton"),
  missionFailedOverlay: document.getElementById("missionFailedOverlay"),
  retryMissionButton: document.getElementById("retryMissionButton")
};

function startAudio() {
  if (!gameData.audioEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!gameData.audioCtx) {
      gameData.audioCtx = new AudioCtx();
    }
  } catch (error) {
    console.log("Audio not available.");
  }
}

function playTone(type) {
  if (!gameData.audioEnabled || !gameData.audioCtx) return;
  try {
    const context = gameData.audioCtx;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    if (type === "correct") {
      oscillator.type = "triangle";
      oscillator.frequency.value = 660;
      gainNode.gain.value = 0.05;
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.value = 880;
      }, 120);
      setTimeout(() => oscillator.stop(), 220);
    } else if (type === "wrong") {
      oscillator.type = "sawtooth";
      oscillator.frequency.value = 220;
      gainNode.gain.value = 0.05;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    } else if (type === "level") {
      oscillator.type = "square";
      oscillator.frequency.value = 420;
      gainNode.gain.value = 0.04;
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.value = 520;
      }, 140);
      setTimeout(() => oscillator.stop(), 260);
    } else if (type === "final") {
      oscillator.type = "triangle";
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.05;
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.value = 520;
      }, 150);
      setTimeout(() => {
        oscillator.frequency.value = 660;
      }, 260);
      setTimeout(() => oscillator.stop(), 420);
    }
  } catch (error) {
    console.log("Audio playback failed.");
  }
}

function setRobotMessage(text) {
  elements.robotBubble.textContent = text;
}

function updateTopBar() {
  elements.scoreLabel.textContent = `SCORE: ${gameData.score}`;
  elements.livesLabel.textContent = `LIVES: ${gameData.lives}`;
  elements.timeLabel.textContent = `TIME: ${gameData.timeLeft}`;
  elements.missionLabel.textContent = `MISSION ${gameData.missionIndex + 1} / 5`;
  const progressPercent = ((gameData.missionIndex + 1) / 5) * 100;
  elements.progressBar.style.width = `${progressPercent}%`;
}

function renderLevelList() {
  elements.levelList.innerHTML = "";
  for (let i = 1; i <= 5; i += 1) {
    const item = document.createElement("div");
    const unlocked = i <= gameData.unlockedMission;
    item.className = `level-item ${unlocked ? "unlocked" : "locked"}`;
    item.innerHTML = `
      <span class="label">Mission ${i}</span>
      <span class="status">${unlocked ? "🔓" : "🔒"}</span>
    `;
    elements.levelList.appendChild(item);
  }
}

function showScreen(screenName) {
  const screens = [elements.startScreen, elements.missionScreen, elements.finalScreen, elements.reviewScreen];
  screens.forEach((screen) => {
    screen.classList.add("hidden");
    screen.classList.remove("visible");
  });

  if (screenName === "start") elements.startScreen.classList.remove("hidden");
  if (screenName === "mission") elements.missionScreen.classList.remove("hidden");
  if (screenName === "final") elements.finalScreen.classList.remove("hidden");
  if (screenName === "review") elements.reviewScreen.classList.remove("hidden");
}

function setFeedback(message, type = "info") {
  elements.feedbackBox.textContent = message;
  elements.feedbackBox.className = `feedback-box ${type}`;
  elements.feedbackBox.classList.remove("hidden");
}

function hideFeedback() {
  elements.feedbackBox.textContent = "";
  elements.feedbackBox.className = "feedback-box hidden";
}

function startMissionTimer() {
  clearInterval(gameData.timerId);
  gameData.timeLeft = 30;
  updateTopBar();
  gameData.timerId = setInterval(() => {
    gameData.timeLeft -= 1;
    updateTopBar();

    if (gameData.timeLeft <= 0) {
      clearInterval(gameData.timerId);
      setRobotMessage("Time's up!");
      setFeedback("Time's up! You can try this mission again.", "wrong");
      elements.continueButton.classList.add("hidden");
      elements.continueButton.disabled = true;
      gameData.holdContinue = false;
      setTimeout(() => {
        renderMission(gameData.missionIndex);
      }, 1000);
    }
  }, 1000);
}

function addScore(points) {
  gameData.score += points;
  updateTopBar();
}

function loseLife() {
  gameData.lives -= 1;
  updateTopBar();
  setRobotMessage("Good try! Think carefully!");
  playTone("wrong");

  if (gameData.lives <= 0) {
    clearInterval(gameData.timerId);
    elements.continueButton.classList.add("hidden");
    elements.missionFailedOverlay.classList.remove("hidden");
    return;
  }
}

function resetMissionTry() {
  elements.missionFailedOverlay.classList.add("hidden");
  gameData.lives = 3;
  updateTopBar();
  renderMission(gameData.missionIndex);
}

function completeMission() {
  clearInterval(gameData.timerId);
  gameData.completedMissions += 1;
  gameData.unlockedMission = Math.min(5, Math.max(gameData.unlockedMission, gameData.missionIndex + 2));
  renderLevelList();
  setRobotMessage("Excellent work! Let's train the AI!");
  playTone("level");
  elements.continueButton.classList.remove("hidden");
  elements.continueButton.disabled = false;
  gameData.holdContinue = true;
}

function nextMission() {
  if (gameData.missionIndex >= 4) {
    renderFinalChallenge();
    return;
  }

  gameData.missionIndex += 1;
  updateTopBar();
  renderMission(gameData.missionIndex);
}

function updateProgressPercent() {
  const baseProgress = ((gameData.missionIndex + 1) / (gameData.totalMissions + 1)) * 100;
  elements.progressBar.style.width = `${Math.min(baseProgress, 100)}%`;
}

function renderMission(index) {
  const mission = missionTemplates[index];
  if (!mission) return;

  hideFeedback();
  elements.continueButton.classList.add("hidden");
  elements.continueButton.disabled = true;
  elements.missionFailedOverlay.classList.add("hidden");

  showScreen("mission");
  elements.progressSection.classList.remove("hidden");
  elements.missionNumber.textContent = `Mission ${index + 1}`;
  elements.missionTitle.textContent = mission.title;
  elements.missionInstruction.textContent = mission.instruction;
  elements.missionContent.innerHTML = "";
  updateTopBar();
  updateProgressPercent();

  if (mission.type === "order") {
    renderOrderMission(mission);
  }

  if (mission.type === "question") {
    renderQuestionMission(mission);
  }

  if (mission.type === "loop") {
    renderLoopMission(mission);
  }

  if (mission.type === "detective") {
    renderDetectiveMission(mission);
  }

  if (mission.type === "mlvdl") {
    renderMLDLMission(mission);
  }

  startMissionTimer();
}

function renderOrderMission(mission) {
  const steps = [...mission.answer].sort(() => Math.random() - 0.5);
  const list = document.createElement("ul");
  list.className = "step-list preview";
  const selectedOrder = [];

  steps.forEach((step, idx) => {
    const item = document.createElement("li");
    item.className = "step-item";
    item.dataset.step = step;
    item.innerHTML = `
      <span>${step}</span>
      <span class="step-index">${idx + 1}</span>
    `;
    item.addEventListener("click", () => {
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
        const index = selectedOrder.indexOf(step);
        if (index !== -1) selectedOrder.splice(index, 1);
        return;
      }

      if (selectedOrder.length >= mission.answer.length) return;
      selectedOrder.push(step);
      item.classList.add("selected");

      if (selectedOrder.length === mission.answer.length) {
        const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(mission.answer);
        setFeedback(isCorrect ? mission.correctText : mission.wrongText, isCorrect ? "correct" : "wrong");

        if (isCorrect) {
          addScore(mission.points);
          gameData.correctAnswers += 1;
          playTone("correct");
          setRobotMessage("AI Agent level up!");
          completeMission();
        } else {
          loseLife();
          if (gameData.lives > 0) {
            setTimeout(() => {
              renderMission(gameData.missionIndex);
            }, 1000);
          }
        }
      }
    });
    list.appendChild(item);
  });

  elements.missionContent.appendChild(list);
}

function renderQuestionMission(mission) {
  const current = mission.questions[gameData.mission2Index];
  if (!current) {
    setFeedback("Mission Complete!", "correct");
    addScore(25);
    gameData.correctAnswers += 1;
    setRobotMessage("Mission Complete!");
    completeMission();
    return;
  }

  const card = document.createElement("div");
  card.innerHTML = `<h3>${current.question}</h3>`;
  const grid = document.createElement("div");
  grid.className = "choice-grid";

  current.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.textContent = option;
    button.addEventListener("click", () => {
      const isCorrect = option === current.answer;
      if (isCorrect) {
        addScore(mission.points);
        gameData.correctAnswers += 1;
        setFeedback("Correct! Great job!", "correct");
        playTone("correct");
        setRobotMessage("Excellent work!");
      } else {
        setFeedback(`Good try! The correct answer is ${current.answer}.`, "wrong");
        loseLife();
      }

      current.options.forEach((item) => {
        const btn = Array.from(grid.children).find((el) => el.textContent === item);
        if (btn) {
          btn.disabled = true;
          btn.classList.add(option === current.answer ? "correct" : "wrong");
        }
      });

      if (isCorrect) {
        setTimeout(() => {
          gameData.mission2Index += 1;
          renderMission(gameData.missionIndex);
        }, 900);
      } else if (gameData.lives > 0) {
        setTimeout(() => {
          renderMission(gameData.missionIndex);
        }, 900);
      }
    });
    grid.appendChild(button);
  });

  card.appendChild(grid);
  elements.missionContent.appendChild(card);
}

function renderLoopMission(mission) {
  const current = mission.firstChallenge;
  const output = document.createElement("div");
  output.className = "machine-output";
  output.innerHTML = "<span class='hello-line'>Hello!</span>";
  elements.missionContent.appendChild(output);

  const options = document.createElement("div");
  options.className = "option-grid";
  current.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "game-option";
    btn.textContent = String(option);
    btn.addEventListener("click", () => {
      const isCorrect = option === current.answer;
      if (isCorrect) {
        addScore(mission.points);
        gameData.correctAnswers += 1;
        setFeedback("Great! A Loop repeats a process.", "correct");
        playTone("correct");
        setRobotMessage("Loop activated!");

        const repeated = Array.from({ length: 5 }, () => "Hello!").join("\n");
        output.innerHTML = repeated.split("\n").map((line) => `<span class="hello-line">${line}</span>`).join("");

        const secondQuestion = document.createElement("div");
        secondQuestion.classList.add("example-card");
        secondQuestion.innerHTML = `<h4>${mission.secondChallenge.question}</h4>`;
        const ansGrid = document.createElement("div");
        ansGrid.className = "answer-grid";
        mission.secondChallenge.options.forEach((item) => {
          const answerBtn = document.createElement("button");
          answerBtn.className = "answer-btn";
          answerBtn.textContent = item;
          answerBtn.addEventListener("click", () => {
            const correct = item === mission.secondChallenge.answer;
            if (correct) {
              addScore(10);
              gameData.correctAnswers += 1;
              setFeedback("Correct! A loop helps repeat the same process.", "correct");
              playTone("correct");
              setRobotMessage("Great job! Loop mastered.");
              completeMission();
            } else {
              setFeedback(`Good try! The correct answer is ${mission.secondChallenge.answer}.`, "wrong");
              loseLife();
              if (gameData.lives > 0) {
                setTimeout(() => renderMission(gameData.missionIndex), 900);
              }
            }
          });
          ansGrid.appendChild(answerBtn);
        });
        secondQuestion.appendChild(ansGrid);
        elements.missionContent.appendChild(secondQuestion);
      } else {
        setFeedback("Almost! Think about repeating the same action 5 times.", "wrong");
        loseLife();
        if (gameData.lives > 0) {
          setTimeout(() => renderMission(gameData.missionIndex), 900);
        }
      }
      options.querySelectorAll("button").forEach((button) => button.disabled = true);
    });
    options.appendChild(btn);
  });

  elements.missionContent.appendChild(options);
}

function renderDetectiveMission(mission) {
  const examples = document.createElement("div");
  examples.className = "example-card";
  examples.innerHTML = `<h4>Examples</h4>`;

  const exampleList = document.createElement("div");
  exampleList.className = "option-grid";

  mission.examples.forEach((example) => {
    const card = document.createElement("div");
    card.className = "example-card";
    card.innerHTML = `<h4>${example.category}</h4><p>${example.email}</p>`;
    exampleList.appendChild(card);
  });

  examples.appendChild(exampleList);
  elements.missionContent.appendChild(examples);

  const prediction = document.createElement("div");
  prediction.className = "example-card";
  prediction.innerHTML = `<h4>New Email</h4><p>${mission.prediction.email}</p>`;
  const grid = document.createElement("div");
  grid.className = "answer-grid";

  mission.prediction.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = option;
    button.addEventListener("click", () => {
      const isCorrect = option === mission.prediction.answer;
      if (isCorrect) {
        addScore(mission.points);
        gameData.correctAnswers += 1;
        setFeedback("Correct! The AI can learn patterns from data and examples.", "correct");
        setRobotMessage("Data + Examples → Learning → Prediction");
        playTone("correct");
        const explain = document.createElement("div");
        explain.className = "example-card";
        explain.innerHTML = "<h4>Learning Rule</h4><p>Data + Examples → Learning → Prediction</p>";
        elements.missionContent.appendChild(explain);
        completeMission();
      } else {
        setFeedback("Good try! The email has the pattern of spam.", "wrong");
        loseLife();
        if (gameData.lives > 0) {
          setTimeout(() => renderMission(gameData.missionIndex), 900);
        }
      }
      grid.querySelectorAll("button").forEach((btn) => btn.disabled = true);
    });
    grid.appendChild(button);
  });

  prediction.appendChild(grid);
  elements.missionContent.appendChild(prediction);
}

function renderMLDLMission(mission) {
  const matchPanel = document.createElement("div");
  matchPanel.className = "match-panel";

  const left = document.createElement("div");
  left.className = "match-column";
  left.innerHTML = "<h4>Ideas</h4>";

  const right = document.createElement("div");
  right.className = "match-column";
  right.innerHTML = "<h4>Choose a Group</h4>";

  const groups = ["Machine Learning", "Deep Learning"];
  const cardButtons = [];

  mission.cards.forEach((card) => {
    const btn = document.createElement("button");
    btn.className = "match-card";
    btn.textContent = card.text;
    btn.dataset.card = card.text;
    btn.addEventListener("click", () => {
      gameData.mission5SelectedItem = card.text;
      cardButtons.forEach((button) => button.classList.remove("selected"));
      btn.classList.add("selected");
    });
    left.appendChild(btn);
    cardButtons.push(btn);
  });

  groups.forEach((group) => {
    const btn = document.createElement("button");
    btn.className = "match-card";
    btn.textContent = group;
    btn.dataset.group = group;
    btn.addEventListener("click", () => {
      if (!gameData.mission5SelectedItem) return;
      const selectedCard = mission.cards.find((item) => item.text === gameData.mission5SelectedItem);
      const isCorrect = selectedCard && selectedCard.group === group;
      const target = left.querySelector(`[data-card="${selectedCard.text}"]`);
      if (target) {
        target.classList.add("matched");
        target.disabled = true;
      }
      if (isCorrect) {
        setFeedback("Correct! You matched the idea to the right AI type.", "correct");
        playTone("correct");
      } else {
        setFeedback(`Good try! The correct group is ${selectedCard.group}.`, "wrong");
        loseLife();
        if (gameData.lives <= 0) return;
      }

      gameData.mission5SelectedItem = null;
      cardButtons.forEach((button) => button.classList.remove("selected"));

      const allMatched = mission.cards.every((cardItem) => {
        return left.querySelector(`[data-card="${cardItem.text}"]`)?.classList.contains("matched");
      });

      if (allMatched) {
        const finalQuestion = document.createElement("div");
        finalQuestion.className = "example-card";
        finalQuestion.innerHTML = `<h4>${mission.finalQuestion.question}</h4>`;
        const qGrid = document.createElement("div");
        qGrid.className = "answer-grid";

        mission.finalQuestion.options.forEach((option) => {
          const answerBtn = document.createElement("button");
          answerBtn.className = "answer-btn";
          answerBtn.textContent = option;
          answerBtn.addEventListener("click", () => {
            const correct = option === mission.finalQuestion.answer;
            if (correct) {
              addScore(mission.points);
              gameData.correctAnswers += 1;
              setFeedback("Correct! Deep Learning uses Neural Networks.", "correct");
              playTone("correct");
              completeMission();
            } else {
              setFeedback(`Good try! The correct answer is ${mission.finalQuestion.answer}.`, "wrong");
              loseLife();
              if (gameData.lives > 0) {
                setTimeout(() => renderMission(gameData.missionIndex), 900);
              }
            }
          });
          qGrid.appendChild(answerBtn);
        });

        finalQuestion.appendChild(qGrid);
        elements.missionContent.appendChild(finalQuestion);
      }
    });
    right.appendChild(btn);
  });

  matchPanel.appendChild(left);
  matchPanel.appendChild(right);
  elements.missionContent.appendChild(matchPanel);
}

function renderFinalChallenge() {
  clearInterval(gameData.timerId);
  elements.progressSection.classList.add("hidden");
  showScreen("mission");
  elements.missionNumber.textContent = "Final Challenge";
  elements.missionTitle.textContent = finalChallenge.title;
  elements.missionInstruction.textContent = finalChallenge.instruction;
  elements.missionContent.innerHTML = "";

  const doors = [
    { label: "Traditional Algorithm", value: "Traditional Algorithm" },
    { label: "AI Algorithm", value: "AI Algorithm" }
  ];

  const challengeWrap = document.createElement("div");
  challengeWrap.className = "door-panel";

  finalChallenge.examples.forEach((example, index) => {
    const card = document.createElement("div");
    card.className = "door";
    card.innerHTML = `
      <h3>Example ${index + 1}</h3>
      <div class="door-example">${example.text}</div>
    `;

    const options = document.createElement("div");
    options.className = "answer-grid";

    doors.forEach((door) => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = door.label;
      btn.addEventListener("click", () => {
        const correct = door.value === example.answer;
        if (correct) {
          addScore(5);
          gameData.correctAnswers += 1;
          setFeedback("Correct! Great thinking.", "correct");
          playTone("correct");
          btn.classList.add("correct");
        } else {
          setFeedback(`Good try! The correct answer is ${example.answer}.`, "wrong");
          loseLife();
          btn.classList.add("wrong");
        }

        options.querySelectorAll("button").forEach((button) => {
          button.disabled = true;
        });

        if (index === finalChallenge.examples.length - 1) {
          setTimeout(() => {
            showFinalScreen();
          }, 700);
        }
      });
      options.appendChild(btn);
    });

    card.appendChild(options);
    challengeWrap.appendChild(card);
  });

  elements.missionContent.appendChild(challengeWrap);
  hideFeedback();
}

function showFinalScreen() {
  clearInterval(gameData.timerId);
  elements.progressSection.classList.add("hidden");
  const possibleScore = 85;
  const percent = Math.min(100, (gameData.score / possibleScore) * 100);
  const stars = percent >= 90 ? "★★★★☆" : percent >= 75 ? "★★★☆☆" : percent >= 50 ? "★★☆☆☆" : "★☆☆☆☆";

  let rank = "Keep Practicing!";
  let message = "Keep going and keep practicing. You are learning a lot about AI.";
  if (percent >= 90) {
    rank = "AI Algorithm Master";
    message = "Excellent work! You understand how algorithms solve problems and how AI learns from data.";
  } else if (percent >= 75) {
    rank = "AI Explorer";
    message = "Great progress! You are building strong ideas about AI algorithms.";
  } else if (percent >= 50) {
    rank = "Algorithm Learner";
    message = "Good effort! You are learning the important ideas step by step.";
  }

  elements.finalName.textContent = gameData.playerName || "Agent";
  elements.finalScore.textContent = String(gameData.score);
  elements.finalStars.textContent = stars;
  elements.finalMissions.textContent = `${gameData.completedMissions}/5`;
  elements.finalCorrect.textContent = String(gameData.correctAnswers);
  elements.finalLives.textContent = String(gameData.lives);
  elements.rankTitle.textContent = rank;
  elements.rankMessage.textContent = message;

  playTone("final");
  showScreen("final");
}

function renderReview() {
  elements.reviewList.innerHTML = "";
  gameData.reviewItems.forEach((item) => {
    const div = document.createElement("div");
    div.className = "review-item";
    div.textContent = item;
    elements.reviewList.appendChild(div);
  });
  showScreen("review");
}

function startGame() {
  gameData.playerName = elements.playerName.value.trim() || "AI Agent";
  gameData.score = 0;
  gameData.lives = 3;
  gameData.missionIndex = 0;
  gameData.mission2Index = 0;
  gameData.mission3Step = 0;
  gameData.completedMissions = 0;
  gameData.correctAnswers = 0;
  gameData.unlockedMission = 1;
  gameData.gameStarted = true;
  setRobotMessage("Ready for your next mission?");
  renderLevelList();
  renderMission(gameData.missionIndex);
  startAudio();
}

function resetGame() {
  gameData.score = 0;
  gameData.lives = 3;
  gameData.missionIndex = 0;
  gameData.completedMissions = 0;
  gameData.correctAnswers = 0;
  gameData.unlockedMission = 1;
  gameData.mission2Index = 0;
  gameData.mission3Step = 0;
  gameData.finalChallengeIndex = 0;
  gameData.finalChallengeScore = 0;
  elements.playerName.value = "";
  elements.progressSection.classList.add("hidden");
  showScreen("start");
  renderLevelList();
  setRobotMessage("Ready for your next mission?");
}

elements.startButton.addEventListener("click", startGame);
elements.continueButton.addEventListener("click", nextMission);
elements.muteButton.addEventListener("click", () => {
  gameData.audioEnabled = !gameData.audioEnabled;
  elements.muteButton.textContent = gameData.audioEnabled ? "🔊" : "🔇";
});
elements.retryMissionButton.addEventListener("click", resetMissionTry);
elements.playAgainButton.addEventListener("click", resetGame);
elements.reviewButton.addEventListener("click", renderReview);
elements.backToMenuButton.addEventListener("click", resetGame);

renderLevelList();
updateTopBar();
showScreen("start");
startAudio();
