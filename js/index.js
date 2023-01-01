'use strict'

let wordList = [
  'piano',
  'spark',
  'horse',
  'stamp',
  'water',
  'sport',
  'panic',
  'dance'
];

let secret = wordList[1];

let attempts = [];
let currentAttempt = '';

function handleKey(key) {
  // if alphabet then add it to current attempt
  if (/^[a-z]$/.test(key)) {
    if (currentAttempt.length < 5) {
      currentAttempt += key;
      animatePress(currentAttempt.length - 1);
    }
  }
  // if backspace then remove one alphabet from currentAttempt
  else if (key == "backspace") {
    currentAttempt = currentAttempt.slice(0, -1);
  }
  // if enter then check if player won and save it to attempts
  else if (key == "enter") {
    if (currentAttempt.length != 5) {
      alert('Not enough letters');
      return;
    }

    if (!wordList.includes(currentAttempt)) {
      alert('Not in word list!');
      return;
    }

    if (currentAttempt == secret) {
      alert("Yayy you won!!");
    }

    attempts.push(currentAttempt);
    currentAttempt = '';
    updateKeyboard();
    saveGame();

    if (attempts.length == 6) {
      alert(`You Lost. Word was: ${secret}`);
    }
  }
  updateGrid();
}

function handleKeyDown(event) {
  let key = event.key.toLowerCase();
  handleKey(key);
}

function handleButtonClick(key) {
  handleKey(key);
}

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    let row = document.createElement('div');
    for (let j = 0; j < 5; j++) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      let surface = document.createElement('div');
      surface.className = 'surface';
      surface.style.transitionDelay = (j * 200) + 'ms';
      let front = document.createElement('div');
      front.className = 'front'
      let back = document.createElement('div');
      back.className = 'back'
      surface.appendChild(front);
      surface.appendChild(back);
      cell.appendChild(surface);
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function updateGrid() {
  for (let i = 0; i < 6; i++) {
    let row = grid.children[i];
    if (i < attempts.length) {
      drawAttempt(row, attempts[i], true);
    } else if (i === attempts.length) {
      drawAttempt(row, currentAttempt, false);
    } else {
      drawAttempt(row, '', false);
    }
  }
}

function drawAttempt(row, attempt, solved) {
  for (let i = 0; i < 5; i++) {
    let cell = row.children[i];
    let surface = cell.firstChild;
    let front = surface.children[0];
    let back = surface.children[1];
    front.textContent = attempt[i] ?? '';
    back.textContent = attempt[i] ?? '';
    
    if (attempt[i] == undefined) {
      clearAnimation(cell);
    }

    if (solved) {
      back.style.background = getBgColor(attempt, i);
      back.style.borderColor = BLACK;
    } else {
      if (front.textContent) {
        front.style.borderColor = LIGHTGREY;
      } else {
        front.style.borderColor = GREY;
      }
    }

    if (solved) {
      cell.classList.add('solved');
    } else {
      cell.classList.remove('solved');
    }
  }
}

function buildKeyboard() {
  buildKeyboardRow('qwertyuiop', false);
  buildKeyboardRow('asdfghjkl', false);
  buildKeyboardRow('zxcvbnm', true);
}

function buildKeyboardRow(letters, isLastRow) {
  let row = document.createElement('div');

  function buildKeyboardButton(text) {
    let button = document.createElement('button');
    button.id = text;
    button.textContent = text;
    button.className = 'keyboard-button';
    button.onclick = () => handleButtonClick(text);
    keyboardButtons.set(text, button);
    return button;
  }

  if (isLastRow) {
    row.appendChild(buildKeyboardButton('enter'));
  }

  for (let letter of letters) {
    row.appendChild(buildKeyboardButton(letter));
  }

  if (isLastRow) {
    row.appendChild(buildKeyboardButton('backspace'));
  }

  keyboard.appendChild(row);
}

function getBetterColor(a, b) {
  if (a === GREEN || b === GREEN) {
    return GREEN;
  }
  if (a === YELLOW || b === YELLOW) {
    return YELLOW;
  }
  return GREY;
}

function updateKeyboard() {
  let bestColors = new Map();
  for (let attempt of attempts) {
    for (let i = 0; i < attempt.length; i++) {
      var newColor = getBgColor(attempt, i);
      var currentColor = bestColors.get(attempt[i]);
      bestColors.set(attempt[i], getBetterColor(currentColor, newColor));
    }
  }

  for (let [key, button] of keyboardButtons) {
    button.style.background = bestColors.get(key);
  }
}

let LIGHTGREY = '#565758';
let GREY = '#3a3a3c';
let GREEN = '#538d4e';
let YELLOW = '#b59f3b';
let BLACK = '#000000';

function getBgColor(attempt, i) {
  if (attempt[i] == secret[i]) {
    return GREEN;
  } else if (secret.includes(attempt[i])) {
    return YELLOW;
  } else {
    return GREY;
  }
}

function animatePress(index) {
  let rowIndex = attempts.length;
  let row = grid.children[rowIndex];
  let cell = row.children[index];
  cell.style.animationName = 'press';
  cell.style.animationDuration = '100ms';
}

function clearAnimation(cell) {
  cell.style.animationName = '';
  cell.style.animationDuration = '';
}

function loadGame() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem('data'));
  } catch { }
  if (data != null) {
    if (data.secret == secret) {
      attempts = data.attempts
    }
  }
}

function saveGame() {
  let data = JSON.stringify({
    secret,
    attempts
  });
  localStorage.setItem('data', data);
}

let grid = document.getElementById('grid');
let keyboard = document.getElementById('keyboard');
let keyboardButtons = new Map();
loadGame();
buildGrid();
updateGrid();
buildKeyboard();
updateKeyboard();
window.addEventListener('keydown', handleKeyDown);