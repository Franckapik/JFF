/**
 * ============================================================================
 * SHARED ACTIONS CORE - Export centralisé
 * ============================================================================
 * 
 * Point d'entrée principal pour toutes les actions core partagées.
 * Facilite l'import et maintient une interface cohérente.
 * 
 * 📋 MODULES DISPONIBLES:
 * ======================
 * 
 * 🚀 MOVEMENT & VEHICLE (movementActions.js):
 * - Actions: moveToTile, stopMovement, updateProgress, updatePosition, etc.
 * 
 * ⛽ FUEL (fuelActions.js):
 * - Actions: consumeFuel, refuelVehicle, addFuel, setFuelLevel, etc.
 * 
 * 📦 RESOURCES (resourcesActions.js):
 * - Actions: collectResources, depositResources, addResources, etc.
 * 
 * 🔍 EXPLORATION (explorationActions.js):
 * - Actions: startExploration, markTileExplored, recordDiscovery, etc.
 * 
 * 🤖 DRONES (droneActions.js):
 * - Actions: deployDrone, recallDrone, dockDrone, updateDronePosition, etc.
 * 
 * 📊 EXPORTS ORGANISÉS:
 * - Exports individuels par action
 * - Exports groupés par domaine (movement, fuel, resource, exploration, drone)
 * - Collection globale des actions (coreActions)
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

// Import des actions core
import movementCore from './movementActions.js';
import explorationCore from './explorationActions.js';
import fuelCore from './fuelActions.js';
import resourceCore from './resourcesActions.js';
import droneCore from './droneActions.js'; // ✅ AJOUTÉ: Import manquant

// ============================================================================
// EXPORTS INDIVIDUELS - SIMPLIFIÉS (SEULEMENT ACTIONS + UTILS)
// ============================================================================

export { movementActions } from './movementActions.js';
export { fuelActions } from './fuelActions.js';
export { resourceActions } from './resourcesActions.js';
export { explorationActions } from './explorationActions.js';
export { droneDeploymentActions } from './droneActions.js';

// ============================================================================
// EXPORT GROUPÉ PAR DOMAINE - SIMPLIFIÉ
// ============================================================================

export const movement = movementCore;
export const exploration = explorationCore;
export const fuel = fuelCore;
export const resource = resourceCore;
export const drone = droneCore; // ✅ AJOUTÉ: Export manquant

// ============================================================================
// EXPORTS COLLECTIONS - SEULEMENT ACTIONS
// ============================================================================

/**
 * Toutes les actions regroupées par domaine
 */
export const coreActions = {
  movement: movementCore.actions,
  exploration: explorationCore.actions,
  fuel: fuelCore.actions,
  resource: resourceCore.actions,
  drone: droneCore.actions
};

// ============================================================================
// EXPORT PAR DÉFAUT - SIMPLIFIÉ
// ============================================================================

export default {
  movement: movementCore,
  fuel: fuelCore,
  resource: resourceCore,
  exploration: explorationCore,
  drone: droneCore,
  
  // Collection globale des actions
  actions: coreActions
};
