// js/game/game.js
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SPRITE_CONFIG } from './config.js';
import { Player } from './Player.js';
import { Hud } from './Hud.js';
import { loadAllAssets, getAsset } from './assets.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

let player1;
let player2;
let hud;
let lastTime = 0;

/**
 * Démarre le jeu : charge les assets et initialise les entités.
 */
async function startGame() {
    await loadAllAssets(); // Attend que tous les assets soient chargés

    const player1Image = getAsset('player1Spritesheet');
    const player2Image = getAsset('player2Spritesheet');
    const backgroundImage = getAsset('backgroundStage1');

    // Initialisation des joueurs
    player1 = new Player(200, 500 - PLAYER_SPRITE_CONFIG.frameHeight, PLAYER_SPRITE_CONFIG.frameWidth, PLAYER_SPRITE_CONFIG.frameHeight, player1Image, PLAYER_SPRITE_CONFIG, true);
    player2 = new Player(GAME_WIDTH - 200 - PLAYER_SPRITE_CONFIG.frameWidth, 500 - PLAYER_SPRITE_CONFIG.frameHeight, PLAYER_SPRITE_CONFIG.frameWidth, PLAYER_SPRITE_CONFIG.frameHeight, player2Image, PLAYER_SPRITE_CONFIG, false);

    hud = new Hud();

    // Démarrer la boucle de jeu
    requestAnimationFrame(gameLoop);
}

/**
 * La boucle de jeu principale.
 * @param {number} currentTime - Le temps actuel (fourni par requestAnimationFrame).
 */
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    update(deltaTime / 1000); // Convertir deltaTime en secondes pour la physique
    draw();

    requestAnimationFrame(gameLoop); // Rappeler la boucle pour la prochaine frame
}

/**
 * Met à jour l'état du jeu (logique de jeu, mouvements, collisions).
 * @param {number} dt - Le temps écoulé depuis la dernière mise à jour en secondes.
 */
function update(dt) {
    // Mettre à jour les joueurs
    player1.update(dt * 1000, player2); // Convertir dt en ms pour l'animation
    player2.update(dt * 1000, player1);

    // Vérifier les collisions entre les hitboxes d'attaque et les hurtboxes
    checkAttackCollisions(player1, player2);
    checkAttackCollisions(player2, player1);

    // Mettre à jour le HUD
    hud.updateHealthBars(player1.health, player1.maxHealth, player2.health, player2.maxHealth);
    // hud.updateEnergyBars(player1.energy, player1.maxEnergy, player2.energy, player2.maxEnergy); // À décommenter plus tard
    // hud.updateTimer(gameTimer); // À décommenter plus tard
}

/**
 * Vérifie si une attaque touche sa cible.
 * @param {Character} attacker - L'attaquant.
 * @param {Character} target - La cible.
 */
function checkAttackCollisions(attacker, target) {
    if (attacker.isAttacking && attacker.attackHitbox.width > 0) {
        // Vérification de collision rectangulaire simple
        if (attacker.attackHitbox.x < target.hurtbox.x + target.hurtbox.width &&
            attacker.attackHitbox.x + attacker.attackHitbox.width > target.hurtbox.x &&
            attacker.attackHitbox.y < target.hurtbox.y + target.hurtbox.height &&
            attacker.attackHitbox.y + attacker.attackHitbox.height > target.hurtbox.y) {
            
            console.log(`${attacker.isPlayer1 ? 'Player 1' : 'Player 2'} hit ${target.isPlayer1 ? 'Player 1' : 'Player 2'}!`);
            target.takeDamage(10); // Exemple de dégâts
            attacker.isAttacking = false; // L'attaque ne frappe qu'une fois
            attacker.resetAttackHitbox(); // Réinitialise la hitbox après un hit
        }
    }
}


/**
 * Dessine tous les éléments du jeu sur le canvas.
 */
function draw() {
    // Effacer le canvas à chaque frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner l'arrière-plan
    const backgroundImage = getAsset('backgroundStage1');
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'lightblue'; // Couleur de secours si l'image ne charge pas
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Dessiner le sol (pour la démo)
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 500, canvas.width, GAME_HEIGHT - 500);

    // Dessiner les joueurs
    player1.draw(ctx);
    player2.draw(ctx);
}

// Lancer le jeu au chargement de la page
window.onload = startGame;