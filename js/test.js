//  Classe ScoreGame
class ScoreGame {
  constructor() {
    this.score = 0;
    this.timeGame = 180;
    this.wastePoints = { plastique: 2, verre: 3, toxique: 5, organique: 1 };
    this.multiplierActive = false;
  }
  collectWaste(type) {
    const pts = this.wastePoints[type] || 0;
    this.score += pts;
    console.log(`+${pts} pts  ${type}`);
  }
  recycleError() {
    this.score = Math.max(0, this.score - 1);
    console.log("-1 pt → Mauvaise poubelle! ");
  }
  solvePuzzle(difficulty) {
    const bonus = difficulty * 3;
    this.score += bonus;
    console.log(`+${bonus} pts → Énigme réussie! `);
  }
  calculateFinalScore() {
    return this.multiplierActive ? this.score * 2 : this.score;
  }
}

//  Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//  Sons
const goodSound = document.getElementById("goodSound");
const badSound = document.getElementById("badSound");
const victorySound = document.getElementById("victorySound");

// Petites zones invisibles sur le terrain
const traps = [
    { x: 200, y: 300, width: 50, height: 50 },
    { x: 600, y: 400, width: 50, height: 50 },
    { x: 800, y: 200, width: 50, height: 50 },
  ];
  
  // Horloge pour éviter qu’un joueur soit piégé trop souvent
  const lastTrapTime = [0, 0]; // pour chaque joueur
  const trapCooldown = 30; // 30 secondes entre 2 pièges
  

//  Récupération des choix depuis localStorage
let savedPlayer1 = JSON.parse(localStorage.getItem("player1"));
let savedPlayer2 = JSON.parse(localStorage.getItem("player2"));

if (!savedPlayer1)
  savedPlayer1 = { name: "Joueur 1", character: "assets/3PERSO-01.png" };
if (!savedPlayer2)
  savedPlayer2 = { name: "Joueur 2", character: "assets/3PERSO-02.png" };

//  Joueurs
const players = [
  {
    x: 100,
    y: 500,
    size: 90,
    keyMap: { up: "z", down: "x", left: "q", right: "d" },
    carried: null,
    score: new ScoreGame(),
    image: new Image(),
    label: savedPlayer1.name,
    carrying: null,
  },
  {
    x: 800,
    y: 500,
    size: 90,
    keyMap: {
      up: "arrowup",
      down: "arrowdown",
      left: "arrowleft",
      right: "arrowright",
    },
    carried: null,
    score: new ScoreGame(),
    image: new Image(),
    label: savedPlayer2.name,
    carrying: null,
  },
];

players[0].image.src = savedPlayer1.character;
players[1].image.src = savedPlayer2.character;

console.log(localStorage.getItem("player1"));
console.log(localStorage.getItem("player2"));

const background = new Image();
background.src = "/assets/plage_vide.png"

// Liste des images de déchets
const imagesDechets = {
  pile: new Image(),
  pomme: new Image(),
  pastèque: new Image(),
  sacRenverse: new Image(),
  sacAvecMouches: new Image(),
  bouteilleVerre: new Image(),
  bouteilleVerreCasse: new Image(),
  briqueJusEntiere: new Image(),
  briqueJusVide: new Image(),
  bidonPetrole: new Image(),
};

// On met les bons chemins d'images ici (à toi de les corriger selon ton dossier)
imagesDechets.pile.src = "/assets/DECHETS/pile.png";
imagesDechets.pomme.src = "/assets/DECHETS/pomme.png";
imagesDechets.pastèque.src = "/assets/DECHETS/pastèque.png";
imagesDechets.sacRenverse.src = "/assets/DECHETS/cannettes-01.png";
imagesDechets.sacAvecMouches.src = "/assets/DECHETS/sacs poubelles.png";
imagesDechets.bouteilleVerre.src = "/assets/DECHETS/bouteille en verre.png";
imagesDechets.bouteilleVerreCasse.src =
  "/assets/DECHETS/bouteille en verre cassée.png";
imagesDechets.briqueJusEntiere.src = "/assets/DECHETS/brique de jus pleine.png";
imagesDechets.briqueJusVide.src = "/assets/DECHETS/brique de jus usagé.png";
imagesDechets.bidonPetrole.src = "/assets/DECHETS/cannette petrole.png";

// poubelles
const bins = [
  { x: 200, y: 50, color: "#2196f3", type: "plastique" },
  { x: 450, y: 50, color: "#4caf50", type: "organique" },
  { x: 700, y: 50, color: "#00bcd4", type: "verre" },
  { x: 900, y: 50, color: "#9c27b0", type: "toxique" },
];
// Fonction utilitaire pour vérifier les collisions
function isOverlapping(x, y, size, items, margin = 10) {
  return items.some(
    (item) =>
      x < item.x + size + margin &&
      x + size + margin > item.x &&
      y < item.y + size + margin &&
      y + size + margin > item.y
  );
}

// Fonction pour générer des positions valides de déchets
function generateDechets(nb, size = 40) {
  const allDechets = [];
  const types = [
    { type: "toxique", image: imagesDechets.pile },
    { type: "organique", image: imagesDechets.pomme },
    { type: "organique", image: imagesDechets.pastèque },
    { type: "plastique", image: imagesDechets.sacRenverse },
    { type: "plastique", image: imagesDechets.sacAvecMouches },
    { type: "verre", image: imagesDechets.bouteilleVerre },
    { type: "verre", image: imagesDechets.bouteilleVerreCasse },
    { type: "plastique", image: imagesDechets.briqueJusEntiere },
    { type: "plastique", image: imagesDechets.briqueJusVide },
    { type: "toxique", image: imagesDechets.bidonPetrole },
  ];

  for (let i = 0; i < nb; i++) {
    let x,
      y,
      attempts = 0;
    let binSafe = false;
    do {
      x = Math.random() * (canvas.width - size);
      y = Math.random() * (canvas.height - size);
      const overlappingDechets = isOverlapping(x, y, size, allDechets);
      const overlappingBins = isOverlapping(x, y, 50, bins);
      binSafe = !overlappingDechets && !overlappingBins;
      attempts++;
    } while (!binSafe && attempts < 100);

    const d = types[i % types.length];
    allDechets.push({
      x,
      y,
      size,
      type: d.type,
      image: d.image,
      collected: false,
    });
  }
  return allDechets;
}

let dechets = generateDechets(10);

// imag de poubelles
const binImages = {
  plastique: new Image(),
  organique: new Image(),
  verre: new Image(),
  toxique: new Image(),
};

binImages.plastique.src = "/assets/Poubelle/poubelle-jaune.png";
binImages.organique.src = "/assets/Poubelle/poubelle-marron.png";
binImages.verre.src = "/assets/Poubelle/poubelle-verte.png";
binImages.toxique.src = "/assets/Poubelle/poubelle-rouge.png";

//  Variables générales
let gameDuration = 180; // 3 minutes = 180 secondes
let gameOver = false;
const keys = {};

document.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

//  Vagues et énigmes
const waves = Array.from({ length: 3 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * 200 + 350,
  width: 100,
  height: 20,
  speedX: Math.random() * 2 + 1,
}));

// const puzzles = [
//   {
//     question: "Dans quelle poubelle va une bouteille en verre ?",
//     answer: "verre",
//   },
//   { question: "Quel déchet est le plus dangereux ?", answer: "toxique" },
//   { question: "Lequel est biodégradable ?", answer: "organique" },
// ];
// let activePuzzle = null;
// let puzzleTimer = 0;


//  Boucle principale
function gameLoop() {
  if (gameOver) {
    showEndGameScreen();
    return;
  }
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function checkTrapCollision(player, index) {
    const now = Date.now() / 1000;
    if (now - lastTrapTime[index] < trapCooldown || player.paused) return;
  
    for (const trap of traps) {
      if (
        player.x < trap.x + trap.width &&
        player.x + player.width > trap.x &&
        player.y < trap.y + trap.height &&
        player.y + player.height > trap.y
      ) {
        lastTrapTime[index] = now;
        player.paused = true;
        puzzleTimer = 10;
  
        // showQCM(
        //   index,
        //   "Dans quelle poubelle va ce déchet ?",
        //   "plastique", // réponse correcte d’exemple
        //   (correct) => {
        //     if (correct) {
        //       player.score += 1;
        //       document.getElementById("goodSound").play();
        //     } else {
        //       player.score = Math.max(0, player.score - 1);
        //       document.getElementById("badSound").play();
        //     }
        //     player.paused = false;
        //   }
        // );
      }
    }
  }
  

function update() {
  

  players.forEach((p) => {
    // Déplacement
    if (keys[p.keyMap.up]) p.y -= 2.5;
    if (keys[p.keyMap.down]) p.y += 2.5;
    if (keys[p.keyMap.left]) p.x -= 2.5;
    if (keys[p.keyMap.right]) p.x += 2.5;

    // Empêche de sortir de l'écran
    p.x = Math.max(0, Math.min(canvas.width - p.size, p.x));
    p.y = Math.max(0, Math.min(canvas.height - p.size, p.y));

    // Ramassage de déchets
    if (!p.carrying) {
      dechets.forEach((d) => {
        if (!d.collected && isColliding(p, d)) {
          p.carrying = d;
          d.collected = true;
        }
      });
    }

    // Dépôt dans une poubelle
    if (p.carrying) {
      bins.forEach((bin) => {
        if (isColliding(p, bin)) {
          if (p.carrying.type === bin.type) {
            p.score.collectWaste(p.carrying.type);
            goodSound.play();
          } else {
            p.score.recycleError();
            badSound.play();
          }
          p.carrying = null;
        }
      });
    }

    // Vagues (pièges)
    waves.forEach((w) => {
      if (isColliding(p, w)) {
        p.x -= w.speedX * 2;
      }
    });
  });

  // Chrono
  if (gameDuration > 0) {
    gameDuration -= 1 / 60;
  } else {
    gameOver = true;
    victorySound.play();
  }

  // Énigmes
//   if (Math.random() < 0.001 && !activePuzzle && gameDuration > 10) {
//     const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
//     const randomPlayer = Math.floor(Math.random() * players.length);
//     activePuzzle = puzzle;
  
    // showQCM(randomPlayer, puzzle.question, puzzle.answer, function(correct) {
    //   if (correct) {
    //     players[randomPlayer].score.solvePuzzle(2);
    //     goodSound.play();
    //   } else {
    //     players[randomPlayer].score.recycleError();
    //     badSound.play();
    //   }
    //   activePuzzle = null;
    // });
//   }
  

  // Réapparition des déchets si presque tous sont ramassés
  const remainingDechets = dechets.filter((d) => !d.collected);
  if (remainingDechets.length <= 2) {
    const newDechets = generateDechets(5);
    dechets = dechets.concat(newDechets);
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + 50 && a.x + a.size > b.x && a.y < b.y + 50 && a.y + a.size > b.y
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(background,0 ,0, canvas.width, canvas.height);
  
  bins.forEach((bin) => {
    const img = binImages[bin.type];
    if (img && img.complete) {
      ctx.drawImage(img, bin.x, bin.y, 80, 80);
    } else {
      ctx.fillStyle = bin.color;
      ctx.fillRect(bin.x, bin.y, 50, 50);
    }
  });
  players.forEach(player => {
    ctx.drawImage(player.image, player.x, player.y, player.size, player.size);
    if (player.carrying) {
        // Dessiner l'image du déchet porté
        ctx.drawImage(
            player.carrying.image,
            player.x + player.size / 4,  // Centré horizontalement
            player.y - 10,               // Au-dessus du joueur
            30, 30
        );
    }
});


  // trashes.forEach(t => {
  //     if (!t.collected) {
  //         ctx.fillStyle = 'brown';
  //         ctx.beginPath();
  //         ctx.arc(t.x, t.y, 10, 0, Math.PI * 2);
  //         ctx.fill();
  //     }
  // });
  // afficher les images des déchets (nouveaux)
  // Dessiner uniquement les déchets non collectés (et donc visibles au sol)
  dechets.forEach((d) => {
    if (!d.collected && d.image.complete) {
      // Dessiner seulement s'ils ne sont pas ramassés
      ctx.drawImage(d.image, d.x, d.y, d.size, d.size);
    }
  });

  // timer en min et s
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px 'Press Start 2P'";

  const minutes = Math.floor(gameDuration / 60);
  const seconds = Math.floor(gameDuration % 60)
    .toString()
    .padStart(2, "0");
  ctx.fillText(`Temps: ${minutes}:${seconds}`, 800, 30);

  // score des joueur afficher
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    `👤 ${players[0].label} : ${players[0].score.score} pts`,
    20,
    30
  );
  ctx.fillText(
    `👥 ${players[1].label} : ${players[1].score.score} pts`,
    20,
    55
  );

  waves.forEach((w) => {
    ctx.fillStyle = "#81d4fa";
    ctx.fillRect(w.x, w.y, w.width, w.height);
  });


}


function showEndGameScreen() {

  showNextButton = true;
  localStorage.setItem("score1", players[0].score.calculateFinalScore());
  localStorage.setItem("score2", players[1].score.calculateFinalScore());
  window.location.href = "end.html";


  requestAnimationFrame(showEndGameScreen);
}


// Lancer le jeu quand les deux images sont chargées
let loadedImages = 0;
players.forEach((p) => {
  p.image.onload = () => {
    loadedImages++;
    if (loadedImages === players.length) requestAnimationFrame(gameLoop);
  };
});

// Boutons
function restartGame() {
  location.reload(); // Recharge la page
}

function goToMenu() {
  window.location.href = "index.html"; // retour vers le menu principal
}


gameLoop();
