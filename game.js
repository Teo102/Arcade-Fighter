// js/game/game.js

import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, FIGHTER_STATE } from './config.js';
import { Player } from './Player.js';
import { Hud } from './Hud.js';
import { loadAllAssets, getAsset } from './assets.js';
import { resetInputForNewFrame } from './input.js';
import { checkCollision } from './collision.js';
import { FIGHTERS_DATA } from './fightersdata.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajuste la taille du canvas pour correspondre aux dimensions du jeu
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

let player1;
let player2;
let hud;
let lastTime = 0;
let gameTimer = 99; // Compteur de temps pour le round
let roundActive = false; // Indique si le round est en cours
let gameEnded = false; // Indique si le jeu est terminé (KO)

/**
 * Initialise le jeu : charge les assets, crée les personnages et le HUD.
 */
async function startGame() {
    console.log("Starting game...");
    await loadAllAssets(); // Attente du chargement des assets

    const background = getAsset('backgroundDojo');
    if (background) {
        // Redimensionner le canvas pour correspondre au background si nécessaire, ou s'assurer que le background correspond au canvas
        console.log("Background loaded, dimensions:", background.width, background.height);
    } else {
        console.warn("Background image not loaded, using fallback color.");
    }

    // Création des joueurs
    // Utilisez les IDs de fightersData.js pour choisir les personnages
    player1 = new Player('ken', 200, GROUND_Y, true);
    player2 = new Player('ryu', GAME_WIDTH - 200, GROUND_Y, false); // Adjusted initial X for player 2

    hud = new Hud();

    // Démarrer le premier round
    startRound();

    // Lancer la boucle de jeu
    requestAnimationFrame(gameLoop);
}

/**
 * Gère le début d'un nouveau round.
 */
function startRound() {
    gameEnded = false;
    roundActive = true;
    gameTimer = 99; // Réinitialise le timer
    player1.health = player1.maxHealth; // Réinitialise la vie
    player2.health = player2.maxHealth;
    player1.x = 200; // Réinitialise la position
    player2.x = GAME_WIDTH - 200;
    player1.y = GROUND_Y - player1.height;
    player2.y = GROUND_Y - player2.height;
    player1.velocityY = 0; player1.velocityX = 0;
    player2.velocityY = 0; player2.velocityX = 0;
    player1.state = FIGHTER_STATE.IDLE; // Réinitialise l'état
    player2.state = FIGHTER_STATE.IDLE;
    player1.isAttacking = false; player1.attackCooldownTimer = 0;
    player2.isAttacking = false; player2.attackCooldownTimer = 0;


    hud.showMessage("ROUND 1! FIGHT!", 2000); // Affiche le message de début de round
    console.log("Round started!");
}

/**
 * La boucle de jeu principale.
 * @param {number} currentTime - Le temps actuel (fourni par requestAnimationFrame).
 */
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime; // Temps écoulé depuis la dernière frame en ms
    lastTime = currentTime;

    resetInputForNewFrame(); // Réinitialise les inputs 'just pressed' pour cette frame

    if (roundActive && !gameEnded) {
        update(deltaTime);
        draw();
    } else if (gameEnded) {
        draw(); // On continue de dessiner la dernière frame après la fin du jeu
        // Afficher l'écran de victoire/défaite
    }

    requestAnimationFrame(gameLoop); // Rappeler la boucle pour la prochaine frame
}

/**
 * Met à jour l'état du jeu (logique de jeu, mouvements, collisions).
 * @param {number} deltaTimeMs - Le temps écoulé depuis la dernière mise à jour en millisecondes.
 */
function update(deltaTimeMs) {
    // Mettre à jour les joueurs
    player1.update(deltaTimeMs, player2);
    player2.update(deltaTimeMs, player1);

    // Vérifier les collisions d'attaque
    // On ne frappe qu'une fois par attaque
    if (player1.isAttacking && player1.currentAttackHitbox && !player1.hitThisAttack) {
        if (checkCollision(player1.currentAttackHitbox, player2.hurtbox)) {
            player2.takeDamage(player1.currentAttackHitbox.damage);
            player1.hitThisAttack = true; // Empêche de frapper à nouveau
            console.log("Player 1 hits Player 2!");
            // TODO: Ajouter effets sonores, particules d'impact
        }
    }
    if (player2.isAttacking && player2.currentAttackHitbox && !player2.hitThisAttack) {
        if (checkCollision(player2.currentAttackHitbox, player1.hurtbox)) {
            player1.takeDamage(player2.currentAttackHitbox.damage);
            player2.hitThisAttack = true; // Empêche de frapper à nouveau
            console.log("Player 2 hits Player 1!");
            // TODO: Ajouter effets sonores, particules d'impact
        }
    }

    // Gestion du timer
    gameTimer -= deltaTimeMs / 1000; // Décrémente le timer en secondes
    if (gameTimer <= 0) {
        gameTimer = 0;
        roundActive = false; // Arrête le round
        determineWinnerByTime();
    }

    // Mettre à jour le HUD
    hud.updateHealthBars(player1.health, player1.maxHealth, player2.health, player2.maxHealth);
    hud.updateTimer(gameTimer);

    // Vérifier les conditions de fin de round (KO)
    if (player1.health <= 0 || player2.health <= 0) {
        roundActive = false;
        gameEnded = true;
        handleRoundEnd();
    }
}

/**
 * Détermine le gagnant si le temps est écoulé.
 */
function determineWinnerByTime() {
    if (player1.health > player2.health) {
        hud.showMessage("Player 1 Wins by Time!", 3000);
    } else if (player2.health > player1.health) {
        hud.showMessage("Player 2 Wins by Time!", 3000);
    } else {
        hud.showMessage("DRAW!", 3000); // Égalité si même vie restante
    }
    setTimeout(startRound, 4000); // Redémarre un round après un délai
}

/**
 * Gère la fin du round (KO).
 */
function handleRoundEnd() {
    if (player1.health <= 0) {
        hud.showMessage("K.O.! Player 2 Wins!", 3000);
        player1.state = FIGHTER_STATE.KO; // Force l'état KO
        player1.animator.setAnimation(FIGHTER_STATE.KO);
        console.log("Player 2 Wins!");
    } else if (player2.health <= 0) {
        hud.showMessage("K.O.! Player 1 Wins!", 3000);
        player2.state = FIGHTER_STATE.KO;
        player2.animator.setAnimation(FIGHTER_STATE.KO);
        console.log("Player 1 Wins!");
    }
    // TODO: Ajouter la logique pour les rounds gagnés (win count)
    setTimeout(startRound, 4000); // Redémarre un round après un délai
}

/**
 * Dessine tous les éléments du jeu sur le canvas.
 */
function draw() {
    // Effacer le canvas à chaque frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner l'arrière-plan
    const background = getAsset('backgroundDojo');
    if (background) {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    } else {
        // Fallback si l'image ne charge pas
        ctx.fillStyle = 'darkgreen';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Dessiner le sol (pour la démo, si non intégré au background)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Semi-transparent pour voir le background
    ctx.fillRect(0, GROUND_Y, canvas.width, GAME_HEIGHT - GROUND_Y);

    // Dessiner les joueurs
    player1.draw(ctx);
    player2.draw(ctx);
}

// Lancer le jeu au chargement de la page
window.onload = startGame;