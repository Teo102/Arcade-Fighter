// js/game/utils/collision.js

/**
 * Vérifie la collision entre deux rectangles (AABB - Axis-Aligned Bounding Box).
 * @param {object} rect1 - Le premier rectangle {x, y, width, height}.
 * @param {object} rect2 - Le second rectangle {x, y, width, height}.
 * @returns {boolean} True si les rectangles se chevauchent, sinon false.
 */
export function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}