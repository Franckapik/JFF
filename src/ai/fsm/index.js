/**
 * ============================================================================
 * FSM - Point d'entrée principal
 * ============================================================================
 * 
 * Export principal pour la machine FSM optimisée avec React-Robot
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

// Machine principale
export { createBotMachine } from './machine/botMachine.js';

// Hooks
export { useBotMachine } from './hooks/useBotMachine.js';
export { useBotActions } from './hooks/useBotActions.js';
export { useBotEvents } from './hooks/useBotEvents.js';

// États et constantes
export { BOT_STATES } from './machine/states/index.js';

// Guards et actions (pour debug/tests)
export { guards } from './machine/guards/index.js';
export { actions } from './machine/actions/index.js';
export { events } from './machine/events/index.js';

// Utilitaires
export { machineHelpers } from './utils/machineHelpers.js';
export { debugFSM } from './utils/debugging.js';

// Contexte initial
export { createInitialContext } from './machine/context/initialContext.js';
