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

let grid = document.getElementById('grid');
let keyboard = document.getElementById('keyboard');
buildGrid();
buildKeyboard();
window.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
  let letter = event.key.toLowerCase();

  // if alphabet then add it to current attempt
  if (/^[a-z]$/.test(letter)) {
    if (currentAttempt.length < 5) {
      currentAttempt += letter;
    }
  }

  // if backspace then remove one alphabet from currentAttempt
  if (letter == "backspace") {
    currentAttempt = currentAttempt.slice(0, -1);
  }

  // if enter then check if player won and save it to attempts
  if (letter == "enter") {
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

function handleButtonClick(text) {
  if (text == "enter") {
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
  } else if (text == "cancel") {
    currentAttempt = currentAttempt.slice(0, -1);
  } else {
    if (currentAttempt.length < 5) {
      currentAttempt += text;
    }
  }
  updateGrid();
  updateKeyboard();
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
    return button;
  }

  if (isLastRow) {
    row.appendChild(buildKeyboardButton('enter'));
  }

  for (let letter of letters) {
    row.appendChild(buildKeyboardButton(letter));
  }

  if (isLastRow) {
    row.appendChild(buildKeyboardButton('cancel'));
  }

  keyboard.appendChild(row);
}

function updateKeyboard() {
  for (let attempt of attempts) {
    for (let i = 0; i < attempt.length; i++) {
      let button = document.getElementById(attempt[i]);
      // TODO: apply color based on precedence like once green then should not be changed, green > yellow
      button.style.background = getBgColor(attempt, i);
    }
  }
}

function getBgColor(attempt, i) {
  if (attempt[i] == secret[i]) {
    return '#538d4e';
  } else if (secret.includes(attempt[i])) {
    return '#b59f3b';
  } else {
    return '#3a3a3c';
  }
}