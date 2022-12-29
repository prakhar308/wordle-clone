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

let randomIndex = Math.floor((Math.random() * wordList.length));
let secret = wordList[randomIndex];

let attempts = [];
let currentAttempt = '';

function handleKey(key) {
  // if alphabet then add it to current attempt
  if (/^[a-z]$/.test(key)) {
    if (currentAttempt.length < 5) {
      currentAttempt += key;
    }
  }
  // if backspace then remove one alphabet from currentAttempt
  else if (key == "backspace") {
    currentAttempt = currentAttempt.slice(0, -1);
  }
  // if enter then check if player won and save it to attempts
  else if (key == "enter") {
    if (currentAttempt.length == 5) {
      if (!wordList.includes(currentAttempt)) {
        alert('Not in word list!');
        return;
      }
      attempts.push(currentAttempt);
      currentAttempt = '';
    } else {
      alert('Not enough letters');
    }
  }
  
  updateGrid();
  updateKeyboard(); 
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
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function updateGrid() {
  let row = grid.firstChild;
  for (let attempt of attempts) {
    drawAttempt(row, attempt, false);
    row = row.nextSibling;
  }
  drawAttempt(row, currentAttempt, true);
}

function drawAttempt(row, attempt, isCurrent) {
  for (let i = 0; i < 5; i++) {
    let cell = row.children[i];
    cell.textContent = attempt[i] ?? '';
    if (!isCurrent) {
      cell.style.background = getBgColor(attempt, i);
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

let GREY = '#3a3a3c';
let GREEN = '#538d4e';
let YELLOW = '#b59f3b'; 

function getBgColor(attempt, i) {
  if (attempt[i] == secret[i]) {
    return GREEN;
  } else if (secret.includes(attempt[i])) {
    return YELLOW;
  } else {
    return GREY;
  }
}

let grid = document.getElementById('grid');
let keyboard = document.getElementById('keyboard');
let keyboardButtons = new Map();
buildGrid();
buildKeyboard();
window.addEventListener('keydown', handleKeyDown);