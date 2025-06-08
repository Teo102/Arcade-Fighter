// js/game/entities/Character.js
import { SpriteAnimator } from '../utils/animation.js';
import { GRAVITY, MAX_HEALTH } from '../config.js';

/**
 * Classe de base pour tous les personnages du jeu.
 */
export class Character {
    constructor(x, y, width, height, image, spriteConfig, isPlayer1 = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isOnGround = false;
        this.health = MAX_HEALTH;
        this.maxHealth = MAX_HEALTH;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.currentAnimation = 'idle';
        this.animator = new SpriteAnimator(image, spriteConfig);
        this.isPlayer1 = isPlayer1; // Pour déterminer l'orientation initiale et le HUD
        this.animator.facingRight = isPlayer1; // Player 1 starts facing right, Player 2 facing left
        this.attackHitbox = { x: 0, y: 0, width: 0, height: 0 }; // Hitbox de l'attaque
        this.hurtbox = { x: this.x, y: this.y, width: this.width, height: this.height }; // Hurtbox du personnage (son corps)
    }

    /**
     * Met à jour la physique et l'état du personnage.
     * @param {number} deltaTime - Le temps écoulé depuis la dernière mise à jour.
     * @param {Character} opponent - Le personnage adverse.
     */
    update(deltaTime, opponent) {
        // Appliquer la gravité
        this.velocityY += GRAVITY;
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Gestion du sol
        if (this.y + this.height >= 500) { // Hypothèse: le sol est à Y=500, à ajuster
            this.y = 500 - this.height;
            this.velocityY = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }

        // Mettre à jour l'animation
        this.animator.update(deltaTime);

        // Déterminer la direction du personnage
        if (opponent) {
            this.animator.facingRight = (this.x < opponent.x);
        }

        // Mettre à jour la position de la hurtbox
        this.hurtbox.x = this.x;
        this.hurtbox.y = this.y;
        this.hurtbox.width = this.width;
        this.hurtbox.height = this.height;

        // Gérer le cooldown des attaques
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
            if (this.attackCooldown <= 0) {
                this.attackCooldown = 0;
                this.isAttacking = false;
                this.animator.setAnimation('idle'); // Revenir à idle après l'attaque
            }
        }
    }

    /**
     * Dessine le personnage sur le canvas.
     * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu du canvas.
     */
    draw(ctx) {
        // Dessine le sprite animé
        this.animator.draw(ctx, this.x, this.y, this.width, this.height);

        // DEBUG: Dessiner la hurtbox (en bleu)
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.hurtbox.x, this.hurtbox.y, this.hurtbox.width, this.hurtbox.height);

        // DEBUG: Dessiner la hitbox d'attaque (en rouge) si une attaque est active
        if (this.isAttacking && this.attackHitbox.width > 0) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.attackHitbox.x, this.attackHitbox.y, this.attackHitbox.width, this.attackHitbox.height);
        }
    }

    /**
     * Fait sauter le personnage.
     */
    jump() {
        if (this.isOnGround) {
            this.velocityY = PLAYER_JUMP_VELOCITY;
            this.isOnGround = false;
            this.animator.setAnimation('jump');
        }
    }

    /**
     * Gère les mouvements latéraux.
     * @param {number} direction - -1 pour gauche, 1 pour droite.
     */
    move(direction) {
        this.velocityX = direction * this.speed;
        this.animator.setAnimation('run');
    }

    /**
     * Arrête le mouvement horizontal.
     */
    stopMoving() {
        this.velocityX = 0;
        if (this.isOnGround && !this.isAttacking) {
            this.animator.setAnimation('idle');
        }
    }

    /**
     * Déclenche une attaque.
     * @param {string} attackType - 'light', 'medium', 'heavy'.
     */
    attack(attackType) {
        if (!this.isAttacking && this.attackCooldown <= 0) {
            this.isAttacking = true;
            this.attackCooldown = ATTACK_COOLDOWN; // Durée de l'attaque et du cooldown
            this.animator.setAnimation(`attack${attackType.charAt(0).toUpperCase() + attackType.slice(1)}`);

            // Définir la hitbox de l'attaque (simplifié pour la démo)
            // Ces valeurs doivent être ajustées en fonction de l'animation et de la direction
            const attackWidth = 80;
            const attackHeight = 30;
            if (this.animator.facingRight) {
                this.attackHitbox = {
                    x: this.x + this.width,
                    y: this.y + this.height / 2 - attackHeight / 2,
                    width: attackWidth,
                    height: attackHeight
                };
            } else {
                this.attackHitbox = {
                    x: this.x - attackWidth,
                    y: this.y + this.height / 2 - attackHeight / 2,
                    width: attackWidth,
                    height: attackHeight
                };
            }
        }
    }

    /**
     * Réinitialise la hitbox d'attaque.
     */
    resetAttackHitbox() {
        this.attackHitbox = { x: 0, y: 0, width: 0, height: 0 };
    }

    /**
     * Subit des dégâts.
     * @param {number} amount - La quantité de dégâts.
     */
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        console.log(`${this.isPlayer1 ? 'Player 1' : 'Player 2'} Health: ${this.health}`);
    }
}