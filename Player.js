// js/game/entities/Player.js

import { Fighter } from './Fighter.js';
import { isKeyPressed, wasKeyJustPressed } from '../utils/input.js';
import { CONTROLS, FIGHTER_STATE } from '../config.js';

export class Player extends Fighter {
    constructor(fighterId, x, y, isPlayer1 = true) {
        super(fighterId, x, y, isPlayer1);
        this.controls = isPlayer1 ? CONTROLS.PLAYER1 : CONTROLS.PLAYER2;
        this.speed = 4; // Vitesse de déplacement du joueur
        this.doubleJumpAvailable = true; // Pour le double saut
    }

    /**
     * Met à jour l'état du joueur en fonction des entrées.
     * @param {number} deltaTimeMs - Le temps écoulé depuis la dernière mise à jour.
     * @param {Fighter} opponent - Le combattant adverse.
     */
    update(deltaTimeMs, opponent) {
        super.update(deltaTimeMs, opponent); // Appelle la mise à jour de la classe de base

        // Ne pas gérer les inputs si le joueur est en train d'attaquer ou KO
        if (this.isAttacking || this.state === FIGHTER_STATE.HIT || this.state === FIGHTER_STATE.KO) {
            this.velocityX = 0; // Arrête le mouvement pendant l'attaque/hit
            return;
        }

        // --- Mouvements ---
        let moving = false;
        if (isKeyPressed(this.controls.LEFT)) {
            this.move(-1, this.speed);
            moving = true;
        } else if (isKeyPressed(this.controls.RIGHT)) {
            this.move(1, this.speed);
            moving = true;
        }

        if (!moving && this.isOnGround) {
            this.stopMoving();
        }

        // Si le personnage est en l'air, il peut se déplacer un peu, mais ne change pas d'état
        if (!this.isOnGround && this.state !== FIGHTER_STATE.JUMP && this.state !== FIGHTER_STATE.FALL) {
            if (this.velocityY < 0) {
                this.state = FIGHTER_STATE.JUMP;
            } else {
                this.state = FIGHTER_STATE.FALL;
            }
        }

        // Réinitialise le double saut si sur le sol
        if (this.isOnGround) {
            this.doubleJumpAvailable = true;
            // Assure que l'animation est "fall" ou "idle" après une chute
            if (this.state === FIGHTER_STATE.JUMP || this.state === FIGHTER_STATE.FALL) {
                 this.state = FIGHTER_STATE.IDLE;
            }
        }


        // Saut / Double Saut
        if (wasKeyJustPressed(this.controls.JUMP)) {
            if (this.isOnGround) {
                this.jump();
            } else if (this.doubleJumpAvailable) {
                this.velocityY = -15; // Moins de force pour le double saut
                this.doubleJumpAvailable = false;
                this.state = FIGHTER_STATE.JUMP; // Peut-être une animation spécifique de double saut
            }
        }

        // Attaques
        if (wasKeyJustPressed(this.controls.ATTACK_LIGHT)) {
            this.attack('light');
        } else if (wasKeyJustPressed(this.controls.ATTACK_MEDIUM)) {
            this.attack('medium');
        } else if (wasKeyJustPressed(this.controls.ATTACK_HEAVY)) {
            this.attack('heavy');
        }

        // Dash (exemple simple)
        if (wasKeyJustPressed(this.controls.DASH) && this.isOnGround) {
            this.velocityX = this.animator.facingRight ? 15 : -15; // Dash rapide
            this.state = FIGHTER_STATE.DASH; // Changer l'animation si vous en avez une
            // Reset velocity after a short time or animation ends
            setTimeout(() => {
                if (this.state === FIGHTER_STATE.DASH) { // S'assurer qu'on n'a pas été interrompu
                    this.velocityX = 0;
                    this.state = FIGHTER_STATE.IDLE;
                }
            }, 200); // Durée du dash
        }

        // Roll (exemple simple)
        if (wasKeyJustPressed(this.controls.ROLL) && this.isOnGround) {
             this.velocityX = this.animator.facingRight ? 10 : -10; // Roll
             this.state = FIGHTER_STATE.ROLL; // Changer l'animation
             setTimeout(() => {
                if (this.state === FIGHTER_STATE.ROLL) {
                    this.velocityX = 0;
                    this.state = FIGHTER_STATE.IDLE;
                }
             }, 300); // Durée du roll
        }
    }
}