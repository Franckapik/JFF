/**
 * Store principal pour la gestion des joueurs
 * Combinaison de tous les slices avec leurs responsabilités séparées
 */
import { create } from 'zustand';

// Import des slices
import createPlayerBaseSlice from './slices/playerBaseSlice';
import createVehicleSlice from './slices/vehicleSlice';
import createResourceSlice from './slices/resourceSlice';
import createMessageSlice from './slices/messageSlice';
import createMemorySlice from './slices/memorySlice';

/**
 * Crée un store Zustand en combinant tous les slices
 */
const usePlayerStore = create((set, get) => ({
  // Combine tous les slices pour former le store complet
  ...createPlayerBaseSlice(set, get),
  ...createVehicleSlice(set, get),
  ...createResourceSlice(set, get),
  ...createMessageSlice(set),
  ...createMemorySlice(set),
}));

export default usePlayerStore;