// ===== HUB MUSIC (iPhone compatible) =====
const hubMusic = document.getElementById("hubMusic");
let hubMusicStarted = false;

function startHubMusic(){
  if(!hubMusic || hubMusicStarted) return;
  hubMusic.volume = 0.35;
  hubMusic.play().catch(()=>{});
  hubMusicStarted = true;
}

// iPhone / Safari necesita interacción real
window.addEventListener("pointerdown", startHubMusic, { once:true });


// ===== WORLD SWITCH =====
const body = document.body;
const worldBtn = document.getElementById("worldBtn");
const stage = document.getElementById("stage");

const worlds = [
  { cls: "normal", label: "WORLD: NORMAL" },
  { cls: "upside", label: "WORLD: UPSIDE DOWN" },
  { cls: "will", label: "WORLD: WILL LIGHTS" }
];

let w = 0;
let taps = 0;

function setWorld(i){
  body.classList.remove("normal","upside","will");
  body.classList.add(worlds[i].cls);
  worldBtn.textContent = worlds[i].label;
}

worldBtn.addEventListener("click", () => {
  w = (w + 1) % worlds.length;
  setWorld(w);

  taps++;
  if(taps >= 7){
    taps = 0;
    spawnSparkBurst(window.innerWidth/2, 90, "ink");
  }
});

setWorld(0);


// ===== SPARKS =====
function spawnSparkBurst(x, y, mode="ink"){
  const count = 18;
  for(let i=0;i<count;i++){
    const p = document.createElement("span");
    p.className = `spark ${mode}`;
    p.style.left = x + "px";
    p.style.top  = y + "px";

    const ang = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 60;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist;

    p.style.setProperty("--dx", dx + "px");
    p.style.setProperty("--dy", dy + "px");
    p.style.animationDuration = (450 + Math.random()*350) + "ms";

    stage.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

stage.addEventListener("click", (e) => {
  const target = e.target.closest("[data-spark]");
  const mode = target?.dataset?.spark || "ash";
  spawnSparkBurst(e.clientX, e.clientY, mode);
});
