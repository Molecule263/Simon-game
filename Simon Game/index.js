// Classes
class button {
  constructor(btnElement, soundUrl, value) {
    this.btnElement = btnElement;
    this.soundUrl = soundUrl;
    this.value = value;
  }

  playSound() {
    let audio = new Audio(this.soundUrl);
    audio.play();
  }

  clickButton() {
    this.btnElement.addClass("pressed");
    setTimeout(() => {
      this.btnElement.removeClass("pressed");
    }, 80);
    this.playSound();
  }

  showBtn() {
    this.btnElement.animate({ opacity: 0.5 });
    this.btnElement.animate({ opacity: 1 });
    this.playSound();
  }

  showButton(callback) {
    this.showBtn();
    setTimeout(() => {
      callback();
    }, 1000);
  }
}

// Functions

function appendSequence() {
  let randNum = Math.floor(Math.random() * 4);
  sequence.push(randNum);
}

function showSequence(sequence) {
  let seq = Array.from(sequence);
  let btnValue = seq[0];

  if (sequence.length === 1) {
    showLastButtonFromValue(btnValue);
    setTimeout(() => {
      $(document).trigger("wait_for_answer");
    }, 1000);
  } else {
    showButtonFromValue(btnValue, () => {
      seq.shift();
      showSequence(seq);
    });
  }
}

function showButtonFromValue(btnValue, callback) {
  switch (btnValue) {
    case greenBtn.value:
      greenBtn.showButton(callback);
      break;

    case redBtn.value:
      redBtn.showButton(callback);
      break;

    case yellowBtn.value:
      yellowBtn.showButton(callback);
      break;

    case blueBtn.value:
      blueBtn.showButton(callback);
      break;
  }
}

function showLastButtonFromValue(btnValue) {
  switch (btnValue) {
    case greenBtn.value:
      greenBtn.showBtn();
      break;

    case redBtn.value:
      redBtn.showBtn();
      break;

    case yellowBtn.value:
      yellowBtn.showBtn();
      break;

    case blueBtn.value:
      blueBtn.showBtn();
      break;
  }
}

function addEventListener(btnObj, evt, callback) {
  btnObj.btnElement.on(evt, () => {
    callback();
  });
}

function checkUserAns() {
  let lastIndex = userSeq.length - 1;

  if (userSeq[lastIndex] !== sequence[lastIndex]) {
    return false;
  } else {
    return true;
  }
}

function nextLevel() {
  level++;
  $("#level-title").text(`Level ${level}`);
  appendSequence();
  showSequence(sequence);
}

function gameOver() {
  gameStarted = false;
  $("#level-title").text("Game over! Press Any Key to restart");
  $("body").addClass("game-over");
  let audio = new Audio("sounds/wrong.mp3");
  audio.play();
  setTimeout(() => {
    $("body").removeClass("game-over");
  }, 80);

  level = 0;
  isShowingSequence = false;
  userSeq = [];
  sequence = [];
  isCorrect = true;
}

//Game logic

let greenBtn = new button($("#green"), "sounds/green.mp3", 0);
let redBtn = new button($("#red"), "sounds/red.mp3", 1);
let yellowBtn = new button($("#yellow"), "sounds/yellow.mp3", 2);
let blueBtn = new button($("#blue"), "sounds/blue.mp3", 3);

let btnArray = [greenBtn, redBtn, yellowBtn, blueBtn];

let level = 0;
let gameStarted = false;
let isShowingSequence = false;
let userSeq = [];
let sequence = [];
let isCorrect = true;

//Adding click event listeners
for (let i = 0; i < btnArray.length; i++) {
  addEventListener(btnArray[i], "click", () => {
    if (gameStarted && !isShowingSequence) {
      btnArray[i].clickButton();
      userSeq.push(btnArray[i].value);
      isCorrect = checkUserAns();
    }
  });
}

$(document).on("wait_for_answer", () => {
  userSeq = [];
  let isAnswerDone = false;
  isShowingSequence = false;

  let timer = setInterval(() => {
    isCorrect = checkUserAns();

    if (userSeq.length === sequence.length) {
      isAnswerDone = true;
    }

    if (userSeq.length > sequence.length) {
      gameOver();
      clearInterval(timer);
    }

    if (!isCorrect) {
      gameOver();
      clearInterval(timer);
    } else if (isAnswerDone && isCorrect) {
      $(document).trigger("moveToNextLevel");
      clearInterval(timer);
    }
  }, 200);
});

$(document).on("keypress", () => {
  if (!gameStarted) {
    gameStarted = true;
    $(document).trigger("moveToNextLevel");
  }
});

$(document).on("moveToNextLevel", () => {
  if (gameStarted) {
    isShowingSequence = true;
    setTimeout(nextLevel,500);
  }
});