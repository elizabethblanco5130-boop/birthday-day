const body = document.body;
const worldBtn = document.getElementById("worldBtn");

// Linterna
const flashlight = document.createElement("div");
flashlight.className = "flashlight";
document.body.appendChild(flashlight);

// Polvo
const canvas = document.createElement("canvas");
canvas.id = "dust";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
}
window.addEventListener("resize", resize);
resize();

function setPointer(x, y){
  document.documentElement.style.setProperty("--mx", x + "px");
  document.documentElement.style.setProperty("--my", y + "px");
}
window.addEventListener("mousemove", (e)=>setPointer(e.clientX, e.clientY), {passive:true});
window.addEventListener("touchmove", (e)=>{
  const t = e.touches[0];
  if(t) setPointer(t.clientX, t.clientY);
}, {passive:true});

// Partículas
let particles = [];
function makeParticles(count){
  particles = [];
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: (Math.random()*1.8 + 0.6) * devicePixelRatio,
      s: (Math.random()*0.35 + 0.08) * devicePixelRatio,
      a: Math.random()*0.55 + 0.15,
      drift: (Math.random()*0.7 - 0.35) * devicePixelRatio
    });
  }
}
makeParticles(85);

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const isUpside = body.classList.contains("upside");

  for(const p of particles){
    p.y += p.s;
    p.x += p.drift * 0.15;

    if(p.y > canvas.height + 20) p.y = -20;
    if(p.x > canvas.width + 20) p.x = -20;
    if(p.x < -20) p.x = canvas.width + 20;

    ctx.fillStyle = isUpside
      ? `rgba(0,255,255,${p.a*0.55})`
      : `rgba(255,255,255,${p.a*0.35})`;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// FX click por icono
function popFx(x, y, kind="ink"){
  const d = document.createElement("div");
  d.className = `fx ${kind}`;
  d.style.left = x + "px";
  d.style.top = y + "px";
  document.body.appendChild(d);
  setTimeout(()=>d.remove(), 700);
}

document.addEventListener("click", (e)=>{
  const el = e.target.closest("[data-spark]");
  if(!el) return;
  const kind = el.getAttribute("data-spark") || "ink";
  popFx(e.clientX, e.clientY, kind);
}, {passive:true});

// WORLD toggle + easter
let taps = 0;
let tapTimer = null;

function shake(){
  body.classList.remove("glitch-shake");
  void body.offsetWidth;
  body.classList.add("glitch-shake");
  setTimeout(()=>body.classList.remove("glitch-shake"), 280);
}

function setWorld(up){
  body.classList.toggle("upside", up);
  worldBtn.textContent = up ? "WORLD: UPSIDE DOWN" : "WORLD: NORMAL";
  shake();
}

if(worldBtn){
  worldBtn.addEventListener("click", ()=>{
    taps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(()=>{ taps = 0; }, 1400);

    setWorld(!body.classList.contains("upside"));

    if(taps >= 7){
      taps = 0;
      makeParticles(140);
      flashlight.style.opacity = "1";
      setTimeout(()=>{
        makeParticles(85);
        flashlight.style.opacity = "";
      }, 6000);
    }
  });
}

setWorld(false);
