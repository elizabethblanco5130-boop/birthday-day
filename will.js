const wall = document.getElementById("wall");
const lights = document.getElementById("lights");
const flipBtn = document.getElementById("flipBtn");
const modeLabel = document.getElementById("modeLabel");

let isUpside = false;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function buildLights(){
  lights.innerHTML = "";
  // 26 “bombillitos”
  alphabet.forEach((_, i) => {
    const b = document.createElement("span");
    b.className = "bulb";
    b.style.setProperty("--i", i);
    lights.appendChild(b);
  });
}

function buildWallNormal(){
  wall.innerHTML = "";
  alphabet.forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.className = "letter";
    btn.textContent = ch;
    btn.dataset.i = i;
    btn.addEventListener("click", () => popLight(i, "normal"));
    wall.appendChild(btn);
  });
}

function buildWallUpside(){
  wall.innerHTML = "";
  const msg = "HAPPY BIRTHDAY DAY";
  // convertimos a “tiles”
  msg.split("").forEach((ch, idx) => {
    const btn = document.createElement("button");
    btn.className = "letter upside-letter";
    btn.textContent = ch === " " ? "·" : ch;
    btn.addEventListener("click", () => popLight(idx % 26, "upside"));
    wall.appendChild(btn);
  });
}

function popLight(i, mode){
  const bulbs = document.querySelectorAll(".bulb");
  const b = bulbs[i];
  if(!b) return;

  b.classList.remove("hit","hit-up");
  void b.offsetWidth;

  if(mode === "upside") b.classList.add("hit-up");
  else b.classList.add("hit");

  // chispita rápida
  spawnSpark();
}

function spawnSpark(){
  const s = document.createElement("span");
  s.className = isUpside ? "spark up" : "spark";
  s.style.left = (10 + Math.random()*80) + "vw";
  s.style.top  = (20 + Math.random()*60) + "vh";
  document.body.appendChild(s);
  s.addEventListener("animationend", () => s.remove());
}

function setMode(up){
  isUpside = up;
  document.body.classList.toggle("upside", up);
  document.body.classList.toggle("normal", !up);

  if(up){
    buildWallUpside();
    modeLabel.textContent = "Modo: UPSIDE DOWN";
    flipBtn.textContent = "VOLVER A LA LUZ";
  } else {
    buildWallNormal();
    modeLabel.textContent = "Modo: NORMAL";
    flipBtn.textContent = "ENTER THE UPSIDE DOWN";
  }
}

// init
buildLights();
setMode(false);

// botón toggle
flipBtn.addEventListener("click", () => {
  setMode(!isUpside);
  // un pequeño “temblor”
  document.body.classList.add("shake");
  setTimeout(()=>document.body.classList.remove("shake"), 300);
});
