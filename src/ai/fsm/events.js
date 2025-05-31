/**
 * ============================================================================
 * EXPORT DU SYSTÈME D'ÉVÉNEMENTS
 * ============================================================================
 * 
 * Point d'entrée pour le système d'événements FSM.
 * 
 * @author FSM Optimization
 * @version 1.0.0
 */

// Exporter tous les événements depuis le dossier centralisé
export { events } from './machine/events';

// Exporter les groupes individuels pour un accès direct
export {
  systemEvents,
  userEvents,
  emergencyEvents,
  movementEvents,
  resourceEvents,
  fuelEvents
} from './machine/events';

// Exporter les types d'événements
export {
  SYSTEM_EVENT_TYPES
} from './machine/events/systemEvents.js';

export {
  USER_EVENT_TYPES
} from './machine/events/userEvents.js';

export {
  EMERGENCY_EVENT_TYPES
} from './machine/events/emergencyEvents.js';

export {
  MOVEMENT_EVENT_TYPES
} from './machine/events/movementEvents.js';

export {
  RESOURCE_EVENT_TYPES
} from './machine/events/resourceEvents.js';

export {
  FUEL_EVENT_TYPES
} from './machine/events/fuelEvents.js';
