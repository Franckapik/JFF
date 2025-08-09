/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Action assign pour le démarrage de la collecte
 * Configure le vaisseau pour se déplacer vers la position cible (0,0,0 pour test)
 */
export const assignShipMovingToTileContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignShipMovingToTileContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    contextKeys: Object.keys(context || {})
  });
  
  // Vérification de sécurité pour l'événement
  if (!event || !event.type) {
    fsmLogger.info(`⚠️ [${context?.entityId || 'unknown'}] assignShipMovingToTileContext called with invalid event`);
    return {}; // Préserver le contexte
  }
  
  fsmLogger.info(`🔄 [${context.entityId}] Updating context for ship movement: ${event.type}`);
  
  if (event.type === 'NEED_COLLECTING') {
    // Position cible simplifiée (0,0,0) pour les tests
    const targetPosition = { x: 0, y: 0.5, z: 0 };
    const targetCoord = { coord: '0,0' as const, type: 'collect' as const };
    
    fsmLogger.info(`🚢 [${context.entityId}] Setting ship target for collection:`, {
      targetPosition,
      targetCoord,
      currentPosition: context.vehicle?.position
    });
    
    // Mise à jour complète du contexte en une seule fois
    const updatedContext = {
      vehicle: {
        ...context.vehicle,
        targetTile: targetCoord,
        isMoving: true, // ✅ IMPORTANT: Le vaisseau est en mouvement vers sa cible
        progress: 0, // Reset du progrès
        currentSpeed: context.vehicle?.maxSpeed || 1
      },
      selectedTileForCollection: {
        coord: targetCoord,
        position: targetPosition,
        resources: { food: 10, debris: 5, special: 1, total: 16 } // Ressources simulées
      },
      lastAction: 'shipMovingToTile_success',
      currentState: 'collecting_ship_moving_to_tile', // 🟢 Mise à jour de l'état global FSM
    };
    
    fsmLogger.info(`✅ [${context.entityId}] Ship movement setup result:`, {
      hasVehicle: !!updatedContext.vehicle,
      targetTile: updatedContext.vehicle?.targetTile,
      isMoving: updatedContext.vehicle?.isMoving,
      selectedTile: updatedContext.selectedTileForCollection
    });
    
    return updatedContext;
  }
  
  // Pour les autres événements, ne pas modifier le contexte
  fsmLogger.info(`⚠️ [${context.entityId}] No ship movement needed for event: ${event.type}`);
  return {};
});

/**
 * Action assign pour mettre à jour l'état du vaisseau lors de l'arrivée sur la tuile
 */
export const assignShipCollectingContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignShipCollectingContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentVehicleState: context.vehicle?.isMoving
  });
  
  if (!context.vehicle) {
    fsmLogger.info(`⚠️ [${context.entityId}] No vehicle found in context`);
    return {};
  }
  
  fsmLogger.info(`📦 [${context.entityId}] Updating vehicle state to collecting`);
  
  return {
    vehicle: {
      ...context.vehicle,
      isMoving: false, // ✅ IMPORTANT: Le vaisseau s'arrête pour collecter
      progress: 100, // Arrivé à destination
      currentSpeed: 0
    },
    currentState: 'collecting_ship_collecting', // 🟢 Mise à jour de l'état global FSM
  };
});

/**
 * Action assign pour le retour à la base après collecte
 */
export const assignShipReturningContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignShipReturningContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentVehicleState: context.vehicle?.isMoving
  });
  
  if (!context.vehicle) {
    fsmLogger.info(`⚠️ [${context.entityId}] No vehicle found in context`);
    return {};
  }
  
  // Position de base (pour simplifier, retour à la position initiale)
  const basePosition = context.vehicle?.basePosition || { x: 0, y: 0.5, z: 0 };
  const baseCoord = { coord: '0,0' as const, type: 'base' as const };
  
  fsmLogger.info(`🔙 [${context.entityId}] Updating vehicle state to returning with target:`, {
    basePosition,
    baseCoord,
    currentPosition: context.vehicle.position
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      targetTile: baseCoord,
      isMoving: true, // ✅ IMPORTANT: Le vaisseau doit bouger vers la base
      progress: 0, // Reset du progrès pour le retour
      currentSpeed: context.vehicle?.maxSpeed || 1
    },
    currentState: 'collecting_ship_returning', // 🟢 Mise à jour de l'état global FSM
  };
});

// Placeholder pour éviter les erreurs d'import
export const __collectionAssignPlaceholder = createAssignAction(({ context }) => {
  fsmLogger.info(`🔄 [${context.entityId}] Collection assign actions placeholder`);
  return {};
});
