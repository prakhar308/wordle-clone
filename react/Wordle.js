export default function Wordle() {
  return (
    <div id="screen">
      <h1>Wordle</h1>
      <Grid />
      <Keyboard />
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
let attempts = ['sport', 'piano', 'panic'];
let currentAttempt = 'wat';

function Grid() {
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

function Keyboard() {
  return (
    <div id="keyboard">
      <KeyboardRow letters="qwertyuiop" isLastRow={false} />
      <KeyboardRow letters="asdfghjkl" isLastRow={false} />
      <KeyboardRow letters="zxcvbnm" isLastRow={true} />
    </div>
  );
}

function KeyboardRow({
  letters,
  isLastRow
}) {
  let buttons = []
  if (isLastRow) {
    buttons.push(
      <Button
        key="enter"
        buttonKey="enter"
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
      >
        Backspace
      </Button>
    );
  }
  return(
    <div>
      {buttons}
    </div>
  )
}

function Button({
  buttonKey,
  children
}) {
  return (
    <button
      className="keyboard-button"
      onClick={() => {
        // TODO
        // handleButtonClick()
      }}
    >
      {children}
    </button>
  );
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