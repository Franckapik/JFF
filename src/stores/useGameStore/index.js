/**
 * Store principal pour la gestion du jeu
 * Combinaison de tous les slices avec leurs responsabilités séparées
 */
import { create } from 'zustand';

// Import des slices
import createClockSlice from './slices/clockSlice';
import createPlayerConfigSlice from './slices/playerConfigSlice';

/**
 * Crée un store Zustand en combinant tous les slices
 */
const useGameStore = create((set, get) => ({
  // Combine tous les slices pour former le store complet
  ...createClockSlice(set, get),
  ...createPlayerConfigSlice(set, get),
}));

export default useGameStore;
