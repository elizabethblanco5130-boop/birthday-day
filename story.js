// Historia interactiva tipo "choose your path"
// Cambia NODES para agregar más escenas.

const state = {
  hearts: 3,
  keys: 0,
  mode: "HAWKINS",   // HAWKINS / UPSIDE
  node: "start",
  inventory: new Set()
};

const nodes = {
  start: {
    title: "HAWKINS / NOCHE",
    text: [
      "Te despiertas con una estática en el walkie-talkie.",
      "Una voz susurra tu nombre: Dayanara.",
      "En el bolsillo hay una nota: “Si encuentras 2 llaves, la puerta se abre.”",
      "",
      "¿Qué haces primero?"
    ],
    choices: [
      { label: "IR AL BOSQUE", to: "forest" },
      { label: "IR AL LAB", to: "lab" },
      { label: "IR AL ARCADE", to: "arcade", gain: { keys: 1 }, add: "token" }
    ]
  },

  forest: {
    title: "BOSQUE / NIEBLA",
    text: [
      "Los árboles están demasiado quietos.",
      "Ves luces entre ramas como si alguien te guiara.",
      "Algo se mueve… pero no lo ves completo.",
      "",
      "Elige rápido."
    ],
    choices: [
      { label: "SEGUIR LAS LUCES", to: "lightswall", gain: { keys: 1 } },
      { label: "ESCONDERSE", to: "hide", lose: { hearts: 1 } },
      { label: "VOLVER", to: "start" }
    ]
  },

  lab: {
    title: "HAWKINS LAB",
    text: [
      "Puertas frías. Señales de 'RESTRICTED'.",
      "Encuentras un gabinete con un candado.",
      "Una placa dice: “La llave está donde la música se queda pegada.”"
    ],
    choices: [
      { label: "BUSCAR EN CASSETTES", to: "mixtape", gain: { keys: 1 }, add: "tape" },
      { label: "ENTRAR A UNA SALA OSCURA", to: "darkroom", lose: { hearts: 1 } },
      { label: "VOLVER", to: "start" }
    ]
  },

  arcade: {
    title: "ARCADE (CUTE)",
    text: [
      "Luces neon. Máquinas viejas. Una melodía pegajosa.",
      "Ganas un token raro con un símbolo: ⚡",
      "Te ríes porque por un segundo todo se siente normal.",
      "",
      "Pero escuchas un golpe al fondo…"
    ],
    choices: [
      { label: "IR AL FONDO", to: "portal" },
      { label: "VOLVER", to: "start" }
    ]
  },

  lightswall: {
    title: "CASA / PARED DE LUCES",
    text: [
      "La pared está llena de letras y luces.",
      "Parpadean como si respondieran a tu presencia.",
      "",
      "Las luces forman una frase: “NO ESTÁS SOLA.”"
    ],
    choices: [
      { label: "RESPONDER (TOCAR LETRAS)", to: "talk", gain: { keys: 1 } },
      { label: "BUSCAR LA PUERTA", to: "portal" }
    ]
  },

  hide: {
    title: "SILENCIO",
    text: [
      "Te escondes. La respiración te delata.",
      "Algo pasa cerca. Sientes el aire cambiar.",
      "Pierdes una vida… pero sobrevives."
    ],
    choices: [
      { label: "CORRER A CASA", to: "lightswall" },
      { label: "VOLVER", to: "start" }
    ]
  },

  mixtape: {
    title: "CASSETTE / SEÑAL",
    text: [
      "La cinta dice: “PLAY ME WHEN IT'S DARK”.",
      "Cuando la tocas, una chispa azul recorre tu mano.",
      "El mundo parece… voltearse."
    ],
    choices: [
      { label: "ABRIR EL PORTAL", to: "portal", setMode: "UPSIDE" },
      { label: "GUARDAR Y VOLVER", to: "start" }
    ]
  },

  darkroom: {
    title: "SALA OSCURA",
    text: [
      "Tu linterna tiembla.",
      "Ves sombras donde no debería haber nada.",
      "Un cartel: “NO MIRES ARRIBA”.",
      "",
      "Obvio, miras."
    ],
    choices: [
      { label: "SALIR CORRIENDO", to: "start" },
      { label: "ABRIR EL PORTAL", to: "portal", setMode: "UPSIDE" }
    ]
  },

  talk: {
    title: "MENSAJE",
    text: [
      "Las luces responden.",
      "Forman: “FELIZ CUMPLEAÑOS, DAYANARA”.",
      "Y luego: “EL REGALO ESTÁ DEL OTRO LADO.”"
    ],
    choices: [
      { label: "CRUZAR", to: "portal", setMode: "UPSIDE" },
      { label: "VOLVER", to: "start" }
    ]
  },

  portal: {
    title: "PORTAL",
    text: [
      "La puerta vibra. No es una puerta normal.",
      "Si tienes 2 llaves, se abre.",
      "",
      "¿Cuántas llaves tienes? (Mira arriba: 🗝️)"
    ],
    choices: [
      { label: "INTENTAR ABRIR", to: "open" },
      { label: "VOLVER A BUSCAR", to: "start" }
    ]
  },

  open: {
    title: "DECISIÓN FINAL",
    text: [
      "Pones la mano en la manija.",
      "El aire se enfría.",
      "",
      "Si te faltan llaves… algo sale mal."
    ],
    choices: [
      { label: "ABRIR YA", to: "result" }
    ]
  },

  result: {
    title: "RESULTADO",
    text: [
      "El portal responde a tu energía.",
      "Si juntaste suficientes llaves, se abre sin romper el mundo.",
      "",
      "Si no… te empuja de vuelta.",
      "",
      "TIP: vuelve a jugar y elige rutas distintas."
    ],
    choices: [
      { label: "REINICIAR", to: "start", reset: true },
      { label: "IR A WILL", toUrl: "will.html?v=999" }
    ]
  }
};

// ---------- UI ----------
const elTitle = document.getElementById("sceneTitle");
const elText = document.getElementById("text");
const elChoices = document.getElementById("choices");
const elHearts = document.getElementById("hearts");
const elKeys = document.getElementById("keys");
const elMode = document.getElementById("mode");
const elBg = document.getElementById("bg");

function clickFx(x,y){
  const s = document.createElement("div");
  s.className = "spark";
  s.style.left = (x-5)+"px";
  s.style.top = (y-5)+"px";
  document.body.appendChild(s);
  setTimeout(()=>s.remove(), 600);
}

document.addEventListener("click",(e)=>clickFx(e.clientX,e.clientY),{passive:true});

function setMode(mode){
  state.mode = mode;
  elMode.textContent = mode === "UPSIDE" ? "UPSIDE" : "HAWKINS";
  // cambia fondo según modo
  elBg.style.background =
    mode === "UPSIDE"
      ? "radial-gradient(circle at 70% 20%, rgba(0,255,255,.12), rgba(0,0,0,.90))"
      : "radial-gradient(circle at 30% 20%, rgba(255,0,0,.18), rgba(0,0,0,.85))";
}

function applyDelta(obj, sign=1){
  if(!obj) return;
  if(obj.hearts) state.hearts = Math.max(0, state.hearts + sign*obj.hearts);
  if(obj.keys) state.keys = Math.max(0, state.keys + sign*obj.keys);
}

function renderNode(id){
  state.node = id;
  const n = nodes[id];

  // si llegamos al final: verifica llaves (mínimo 2)
  if(id === "result"){
    if(state.keys >= 2){
      n.text = [
        "💥 El portal se abre.",
        "El Upside Down te mira… pero no te consume.",
        "",
        "Ganas: un recuerdo secreto para Daya.",
        "",
        "Ahora puedes ir a Will y ver la carta."
      ];
      setMode("UPSIDE");
    }else{
      n.text = [
        "❌ No tienes suficientes llaves.",
        "El portal se cierra con un golpe.",
        "",
        "Consejo: explora más rutas (bosque/lab/arcade).",
        "Necesitas al menos 2 llaves 🗝️."
      ];
      setMode("HAWKINS");
    }
  }

  elTitle.textContent = n.title;
  elText.innerHTML = typeLines(n.text);
  elChoices.innerHTML = "";

  elHearts.textContent = state.hearts;
  elKeys.textContent = state.keys;
  elMode.textContent = state.mode === "UPSIDE" ? "UPSIDE" : "HAWKINS";

  n.choices.forEach(c=>{
    const b = document.createElement("button");
    b.className = "btn" + (c.main ? " btn-main" : "");
    b.textContent = c.label;
    b.addEventListener("click", ()=>{
      if(c.reset){
        state.hearts = 3;
        state.keys = 0;
        state.inventory = new Set();
        setMode("HAWKINS");
      }
      if(c.add) state.inventory.add(c.add);
      applyDelta(c.gain, +1);
      applyDelta(c.lose, -1);
      if(c.setMode) setMode(c.setMode);

      if(c.toUrl){
        window.location.href = c.toUrl;
        return;
      }
      renderNode(c.to);
    });
    elChoices.appendChild(b);
  });
}

// Texto tipo máquina simple
function typeLines(lines){
  const html = lines.map(l=>`<div>${escapeHtml(l)}</div>`).join("");
  // hacemos un “typing” visual con CSS simple: mostramos todo pero con un estilo tipo terminal
  return html;
}

function escapeHtml(s){
  return (s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

// start
setMode("HAWKINS");
renderNode("start");
