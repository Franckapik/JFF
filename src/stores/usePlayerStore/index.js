/**
 * ============================================================================
 * PLAYER STORE - Architecture refactorisée en slices spécialisés
 * ============================================================================
 * 
 * Store principal pour la gestion des joueurs avec responsabilités séparées :
 * - vehicleSlice : Gestion de base des véhicules (CRUD)
 * - movementSlice : Système de mouvement et navigation
 * - fuelSlice : Gestion du carburant
 * - resourceSlice : Gestion des ressources et dépôts
 * - memorySlice : Mémoire persistante des joueurs
 * - messageSlice : Système de messagerie
 * 
 * @version 2.0.0
 */

import { create } from 'zustand';

// Import des slices spécialisés
import createPlayerSlice from './slices/playerSlice';
import createVehicleSlice from './slices/vehicleSlice';
import createMovementSlice from './slices/movementSlice';
import createFuelSlice from './slices/fuelSlice';
import createResourceSlice from './slices/resourceSlice';
import createMemorySlice from './slices/memorySlice';
import createMessageSlice from './slices/messageSlice';

/**
 * Crée un store Zustand en combinant tous les slices spécialisés
 */
const usePlayerStore = create((set, get) => ({
  // Combine tous les slices (playerSlice fournit l'état initial et initializePlayer)
  ...createPlayerSlice(set, get),
  ...createVehicleSlice(set, get),
  ...createMovementSlice(set, get),
  ...createFuelSlice(set, get),
  ...createResourceSlice(set, get),
  ...createMemorySlice(set, get),
  ...createMessageSlice(set, get),

  // Wrapper pour maintenir la compatibilité
  updateVehicle: (playerId, vehicleId, updates) => {
    const { updateVehicle: vehicleUpdate, processResourceDeposit } = get();
    
    // Mise à jour standard
    vehicleUpdate(playerId, vehicleId, updates);
    
    // Vérifier si un dépôt de ressources est nécessaire
    processResourceDeposit(playerId, vehicleId);
  },

  // ...existing methods...
}));

export default usePlayerStore;