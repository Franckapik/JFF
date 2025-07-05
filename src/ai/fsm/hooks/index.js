/**
 * ============================================================================
 * FSM HOOKS INDEX - Exports centralisés (NETTOYÉ)
 * ============================================================================
 * 
 * Point d'entrée pour tous les hooks FSM avec l'architecture moderne.
 */

// === HOOKS CORE ===
export { useBotMachine, useBotMachineFixed, useBotMachineSharedInstance } from './useBotMachine.js';
export { useEventDebounce } from './useEventDebounce.js';

// === TRACKERS SPÉCIALISÉS (NOUVELLE ARCHITECTURE) ===
export { useFSMDroneTracker } from './useFSMDroneTracker.js';
export { useFSMShipTracker } from './useFSMShipTracker.js';

// === ANIMATIONS SPÉCIALISÉES ===
export { useDroneAnimation } from '../../animations/useDroneAnimation.js';
export { useShipAnimation } from '../../animations/useShipAnimation.js';

// === LEGACY SUPPORT (DEPRECATED) ===
// ⚠️ Déprécié : Utiliser useFSMDroneTracker + useFSMShipTracker à la place
export { useFSMPositionTracker } from './useFSMPositionTracker.js';
