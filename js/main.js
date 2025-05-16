const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const images = {};
const assetsToLoad = [
  { name: "ciel", src: "assets/ciel-seul.png" },
  { name: "mer", src: "assets/mer-accueil.png" },
  { name: "sable", src: "assets/sable-seul.png" },
  { name: "leftCloud", src: "assets/Capture_d_ecran_2025-05-06_092847-removebg-preview.png" },
  { name: "rightCloud", src: "assets/Capture_d_ecran_2025-05-06_093137-removebg-preview.png" },
  { name: "cleaners", src: "assets/Nettoyage_de_plage_en_pixel_art-Photoroom.png" },
  { name : "doublePerso", src: "/assets/double.png"},
  { name : "soloPerso", src: "/assets/red_solo.png"},
  { name: "hoverSound", src: "/assets/audio/tunetank.com_menu-option-hover.wav" } // optionnel
];

let waveOffset = 0;
let cloudOffset = 0;

let buttons = [
  { text: "JOUER", y: canvas.height / 2 },
  { text: "REGLES", y: canvas.height / 2 + 70 },
  { text: "PARAMETRES", y: canvas.height / 2 + 140 }
];

let hoveredButtonIndex = -1;
let hoverSound = new Audio("/assets/audio/tunetank.com_menu-option-hover.wav");

function loadAssets(callback) {
  let loaded = 0;
  for (const asset of assetsToLoad) {
    if (asset.name === "hoverSound") continue; // skip audio
    const img = new Image();
    img.src = asset.src;
    img.onload = () => {
      images[asset.name] = img;
      loaded++;
      if (loaded === assetsToLoad.length - 1) callback();
    };
  }
}

function drawAccueil() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // Dégradé fondu entre mer et sable
  const gradient = ctx.createLinearGradient(0, 440, 0, 460);
  gradient.addColorStop(0, "rgb(85, 142, 247)");
  gradient.addColorStop(1, "rgba(216, 190, 112, 0.8)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 1, canvas.width, 420);

  // Fond ciel + déplacement infini
  ctx.drawImage(images.ciel, -cloudOffset % canvas.width, 0, canvas.width, 650);
  ctx.drawImage(images.ciel, canvas.width - cloudOffset % canvas.width, 0, canvas.width, 650);
  // Sable
  ctx.drawImage(images.sable, 0, -2, canvas.width, canvas.height);

  // mer simple
//   ctx.drawImage(images.mer, 0, 130, canvas.width, 300);

 // Mer ondulée
  const waveY = 50 + Math.sin(waveOffset) * 5;
  ctx.drawImage(images.mer, 0, waveY, canvas.width, 550);

  

  // Personnages
  ctx.drawImage(images.doublePerso, 90, 230, 400, 400);
  ctx.drawImage(images.soloPerso, 500, 230, 400, 400);


  // Nuages flottants
//   ctx.drawImage(images.cloud, (cloudOffset % 400) - 100, 80, 300, 100);
//   ctx.drawImage(images.cloud, (cloudOffset % 600) + 400, 50, 250, 80);

// leftCloud
  ctx.drawImage(images.leftCloud, 0, 8, 400, 272);
  // rightCloud
  ctx.drawImage(images.rightCloud, 600, 8, 400, 273);

  // Titre "TRASH QUEST" en style pixel
  ctx.font = "80px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.lineWidth = 8;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  
  ctx.strokeText("TRASH", canvas.width / 2, 130);
  ctx.fillText("TRASH", canvas.width / 2, 130);
  
  ctx.strokeText("QUEST", canvas.width / 2, 210);
  ctx.fillText("QUEST", canvas.width / 2, 210);
  // Boutons
  drawButtons();

  waveOffset += 0.02;
  cloudOffset += 0.3;

  requestAnimationFrame(drawAccueil);
}

function drawButtons() {
  ctx.font = "20px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.justifyContent = "center";

  buttons.forEach((btn, index) => {
    const isHovered = index === hoveredButtonIndex;
    const x = canvas.width / 2;
    const width = isHovered ? 260 : 240;
    const height = isHovered ? 50 : 40;
    const fontSize = isHovered ? 22 : 20;
    const bgColor = "transparent";

    // Zoom léger
    ctx.fillStyle = bgColor;
    ctx.fillRect(x - width / 2, btn.y - height / 2, width, height);

    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.strokeRect(x - width / 2, btn.y - height / 2, width, height);

    ctx.fillStyle = "white";
    ctx.font = `${fontSize}px 'Press Start 2P'`;
    ctx.fillText(btn.text, x, btn.y + 7);
  });
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  let found = -1;

  buttons.forEach((btn, index) => {
    const bx = canvas.width / 2 - 120;
    const by = btn.y - 25;
    const bw = 240;
    const bh = 40;

    if (x > bx && x < bx + bw && y > by && y < by + bh) {
      found = index;
    }
  });

  // if (found !== hoveredButtonIndex && found !== -1) {
  //   hoverSound.currentTime = 0;
  //   hoverSound.play();
  // }

  hoveredButtonIndex = found;
});

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  buttons.forEach((btn, index) => {
    const bx = canvas.width / 2 - 120;
    const by = btn.y - 25;
    const bw = 240;
    const bh = 40;

    if (x > bx && x < bx + bw && y > by && y < by + bh) {
      if (index === 0) showCharacterSelection();
      else if (index === 1) openPopup("regles");
      else if (index === 2) openPopup("parametres");
    }
  });
});

loadAssets(drawAccueil);
 