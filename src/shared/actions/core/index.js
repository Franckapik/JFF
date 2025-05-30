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
import movementCore from './movement.js';
import fuelCore from './fuel.js';
import resourceCore from './resource.js';
import vehicleCore from './vehicle.js';

// ============================================================================
// EXPORTS INDIVIDUELS
// ============================================================================

export { movementActions, movementSelectors, movementGuards, movementEvents } from './movement.js';
export { fuelActions, fuelSelectors, fuelGuards, fuelEvents } from './fuel.js';
export { resourceActions, resourceSelectors, resourceGuards, resourceEvents } from './resource.js';
export { vehicleActions, vehicleSelectors, vehicleGuards, vehicleEvents } from './vehicle.js';

// ============================================================================
// EXPORT GROUPÉ PAR DOMAINE
// ============================================================================

export const movement = movementCore;
export const fuel = fuelCore;
export const resource = resourceCore;
export const vehicle = vehicleCore;

// ============================================================================
// EXPORTS COLLECTIONS - Par type d'interface
// ============================================================================

/**
 * Toutes les actions regroupées par domaine
 */
export const coreActions = {
  movement: movementCore.actions,
  fuel: fuelCore.actions,
  resource: resourceCore.actions,
  vehicle: vehicleCore.actions
};

/**
 * Tous les selectors regroupés par domaine
 */
export const coreSelectors = {
  movement: movementCore.selectors,
  fuel: fuelCore.selectors,
  resource: resourceCore.selectors,
  vehicle: vehicleCore.selectors
};

/**
 * Tous les guards regroupés par domaine
 */
export const coreGuards = {
  movement: movementCore.guards,
  fuel: fuelCore.guards,
  resource: resourceCore.guards,
  vehicle: vehicleCore.guards
};

/**
 * Tous les events regroupés par domaine
 */
export const coreEvents = {
  movement: movementCore.events,
  fuel: fuelCore.events,
  resource: resourceCore.events,
  vehicle: vehicleCore.events
};

// ============================================================================
// EXPORT PAR DÉFAUT - TOUTES LES ACTIONS
// ============================================================================

export default {
  movement: movementCore,
  fuel: fuelCore,
  resource: resourceCore,
  vehicle: vehicleCore,
  
  // Collections pour usage global
  actions: coreActions,
  selectors: coreSelectors,
  guards: coreGuards,
  events: coreEvents
};
