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
    canManualControl, createMachineContext, ENTITY_TYPES, getMainVehicle, isAutonomous, isMoving,
    updateStateHistory
} from './machineX/context/initialContext.ts';

// Hook principal (utilisé par Fleet.jsx)
export {
    clearAllBotMachineInstances, clearBotMachineInstance, useBotMachine,
    useBotMachineFixed,
    useBotMachineSharedInstance
} from './hooks/useBotMachine.js';

