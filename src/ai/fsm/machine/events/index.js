/**
 * ============================================================================
 * ÉVÉNEMENTS FSM - Point d'entrée principal
 * ============================================================================
 * 
 * Ce fichier centralise tous les événements utilisés par la machine à états (FSM).
 * Les événements sont groupés par catégorie pour une meilleure organisation.
 * 
 * @author FSM Optimization
 * @version 1.0.0
 */

// Importer les groupes d'événements
import { systemEvents } from './systemEvents.js';
import { userEvents } from './userEvents.js';
import { emergencyEvents } from './emergencyEvents.js';
import { movementEvents } from './movementEvents.js';
import { resourceEvents } from './resourceEvents.js';
import { fuelEvents } from './fuelEvents.js';

/**
 * Tous les événements de la machine FSM
 * Exportation consolidée de tous les événements
 */
export const events = {
  system: systemEvents,
  user: userEvents,
  emergency: emergencyEvents,
  movement: movementEvents,
  resources: resourceEvents,
  fuel: fuelEvents
};

// Export individuel des groupes d'événements pour un import plus précis
export {
  systemEvents,
  userEvents,
  emergencyEvents,
  movementEvents,
  resourceEvents,
  fuelEvents
};
