/**
 * ============================================================================
 * EXPLORATION GUARDS - Guards primitifs pour la gestion de l'exploration
 * ============================================================================
 * 
 * Guards de base pour la gestion de l'exploration et de la découverte.
 * Ces guards sont réutilisables et constituent la base logique métier.
 * 
 * 🔍 GUARDS PRIMITIFS - Logique métier pure
 * 📍 Localisation: guards/core/ (au lieu de actions/)
 * 🎯 Réutilisables par les guards FSM composés
 */

// ============================================================================
// CONSTANTES EXPLORATION
// ============================================================================

export const EXPLORATION_CONSTANTS = {
  EXPLORATION_TIMEOUT: 300000,      // 5 minutes d'expiration
  MAX_EXPLORED_TILES: 100,          // Maximum de tuiles explorées
  MIN_EXPLORATION_DISTANCE: 2,      // Distance minimale pour explorer
  DISCOVERY_COOLDOWN: 30000,        // 30 secondes entre découvertes
  EXPLORATION_RADIUS: 5             // Rayon d'exploration
};

// ============================================================================
// UTILITAIRES EXPLORATION
// ============================================================================

/**
 * Obtient le timestamp de la dernière exploration
 * @param {Object} context - Contexte FSM
 * @returns {number} Timestamp de dernière exploration
 */
const getLastExplorationTime = (context) => {
  return context?.exploration?.lastExplorationTime || 0;
};

/**
 * Obtient le nombre de tuiles explorées
 * @param {Object} context - Contexte FSM
 * @returns {number} Nombre de tuiles explorées
 */
const getExploredTileCount = (context) => {
  const exploredTiles = context?.exploration?.exploredTiles || [];
  return exploredTiles.length;
};

/**
 * Vérifie si une tuile a été explorée
 * @param {Object} context - Contexte FSM
 * @param {string} tileCoord - Coordonnée de la tuile
 * @returns {boolean} True si tuile explorée
 */
const isTileExplored = (context, tileCoord) => {
  const exploredTiles = context?.exploration?.exploredTiles || [];
  return exploredTiles.includes(tileCoord);
};

// ============================================================================
// GUARDS PRIMITIFS EXPLORATION
// ============================================================================

/**
 * Vérifie si une nouvelle exploration peut être démarrée
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si peut démarrer exploration
 */
const canStartExploration = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  // Vérifie la santé du véhicule
  const health = vehicle.health || 0;
  if (health < 20) return false;
  
  // Vérifie le carburant
  const fuel = vehicle.fuel || 0;
  if (fuel < 30) return false;
  
  // Vérifie qu'il n'y a pas d'exploration en cours
  const isCurrentlyExploring = context?.currentAction === 'exploring';
  if (isCurrentlyExploring) return false;
  
  return true;
};

/**
 * Vérifie si une tuile spécifique a été explorée
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @param {string} tileCoord - Coordonnée de la tuile (optionnel)
 * @returns {boolean} True si tuile explorée
 */
const isTileExploredGuard = (context, event, tileCoord = null) => {
  const coord = tileCoord || event?.tileCoord || context?.currentTile;
  if (!coord) return false;
  
  return isTileExplored(context, coord);
};

/**
 * Vérifie s'il y a des découvertes non traitées
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si découvertes non traitées
 */
const hasUnprocessedDiscoveries = (context, event) => {
  const discoveries = context?.exploration?.discoveries || [];
  const unprocessed = discoveries.filter(discovery => !discovery.processed);
  return unprocessed.length > 0;
};

/**
 * Vérifie si l'exploration actuelle a expiré
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si exploration expirée
 */
const isExplorationExpired = (context, event) => {
  const lastExplorationTime = getLastExplorationTime(context);
  const now = Date.now();
  const timeSinceLastExploration = now - lastExplorationTime;
  
  return timeSinceLastExploration > EXPLORATION_CONSTANTS.EXPLORATION_TIMEOUT;
};

/**
 * Vérifie si l'exploration est terminée
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si exploration terminée
 */
const isExplorationComplete = (context, event) => {
  const exploredTileCount = getExploredTileCount(context);
  const maxTiles = EXPLORATION_CONSTANTS.MAX_EXPLORED_TILES;
  
  // Exploration terminée si maximum de tuiles atteint
  if (exploredTileCount >= maxTiles) return true;
  
  // Ou si explicitement marquée comme terminée
  return context?.exploration?.isComplete === true;
};

/**
 * Vérifie si une exploration est nécessaire
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si exploration nécessaire
 */
const needsExploration = (context, event) => {
  // Vérifie si l'exploration a expiré
  if (isExplorationExpired(context, event)) return true;
  
  // Vérifie s'il y a encore des zones à explorer
  const exploredTileCount = getExploredTileCount(context);
  const maxTiles = EXPLORATION_CONSTANTS.MAX_EXPLORED_TILES;
  
  return exploredTileCount < maxTiles;
};

/**
 * Vérifie si le véhicule est dans une zone d'exploration valide
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si zone valide
 */
const isInValidExplorationZone = (context, event) => {
  const position = context?.vehicle?.position;
  if (!position) return false;
  
  // Zone valide si suffisamment loin de la base
  const basePosition = context?.vehicle?.basePosition || { x: 0, y: 0 };
  const distance = Math.sqrt(
    Math.pow(position.x - basePosition.x, 2) + 
    Math.pow(position.y - basePosition.y, 2)
  );
  
  return distance >= EXPLORATION_CONSTANTS.MIN_EXPLORATION_DISTANCE;
};

/**
 * Vérifie si la zone cible d'exploration est accessible
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si zone accessible
 */
const isTargetExplorationZoneReachable = (context, event) => {
  const vehicle = context?.vehicle;
  const target = context?.targetPosition || event?.targetPosition;
  
  if (!vehicle || !target) return false;
  
  // Calcule la distance à la cible
  const position = vehicle.position || { x: 0, y: 0 };
  const distance = Math.sqrt(
    Math.pow(target.x - position.x, 2) + 
    Math.pow(target.y - position.y, 2)
  );
  
  // Vérifie si le véhicule a assez de carburant pour l'aller-retour
  const fuel = vehicle.fuel || 0;
  const fuelConsumptionRate = vehicle.fuelConsumptionRate || 1;
  const requiredFuel = distance * 2 * fuelConsumptionRate; // Aller-retour
  
  return fuel >= requiredFuel;
};

// ============================================================================
// EXPORT DES GUARDS PRIMITIFS
// ============================================================================

export const explorationGuards = {
  canStartExploration,
  isTileExplored: isTileExploredGuard,
  hasUnprocessedDiscoveries,
  isExplorationExpired,
  isExplorationComplete,
  needsExploration,
  isInValidExplorationZone,
  isTargetExplorationZoneReachable
};

// Utilitaires également exportés
export const explorationUtils = {
  getLastExplorationTime,
  getExploredTileCount,
  isTileExplored
};

export default explorationGuards;
