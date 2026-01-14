const wall = document.getElementById("wall");
const flipBtn = document.getElementById("flipBtn");
const hint = document.getElementById("hint");

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let upside = false;

// Mapa de “luces” que se prenden en modo Upside Down para formar el mensaje
const message = "HAPPY BIRTHDAY DAY";

// Construye la pared A–Z (como en la serie)
function buildAlphabetWall(){
  wall.innerHTML = "";

  alphabet.forEach((ch) => {
    const b = document.createElement("button");
    b.className = "wl-letter";
    b.textContent = ch;
    b.dataset.letter = ch;

    b.addEventListener("click", () => {
      // En normal: parpadea lindo
      if(!upside){
        flash(b);
        hint.textContent = `La pared escucha… (${ch})`;
      } else {
        // En upside: chispas + glow raro
        flashUpside(b);
        hint.textContent = `El Upside Down responde… (${ch})`;
      }
    });

    wall.appendChild(b);
  });
}

// Enciende letras para formar el mensaje (sin borrar el A–Z)
function lightMessage(){
  // apaga todo primero
  document.querySelectorAll(".wl-letter").forEach(el=>{
    el.classList.remove("on","on-up");
  });

  // Prende letras por orden (usa las letras que existan)
  const chars = message.replace(/\s/g,"").split("");
  let i = 0;

  const timer = setInterval(() => {
    if(!upside){ clearInterval(timer); return; }

    const ch = chars[i];
    const el = document.querySelector(`.wl-letter[data-letter="${ch}"]`);
    if(el){
      el.classList.add("on-up");
    }
    i++;
    if(i >= chars.length) clearInterval(timer);
  }, 120);
}

// Efectos
function flash(el){
  el.classList.add("on");
  setTimeout(()=>el.classList.remove("on"), 180);
}

function flashUpside(el){
  el.classList.add("on-up");
  setTimeout(()=>el.classList.remove("on-up"), 220);
}

flipBtn.addEventListener("click", () => {
  upside = !upside;
  document.body.classList.toggle("upside", upside);
  document.body.classList.toggle("normal", !upside);

  if(upside){
    flipBtn.textContent = "VOLVER A HAWKINS";
    hint.textContent = "HAPPY BIRTHDAY DAY… (se está formando)";
    lightMessage();
  } else {
    flipBtn.textContent = "CRUZAR AL OTRO LADO";
    hint.textContent = "Toca letras… o cambia al otro lado.";
  }
});

buildAlphabetWall();
