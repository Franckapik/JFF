/**
 * ============================================================================
 * POSITION ACTIONS CORE - Actions de mise à jour des positions
 * ============================================================================
 * 
 * Actions pour mettre à jour les positions des véhicules dans le contexte FSM.
 * Ces actions sont appelées par les trackers pour synchroniser les positions
 * visuelles avec le contexte de la machine d'état.
 * 
 * @author FSM Position Sync
 * @version 1.0.0
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import { useTileStore } from '../../../../../stores/useTileStore';

// ============================================================================
// ACTIONS DE POSITION DU VAISSEAU
// ============================================================================

/**
 * Met à jour la position du vaisseau principal dans le contexte FSM
 * @param {Object} context - Contexte FSM actuel
 * @param {Object} event - Événement avec position, botId, shipType
 * @returns {Object} - Contexte mis à jour
 */
export const updateShipPosition = (context, event) => {
  const { position, botId, shipType = 'ship', timestamp } = event;
  
  console.log('🚢 [updateShipPosition] Event received:', {
    hasPosition: !!position,
    position,
    botId,
    shipType,
    timestamp,
    contextEntityId: context.entityId
  });
  
  if (!position) {
    fsmLogger.warning(`[${context.entityId || botId}] Ship position update failed: no position provided`);
    return context;
  }

  try {
    // Obtenir les coordonnées de tuile à partir de la position mondiale
    const tileStore = useTileStore.getState();
    const coord = tileStore.worldToGrid ? tileStore.worldToGrid(position) : null;
    
    fsmLogger.context(`[${context.entityId || botId}] Updating ship position`, {
      position,
      coord,
      shipType,
      timestamp
    });

    // Mettre à jour le contexte du véhicule
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        position: { ...position },
        coord: coord,
        lastPositionUpdate: timestamp || Date.now()
      },
      lastAction: 'updateShipPosition_success'
    };
    
  } catch (error) {
    fsmLogger.error(`[${context.entityId || botId}] Ship position update error:`, error);
    return {
      ...context,
      error: error.message,
      lastAction: 'updateShipPosition_failed'
    };
  }
};

/**
 * Met à jour la position de base du vaisseau (position de départ/base)
 * @param {Object} context - Contexte FSM actuel
 * @param {Object} event - Événement avec basePosition, botId
 * @returns {Object} - Contexte mis à jour
 */
export const updateShipBasePosition = (context, event) => {
  const { basePosition, botId, timestamp } = event;
  
  if (!basePosition) {
    fsmLogger.warning(`[${context.entityId || botId}] Ship base position update failed: no position provided`);
    return context;
  }

  try {
    // Obtenir les coordonnées de tuile à partir de la position de base
    const tileStore = useTileStore.getState();
    const startCoord = tileStore.worldToGrid ? tileStore.worldToGrid(basePosition) : null;
    
    fsmLogger.context(`[${context.entityId || botId}] Updating ship base position`, {
      basePosition,
      startCoord,
      timestamp
    });

    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        basePosition: { ...basePosition },
        startCoord: startCoord,
        lastBasePositionUpdate: timestamp || Date.now()
      },
      lastAction: 'updateShipBasePosition_success'
    };
    
  } catch (error) {
    fsmLogger.error(`[${context.entityId || botId}] Ship base position update error:`, error);
    return {
      ...context,
      error: error.message,
      lastAction: 'updateShipBasePosition_failed'
    };
  }
};

// ============================================================================
// ACTIONS DE POSITION DES DRONES
// ============================================================================

/**
 * Met à jour la position d'un drone dans le contexte FSM
 * @param {Object} context - Contexte FSM actuel
 * @param {Object} event - Événement avec position, droneType, botId
 * @returns {Object} - Contexte mis à jour
 */
export const updateDronePosition = (context, event) => {
  const { position, droneType = 'explorer', botId, timestamp } = event;
  
  if (!position || !droneType) {
    fsmLogger.warning(`[${context.entityId || botId}] Drone position update failed: missing position or droneType`);
    return context;
  }

  try {
    // Ajouter un log plus détaillé pour déboguer les mises à jour de positions
    console.log(`🛸 [updateDronePosition] Event received:`, {
      hasPosition: !!position,
      position,
      droneType,
      botId: context.entityId || botId,
      timestamp,
      currentDroneState: context?.droneFleet?.drones?.[droneType]?.state,
      hasTargetPosition: !!context?.droneFleet?.drones?.[droneType]?.targetPosition,
      targetPosition: context?.droneFleet?.drones?.[droneType]?.targetPosition
    });

    fsmLogger.context(`[${context.entityId || botId}] Updating drone position`, {
      position,
      droneType,
      timestamp
    });

    // Si le drone n'a pas de position cible (targetPosition), définir une position par défaut
    const currentDrone = context?.droneFleet?.drones?.[droneType];
    const targetPosition = currentDrone?.targetPosition 
      ? currentDrone.targetPosition 
      : context?.vehicle?.position 
        ? { 
            x: context.vehicle.position.x + 2,
            y: context.vehicle.position.y + 0.5,
            z: context.vehicle.position.z + 2
          }
        : { x: position.x + 2, y: position.y, z: position.z + 2 };

    // Mettre à jour la position du drone dans la flotte
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet?.drones,
          [droneType]: {
            ...context.droneFleet?.drones?.[droneType],
            position: { ...position },
            targetPosition: currentDrone?.targetPosition || targetPosition, // Garantir qu'une cible existe toujours
            lastPositionUpdate: timestamp || Date.now()
          }
        }
      },
      lastAction: 'updateDronePosition_success'
    };
    
  } catch (error) {
    fsmLogger.error(`[${context.entityId || botId}] Drone position update error:`, error);
    return {
      ...context,
      error: error.message,
      lastAction: 'updateDronePosition_failed'
    };
  }
};

// ============================================================================
// EXPORTS ORGANISÉS
// ============================================================================

/**
 * Groupe principal des actions de position
 */
export const positionActions = {
  updateShipPosition,
  updateShipBasePosition,
  updateDronePosition
};

/**
 * Export par défaut avec structure organisée
 */
export default {
  // Actions principales
  actions: positionActions
};
