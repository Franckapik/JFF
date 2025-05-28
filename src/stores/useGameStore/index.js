/**
 * Store principal pour la gestion du jeu
 * Combinaison de tous les slices avec leurs responsabilités séparées
 */
import { create } from 'zustand';
import fsmLogger from '../../utils/fsmLogger';

// Import des slices
import createClockSlice from './slices/clockSlice';
import createPlayerCountSlice from './slices/playerCountSlice';
import createUiConfigSlice from './slices/uiConfigSlice';
import createInitializationFlagsSlice from './slices/initializationFlagsSlice';

/**
 * Crée un store Zustand en combinant tous les slices
 */
const useGameStore = create((set, get) => {
  fsmLogger.game('Game store initialized');
  
  return {
    // Combine tous les slices pour former le store complet
    ...createClockSlice(set, get),
    ...createPlayerCountSlice(set, get),
    ...createUiConfigSlice(set, get),
    ...createInitializationFlagsSlice(set, get),
  };
});

export default useGameStore;
