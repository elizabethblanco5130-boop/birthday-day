// ===== HUB MUSIC (iPhone: solo suena después de un toque real) =====
const hubMusic = document.getElementById("hubMusic");
let hubMusicStarted = false;

function startHubMusic(){
  if(!hubMusic) return;
  hubMusic.volume = 0.35;
  hubMusic.play().then(()=>{ hubMusicStarted = true; }).catch(()=>{});
}

["touchstart","click","pointerdown"].forEach(evt=>{
  window.addEventListener(evt, () => {
    if(!hubMusicStarted) startHubMusic();
  }, { passive:true });
});


// ===== WORLDS =====
const body = document.body;
const worldBtn = document.getElementById("worldBtn");

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


// ===== SPARKS (si tu style.css ya trae .spark animación, esto funciona igual) =====
const stage = document.getElementById("stage");

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
// Carpeta: img/icons/
// =====================================================
const gifLayer = document.getElementById("gifLayer");

function rand(a,b){ return a + Math.random()*(b-a); }
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function clearGifs(){
  if(!gifLayer) return;
  gifLayer.innerHTML = "";
}

function buildGifs(){
  if(!gifLayer) return;

  const topPad = 90;
  const bottomPad = 150;

  const W = window.innerWidth;
  const H = window.innerHeight;

  for(let n=1; n<=22; n++){
    const img = document.createElement("img");
    img.className = "hub-gif";
    img.alt = `hawkins ${n}`;

    // ✅ CASE SENSITIVE: tus archivos son .GIF
    img.src = `img/icons/hawkins${n}.GIF`;

    // si falla cargar, lo escondemos para que no moleste
    img.onerror = () => { img.style.display = "none"; };

    const size = (W < 520) ? rand(34, 58) : rand(42, 76);
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

  if(!document.body.classList.contains("normal")){
    clearGifs();
    return;
  }

  clearGifs();
  buildGifs();
}

window.addEventListener("resize", renderHubGifs);
renderHubGifs();
