import { useState, useEffect, useRef } from 'react'

export default function Wordle() {
  let [attempts, setAttempts] = useState([]);
  let [currentAttempt, setCurrentAttempt] = useState('');
  let loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) {
      return
    }
    loadedRef.current = true
    let savedAttempts = loadAttempts();
    if (savedAttempts) {
      setAttempts(savedAttempts);
    }
  });

  useEffect(() => {
    saveAttempts(attempts);
  }, [attempts])

  function handleKey(key) {
    // if alphabet then add it to current attempt
    if (/^[a-z]$/.test(key)) {
      if (currentAttempt.length < 5) {
        setCurrentAttempt(currentAttempt + key);
        // TODO: animatePress(currentAttempt.length - 1);
      }
    }
    // if backspace then remove one alphabet from currentAttempt
    else if (key == "backspace") {
      setCurrentAttempt(currentAttempt.slice(0, -1));
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

      setAttempts([
        ...attempts,
        currentAttempt
      ]);
      setCurrentAttempt('');

      if (attempts.length == 6) {
        alert(`You Lost. Word was: ${secret}`);
      }
    }
  }

  function handleKeyDown(e) {
    if (event.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    let key = e.key.toLowerCase();
    handleKey(key);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div id="screen">
      <h1>Wordle</h1>
      <Grid
        attempts={attempts}
        currentAttempt={currentAttempt}
      />
      <Keyboard
        onKeyDown={handleKey}
      />
    </div>
  );
}

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

function Grid({
  attempts,
  currentAttempt
}) {
  let rows = []
  for (let i = 0; i < 6; i++) {
    if (i < attempts.length) {
      rows.push(
        <Attempt
          key={i}
          attempt={attempts[i]}
          solved={true}
        />
      );
    } else if (i === attempts.length) {
      rows.push(
        <Attempt
          key={i}
          attempt={currentAttempt}
          solved={false}
        />
      );
    } else {
      rows.push(
        <Attempt
          key={i}
          solved={false}
          attempt=""
        />
      );
    }
  }
  return (
    <div id="grid">
      {rows}
    </div>
  );
}

function Attempt({
  attempt,
  solved
}) {
  let cells = []
  for (let i = 0; i < 5; i++) {
    cells.push(
      <Cell
        key={i}
        index={i}
        attempt={attempt}
        solved={solved}
      />
    );
  }
  return (
    <div>{cells}</div>
  );
}

function Cell({
  index,
  attempt,
  solved
}) {
  let content = attempt[index] ?? '';
  // TODO: 
  // clearAnimation(cell);
  return (
    <div className={"cell " + (solved ? 'solved' : '')}>
      <div className="surface" style={{
        transitionDelay: (index * 200) + 'ms'
      }}>
        <div
          className="front"
          style={{
            borderColor: content ? LIGHTGREY : GREY
          }}
        >
          {content}
        </div>
        <div className="back"
          style={{
            background: getBgColor(attempt, index),
            borderColor: BLACK
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

function Keyboard({
  onKeyDown
}) {
  return (
    <div id="keyboard">
      <KeyboardRow letters="qwertyuiop" onKeyDown={onKeyDown} isLastRow={false} />
      <KeyboardRow letters="asdfghjkl" onKeyDown={onKeyDown} isLastRow={false} />
      <KeyboardRow letters="zxcvbnm" onKeyDown={onKeyDown} isLastRow={true} />
    </div>
  );
}

function KeyboardRow({
  letters,
  onKeyDown,
  isLastRow,
}) {
  let buttons = []
  if (isLastRow) {
    buttons.push(
      <Button
        key="enter"
        buttonKey="enter"
        onKeyDown={onKeyDown}
      >
        Enter
      </Button>
    );
  }

  for (let letter of letters) {
    buttons.push(
      <Button
        key={letter}
        buttonKey={letter}
        onKeyDown={onKeyDown}
      >
        {letter}
      </Button>
    );
  }

  if (isLastRow) {
    buttons.push(
      <Button
        key="backspace"
        buttonKey="backspace"
        onKeyDown={onKeyDown}
      >
        Backspace
      </Button>
    );
  }
  return (
    <div>
      {buttons}
    </div>
  )
}

function Button({
  buttonKey,
  children,
  onKeyDown
}) {
  return (
    <button
      className="keyboard-button"
      onClick={() => {
        onKeyDown(buttonKey)
      }}
    >
      {children}
    </button>
  );
}

function loadAttempts() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem('data'));
  } catch { }
  if (data != null) {
    if (data.secret == secret) {
      return data.attempts
    }
  }
}

function saveAttempts(attempts) {
  let data = JSON.stringify({
    secret,
    attempts
  });
  localStorage.setItem('data', data);
}

function getBgColor(attempt, i) {
  if (attempt[i] == secret[i]) {
    return GREEN;
  } else if (secret.includes(attempt[i])) {
    return YELLOW;
  } else {
    return GREY;
  }
}

let LIGHTGREY = '#565758';
let GREY = '#3a3a3c';
let GREEN = '#538d4e';
let YELLOW = '#b59f3b';
let BLACK = '#000000';