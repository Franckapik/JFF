/**
 * ============================================================================
 * FSM AI - Point d'entrée principal
 * ============================================================================
 * 
 * Export centralisé de tous les composants FSM pour Phase 2.
 * Compatible avec l'ancien système + nouveau système unifié.
 * 
 * @author Migration FSM Phase 2
 * @version 2.0.0
 */

// ============================================================================
// NOUVEAU SYSTÈME FSM (Phase 2)
// ============================================================================

// Contexte et machine
export { 
  createEntityContext, 
  ENTITY_TYPES, 
  FSM_STATES,
  isAutonomous,
  canManualControl,
  getMainVehicle,
  isMoving,
  updateStateHistory
} from './machine/context/initialContext.js';

export { 
  default as botMachine,
  fsmGuards,
  fsmActions
} from './machine/botMachine.js';

// Hook principal Phase 2
export { 
  useBotMachine
} from './hooks/useBotMachine.js';

// ============================================================================
// ANCIEN SYSTÈME FSM (Rétrocompatibilité)
// ============================================================================

// Machine principale (ancien)
export { createBotMachine } from './machine/machineFactory.js';

// Hooks anciens (si ils existent)
// export { useBotActions } from './hooks/useBotActions.js';
// export { useBotEvents } from './hooks/useBotEvents.js';

// États et constantes (ancien)
// export { BOT_STATES } from './machine/states/index.js';

// Guards et actions (pour debug/tests)
export { guards } from './machine/guards/index.js';
export { actions } from './machine/actions/index.js';
export { events } from './machine/events/index.js';

// Utilitaires
export { machineHelpers } from './utils/machineHelpers.js';
export { debugFSM } from './utils/debugging.js';

// Contexte initial
export { createEntityContext } from './machine/context/initialContext.js';
