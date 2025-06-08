// js/game/config.js

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const GROUND_Y = 500; // Position Y du sol, où les personnages atterrissent
export const GRAVITY = 0.8; // Force de gravité
export const MAX_HEALTH = 100;
export const ATTACK_COOLDOWN_MS = 300; // Temps de récupération après une attaque
export const INPUT_BUFFER_TIME_MS = 150; // Temps pour buffer les inputs de combos

// Configuration des touches pour les deux joueurs
export const CONTROLS = {
    PLAYER1: {
        LEFT: 'KeyA',
        RIGHT: 'KeyD',
        JUMP: 'KeyW',
        ATTACK_LIGHT: 'KeyJ',
        ATTACK_MEDIUM: 'KeyK',
        ATTACK_HEAVY: 'KeyL',
        DASH: 'KeyE',
        ROLL: 'KeyQ'
    },
    PLAYER2: {
        LEFT: 'ArrowLeft',
        RIGHT: 'ArrowRight',
        JUMP: 'ArrowUp',
        ATTACK_LIGHT: 'Numpad7',
        ATTACK_MEDIUM: 'Numpad8',
        ATTACK_HEAVY: 'Numpad9',
        DASH: 'Numpad5',
        ROLL: 'Numpad4'
    }
};

// Chemins des assets globaux
export const ASSET_PATHS = {
    BACKGROUND_DOJO: 'assets/images/backgrounds/dojo.png', // Chemin sans slashs pour les fichiers
};

// Échelle par défaut des sprites (important pour le rendu, même si les frames sont individuelles)
export const SPRITE_SCALE = 2; // Pour doubler la taille des sprites sur le canvas

// Types d'états et d'animations
export const FIGHTER_STATE = {
    IDLE: 'idle',
    RUN: 'run',
    JUMP: 'jump',
    FALL: 'fall',
    ATTACK_LIGHT: 'attackLight',
    ATTACK_MEDIUM: 'attackMedium',
    ATTACK_HEAVY: 'attackHeavy',
    HIT: 'hit',
    BLOCK: 'block',
    CROUCH: 'crouch',
    DASH: 'dash',
    ROLL: 'roll',
    KO: 'ko',
};