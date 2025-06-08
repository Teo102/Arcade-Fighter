// js/game/assets.js
import { ASSET_PATHS } from './config.js';
import { FIGHTERS_DATA } from './fightersdata.js';

const assets = {};
let assetsLoadedCount = 0;
let totalAssetsToLoad = 0;

/**
 * Charge une image et la stocke.
 * @param {string} name - Nom pour référencer l'asset (généralement le chemin du fichier).
 * @param {string} path - Chemin de l'image.
 * @returns {Promise<HTMLImageElement>} Promesse résolue avec l'image.
 */
function loadImage(name, path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            assets[name] = img;
            assetsLoadedCount++;
            console.log(`Asset loaded: ${name} (${assetsLoadedCount}/${totalAssetsToLoad})`);
            resolve(img);
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
            reject(new Error(`Failed to load image: ${path}`));
        };
        img.src = path;
    });
}

/**
 * Charge tous les assets nécessaires au jeu.
 * @returns {Promise<void>} Promesse résolue quand tout est chargé.
 */
export async function loadAllAssets() {
    const assetPromises = [];

    // Ajouter le background
    assetPromises.push(loadImage('backgroundDojo', ASSET_PATHS.BACKGROUND_DOJO));

    // Ajouter les frames d'animation pour chaque personnage
    for (const fighterId in FIGHTERS_DATA) {
        const fighter = FIGHTERS_DATA[fighterId];
        for (const animName in fighter.animations) {
            const animation = fighter.animations[animName];
            for (const framePath of animation.frames) {
                // Le nom de l'asset sera le chemin lui-même pour une identification unique
                assetPromises.push(loadImage(framePath, framePath));
            }
        }
    }

    totalAssetsToLoad = assetPromises.length;
    console.log(`Total assets to load: ${totalAssetsToLoad}`);

    await Promise.all(assetPromises);
    console.log('All assets loaded!');
}

/**
 * Récupère un asset chargé.
 * @param {string} name - Nom de l'asset (qui est le chemin du fichier dans ce cas).
 * @returns {*} L'asset.
 */
export function getAsset(name) {
    return assets[name];
}