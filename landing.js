const title = document.getElementById("stTitle");

let taps = 0;

title.addEventListener("click", () => {
  taps++;
  title.classList.add("pulse");
  setTimeout(()=>title.classList.remove("pulse"), 220);

  if(taps >= 7){
    taps = 0;
    alert("Easter unlocked ✅\nEl código te está buscando: 0202");
  }
});

// flicker automático
setInterval(() => {
  title.classList.add("flicker");
  setTimeout(()=>title.classList.remove("flicker"), 120);
}, 1800);

// mini “glitch shift”
setInterval(() => {
  title.classList.add("glitch-shift");
  setTimeout(()=>title.classList.remove("glitch-shift"), 150);
}, 2600);
// Start background music on first user interaction
document.addEventListener("click", () => {
  const bgm = document.getElementById("bgm");
  if (bgm && bgm.paused) {
    bgm.volume = 0.5;
    bgm.play();
  }
}, { once: true });
