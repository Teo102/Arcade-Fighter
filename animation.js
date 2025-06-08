// js/game/utils/animation.js

/**
 * Gère l'animation d'un personnage à partir d'une spritesheet.
 */
export class SpriteAnimator {
    constructor(image, config) {
        this.image = image;
        this.config = config; // Ex: { frameWidth, frameHeight, animations: { idle: { row, frames, speed, loop } } }
        this.currentAnimation = 'idle';
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.facingRight = true; // Pour le flip horizontal
    }

    /**
     * Change l'animation courante.
     * @param {string} newAnimation - Le nom de la nouvelle animation (ex: 'run', 'attackLight').
     */
    setAnimation(newAnimation) {
        if (this.currentAnimation !== newAnimation) {
            this.currentAnimation = newAnimation;
            this.currentFrame = 0; // Réinitialise la frame lors d'un changement d'animation
            this.frameTimer = 0;
        }
    }

    /**
     * Met à jour l'état de l'animation.
     * @param {number} deltaTime - Le temps écoulé depuis la dernière mise à jour.
     */
    update(deltaTime) {
        const anim = this.config.animations[this.currentAnimation];
        if (!anim) return; // Si l'animation n'existe pas

        this.frameTimer += deltaTime;

        // Passe à la frame suivante si le temps est écoulé
        if (this.frameTimer >= anim.speed) {
            this.currentFrame++;
            this.frameTimer = 0;

            // Si l'animation n'est pas censée boucler et que c'est la dernière frame
            if (!anim.loop && this.currentFrame >= anim.frames) {
                this.currentFrame = anim.frames - 1; // Reste sur la dernière frame
                // Optionnel : un callback pour signaler la fin de l'animation
            } else {
                // Boucle l'animation
                this.currentFrame = this.currentFrame % anim.frames;
            }
        }
    }

    /**
     * Dessine la frame courante de l'animation sur le canvas.
     * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu du canvas.
     * @param {number} x - La position X sur le canvas.
     * @param {number} y - La position Y sur le canvas.
     * @param {number} width - La largeur du sprite dessiné.
     * @param {number} height - La hauteur du sprite dessiné.
     */
    draw(ctx, x, y, width, height) {
        const anim = this.config.animations[this.currentAnimation];
        if (!anim) return;

        const sx = this.currentFrame * this.config.frameWidth; // Source X
        const sy = anim.row * this.config.frameHeight;         // Source Y

        ctx.save(); // Sauvegarde l'état du contexte pour la transformation

        if (!this.facingRight) {
            ctx.translate(x + width / 2, y + height / 2); // Origine de la rotation au centre du sprite
            ctx.scale(-1, 1); // Flip horizontal
            ctx.drawImage(this.image, sx, sy, this.config.frameWidth, this.config.frameHeight, -width / 2, -height / 2, width, height);
        } else {
            ctx.drawImage(this.image, sx, sy, this.config.frameWidth, this.config.frameHeight, x, y, width, height);
        }

        ctx.restore(); // Restaure l'état précédent du contexte
    }
}