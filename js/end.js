
        // Données des joueurs
        const player1 = JSON.parse(localStorage.getItem('player1')) || { name: 'Joueur 1' };
        const player2 = JSON.parse(localStorage.getItem('player2')) || { name: 'Joueur 2' };
        const score1 = parseInt(localStorage.getItem('score1') || '0');
        const score2 = parseInt(localStorage.getItem('score2') || '0');

        const canvas = document.getElementById('endCanvas');
        const ctx = canvas.getContext('2d');

        const winnerSound = new Audio("/assets/audio/tunetank.com_puff-of-magic-treasure-chest-(light).wav");
        canvas.addEventListener("click", () => {
            winnerSound.play();
        });

        // Chargement des images des boutons
        const homeImg = new Image();
        homeImg.src = "/assets/bouton-fleche.png";

        const replayImg = new Image();
        replayImg.src = "/assets/bouton-fleche.png";

        const nextImg = new Image();
        nextImg.src = "/assets/bouton-fleche.png";

        // Positions et actions des boutons
        const buttons = [
            { text: 'Menu', img: homeImg, x: 100, y: 395, width: 200, height: 90, action: goToMenu },
            { text: 'Recommencer', img: replayImg, x: 350, y: 395, width: 300, height: 90, action: restartGame },
            { text: 'Suivant', img: nextImg, x: 700, y: 395, width: 200, height: 90, action: goToNext },
        ];



        // Chargement image de fond
        const backImg = new Image();
        backImg.src = "/assets/plage_vide.png";
        backImg.onload = () => {
            ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);

            // Affichage du gagnant
            const winnerText = score1 > score2 ? `🏆 VAINQUEUR : ${player1.name}` :
                score2 > score1 ? `🏆 VAINQUEUR : ${player2.name}` :
                    "🤝 ÉGALITÉ PARFAITE !";

            ctx.fillStyle = "black";
            ctx.font = "bold 28px 'Press Start 2P'";
            ctx.textAlign = "center";
            ctx.fillText(winnerText, canvas.width / 2, 60);

            // FOND score joueur 1
            ctx.fillStyle = "rgba(144,202,249,0.9)"; // bleu clair
            ctx.fillRect(50, 100, 420, 200);

            // FOND score joueur 2
            ctx.fillStyle = "rgba(239,154,154,0.9)"; // rouge clair
            ctx.fillRect(540, 100, 420, 200);

            // Scores texte
            ctx.fillStyle = "black";
            ctx.font = "16px 'Press Start 2P'";
            ctx.textAlign = "left";

            // Player 1
            ctx.fillText(`${player1.name}`, 60, 130);
            ctx.fillText(`Déchets ramassés: xx`, 60, 160);
            ctx.fillText(`Déchets mal triés: xx`, 60, 190);
            ctx.fillText(`Énigmes résolues: xx`, 60, 220);
            ctx.fillText(`Énigmes non résolues: xx`, 60, 250);
            ctx.fillText(`Total de points: ${score1}`, 60, 280);

            // Player 2
            ctx.fillText(`${player2.name}`, 560, 130);
            ctx.fillText(`Déchets ramassés: xx`, 560, 160);
            ctx.fillText(`Déchets mal triés: xx`, 560, 190);
            ctx.fillText(`Énigmes résolues: xx`, 560, 220);
            ctx.fillText(`Énigmes non résolues: xx`, 560, 250);
            ctx.fillText(`Total de points: ${score2}`, 560, 280);

            // Dessin des boutons avec images
            buttons.forEach(btn => {
                ctx.drawImage(btn.img, btn.x, btn.y, btn.width, btn.height);

            });


            buttons.forEach(btn => {
                ctx.font = "16px 'Press Start 2P'";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle"; // ✅ centrage vertical
                ctx.fillText(
                    btn.text,
                    btn.x + btn.width / 2,     // centre horizontal
                    btn.y + btn.height / 2     // centre vertical
                );
            });

        };

        // Gérer clics sur le canvas
        canvas.addEventListener("click", (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            buttons.forEach(btn => {
                if (
                    x >= btn.x && x <= btn.x + btn.width &&
                    y >= btn.y && y <= btn.y + btn.height
                ) {
                    btn.action();
                }
            });
        });

        // Fonctions de navigation
        function restartGame() {
            window.location.href = "TEST.html";
        }
        function goToMenu() {
            window.location.href = "index.html";
        }
        function goToNext() {
            alert("Prochain niveau en préparation !");
        }