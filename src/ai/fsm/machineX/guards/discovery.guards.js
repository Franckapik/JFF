/**
 * ============================================================================
 * XSTATE DISCOVERY GUARDS - Guards d'exploration/découverte pour XState
 * ============================================================================
 * 
 * Guards de découverte migrés depuis Robot3 vers syntaxe XState.
 * Incluent uniquement les guards utilisés dans l'état evaluating.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 * @migration FROM: src/ai/fsm/machine/guards/discoveryGuard.js
 * @usage Used in evaluating state for exploration/collection cycle
 */

import { EXPLORATION_CYCLE_CONFIG } from '../config/constants.js';

/**
 * Vérifie s'il y a des tuiles collectibles disponibles
 * @returns {boolean}
 */
export const hasBestTileForCollection = (context, event) => {
  const knownTiles = context.memory?.knownTiles || new Map();
  const collectibleTiles = Array.from(knownTiles.values())
    .filter(tile => tile && tile.collectible);
  return collectibleTiles.length > 0;
};

/**
 * Vérifie si assez de tuiles ont été explorées pour passer à la collecte
 * @returns {boolean}
 */
export const hasExploredEnoughTiles = (context, event) => {
  const exploredCount = context.memory?.stats?.tilesExplored || 0;
  return exploredCount >= EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION;
};

/**
 * Détermine si on doit passer à la collecte (assez de tuiles ET tuiles collectibles)
 * @returns {boolean}
 */
export const shouldTransitionToCollection = (context, event) => {
  const exploredCount = context.memory?.stats?.tilesExplored || 0;
  const knownTiles = context.memory?.knownTiles || new Map();
  const collectibleTiles = Array.from(knownTiles.values())
    .filter(tile => tile && tile.collectible);
  const required = EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION;
  return exploredCount >= required && collectibleTiles.length > 0;
};

/**
 * Vérifie s'il y a des zones non explorées (continue exploration si rien à collecter)
 * @returns {boolean}
 */
export const hasUnexploredAreas = (context, event) => {
  // Réutilise la logique de needsExploration
  return needsExploration(context, event);
};

/**
 * Vérifie si une exploration est nécessaire (cycle multi-tuiles)
 * @returns {boolean}
 */
export const needsExploration = (context, event) => {
  const exploredCount = context.memory?.stats?.tilesExplored || 0;
  if (exploredCount >= EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION) {
    const collectibleTiles = Array.from(context.memory.knownTiles.values())
      .filter(tile => tile && tile.collectible);
    return collectibleTiles.length === 0;
  }
  // Par défaut, continuer si pas assez de tuiles explorées
  return true;
};

export const discoveryGuards = {
  hasBestTileForCollection,
  hasExploredEnoughTiles,
  shouldTransitionToCollection,
  hasUnexploredAreas,
  needsExploration
};

export default discoveryGuards;
