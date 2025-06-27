/**
 * ============================================================================
 * FSM AI - Point d'entrée principal (SIMPLIFIÉ)
 * ============================================================================
 * 
 * Export centralisé des éléments réellement utilisés uniquement.
 * 
 * @author Migration FSM Phase 2
 * @version 2.1.0 - Nettoyé
 */

// ============================================================================
// EXPORTS RÉELLEMENT UTILISÉS
// ============================================================================

// Contexte principal
export { 
  createMachineContext, 
  ENTITY_TYPES, 
  isAutonomous,
  canManualControl,
  getMainVehicle,
  isMoving,
  updateStateHistory
} from './machine/context/initialContext.js';

// Hook principal (utilisé par Fleet.jsx)
export { 
  useBotMachine,
  useBotMachineFixed,
  useBotMachineSharedInstance,
  clearBotMachineInstance,
  clearAllBotMachineInstances
} from './hooks/useBotMachine.js';
