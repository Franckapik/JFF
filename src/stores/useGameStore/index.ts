/**
 * Store principal pour la gestion du jeu - Version TypeScript
 * Combinaison de tous les slices avec leurs responsabilités séparées
 */
import { create } from 'zustand';

import type { GameStoreType } from '../../types/stores.d';

// Import des slices
import createClockSlice from './slices/clockSlice.ts';
import createInitializationFlagsSlice from './slices/initializationFlagsSlice.ts';
import createPlayerCountSlice from './slices/playerCountSlice.ts';
import createRadiusSlice from './slices/radiusSlice.ts';
import createSeedSlice from './slices/seedSlice.ts';
import createUiConfigSlice from './slices/uiConfigSlice.ts';

/**
 * Crée un store Zustand en combinant tous les slices
 */
const useGameStore = create<GameStoreType>((set, get) => {
  
  return {
    // Combine tous les slices pour former le store complet
    ...createClockSlice(set, get),
    ...createPlayerCountSlice(set, get),
    ...createUiConfigSlice(set, get),
    ...createInitializationFlagsSlice(set, get),
    ...createRadiusSlice(set, get),
    ...createSeedSlice(set, get),
  } as GameStoreType;
});

export default useGameStore;
