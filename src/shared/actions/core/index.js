/**
 * ============================================================================
 * SHARED ACTIONS CORE - Export centralisé
 * ============================================================================
 * 
 * Point d'entrée principal pour toutes les actions core partagées.
 * Facilite l'import et maintient une interface cohérente.
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

// Import des actions core
import movementCore from './movementActions.js';
import explorationCore from './explorationActions.js';
import fuelCore from './fuelActions.js';
import resourceCore from './resourcesActions.js';
// vehicleCore retiré - fonctionnalités consolidées dans movementActions.js

// ============================================================================
// EXPORTS INDIVIDUELS
// ============================================================================

export { 
  movementActions, 
  movementSelectors, 
  movementGuards, 
  movementEvents,
  // Actions véhicule consolidées depuis movement.js
  updateVehicleProperties,
  activateVehicle,
  deactivateVehicle,
  damageVehicle,
  repairVehicle,
  setVehicleShield,
  setVehicleSpeed,
  // Guards véhicule consolidés depuis movementActions.js
  isVehicleActive,
  isVehicleOperational,
  isVehicleDamaged,
  isVehicleCritical,
  canUseVehicle,
  hasShield,
  // Selectors véhicule consolidés depuis movementActions.js
  getVehicleStatus,
  getHealthPercentage,
  getVehicleEssentials,
  hasActiveShield
} from './movementActions.js';
export { fuelActions, fuelSelectors, fuelGuards, fuelEvents } from './fuelActions.js';
export { resourceActions, resourceSelectors, resourceGuards, resourceEvents } from './resourcesActions.js';
export { 
  explorationActions, 
  explorationSelectors, 
  explorationGuards, 
  explorationEvents,
  EXPLORATION_STATES,
  DISCOVERY_TYPES 
} from './explorationActions.js';

// ============================================================================
// EXPORT GROUPÉ PAR DOMAINE
// ============================================================================

export const movement = movementCore;
export const exploration = explorationCore;
export const fuel = fuelCore;
export const resource = resourceCore;
// vehicle consolidé dans movementActions - plus besoin d'export séparé

// ============================================================================
// EXPORTS COLLECTIONS - Par type d'interface
// ============================================================================

/**
 * Toutes les actions regroupées par domaine
 */
export const coreActions = {
  movement: movementCore.actions,
  exploration: explorationCore.actions,
  fuel: fuelCore.actions,
  resource: resourceCore.actions
  // vehicle consolidé dans movementActions
};

/**
 * Tous les selectors regroupés par domaine
 */
export const coreSelectors = {
  movement: movementCore.selectors,
  exploration: explorationCore.selectors,
  fuel: fuelCore.selectors,
  resource: resourceCore.selectors
  // vehicle consolidé dans movementActions
};

/**
 * Tous les guards regroupés par domaine
 */
export const coreGuards = {
  movement: movementCore.guards,
  exploration: explorationCore.guards,
  fuel: fuelCore.guards,
  resource: resourceCore.guards
  // vehicle consolidé dans movementActions
};

/**
 * Tous les events regroupés par domaine
 */
export const coreEvents = {
  movement: movementCore.events,
  fuel: fuelCore.events,
  resource: resourceCore.events
  // vehicle consolidé dans movementActions
};

// ============================================================================
// EXPORT PAR DÉFAUT - TOUTES LES ACTIONS
// ============================================================================

export default {
  movement: movementCore,
  fuel: fuelCore,
  resource: resourceCore,
  // vehicle consolidé dans movementActions - plus besoin d'export séparé
  
  // Collections pour usage global
  actions: coreActions,
  selectors: coreSelectors,
  guards: coreGuards,
  events: coreEvents
};
