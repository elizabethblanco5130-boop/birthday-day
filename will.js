const wall = document.getElementById("wall");
const btn = document.getElementById("switchBtn");

let upside = false;

btn.addEventListener("click", () => {
  if (!upside) {
    wall.style.backgroundImage = "url('upside.jpg')";
    btn.textContent = "Return to Hawkins";
    upside = true;
  } else {
    wall.style.backgroundImage = "url('normal.jpg')";
    btn.textContent = "Enter the Upside Down";
    upside = false;
  }
});
