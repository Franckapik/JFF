/**
 * ==========================================================================
 * XSTATE MACHINE EXPORT - Point d'entrée principal de la machineX
 * ==========================================================================
 *
 * Exporte la machine, les actions, guards, états et la config pour usage externe.
 * Chaque module doit être importé et exporté ici pour garantir la cohérence globale.
 *
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0
 */

export { machineX } from './machine.xstate.js';
export * from './actions/index.js';
export * from './guards/guards.all.js';
export * from './states/index.js';
export * from './config/constants.js';
export * from './config/events.config.js';
