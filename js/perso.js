let currentPlayer = 1;
let selectedCharacter = null;
let playerPseudo = "";
const players = {
  1: { name: "", character: null },
  2: { name: "", character: null }
};

// choisir le premier perso
function showCharacterSelection() {
  currentPlayer = 1;
  selectedCharacter = null;
  playerPseudo = "";
  document.getElementById("selection-title").innerText = "Eco Warior 1 : choisis ton personnage";
  document.getElementById("playerName").value = "";
  document.getElementById("startGameBtn").classList.add("hidden");
  document.querySelector("button[onclick='nextPlayer()']").classList.remove("hidden");
  clearCardBorders();
  document.getElementById("character-selection").classList.remove("hidden");
}

function selectCharacter(num) {
  selectedCharacter = num;
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.style.border = index + 1 === num ? "4px solid gold" : "4px solid transparent";
  });
}

// pour le perso suivant
function nextPlayer() {
  const nameInput = document.getElementById("playerName");
  playerPseudo = nameInput.value.trim();

  if (!playerPseudo || !selectedCharacter) {
    alert("Merci d'entrer un pseudo et de choisir un personnage.");
    return;
  }

  players[currentPlayer].name = playerPseudo;
  players[currentPlayer].character = `assets/3PERSO-0${selectedCharacter}.png`;

  if (currentPlayer === 1) {
    currentPlayer = 2;
    selectedCharacter = null;
    document.getElementById("selection-title").innerText = "Eco Warior 2 : choisis ton personnage";
    document.getElementById("playerName").value = "";
    document.getElementById("nextBtn").classList.remove("hidden");
    clearCardBorders();
  } else {
    document.getElementById("startGameBtn").classList.remove("hidden");
    document.querySelector("button[onclick='nextPlayer()']").classList.add("hidden");
  }
}

// pour charger le jeu 
function startGame() {
  const nameInput = document.getElementById("playerName");
  playerPseudo = nameInput.value.trim();

  if (!playerPseudo || !selectedCharacter) {
    alert("Merci d'entrer un pseudo et de choisir un personnage.");
    return;
  }

  players[2].name = playerPseudo;
  players[2].character = `assets/3PERSO-0${selectedCharacter}.png`;

  localStorage.setItem("player1", JSON.stringify(players[1]));
  localStorage.setItem("player2", JSON.stringify(players[2]));
  window.location.href = "TEST.html";
}

// fonction pour le btn retour
function backStep() {
  if (currentPlayer === 2) {
    // Retour à joueur 1
    currentPlayer = 1;
    selectedCharacter = parseInt(players[1].character.match(/3PERSO-0(\d)\.png/)[1]);
    document.getElementById("selection-title").innerText = "Eco Warior 1 : choisis ton personnage";
    document.getElementById("playerName").value = players[1].name;
    document.getElementById("startGameBtn").classList.add("hidden");
    document.querySelector("button[onclick='nextPlayer()']").classList.remove("hidden");
  } else {
    // Retour au menu principal
    backToMenu();
  }
  highlightSelectedCard();
}

// retourner au menu
function backToMenu() {
  document.getElementById("character-selection").classList.add("hidden");
  clearCardBorders();
}

function clearCardBorders() {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.style.border = "4px solid transparent";
  });
}

function highlightSelectedCard() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.style.border = index + 1 === selectedCharacter ? "4px solid gold" : "4px solid transparent";
  });
}
