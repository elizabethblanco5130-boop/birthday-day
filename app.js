const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const invEl = document.getElementById("inv");
const codeEl = document.getElementById("code");
const heartsEl = document.getElementById("hearts");
const btnAudio = document.getElementById("btnAudio");

let sfxOn = true;
let hearts = 3;
let code = "????";
const inv = new Set();

function setText(t){ textEl.textContent = t; }
function setChoices(arr){
  choicesEl.innerHTML = "";
  arr.forEach(c=>{
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = c.label;
    b.onclick = c.onClick;
    choicesEl.appendChild(b);
  });
}
function addItem(name){
  inv.add(name);
  invEl.textContent = [...inv].join(", ");
}
function setCode(v){ code = v; codeEl.textContent = v; }
function loseHeart(){
  hearts = Math.max(0, hearts-1);
  heartsEl.textContent = hearts;
  if(hearts === 0) gameOver();
}
function gameOver(){
  setText(`GAME OVER.\nThe Upside Down wins… for now.\nBut birthdays reset the universe.`);
  setChoices([{label:"RESTART", onClick: start}]);
}

btnAudio.onclick = () => {
  sfxOn = !sfxOn;
  btnAudio.textContent = `SFX: ${sfxOn ? "ON" : "OFF"}`;
};

function start(){
  hearts = 3; heartsEl.textContent = hearts;
  setCode("????");
  inv.clear(); invEl.textContent = "—";

  setText(
`Day wakes up in Hawkins.\nLas luces parpadean.\n\nA note says:\n"02/02/2005 is the lock.\nDay is the key."`
  );

  setChoices([
    { label:"GO: FOREST", onClick: forest },
    { label:"GO: LAB", onClick: lab },
    { label:"GO: ARCADE (cute)", onClick: arcade },
  ]);
}

function forest(){
  setText(
`The forest is too quiet.\nEscuchas un "click… click" detrás de un árbol.\n\nSomething spells: D-A-Y`
  );
  setChoices([
    { label:"SEARCH GROUND", onClick: ()=>{ addItem("COMPASS"); forest2(); } },
    { label:"WALL LIGHTS PUZZLE", onClick: wallPuzzle },
    { label:"BACK", onClick: start },
  ]);
}

function forest2(){
  setText(
`You found a COMPASS.\nPero apunta hacia “abajo”… como si el mundo tuviera otro mundo debajo.\n\nYou feel the code getting closer.`
  );
  setChoices([
    { label:"GO LAB", onClick: lab },
    { label:"BACK", onClick: forest },
  ]);
}

function lab(){
  setText(
`The lab smells like metal.\nUna puerta con keypad pide 4 dígitos.\n\nA cassette tape reads:\n"For Day — if you hear breathing, don’t look up."`
  );
  setChoices([
    { label:"PLAY TAPE", onClick: tape },
    { label:"TRY DOOR", onClick: door },
    { label:"MINI GAME: FIND PORTAL", onClick: miniGame },
    { label:"BACK", onClick: start },
  ]);
}

function tape(){
  addItem("TAPE");
  setCode("0202");
  setText(
`Tape plays:\n"Day… turn the date into a code.\nFeb 02 2005 → 0202.\nType it when the lights blink."`
  );
  setChoices([
    { label:"TRY DOOR (0202)", onClick: door },
    { label:"BACK", onClick: lab },
  ]);
}

function door(){
  if(code !== "0202"){
    loseHeart();
    setText(`ACCESS DENIED.\nWrong code.\nYou lost 1 heart.\n\nHint: find the TAPE or solve the WALL LIGHTS.`);
    setChoices([
      { label:"BACK TO LAB", onClick: lab },
      { label:"GO FOREST", onClick: forest },
    ]);
    return;
  }
  addItem("PORTAL-ACCESS");
  setText(
`Door opens.\nA red fog crawls like it has hands.\n\nInside the noise:\n"Feliz cumpleaños… Day."`
  );
  setChoices([
    { label:"CLOSE THE PORTAL (FINAL)", onClick: finale },
    { label:"WAIT…", onClick: lab },
  ]);
}

function finale(){
  setText(
`EPIC FINALE.\n\nThe Upside Down bargains:\n"Give me your birthday and I'll give you silence."\n\nDay laughs:\n"No. I want the world loud."\n\nYou slam the code into reality: 0202.\nPortal collapses.\n\nHAPPY BIRTHDAY, DAY.`
  );
  setChoices([
    { label:"SECRET ENDING (cute)", onClick: secret },
    { label:"RESTART", onClick: start },
  ]);
}

function secret(){
  setText(
`SECRET ENDING.\n\nA tiny demogorgon plush appears with a party hat.\nIt offers a cupcake.\n\n"Ok… today no horror. Today only glow." 🎂✨`
  );
  setChoices([{ label:"BACK", onClick: finale }]);
}

/* Simple puzzle: click letters DAY */
function wallPuzzle(){
  setText(`WALL LIGHTS.\nClick letters to spell DAY (D-A-Y).\n(Use your brain, Hawkins doesn’t give freebies.)`);
  setChoices([
    { label:"D", onClick: ()=>pickLetter("D") },
    { label:"A", onClick: ()=>pickLetter("A") },
    { label:"Y", onClick: ()=>pickLetter("Y") },
    { label:"BACK", onClick: forest },
  ]);
}

let picked = "";
function pickLetter(L){
  picked = (picked + L).slice(-3);
  if(picked === "DAY"){
    setCode("0202");
    addItem("WALL-CLUE");
    setText(`The wall whispers:\n"02/02… → 0202"\nCode unlocked.`);
    setChoices([{ label:"GO LAB", onClick: lab }]);
  } else {
    setText(`Picked: ${picked}\nKeep going…`);
  }
}

/* Mini game: choose the right box */
function miniGame(){
  setText("MINI GAME.\nOne of these boxes hides the portal. You get 1 try.");
  const safe = Math.floor(Math.random()*4);
  setChoices([0,1,2,3].map(i=>({
    label: `BOX ${i+1}`,
    onClick: ()=>{
      if(i===safe){
        setCode("0202");
        addItem("PORTAL-FOUND");
        setText("You found it. The date becomes the code: 0202.");
        setChoices([{label:"TRY DOOR", onClick: door}]);
      } else {
        loseHeart();
        setText("Wrong box. Something moves behind you… (lost 1 heart)");
        setChoices([{label:"TRY AGAIN", onClick: miniGame},{label:"BACK", onClick: lab}]);
      }
    }
  })));
}

function arcade(){
  setText(
`ARCADE (cute break).\nNeon lights. 80s music.\nA screen flashes:\n"HAPPY BIRTHDAY, DAY."\n\nYou can heal once.`
  );
  setChoices([
    { label:"+1 HEART", onClick: ()=>{ hearts = Math.min(5, hearts+1); heartsEl.textContent = hearts; } },
    { label:"WIN PRIZE", onClick: ()=>{ addItem("UPSIDEDOWN-KEY"); setText("You won a tiny key made of cold glass."); setChoices([{label:"BACK", onClick: arcade}]); } },
    { label:"BACK", onClick: start },
  ]);
}

start();
