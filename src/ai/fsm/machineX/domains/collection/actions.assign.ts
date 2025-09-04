/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger';
import { useTileStore } from '../../../../../stores/useTileStore';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { TileStoreType } from '../../../../../types/stores.d.ts';
import type { VehicleVisualState } from '../../../../../types/vehicle.d.ts';
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
  // Utiliser selectTargetTileInRadiusForDrone pour sélectionner une vraie tuile cible (targetVehicleTile)
    const tileStore = useTileStore.getState() as TileStoreType;
    const shipPosition = context.vehicle?.position || context.vehicle?.basePosition || { x: 0, y: 0.5, z: 0 };
    
    // Sélectionner une tuile aléatoire dans un rayon pour la collecte
    const targetVehicleTile = tileStore.tileInRadius(shipPosition, 3);
    if (!targetVehicleTile) {
      fsmLogger.error(`🚢 [${context.entityId}] No target tile found for collection`);
      return {};
    }
    const targetGridCoord = targetVehicleTile.coord;
    const consistentTargetPos = targetVehicleTile.position;
    fsmLogger.info(`🚢 [${context.entityId}] Setting ship target for collection:`, {
      targetPosition: consistentTargetPos,
      targetGridCoord,
      currentPosition: shipPosition,
      coordinateCheck: {
        original: consistentTargetPos,
        recalculated: consistentTargetPos,
        areConsistent: true
      }
    });
    // Mise à jour complète du contexte en une seule fois
    const targetVehicleTileObj = targetVehicleTile;
    
    // Calculer coord pour la position pendant le mouvement
    // Ici coord=null pour optimiser pendant le déplacement
    const positionWithCoord = { ...shipPosition, coord: null as string | null };
    
    const updatedContext = {
      vehicle: {
        ...context.vehicle,
        position: positionWithCoord,
        targetVehicleTile: targetVehicleTileObj, // Utiliser l'objet Tile complet
        isMoving: true, // ✅ IMPORTANT: Le vaisseau est en mouvement vers sa cible
        progress: 0, // Reset du progrès
        currentSpeed: context.vehicle?.maxSpeed || 1,
        visualState: 'moving_to_tile' as VehicleVisualState
      },
      lastAction: 'shipMovingToTile_success',
      fsmState: 'collecting_ship_moving_to_tile', // 🟢 Mise à jour de l'état global FSM
    };
    
    fsmLogger.info(`✅ [${context.entityId}] Ship movement setup result:`, {
      hasVehicle: !!updatedContext.vehicle,
  targetVehicleTile: updatedContext.vehicle?.targetVehicleTile,
      isMoving: updatedContext.vehicle?.isMoving
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
      currentSpeed: 0,
      visualState: 'collecting' as VehicleVisualState
    },
    fsmState: 'collecting_ship_collecting', // 🟢 Mise à jour de l'état global FSM
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
  const basePosition = context.vehicle?.basePosition || { x: 0, y: 0.5, z: 0, coord: '0,0' };
  const baseTile = {
    position: basePosition,
    coord: basePosition.coord ?? '0,0',
    type: 'depart',
    biome: 'station',
    resources: { food: 0, debris: 0, special: 0, total: 0 },
    hasResources: false
  };

  fsmLogger.info(`🔙 [${context.entityId}] Updating vehicle state to returning with target:`, {
    basePosition,
    currentPosition: context.vehicle.position
  });

  return {
    vehicle: {
      ...context.vehicle,
  targetVehicleTile: baseTile, // Utiliser un objet Tile complet pour la base
      isMoving: true, // ✅ IMPORTANT: Le vaisseau doit bouger vers la base
      progress: 0, // Reset du progrès pour le retour
      currentSpeed: context.vehicle?.maxSpeed || 1,
      visualState: 'returning' as VehicleVisualState
    },
    fsmState: 'collecting_ship_returning', // 🟢 Mise à jour de l'état global FSM
  };
});

/**
 * Action assign pour gérer l'arrivée du vaisseau à la base après collecte
 * Dépose les ressources et prépare le retour à l'évaluation
 */
export const assignShipReachedBaseContext = createAssignAction(({ context, event }) => {
  fsmLogger.action(`🔄 [${context?.entityId || 'unknown'}] assignShipReachedBaseContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentVehicleState: context.vehicle?.isMoving
  });
  
  if (!context.vehicle) {
    fsmLogger.info(`⚠️ [${context.entityId}] No vehicle found in context for base arrival`);
    return {};
  }
  
  fsmLogger.action(`🏠 [${context.entityId}] Ship reached base - depositing resources and resetting`);
  
  return {
    vehicle: {
      ...context.vehicle,
      isMoving: false, // ✅ IMPORTANT: Le vaisseau s'arrête à la base
      progress: 100, // Arrivé à la base
      currentSpeed: 0,
  targetVehicleTile: null, // Plus de cible active
      resources: { food: 0, debris: 0, special: 0, total: 0 }, // Ressources déposées
      visualState: 'docked' as VehicleVisualState
    },
    lastAction: 'shipReachedBase_success',
    fsmState: 'evaluating', // 🟢 Retour à l'évaluation après dépose
  };
});

/**
 * Action assign pour traiter le chargement des ressources collectées
 * Mise à jour des ressources du vaisseau après collecte
 */
export const assignShipLoadResourcesContext = createAssignAction(({ context, event }) => {
  fsmLogger.action(`🔄 [${context?.entityId || 'unknown'}] assignShipLoadResourcesContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type
  });
  
  if (!context.vehicle) {
    fsmLogger.error(`⚠️ [${context.entityId}] No vehicle found in context for resource loading`);
    return {};
  }
  
  // Récupérer les ressources collectées depuis l'événement ou utiliser des valeurs par défaut
  const resourcesCollected = (event as Record<string, unknown>)?.resourcesCollected as {
    food?: number;
    debris?: number;
    special?: number;
  } || {
    food: Math.floor(Math.random() * 3) + 1,
    debris: Math.floor(Math.random() * 2) + 1,
    special: Math.random() > 0.7 ? 1 : 0
  };
  
  // Mettre à jour les ressources du véhicule
  const currentResources = context.vehicle.resources || { food: 0, debris: 0, special: 0 };
  const newResources = {
    food: (currentResources.food || 0) + (resourcesCollected.food || 0),
    debris: (currentResources.debris || 0) + (resourcesCollected.debris || 0),
    special: (currentResources.special || 0) + (resourcesCollected.special || 0)
  };
  
  const totalResources = Object.values(newResources).reduce((sum, val) => sum + (val || 0), 0);
  
  fsmLogger.action(`📦 [${context.entityId}] Resources loaded onto ship:`, {
    collected: resourcesCollected,
    previous: currentResources,
    new: newResources,
    total: totalResources
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      resources: {
        ...newResources,
        total: totalResources
      }
    },
    lastAction: 'shipLoadResources_success'
  };
});

// Placeholder pour éviter les erreurs d'import
export const __collectionAssignPlaceholder = createAssignAction(({ context }) => {
  fsmLogger.info(`🔄 [${context.entityId}] Collection assign actions placeholder`);
  return {};
});
