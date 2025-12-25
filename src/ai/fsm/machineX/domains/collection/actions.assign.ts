/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * ✅ Phase 4: Pure actions - uses context.gridInfo instead of useTileStore
 * 
 * NOTE: useTileStore is kept ONLY for mutation operations (collectResources, deductResources)
 * which require modifying the tile store directly. All reads use context.gridInfo.
 */

import { assign } from 'xstate';

import { findTilesInRadius, selectRandomTile } from '../../../../../core/spatial/index.ts';
import fsmLogger from '../../../../../logger/fsmLogger.ts';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { VehicleVisualState } from '../../../../../types/vehicle.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Action assign pour le démarrage de la collecte
 * ✅ Phase 4: Uses context.gridInfo.tiles instead of useTileStore.getState()
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
    return {}; // Préserver le contexte
  }
  
  
  if (event.type === 'NEED_COLLECTING') {
    // ✅ Phase 4: Use context.gridInfo instead of useTileStore.getState()
    const tiles = context.gridInfo?.tiles || {};
    const shipPosition = context.vehicle?.position;
    
    // Sélectionner une tuile aléatoire dans un rayon pour la collecte
    const collectingRadius = context.config?.collectingRadius ?? 3;
    const startCoord = shipPosition?.coord;
    const candidateTiles = startCoord ? findTilesInRadius(startCoord, collectingRadius, tiles) : [];
    const targetVehicleTile = selectRandomTile(candidateTiles);
    
    if (!targetVehicleTile) {
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
    return {};
  }
  
  
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
 * Prépare le vaisseau pour la maintenance (le transfert de ressources se fait en maintenance)
 */
export const assignShipReachedBaseContext = createAssignAction(({ context, event }) => {
  fsmLogger.action(`🔄 [${context?.entityId || 'unknown'}] assignShipReachedBaseContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentVehicleState: context.vehicle?.isMoving
  });
  
  if (!context.vehicle) {
    return {};
  }
  
  fsmLogger.action(`🏠 [${context.entityId}] Ship reached base - ready for maintenance`, {
    vehicleResources: context.vehicle.resources,
    vehicleState: context.vehicle.visualState
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      isMoving: false, // ✅ IMPORTANT: Le vaisseau s'arrête à la base
      progress: 100, // Arrivé à la base
      currentSpeed: 0,
      targetVehicleTile: null, // Plus de cible active
      visualState: 'docked' as VehicleVisualState
    },
    lastAction: 'shipReachedBase_success',
    fsmState: 'maintaining_ship_on_base', // 🟢 Passage direct à maintenance pour dépôt
  };
});

/**
 * Action assign pour traiter le chargement des ressources collectées
 * Transfert des ressources de la tuile vers le vaisseau avec gestion de capacité
 */
export const assignShipLoadResourcesContext = createAssignAction(({ context, event }) => {
  fsmLogger.action(`🔄 [${context?.entityId || 'unknown'}] assignShipLoadResourcesContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type
  });
  
  if (!context.vehicle) {
    return {};
  }

  // Récupérer la tuile cible et ses ressources
  const targetTile = context.vehicle.targetVehicleTile;
  if (!targetTile || !targetTile.position?.coord) {
    return {};
  }

  // ⚠️ MUTATION REQUIRED: useTileStore is needed here for write operations
  // collectResources() and deductResources() modify the tile store directly
  // This cannot be done via context.gridInfo which is read-only
  const tileStore = useTileStore.getState();
  const tileCoord = targetTile.position.coord;
  
  // Vérifier si la tuile existe et a des ressources
  const currentTile = tileStore.tiles[tileCoord];
  if (!currentTile || !currentTile.resources || currentTile.resources.total <= 0) {
    fsmLogger.warn(`⚠️ [${context.entityId}] Target tile has no resources to collect`, {
      coord: tileCoord,
      tileExists: !!currentTile,
      resources: currentTile?.resources
    });
    return {};
  }

  // Capacité max du véhicule
  const maxCapacity = typeof context.vehicle.maxCapacity === 'object' 
    ? context.vehicle.maxCapacity.total || 2003
    : Number(context.vehicle.maxCapacity) || 2003;

  // Ressources actuelles du véhicule
  const currentResources = context.vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
  const currentTotal = currentResources.total || 0;
  
  // Espace disponible dans le véhicule
  const availableCapacity = maxCapacity - currentTotal;
  
  if (availableCapacity <= 0) {
    return {};
  }

  // Collecter les ressources via le store (qui gère la logique de déduction)
  const resourcesCollected = tileStore.collectResources(tileCoord, context.entityId);
  
  // Ajuster les ressources collectées selon la capacité disponible
  const totalRequested = resourcesCollected.total;
  const actualCollected = Math.min(totalRequested, availableCapacity);
  
  // Si on ne peut pas tout prendre, ajuster proportionnellement
  if (actualCollected < totalRequested && totalRequested > 0) {
    const ratio = actualCollected / totalRequested;
    resourcesCollected.food = Math.floor(resourcesCollected.food * ratio);
    resourcesCollected.debris = Math.floor(resourcesCollected.debris * ratio);
    resourcesCollected.special = Math.floor(resourcesCollected.special * ratio);
    resourcesCollected.total = resourcesCollected.food + resourcesCollected.debris + resourcesCollected.special;
    
    // Si on ne peut pas tout prendre, déduire seulement ce qu'on peut prendre
    if (actualCollected < totalRequested) {
      const excessResources = {
        food: resourcesCollected.food - Math.floor(resourcesCollected.food * ratio),
        debris: resourcesCollected.debris - Math.floor(resourcesCollected.debris * ratio),
        special: resourcesCollected.special - Math.floor(resourcesCollected.special * ratio)
      };
      
      // Remettre l'excès sur la tuile via le store
      if (excessResources.food > 0 || excessResources.debris > 0 || excessResources.special > 0) {
        tileStore.deductResources(tileCoord, {
          food: -excessResources.food,
          debris: -excessResources.debris,
          special: -excessResources.special
        });
      }
    }
  }

  // Nouvelles ressources du véhicule après collecte
  const newResources = {
    food: (currentResources.food || 0) + (resourcesCollected.food || 0),
    debris: (currentResources.debris || 0) + (resourcesCollected.debris || 0),
    special: (currentResources.special || 0) + (resourcesCollected.special || 0),
    total: 0 // Sera calculé ci-dessous
  };
  newResources.total = newResources.food + newResources.debris + newResources.special;
  
  // Obtenir l'état actuel de la tuile après collecte (le store l'a mise à jour)
  const updatedTile = tileStore.tiles[tileCoord];
  const remainingTileResources = updatedTile.resources;

  // Vérifier si le véhicule est maintenant plein ou presque plein (>80%)
  const isVehicleNearFull = newResources.total >= (maxCapacity * 0.8);
  const tileIsEmpty = remainingTileResources.total <= 0;
  const shouldReturnToBase = isVehicleNearFull || tileIsEmpty;
  
  fsmLogger.action(`📦 [${context.entityId}] Resources transferred from tile:`, {
    tileCoord,
    tileResourcesAfter: remainingTileResources,
    collected: resourcesCollected,
    vehicleResourcesBefore: currentResources,
    vehicleResourcesAfter: newResources,
    vehicleCapacity: `${newResources.total}/${maxCapacity}`,
    capacityUsed: `${Math.round((newResources.total / maxCapacity) * 100)}%`,
    isNearFull: isVehicleNearFull,
    tileIsEmpty,
    shouldReturn: shouldReturnToBase
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      resources: newResources,
      // Mettre à jour la référence à la tuile cible avec les nouvelles ressources
      targetVehicleTile: {
        ...targetTile,
        resources: remainingTileResources,
        collected: tileIsEmpty
      }
    },
    lastAction: 'shipLoadResources_success',
    // Ajouter une indication sur le prochain état recommandé pour la FSM
    shouldReturnToBase
  };
});

// Placeholder pour éviter les erreurs d'import
export const __collectionAssignPlaceholder = createAssignAction(({ context: _context }) => {
  return {};
});
