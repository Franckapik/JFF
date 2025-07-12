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

import fsmLogger from '../../../../../logger/fsmLogger.ts';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import type { WorldPosition } from '../../../../../types/coordinates';
import type { DroneType } from '../../../../../types/drone';
import type { FSMContext, FSMEvent } from '../../../../../types/fsm';

// ============================================================================
// INTERFACES D'ÉVÉNEMENTS
// ============================================================================

interface ShipPositionEvent extends FSMEvent {
  position?: WorldPosition;
  botId?: string;
  shipType?: string;
  timestamp?: number;
}

interface ShipBasePositionEvent extends FSMEvent {
  basePosition?: WorldPosition;
  botId?: string;
  shipType?: string;
  timestamp?: number;
}

interface DronePositionEvent extends FSMEvent {
  position?: WorldPosition;
  droneType?: DroneType;
  botId?: string;
  timestamp?: number;
}

// ============================================================================
// ACTIONS DE POSITION DU VAISSEAU
// ============================================================================

/**
 * Met à jour la position du vaisseau principal dans le contexte FSM
 * @param context - Contexte FSM actuel
 * @param event - Événement avec position, botId, shipType
 * @returns - Contexte mis à jour
 */
export const updateShipPosition = (context: FSMContext, event: ShipPositionEvent): FSMContext => {
  // Vérification de sécurité pour l'événement
  if (!event) {
    fsmLogger.info(`[${context?.entityId || 'unknown'}] Ship position update failed: event is undefined`);
    return context;
  }

  const { position, botId, shipType = 'ship', timestamp } = event;
  
  if (!position) {
    fsmLogger.info(`[${context.entityId || botId}] Ship position update failed: no position provided`);
    return context;
  }

  try {
    // Obtenir les coordonnées de tuile à partir de la position mondiale
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tileStore = useTileStore.getState() as any;
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
        coord: coord || context.vehicle.coord
      },
      explorationCycle: {
        ...context.explorationCycle,
        isActive: false
      },
      lastAction: 'updateShipPosition_success'
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    fsmLogger.error(`[${context.entityId || botId}] Ship position update error:`, error);
    return {
      ...context,
      error: errorMessage,
      lastAction: 'updateShipPosition_failed'
    };
  }
};

/**
 * Met à jour la position de base du vaisseau (position de départ)
 * @param context - Contexte FSM actuel
 * @param event - Événement avec basePosition, botId, shipType
 * @returns - Contexte mis à jour
 */
export const updateShipBasePosition = (context: FSMContext, event: ShipBasePositionEvent): FSMContext => {
  const { basePosition, botId, shipType = 'ship', timestamp } = event;
  
  if (!basePosition) {
    fsmLogger.info(`[${context.entityId || botId}] Ship base position update failed: no basePosition provided`);
    return context;
  }

  try {
    // Obtenir les coordonnées de tuile à partir de la position mondiale
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tileStore = useTileStore.getState() as any;
    const startCoord = tileStore.worldToGrid ? tileStore.worldToGrid(basePosition) : null;
    
    fsmLogger.context(`[${context.entityId || botId}] Updating ship base position`, {
      basePosition,
      startCoord,
      shipType,
      timestamp
    });

    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        basePosition: { ...basePosition },
        startCoord: startCoord || context.vehicle.startCoord
      },
      lastAction: 'updateShipBasePosition_success'
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    fsmLogger.error(`[${context.entityId || botId}] Ship base position update error:`, error);
    return {
      ...context,
      error: errorMessage,
      lastAction: 'updateShipBasePosition_failed'
    };
  }
};

// ============================================================================
// ACTIONS DE POSITION DES DRONES
// ============================================================================

/**
 * Met à jour la position d'un drone dans le contexte FSM
 * @param context - Contexte FSM actuel
 * @param event - Événement avec position, droneType, botId
 * @returns - Contexte mis à jour
 */
export const updateDronePosition = (context: FSMContext, event: DronePositionEvent): FSMContext => {
  // Vérification de sécurité pour l'événement
  if (!event) {
    fsmLogger.info(`[${context?.entityId || 'unknown'}] Drone position update failed: event is undefined`);
    return context;
  }

  const { position, droneType = 'explorer', botId, timestamp: _timestamp } = event;
  
  if (!position || !droneType) {
    fsmLogger.info(`[${context.entityId || botId}] Drone position update failed: missing position or droneType`);
    return context;
  }

  try {
    // Obtenir le drone actuel pour préserver les données existantes
    const currentDrone = context.droneFleet?.drones?.[droneType];
    const targetPosition = currentDrone?.targetPosition;

    fsmLogger.context(`🛸 [${context.entityId || botId}] ${droneType} position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);

    // Déterminer si le drone doit être considéré comme "en mouvement"
    // On considère qu'il est en mouvement si la position diffère de la target ET qu'il est dans un état de déplacement
    const isMoving = currentDrone?.state === 'deploying' || currentDrone?.state === 'scanning' || currentDrone?.state === 'returning';
    const atTarget = position.x === (currentDrone?.targetPosition?.x ?? position.x)
      && position.y === (currentDrone?.targetPosition?.y ?? position.y)
      && position.z === (currentDrone?.targetPosition?.z ?? position.z);

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet?.drones,
          [droneType]: {
            ...context.droneFleet?.drones?.[droneType],
            position: { ...position },
            targetPosition: currentDrone?.targetPosition || targetPosition || position,
            isMoving: isMoving && !atTarget
          }
        }
      },
      lastAction: 'updateDronePosition_success'
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    fsmLogger.error(`[${context.entityId || botId}] Drone position update error:`, error);
    return {
      ...context,
      error: errorMessage,
      lastAction: 'updateDronePosition_failed'
    };
  }
};

// ============================================================================
// ACTIONS D'INITIALISATION DES DRONES
// ============================================================================

interface DroneInitRequestEvent extends FSMEvent {
  droneType?: DroneType;
  botId?: string;
}

/**
 * Traite une demande d'initialisation de drone et calcule sa position
 * Cette action est déclenchée par DRONE_INITIALIZE_REQUEST
 * @param context - Contexte FSM actuel
 * @param event - Événement avec droneType, botId
 * @returns - Contexte mis à jour avec le drone initialisé
 */
export const processDroneInitRequest = (context: FSMContext, event: DroneInitRequestEvent): FSMContext => {
  if (!event) {
    fsmLogger.info(`[${context?.entityId || 'unknown'}] Drone init request failed: event is undefined`);
    return context;
  }

  const { droneType = 'explorer', botId } = event;
  
  // ✅ ATTENDRE QUE LE VAISSEAU AIT UNE POSITION VALIDE
  if (!context?.vehicle?.position || (context.vehicle.position.x === 0 && context.vehicle.position.y === 0 && context.vehicle.position.z === 0)) {
    fsmLogger.debug(`[${context.entityId || botId}] Drone init request deferred: waiting for ship position`);
    // Retourner le contexte inchangé pour que l'init soit retentée
    return context;
  }

  try {
    const shipPosition = context.vehicle.position;
    
    // Calcul de la position initiale selon le type de drone
    const initialOffsets = {
      explorer: { x: 0.5, y: 0.3, z: 0.5 },
      combat: { x: -0.5, y: 0.3, z: 0.5 },
      special: { x: 0, y: 0.3, z: -0.7 }
    };

    const offset = initialOffsets[droneType] || initialOffsets.explorer;
    const initialPosition: WorldPosition = {
      x: shipPosition.x + offset.x,
      y: shipPosition.y + offset.y,
      z: shipPosition.z + offset.z
    };

    fsmLogger.context(`🛸 [${context.entityId || botId}] Processing ${droneType} drone init request`, {
      shipPosition,
      initialPosition,
      droneType
    });

    // Initialiser le drone avec la position calculée
    const initializedDrone = {
      id: `${context.entityId || botId}-${droneType}`,
      type: droneType,
      state: 'docked' as const, // Passer directement à 'docked' après calcul
      position: { ...initialPosition },
      targetPosition: { ...initialPosition },
      isActive: true,
      isMoving: false,
      lastUpdate: Date.now()
    };

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet?.drones,
          [droneType]: initializedDrone
        }
      },
      lastAction: 'processDroneInitRequest_success'
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    fsmLogger.error(`[${context.entityId || botId}] Drone init request error:`, error);
    return {
      ...context,
      error: errorMessage,
      lastAction: 'processDroneInitRequest_failed'
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
  updateDronePosition,
  processDroneInitRequest
};

/**
 * Export par défaut avec structure organisée
 */
export default {
  // Actions principales
  actions: positionActions
};
