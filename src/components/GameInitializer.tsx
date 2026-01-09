/**
 * ==========================================================================
 * GAME INITIALIZER - Gestionnaire centralisé de l'initialisation du jeu
 * ==========================================================================
 * 
 * ✅ Phase 5 Migration: Worker 100% autonome + Initialisation centralisée
 * 
 * Ce composant gère la connexion au SharedWorker et l'initialisation
 * complète du jeu (génération des tuiles, placement des éléments, etc.).
 * 
 * Responsabilités:
 * - Connexion au SharedWorker au montage
 * - Génération complète de la grille (pipeline 7 étapes)
 * - Envoi des données au worker
 * - Logging de l'initialisation
 * 
 * Pipeline de génération:
 * 1. Base grid (hexGrid avec radius/spacing)
 * 2. Empty tiles (15%)
 * 3. Obstacles (20%)
 * 4. Danger tiles (10%)
 * 5. Starting tiles (1 par bot)
 * 6. Stations (fuel + repair)
 * 7. Bot assignment (fairness)
 * 
 * Utilisation:
 * ```tsx
 * <GameInitializer />
 * ```
 * 
 * Ce composant ne rend rien (null) - c'est un composant logique pur.
 * 
 * @see docs/SHARED_WORKER_VIEWS_ARCHITECTURE.md
 * @see docs/TILESTORE_FSM_INTEGRATION.md
 */

import React from 'react';

import {
  assignStartingTilesToBots,
  initializeGameGrid,
  placeDangerTiles,
  placeEmptyTiles,
  placeGameStations,
  placeObstacleTiles,
  placeStartingTiles,
} from '../core/spatial/hexGrid';
import { useSharedWorkerStore } from '../stores/useSharedWorkerStore';

// =========================================================================
// CONFIGURATION
// =========================================================================

const GAME_CONFIG = {
  radius: 3,
  spacing: -0.2,
  botCount: 2,
  botIds: ['bot-0', 'bot-1'],
  emptyTileRatio: 0.15, // 15%
  // obstacle: 20% (default in placeObstacleTiles)
  // danger: 10% (default in placeDangerTiles)
};

// =========================================================================
// GAME INITIALIZER COMPONENT
// =========================================================================

export default function GameInitializer() {
  const connect = useSharedWorkerStore((s) => s.connect);
  const initGame = useSharedWorkerStore((s) => s.initGame);
  const isConnected = useSharedWorkerStore((s) => s.isConnected);
  const isInitialized = useSharedWorkerStore((s) => s.isInitialized);

  // Connect to SharedWorker on mount
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('🔌 [GameInitializer] Connecting to SharedWorker...');
    connect();
  }, [connect]);

  // Initialize game when connected
  React.useEffect(() => {
    if (!isConnected || isInitialized) return;

    // eslint-disable-next-line no-console
    console.log('🎮 [GameInitializer] Starting game initialization...');

    const seed = Date.now();

    try {
      // Step 1: Initialize base grid
      let tiles = initializeGameGrid({
        radius: GAME_CONFIG.radius,
        spacing: GAME_CONFIG.spacing,
        seed,
      });

      // Step 2: Place empty tiles (15%)
      tiles = placeEmptyTiles(tiles, GAME_CONFIG.emptyTileRatio, seed);

      // Step 3: Place obstacles (20%)
      tiles = placeObstacleTiles(tiles, seed);

      // Step 4: Place danger tiles (10%)
      tiles = placeDangerTiles(tiles, seed);

      // Step 5: Place starting tiles (1 per bot)
      tiles = placeStartingTiles(tiles, GAME_CONFIG.botCount, seed);

      // Step 6: Place stations (fuel + repair)
      tiles = placeGameStations(tiles, { radius: GAME_CONFIG.radius, seed });

      // Step 7: Assign starting tiles to bots
      tiles = assignStartingTilesToBots(tiles, GAME_CONFIG.botIds);

      // Send to worker
      initGame(tiles);

      // eslint-disable-next-line no-console
      console.log(
        `✅ [GameInitializer] Game initialized successfully!`,
        `\n   - Tiles: ${Object.keys(tiles).length}`,
        `\n   - Bots: ${GAME_CONFIG.botIds.join(', ')}`,
        `\n   - Seed: ${seed}`
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ [GameInitializer] Failed to initialize game:', error);
    }
  }, [isConnected, isInitialized, initGame]);

  // This component doesn't render anything
  return null;
}
