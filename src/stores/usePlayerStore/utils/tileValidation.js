/**
 * =========================================================================
 * TILE VALIDATION UTILITIES
 * =========================================================================
 * 
 * Fonctions utilitaires pour la validation des tuiles de départ
 * et autres validations liées aux tuiles.
 */

import fsmLogger from '../../../logger/fsmLogger';

/**
 * Valide qu'il y a suffisamment de tuiles de départ pour tous les joueurs
 * @param {Array} startingTiles - Tuiles de type "depart" disponibles
 * @param {number} playerCount - Nombre total de joueurs
 * @param {number} botCount - Nombre de bots
 * @param {number} numberOfPlayers - Nombre total de joueurs nécessaires
 * @throws {Error} Si pas assez de tuiles de départ
 */
export const validateStartingTiles = (startingTiles, playerCount, botCount, numberOfPlayers) => {
  if (startingTiles.length < numberOfPlayers) {
    const errorMessage = `Not enough starting tiles of type 'depart' found. Need ${numberOfPlayers} (for ${playerCount} human players and ${botCount} bots), but found only ${startingTiles.length}. Check tile generation or player/bot count in useGameStore.`;
    
    fsmLogger.player(errorMessage, {
      needed: numberOfPlayers,
      found: startingTiles.length,
      playerCountFromGameStore: playerCount,
      botCountFromGameStore: botCount,
      availableStartingTiles: startingTiles
    });
    
    throw new Error(errorMessage);
  }
};

/**
 * Filtre les tuiles de départ disponibles depuis un dictionnaire de tuiles
 * @param {Object} tiles - Dictionnaire de toutes les tuiles du jeu
 * @returns {Array} Tableau des tuiles de type "depart"
 */
export const getStartingTiles = (tiles) => {
  const startingTiles = Object.values(tiles).filter((tile) => tile.type === "depart");
  
  fsmLogger.player(`Found ${startingTiles.length} starting tiles of type 'depart'`, {
    startingTilesCount: startingTiles.length,
    startingTileCoords: startingTiles.map(tile => tile.coord)
  });
  
  return startingTiles;
};
