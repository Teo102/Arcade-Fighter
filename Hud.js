// js/game/ui/Hud.js

/**
 * Gère l'affichage du HUD (barres de vie, énergie, timer, etc.).
 */
export class Hud {
    constructor() {
        this.player1HealthBar = document.querySelector('.player-1-health');
        this.player2HealthBar = document.querySelector('.player-2-health');
        this.player1EnergyBar = document.querySelector('.player-1-energy');
        this.player2EnergyBar = document.querySelector('.player-2-energy');
        this.player1Portrait = document.querySelector('.player-1-portrait');
        this.player2Portrait = document.querySelector('.player-2-portrait');
        this.timerDisplay = document.querySelector('.timer');
        this.roundDisplay = document.createElement('div'); // Pour "Round 1 Fight!"
        this.roundDisplay.className = 'round-message';
        document.getElementById('hud').appendChild(this.roundDisplay);
    }

    /**
     * Met à jour les barres de vie des joueurs.
     * @param {number} p1Health - La vie actuelle du joueur 1.
     * @param {number} p1MaxHealth - La vie maximale du joueur 1.
     * @param {number} p2Health - La vie actuelle du joueur 2.
     * @param {number} p2MaxHealth - La vie maximale du joueur 2.
     */
    updateHealthBars(p1Health, p1MaxHealth, p2Health, p2MaxHealth) {
        const p1HealthPercent = (p1Health / p1MaxHealth) * 100;
        const p2HealthPercent = (p2Health / p2MaxHealth) * 100;

        this.player1HealthBar.style.width = `${p1HealthPercent}%`;
        this.player2HealthBar.style.width = `${p2HealthPercent}%`;

        // Changement de couleur dynamique pour les barres de vie
        this.player1HealthBar.style.backgroundColor = p1HealthPercent > 50 ? '#00FF00' : (p1HealthPercent > 20 ? '#FFA500' : '#FF0000');
        this.player2HealthBar.style.backgroundColor = p2HealthPercent > 50 ? '#00FF00' : (p2HealthPercent > 20 ? '#FFA500' : '#FF0000');
    }

    /**
     * Met à jour les barres d'énergie (simple pour la démo).
     * @param {number} p1Energy - Énergie J1.
     * @param {number} p1MaxEnergy - Max énergie J1.
     * @param {number} p2Energy - Énergie J2.
     * @param {number} p2MaxEnergy - Max énergie J2.
     */
    updateEnergyBars(p1Energy, p1MaxEnergy, p2Energy, p2MaxEnergy) {
        // Pour l'instant, on n'a pas de système d'énergie, donc on peut les laisser vides ou avec un placeholder
        // this.player1EnergyBar.style.width = `${(p1Energy / p1MaxEnergy) * 100}%`;
        // this.player2EnergyBar.style.width = `${(p2Energy / p2MaxEnergy) * 100}%`;
    }

    /**
     * Met à jour l'affichage du timer.
     * @param {number} time - Temps restant.
     */
    updateTimer(time) {
        this.timerDisplay.textContent = Math.max(0, Math.floor(time));
    }

    /**
     * Affiche un message de début de round ou de KO.
     * @param {string} message - Le message à afficher.
     * @param {number} durationMs - Durée d'affichage du message en ms.
     */
    showMessage(message, durationMs = 1500) {
        this.roundDisplay.textContent = message;
        this.roundDisplay.style.opacity = '1';
        this.roundDisplay.style.transform = 'scale(1)';

        setTimeout(() => {
            this.roundDisplay.style.opacity = '0';
            this.roundDisplay.style.transform = 'scale(0.8)';
        }, durationMs);
    }
}