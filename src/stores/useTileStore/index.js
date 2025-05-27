/**
 * Store principal pour la gestion des tuiles
 * Combinaison de tous les slices avec leurs responsabilités séparées
 */
import { create } from 'zustand';

// Import des slices
import createTileBaseSlice from './slices/tileBaseSlice';
import createTileSearchSlice from './slices/tileSearchSlice';
import createTileResourceSlice from './slices/tileResourceSlice';
import createTileExplorationSlice from './slices/tileExplorationSlice';
import createTileCalculationSlice from './slices/tileCalculationSlice';

/**
 * Crée un store Zustand en combinant tous les slices
 */
export const useTileStore = create((set, get) => ({
  // Combine tous les slices pour former le store complet
  ...createTileBaseSlice(set, get),
  ...createTileSearchSlice(set, get),
  ...createTileResourceSlice(set, get),
  ...createTileExplorationSlice(set, get),
  ...createTileCalculationSlice(set, get),
}));
