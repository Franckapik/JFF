/**
 * =========================================================================
 * TILE STORE - Store principal pour la gestion des tuiles
 * =========================================================================
 * 
 * Ce store combine tous les slices spécialisés pour la gestion complète des tuiles :
 * - tileBaseSlice : initialisation, CRUD de base, gestion du hover
 * - tileResourceSlice : collecte, déduction et analyse des ressources
 * - tileCalculationSlice : calculs de distance et pathfinding
 * - tileMarkSlice : marquage d'exploration et statuts
 * - tileFilterSlice : filtrage, recherche et sélection avancée
 * - tileCoordinateSlice : système de coordonnées et transformations (migré depuis utils/coordinateSystem)
 * - tileGenerationSlice : génération hexagonale et pathfinding (migré depuis utils/utils)
 * 
 * Architecture modulaire permettant :
 * - Séparation claire des responsabilités
 * - Composition flexible des fonctionnalités
 * - Maintenabilité et extensibilité optimales
 * - Performance et réutilisabilité du code
 * - Migration progressive depuis le dossier utils
 * 
 * Utilisation :
 * ```javascript
 * import { useTileStore } from './stores/useTileStore';
 * 
 * const { 
 *   tiles, 
 *   initializeTiles, 
 *   calculateDistance, 
 *   markTileAsExplored, 
 *   gridToWorld,
 *   initializeGameGrid,
 *   addPlayerStartingPosition 
 * } = useTileStore();
 * ```
 */

// =========================================================================
// IMPORTS
// =========================================================================
import { create } from 'zustand';

// Import des slices spécialisés
import createTileBaseSlice from './slices/tileBaseSlice';
import createTileResourceSlice from './slices/tileResourceSlice';
import createTileCalculationSlice from './slices/tileCalculationSlice';
import createTileMarkSlice from './slices/tileMarkSlice';
import createTileFilterSlice from './slices/tileFilterSlice';

// Import des nouveaux slices migrés depuis utils
import createTileCoordinateSlice from './slices/tileCoordinateSlice';
import createTileGenerationSlice from './slices/tileGenerationSlice';

// =========================================================================
// STORE PRINCIPAL
// =========================================================================

/**
 * Store Zustand combinant tous les slices de tuiles
 * 
 * Composition des slices dans l'ordre logique :
 * 1. Base : fondations et opérations CRUD
 * 2. Resources : gestion des ressources et collecte
 * 3. Calculation : calculs spatiaux et pathfinding
 * 4. Mark : marquage et exploration
 * 5. Filter : filtrage et recherche avancée
 * 6. Coordinate : système de coordonnées (migré depuis utils/coordinateSystem)
 * 7. Generation : génération hexagonale et pathfinding (migré depuis utils/utils)
 */
export const useTileStore = create((set, get) => ({
  // =========================================================================
  // COMPOSITION DES SLICES
  // =========================================================================
  
  // Slice de base : gestion fondamentale des tuiles
  ...createTileBaseSlice(set, get),
  
  // Slice des ressources : collecte et analyse
  ...createTileResourceSlice(set, get),
  
  // Slice des calculs : distances et pathfinding
  ...createTileCalculationSlice(set, get),
  
  // Slice de marquage : exploration et statuts
  ...createTileMarkSlice(set, get),
  
  // Slice de filtrage : recherche et sélection avancée
  ...createTileFilterSlice(set, get),
  
  // Nouveaux slices migrés depuis utils
  // Slice des coordonnées : transformations et validations
  ...createTileCoordinateSlice(set, get),
  
  // Slice de génération : création des grilles hexagonales et pathfinding
  ...createTileGenerationSlice(set, get),
}));
