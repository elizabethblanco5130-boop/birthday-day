// ===== HUB MUSIC (iPhone: solo suena después de un toque real) =====
const hubMusic = document.getElementById("hubMusic");
let hubMusicStarted = false;

function startHubMusic(){
  if(!hubMusic) return;
  hubMusic.volume = 0.35;

  hubMusic.play()
    .then(()=>{ hubMusicStarted = true; })
    .catch(()=>{});
}

// iPhone: intenta arrancar con cualquier interacción real
["touchstart","click","pointerdown"].forEach(evt=>{
  window.addEventListener(evt, () => {
    if(!hubMusicStarted) startHubMusic();
  }, { passive:true });
});


// ===== WORLDS =====
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

  // ✅ GIFs solo en NORMAL
  renderHubGifs();
}

worldBtn.addEventListener("click", () => {
  if(!hubMusicStarted) startHubMusic();

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
  if(!hubMusicStarted) startHubMusic();

  const target = e.target.closest("[data-spark]");
  const mode = target?.dataset?.spark || "ash";
  spawnSparkBurst(e.clientX, e.clientY, mode);
});


// =====================================================
// ✅ FLOATING GIFS (hawkins1.GIF ... hawkins22.GIF)
// Solo se ven en WORLD: NORMAL
// Carpeta: img/icons/
// =====================================================
const gifLayer = document.getElementById("gifLayer");

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function rand(a,b){ return a + Math.random()*(b-a); }

function clearGifs(){
  if(!gifLayer) return;
  gifLayer.innerHTML = "";
}

function buildGifs(){
  if(!gifLayer) return;

  // zona segura (no tapar header ni hint de abajo)
  const topPad = 90;
  const bottomPad = 140;

  const W = window.innerWidth;
  const H = window.innerHeight;

  for(let n=1; n<=22; n++){
    const img = document.createElement("img");
    img.className = "hub-gif";
    img.alt = `hawkins ${n}`;

    // ✅ IMPORTANTE: tus archivos son .GIF en mayúscula
    img.src = `img/icons/hawkins${n}.GIF`;

    // tamaño responsive
    const size = (W < 520) ? rand(38, 62) : rand(44, 78);
    const x = rand(6, 94);
    const yPx = rand(topPad, H - bottomPad);
    const y = (yPx / H) * 100;

    img.style.setProperty("--s", `${size}px`);
    img.style.setProperty("--x", `${x}%`);
    img.style.setProperty("--y", `${clamp(y, 10, 92)}%`);
    img.style.setProperty("--r", `${rand(-12, 12)}deg`);
    img.style.setProperty("--t", `${rand(2.6, 4.8)}s`);

    gifLayer.appendChild(img);
  }
}

function renderHubGifs(){
  if(!gifLayer) return;

  // Solo en NORMAL
  if(!document.body.classList.contains("normal")){
    clearGifs();
    return;
  }

  // Rebuild limpio
  clearGifs();
  buildGifs();
}

// Recalcular cuando cambie el tamaño (tablet/desktop)
window.addEventListener("resize", () => {
  renderHubGifs();
});

// Primera vez
renderHubGifs();
