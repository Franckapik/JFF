/**
 * ============================================================================
 * FSM HOOKS INDEX - Exports centralisés
 * ============================================================================
 * 
 * Point d'entrée pour tous les hooks FSM avec l'architecture refactorisée.
 */

// === HOOKS CORE ===
export { useBotMachine, useBotMachineFixed, useBotMachineSharedInstance } from './useBotMachineCompat.js';
export { useEventDebounce } from './useEventDebounce.js';
export { useCentralizedEventHistorySync } from './useCentralizedEventHistorySync.js';

// === TRACKERS SPÉCIALISÉS (NOUVELLE ARCHITECTURE) ===
export { useFSMDroneTracker } from './useFSMDroneTracker.js';
export { useFSMShipTracker } from './useFSMShipTracker.js';

// === ANIMATIONS SPÉCIALISÉES ===
export { useDroneAnimation } from '../../animations/useDroneAnimation.js';
export { useShipAnimation } from '../../animations/useShipAnimation.js';

// === LEGACY SUPPORT (DEPRECATED) ===
// ⚠️ Déprécié : Utiliser useFSMDroneTracker + useFSMShipTracker à la place
export { useFSMPositionTracker } from './useFSMPositionTracker.js';
