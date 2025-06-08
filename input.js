// js/game/utils/input.js

const keys = {}; // Stocke l'état des touches (pressé/relâché)
const pressedThisFrame = {}; // Touches pressées spécifiquement à la frame actuelle
const releasedThisFrame = {}; // Touches relâchées spécifiquement à la frame actuelle

// Listener pour la pression des touches
window.addEventListener('keydown', (e) => {
    if (!keys[e.code]) { // Si la touche n'était pas déjà pressée
        keys[e.code] = true;
        pressedThisFrame[e.code] = true;
    }
});

// Listener pour le relâchement des touches
window.addEventListener('keyup', (e) => {
    if (keys[e.code]) { // Si la touche était pressée
        keys[e.code] = false;
        releasedThisFrame[e.code] = true;
    }
});

/**
 * Réinitialise les états de pressedThisFrame et releasedThisFrame pour la nouvelle frame.
 * Doit être appelé au début de chaque boucle de jeu (update).
 */
export function resetInputForNewFrame() {
    for (const key in pressedThisFrame) {
        delete pressedThisFrame[key];
    }
    for (const key in releasedThisFrame) {
        delete releasedThisFrame[key];
    }
}

/**
 * Vérifie si une touche est actuellement pressée.
 * @param {string} keyCode - Le code de la touche (ex: 'KeyA', 'ArrowLeft').
 * @returns {boolean} True si la touche est pressée, sinon false.
 */
export function isKeyPressed(keyCode) {
    return keys[keyCode] || false;
}

/**
 * Vérifie si une touche a été pressée au début de la frame actuelle (événement unique).
 * @param {string} keyCode - Le code de la touche.
 * @returns {boolean} True si la touche a été pressée cette frame, sinon false.
 */
export function wasKeyJustPressed(keyCode) {
    return pressedThisFrame[keyCode] || false;
}

/**
 * Vérifie si une touche a été relâchée au début de la frame actuelle (événement unique).
 * @param {string} keyCode - Le code de la touche.
 * @returns {boolean} True si la touche a été relâchée cette frame, sinon false.
 */
export function wasKeyJustReleased(keyCode) {
    return releasedThisFrame[keyCode] || false;
}