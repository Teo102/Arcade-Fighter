// js/game/data/fightersData.js

import { SPRITE_SCALE } from '../config.js'; // Utilisez SPRITE_SCALE pour le facteur de mise à l'échelle

// Données d'animation et de hitbox pour les personnages
// IMPORTANT: Ces valeurs sont des EXEMPLES et DOIVENT être ajustées à vos fichiers images.
export const FIGHTERS_DATA = {
    ken: {
        name: 'Ken',
        // Note: plus de spriteSheetPath ici, chaque frame est une image individuelle
        scale: SPRITE_SCALE, // Utilise le scale par défaut

        animations: {
            idle: {
                frames: [
                    'assetsimagescharacterskenidle0.png',
                    'assetsimagescharacterskenidle1.png',
                    'assetsimagescharacterskenidle2.png',
                    'assetsimagescharacterskenidle3.png'
                ],
                speed: 120, // Millisecondes par frame
                loop: true
            },
            run: {
                frames: [
                    'assetsimagescharacterskenrun0.png',
                    'assetsimagescharacterskenrun1.png',
                    'assetsimagescharacterskenrun2.png',
                    'assetsimagescharacterskenrun3.png',
                    'assetsimagescharacterskenrun4.png',
                    'assetsimagescharacterskenrun5.png'
                ],
                speed: 80,
                loop: true
            },
            jump: {
                frames: [
                    'assetsimagescharacterskenjump0.png'
                ],
                speed: 0, // Pas d'animation, juste une frame
                loop: false
            },
            fall: {
                frames: [
                    'assetsimagescharacterskenfall0.png'
                ],
                speed: 0,
                loop: false
            },
            attackLight: {
                frames: [
                    'assetsimagescharacterskenattacklight0.png',
                    'assetsimagescharacterskenattacklight1.png',
                    'assetsimagescharacterskenattacklight2.png'
                ],
                speed: 90,
                loop: false,
                hitboxes: [ // Définition des hitboxes par index de frame dans l'animation
                    { frame: 1, x: 70, y: 30, width: 40, height: 20, damage: 10 },
                    { frame: 2, x: 80, y: 30, width: 50, height: 20, damage: 10 }
                ]
            },
            attackMedium: {
                frames: [
                    'assetsimagescharacterskenattackmedium0.png',
                    'assetsimagescharacterskenattackmedium1.png',
                    'assetsimagescharacterskenattackmedium2.png',
                    'assetsimagescharacterskenattackmedium3.png'
                ],
                speed: 100,
                loop: false,
                hitboxes: [
                    { frame: 2, x: 90, y: 20, width: 60, height: 30, damage: 15 },
                    { frame: 3, x: 100, y: 20, width: 70, height: 30, damage: 15 }
                ]
            },
            attackHeavy: {
                frames: [
                    'assetsimagescharacterskenattackheavy0.png',
                    'assetsimagescharacterskenattackheavy1.png',
                    'assetsimagescharacterskenattackheavy2.png',
                    'assetsimagescharacterskenattackheavy3.png',
                    'assetsimagescharacterskenattackheavy4.png'
                ],
                speed: 120,
                loop: false,
                hitboxes: [
                    { frame: 3, x: 110, y: 10, width: 80, height: 40, damage: 20 },
                    { frame: 4, x: 120, y: 10, width: 90, height: 40, damage: 20 }
                ]
            },
            hit: {
                frames: [
                    'assetsimagescharacterskenhit0.png',
                    'assetsimagescharacterskenhit1.png'
                ],
                speed: 150,
                loop: false
            },
            ko: { // N'oubliez pas l'animation KO si vous l'avez
                frames: [
                    'assetsimagescharacterskenko0.png',
                    'assetsimagescharacterskenko1.png'
                ],
                speed: 200,
                loop: false
            },
            // ... autres animations (block, crouch, dash, roll, special moves)
        },
    },
    ryu: {
        name: 'Ryu',
        scale: SPRITE_SCALE,
        animations: {
            idle: {
                frames: [
                    'assetsimagescharactersryuidle0.png',
                    'assetsimagescharactersryuidle1.png',
                    'assetsimagescharactersryuidle2.png',
                    'assetsimagescharactersryuidle3.png'
                ],
                speed: 120,
                loop: true
            },
            run: {
                frames: [
                    'assetsimagescharactersryurun0.png',
                    'assetsimagescharactersryurun1.png',
                    'assetsimagescharactersryurun2.png',
                    'assetsimagescharactersryurun3.png',
                    'assetsimagescharactersryurun4.png',
                    'assetsimagescharactersryurun5.png'
                ],
                speed: 80,
                loop: true
            },
            jump: {
                frames: [
                    'assetsimagescharactersryujump0.png'
                ],
                speed: 0,
                loop: false
            },
            fall: {
                frames: [
                    'assetsimagescharactersryufall0.png'
                ],
                speed: 0,
                loop: false
            },
            attackLight: {
                frames: [
                    'assetsimagescharactersryuattacklight0.png',
                    'assetsimagescharactersryuattacklight1.png',
                    'assetsimagescharactersryuattacklight2.png'
                ],
                speed: 90,
                loop: false,
                hitboxes: [
                    { frame: 1, x: 70, y: 30, width: 40, height: 20, damage: 10 },
                    { frame: 2, x: 80, y: 30, width: 50, height: 20, damage: 10 }
                ]
            },
            attackMedium: {
                frames: [
                    'assetsimagescharactersryuattackmedium0.png',
                    'assetsimagescharactersryuattackmedium1.png',
                    'assetsimagescharactersryuattackmedium2.png',
                    'assetsimagescharactersryuattackmedium3.png'
                ],
                speed: 100,
                loop: false,
                hitboxes: [
                    { frame: 2, x: 90, y: 20, width: 60, height: 30, damage: 15 },
                    { frame: 3, x: 100, y: 20, width: 70, height: 30, damage: 15 }
                ]
            },
            attackHeavy: {
                frames: [
                    'assetsimagescharactersryuattackheavy0.png',
                    'assetsimagescharactersryuattackheavy1.png',
                    'assetsimagescharactersryuattackheavy2.png',
                    'assetsimagescharactersryuattackheavy3.png',
                    'assetsimagescharactersryuattackheavy4.png'
                ],
                speed: 120,
                loop: false,
                hitboxes: [
                    { frame: 3, x: 110, y: 10, width: 80, height: 40, damage: 20 },
                    { frame: 4, x: 120, y: 10, width: 90, height: 40, damage: 20 }
                ]
            },
            hit: {
                frames: [
                    'assetsimagescharactersryuhit0.png',
                    'assetsimagescharactersryuhit1.png'
                ],
                speed: 150,
                loop: false
            },
            ko: {
                frames: [
                    'assetsimagescharactersryuko0.png',
                    'assetsimagescharactersryuko1.png'
                ],
                speed: 200,
                loop: false
            },
        },
    },
};