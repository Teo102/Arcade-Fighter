// js/game/entities/Fighter.js

import { GRAVITY, GROUND_Y, FIGHTER_STATE, MAX_HEALTH, SPRITE_SCALE } from '../config.js';
import { getAsset } from '../assets.js';
import { FIGHTERS_DATA } from '../data/fightersData.js'; // Importer les données des combattants

/**
 * Gère l'animation d'un combattant à partir de ses images individuelles.
 */
class Animator {
    constructor(fighterId) {
        this.data = FIGHTERS_DATA[fighterId]; // Accéder aux données du combattant
        if (!this.data) {
            console.error(`Fighter data for ${fighterId} not found in Animator!`);
            return;
        }
        this.currentAnimation = FIGHTER_STATE.IDLE;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.facingRight = true;
        this.animationFinished = false;
        
        // Stocker les images chargées pour un accès rapide
        this.loadedAnimationFrames = {};
        for (const animName in this.data.animations) {
            this.loadedAnimationFrames[animName] = this.data.animations[animName].frames.map(path => getAsset(path));
        }
    }

    /**
     * Change l'animation courante si elle est différente de la précédente.
     * @param {string} newAnimationState - La nouvelle animation (ex: 'run', 'attackLight').
     */
    setAnimation(newAnimationState) {
        if (this.currentAnimation !== newAnimationState) {
            this.currentAnimation = newAnimationState;
            this.currentFrame = 0; // Réinitialise la frame au changement d'animation
            this.frameTimer = 0;
            this.animationFinished = false; // Réinitialise l'état de fin d'animation
        }
    }

    /**
     * Met à jour l'état de l'animation.
     * @param {number} deltaTimeMs - Le temps écoulé depuis la dernière mise à jour en millisecondes.
     */
    update(deltaTimeMs) {
        const anim = this.data.animations[this.currentAnimation];
        if (!anim || anim.frames.length === 0) return; // S'assurer qu'il y a des frames

        this.frameTimer += deltaTimeMs;

        if (this.frameTimer >= anim.speed) {
            this.currentFrame++;
            this.frameTimer = 0;

            if (!anim.loop && this.currentFrame >= anim.frames.length) {
                // Si l'animation ne boucle pas et est terminée, reste sur la dernière frame
                this.currentFrame = anim.frames.length - 1;
                this.animationFinished = true;
            } else {
                // Boucle l'animation
                this.currentFrame = this.currentFrame % anim.frames.length;
            }
        }
    }

    /**
     * Dessine la frame courante de l'animation sur le canvas.
     * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu du canvas.
     * @param {number} x - La position X du personnage.
     * @param {number} y - La position Y du personnage.
     * @param {number} width - La largeur de rendu du personnage.
     * @param {number} height - La hauteur de rendu du personnage.
     */
    draw(ctx, x, y, width, height) {
        const currentAnimFrames = this.loadedAnimationFrames[this.currentAnimation];
        if (!currentAnimFrames || currentAnimFrames.length === 0) return;

        const currentImage = currentAnimFrames[this.currentFrame];
        if (!currentImage) {
            console.warn(`Image for animation ${this.currentAnimation}, frame ${this.currentFrame} not found.`);
            return;
        }

        ctx.save(); // Sauvegarde l'état du contexte pour la transformation

        // Si le personnage est tourné vers la gauche, on flip horizontalement
        if (!this.facingRight) {
            ctx.translate(x + width, y); // Déplace l'origine vers le coin supérieur droit du sprite
            ctx.scale(-1, 1); // Applique le flip horizontal
            ctx.drawImage(currentImage, 0, 0, currentImage.width, currentImage.height, 0, 0, width, height); // Dessine à partir de l'origine flipée
        } else {
            ctx.drawImage(currentImage, 0, 0, currentImage.width, currentImage.height, x, y, width, height);
        }

        ctx.restore(); // Restaure l'état précédent du contexte
    }
}

/**
 * Classe de base pour tous les combattants.
 */
export class Fighter {
    constructor(fighterId, x, y, isPlayer1 = true) {
        this.id = fighterId;
        this.data = FIGHTERS_DATA[fighterId];
        if (!this.data) {
            console.error(`Fighter data for ${fighterId} not found!`);
            return;
        }

        // Les dimensions sont maintenant basées sur la première frame de l'animation idle
        // Assurez-vous que toutes vos frames ont la même taille pour un rendu cohérent
        const idleFrameImage = getAsset(this.data.animations.idle.frames[0]);
        this.originalWidth = idleFrameImage ? idleFrameImage.width : 100; // Fallback si non chargé
        this.originalHeight = idleFrameImage ? idleFrameImage.height : 100; // Fallback si non chargé

        this.width = this.originalWidth * this.data.scale;
        this.height = this.originalHeight * this.data.scale;
        this.x = x;
        this.y = y - this.height;

        this.velocityX = 0;
        this.velocityY = 0;
        this.isOnGround = false;
        this.isPlayer1 = isPlayer1;

        this.health = MAX_HEALTH;
        this.maxHealth = MAX_HEALTH;
        this.state = FIGHTER_STATE.IDLE;
        this.animator = new Animator(fighterId); // L'Animator prend juste l'ID
        this.animator.facingRight = isPlayer1;

        this.isAttacking = false;
        this.attackCooldownTimer = 0;
        this.currentAttackHitbox = null;
        this.hitThisAttack = false;

        this.hurtbox = { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    // Le reste de la classe Fighter reste le même, car les méthodes update et draw appellent l'Animator
    // et utilisent les données d'animation pour les hitboxes et l'état.

    /**
     * Met à jour l'état du combattant (physique, animation, états).
     * @param {number} deltaTimeMs - Temps écoulé en millisecondes.
     * @param {Fighter} opponent - Le combattant adverse.
     */
    update(deltaTimeMs, opponent) {
        // --- Mise à jour de la physique ---
        this.velocityY += GRAVITY;
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Limite de déplacement horizontal (pour ne pas sortir de l'écran)
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > GAME_WIDTH) this.x = GAME_WIDTH - this.width;

        // Collision avec le sol
        if (this.y + this.height >= GROUND_Y) {
            this.y = GROUND_Y - this.height;
            this.velocityY = 0;
            if (!this.isOnGround) {
                this.isOnGround = true;
                // Si on atterrit et qu'on n'est pas en train d'attaquer, revenir à Idle
                if (!this.isAttacking && this.state !== FIGHTER_STATE.KO) { // Ajouté KO pour ne pas interrompre l'état final
                    this.state = FIGHTER_STATE.IDLE;
                }
            }
        } else {
            this.isOnGround = false;
        }

        // Mettre à jour la hurtbox
        this.hurtbox.x = this.x;
        this.hurtbox.y = this.y;
        // Si besoin, ajustez la taille ou la position de la hurtbox relative au sprite
        // Ex: this.hurtbox.x = this.x + 20; this.hurtbox.width = this.width - 40;


        // --- Gestion des états et animations ---
        this.animator.update(deltaTimeMs);
        this.animator.setAnimation(this.state); // Applique l'animation basée sur l'état

        // Direction du personnage (face à l'adversaire)
        if (opponent) {
            this.animator.facingRight = (this.x < opponent.x);
        }

        // --- Gestion des attaques ---
        if (this.isAttacking) {
            this.attackCooldownTimer -= deltaTimeMs;
            if (this.attackCooldownTimer <= 0 || this.animator.animationFinished) {
                this.isAttacking = false;
                this.attackCooldownTimer = 0;
                this.currentAttackHitbox = null; // Réinitialise la hitbox
                this.hitThisAttack = false; // Prêt à frapper à nouveau
                if (this.state !== FIGHTER_STATE.KO) { // Ne pas quitter l'état KO
                    this.state = FIGHTER_STATE.IDLE; // Revenir à idle ou fall si en l'air
                }
            } else {
                // Met à jour la position de la hitbox d'attaque par rapport au personnage
                const animData = this.data.animations[this.state];
                const frameIndex = this.animator.currentFrame;
                const hitboxData = animData.hitboxes ? animData.hitboxes.find(hb => hb.frame === frameIndex) : null;

                if (hitboxData) {
                    // Calcul de la position de la hitbox en tenant compte du flip
                    let hbX = this.x;
                    // L'origine des coordonnées de la hitbox est toujours relative au coin supérieur gauche du sprite non-flipé.
                    // Si le sprite est flipé, l'image est inversée, mais la logique de la hitbox reste la même,
                    // sauf que sa position sur l'axe X doit être calculée par rapport au côté "droit" du sprite,
                    // qui devient le "gauche" après flip.
                    if (this.animator.facingRight) {
                        hbX += hitboxData.x * this.data.scale;
                    } else {
                        // Si flipé, la hitbox est miroir par rapport au côté droit du sprite
                        // Calcul: position du coin gauche du sprite + (largeur originale du sprite - (offset X de la hitbox + largeur de la hitbox)) * scale
                        hbX += (this.originalWidth - (hitboxData.x + hitboxData.width)) * this.data.scale;
                    }
                    this.currentAttackHitbox = {
                        x: hbX,
                        y: this.y + hitboxData.y * this.data.scale,
                        width: hitboxData.width * this.data.scale,
                        height: hitboxData.height * this.data.scale,
                        damage: hitboxData.damage
                    };
                } else {
                    this.currentAttackHitbox = null; // Pas de hitbox sur cette frame
                }
            }
        }
    }

    /**
     * Dessine le combattant et ses boîtes de collision (pour le debug).
     * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu du canvas.
     */
    draw(ctx) {
        this.animator.draw(ctx, this.x, this.y, this.width, this.height);

        // DEBUG: Dessiner la hurtbox (en bleu)
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.hurtbox.x, this.hurtbox.y, this.hurtbox.width, this.hurtbox.height);

        // DEBUG: Dessiner la hitbox d'attaque (en rouge)
        if (this.currentAttackHitbox) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.currentAttackHitbox.x, this.currentAttackHitbox.y, this.currentAttackHitbox.width, this.currentAttackHitbox.height);
        }
    }

    /**
     * Fait sauter le personnage.
     */
    jump() {
        if (this.isOnGround && !this.isAttacking && this.state !== FIGHTER_STATE.KO) {
            this.velocityY = -20; // Force de saut
            this.isOnGround = false;
            this.state = FIGHTER_STATE.JUMP;
        }
    }

    /**
     * Déplace le personnage horizontalement.
     * @param {number} direction - -1 pour gauche, 1 pour droite.
     * @param {number} speed - La vitesse de déplacement.
     */
    move(direction, speed) {
        if (this.isOnGround && !this.isAttacking && this.state !== FIGHTER_STATE.KO) {
            this.velocityX = direction * speed;
            this.state = FIGHTER_STATE.RUN;
        }
    }

    /**
     * Arrête le mouvement horizontal.
     */
    stopMoving() {
        if (this.isOnGround && !this.isAttacking && this.state !== FIGHTER_STATE.KO) {
            this.velocityX = 0;
            this.state = FIGHTER_STATE.IDLE;
        }
    }

    /**
     * Déclenche une attaque.
     * @param {string} attackType - 'Light', 'Medium', 'Heavy'.
     */
    attack(attackType) {
        if (!this.isAttacking && this.attackCooldownTimer <= 0 && this.isOnGround && this.state !== FIGHTER_STATE.KO) {
            this.isAttacking = true;
            this.attackCooldownTimer = ATTACK_COOLDOWN_MS;
            this.state = FIGHTER_STATE[`ATTACK_${attackType.toUpperCase()}`];
            this.animator.setAnimation(this.state); // Force l'animation à se lancer depuis le début
            this.hitThisAttack = false; // Prêt à frapper une cible
        }
    }

    /**
     * Inflige des dégâts au combattant.
     * @param {number} amount - Quantité de dégâts.
     */
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
            this.state = FIGHTER_STATE.KO; // Passe en état KO
            this.animator.setAnimation(FIGHTER_STATE.KO); // Lance l'animation KO
            this.velocityX = 0; // Arrête tout mouvement
            this.velocityY = 0;
            this.isAttacking = false; // Arrête toute attaque en cours
            this.currentAttackHitbox = null;
        } else {
            this.state = FIGHTER_STATE.HIT; // Passe en état hit
            this.animator.setAnimation(FIGHTER_STATE.HIT); // Lance l'animation de coup reçu
        }
        this.currentAttackHitbox = null; // S'assure que la hitbox n'est plus active après un hit
        console.log(`${this.id} Health: ${this.health}`);
    }
}