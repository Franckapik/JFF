/**
 * ==========================================================================
 * HOOKS - Exports centralisés
 * ==========================================================================
 * 
 * ✅ Phase 4 Migration: Hooks pour accéder au contexte FSM
 */

// FSM Context hooks (Phase 4)
export { 
  useFSMContext, 
  useFSMContextOnly, 
  useAllBotsFSMContext,
  useGameConfig 
} from './useFSMContext.ts';

// Bot State hooks (Phase 4 - compatibility layer)
export { 
  useBotState, 
  useBotStates 
} from './useBotState.ts';

// Other hooks
export { useDangerMovement } from './useDangerMovement.ts';
