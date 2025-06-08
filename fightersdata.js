// js/game/data/fightersData.js

import { SPRITE_SCALE } from './config.js';

// Simple animation data using the few images available in the repo
export const FIGHTERS_DATA = {
  ken: {
    name: 'Ken',
    scale: SPRITE_SCALE,
    animations: {
      idle: { frames: ['kenidle1.png'], speed: 120, loop: true },
      run: { frames: ['kenrun1.png'], speed: 80, loop: true },
      jump: { frames: ['kenjump1.png'], speed: 0, loop: false },
      fall: { frames: ['kenfall1.png'], speed: 0, loop: false },
      attackLight: { frames: ['kenattackLight1.png'], speed: 100, loop: false },
      attackMedium: { frames: ['kenattackMedium1.png'], speed: 100, loop: false },
      attackHeavy: { frames: ['kenattackHeavy1.png'], speed: 120, loop: false },
      hit: { frames: ['kenfall1.png'], speed: 100, loop: false },
      ko: { frames: ['kenfall1.png'], speed: 100, loop: false },
    },
  },
  ryu: {
    name: 'Ryu',
    scale: SPRITE_SCALE,
    animations: {
      idle: { frames: ['kenidle1.png'], speed: 120, loop: true },
      run: { frames: ['kenrun1.png'], speed: 80, loop: true },
      jump: { frames: ['kenjump1.png'], speed: 0, loop: false },
      fall: { frames: ['kenfall1.png'], speed: 0, loop: false },
      attackLight: { frames: ['kenattackLight1.png'], speed: 100, loop: false },
      attackMedium: { frames: ['kenattackMedium1.png'], speed: 100, loop: false },
      attackHeavy: { frames: ['kenattackHeavy1.png'], speed: 120, loop: false },
      hit: { frames: ['kenfall1.png'], speed: 100, loop: false },
      ko: { frames: ['kenfall1.png'], speed: 100, loop: false },
    },
  },
};
