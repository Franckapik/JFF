/**
 * ============================================================================
 * DRONE EXPLORING ACTIONS CORE - Actions d'exploration des drones
 * ============================================================================
 * 
 * Actions pures pour l'exploration et la découverte par les drones.
 * Fusionne les fonctionnalités de droneActions.js et explorationActions.js.
 * 
 * 📋 FONCTIONS DISPONIBLES DANS CE FICHIER:
 * ==========================================
 * 
 * 🤖 ACTIONS DRONE (droneExploringActions):
 * - droneDeployForExploration(context, event) : Déploie drone vers zone cible
 * - droneRecallToShip(context, event) : Rappelle drone au vaisseau
 * - droneDockToShip(context, event) : Finalise retour drone (ancré)
 * - droneUpdatePosition(context, event) : Met à jour position drone
 * - droneStartExploration(context, event) : Démarre mission d'exploration
 * - droneMarkTileExplored(context, event) : Marque tuile comme explorée
 * - droneRecordDiscovery(context, event) : Enregistre découverte ressource
 * - droneUpdateExplorationStatus(context, event) : Met à jour statut exploration
 * - droneCompleteExploration(context, event) : Termine exploration actuelle
 * - droneCancelExploration(context, event) : Annule exploration en cours
 * - droneMarkDiscoveriesProcessed(context) : Marque découvertes comme traitées
 * 
 * 🔄 RÉTROCOMPATIBILITÉ:
 * - droneFleetActions : Actions drone fleet héritées
 * - droneDeploymentActions : Actions drone deployment héritées
 * - explorationActions : Actions exploration héritées
 * 
 * 🔧 UTILITAIRES INTERNES:
 * - calculateDroneFleetStatus(context) : Calcule statut flotte depuis états individuels
 * - selectTargetTileInRadiusForDrone(context, range) : Sélectionne tuile cible
 * - validateExplorationZone(zone) : Validation zone exploration
 * - validateDiscovery(discovery) : Validation découverte
 * 
 * @author Migration FSM - Actions Métier
 * @version 3.0.0
 */

import { 
  DRONE_DEPLOYMENT_STATES, 
  DRONE_TYPES, 
  DRONE_VISUAL_STATES, 
  DRONE_CONFIG,
  EXPLORATION_STATES, 
  DISCOVERY_TYPES, 
  EXPLORATION_CONFIG 
} from '../../constants/constants.js';
import { useTileStore } from '../../../../../stores/useTileStore/index.js';

// ============================================================================
// UTILITAIRES INTERNES - FUSION DRONES + EXPLORATION
// ============================================================================

/**
 * Calcule le statut global de la flotte basé sur les états individuels des drones
 * @param {Object} context - Contexte actuel
 * @returns {string} - Status calculé ('docked', 'active', 'returning')
 */
export const calculateDroneFleetStatus = (context) => {
  const explorer = context.droneFleet?.drones?.explorer;
  
  if (!explorer || !explorer.isActive) {
    return 'docked';
  }
  
  if (explorer.state === 'returning') {
    return 'returning';
  }
  
  if (explorer.state === 'deploying' || explorer.state === 'exploring') {
    return 'active';
  }
  
  return 'docked';
};

/**
 * Sélectionne une tuile cible dans un rayon donné autour du véhicule (pour drones)
 */
const selectTargetTileInRadiusForDrone = (context, range = 3) => {
  try {
    const tileStore = useTileStore.getState();
    const vehicle = context.vehicle || context.botVehicle;
    
    if (!vehicle || !vehicle.coord) {
      console.warn('[selectTargetTileInRadiusForDrone] Vehicle or vehicle.coord not found in context');
      return { x: 0, y: 0.5, z: 0 };
    }

    const walkableTiles = tileStore.getWalkableTilesInRadius(
      vehicle.coord,
      range,
      true, // Seulement les tuiles non explorées
      true  // Exclure les tuiles dangereuses
    );
    
    const validTargets = walkableTiles.filter(tile => 
      tile.coord !== vehicle.coord && 
      tile.position && 
      tile.distance > 0
    );
    
    if (validTargets.length === 0) {
      console.warn('[selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile');
      
      const randomTile = tileStore.selectRandomWalkableTile();
      if (randomTile && randomTile.position) {
        return {
          x: randomTile.position.x,
          y: randomTile.position.y + 0.5,
          z: randomTile.position.z
        };
      }
      
      const fallbackAngle = Math.random() * Math.PI * 2;
      const fallbackDistance = Math.min(range, 2);
      return {
        x: vehicle.position.x + Math.cos(fallbackAngle) * fallbackDistance,
        y: vehicle.position.y + 0.5,
        z: vehicle.position.z + Math.sin(fallbackAngle) * fallbackDistance
      };
    }

    const targetTile = validTargets[0];
    
    return {
      x: targetTile.position.x,
      y: targetTile.position.y + 0.5,
      z: targetTile.position.z
    };
    
  } catch (error) {
    console.error('[selectTargetTileInRadiusForDrone] Error selecting target tile:', error);
    
    const vehicle = context.vehicle || context.botVehicle;
    if (vehicle && vehicle.position) {
      const safeAngle = Math.random() * Math.PI * 2;
      const safeDistance = Math.min(range, 2);
      return {
        x: vehicle.position.x + Math.cos(safeAngle) * safeDistance,
        y: vehicle.position.y + 0.5,
        z: vehicle.position.z + Math.sin(safeAngle) * safeDistance
      };
    }
    
    return { x: 0, y: 0.5, z: 0 };
  }
};

/**
 * Validation d'une zone d'exploration
 */
const validateExplorationZone = (zone) => {
  if (!zone || typeof zone !== 'object') {
    throw new Error('Exploration zone must be a valid object');
  }
  
  if (!zone.center || typeof zone.center !== 'string') {
    throw new Error('Exploration zone must have a valid center coordinate');
  }
  
  const radius = Number(zone.radius) || EXPLORATION_CONFIG.DEFAULT_RADIUS;
  if (radius < 1 || radius > 10) {
    throw new Error('Exploration radius must be between 1 and 10');
  }
  
  return {
    center: zone.center,
    radius,
    priority: zone.priority || 'normal',
    type: zone.type || 'general'
  };
};

/**
 * Validation d'une découverte
 */
const validateDiscovery = (discovery) => {
  if (!discovery || typeof discovery !== 'object') {
    throw new Error('Discovery must be a valid object');
  }
  
  if (!discovery.coord || !discovery.type) {
    throw new Error('Discovery must have coord and type');
  }
  
  if (!Object.values(DISCOVERY_TYPES).includes(discovery.type)) {
    throw new Error(`Invalid discovery type. Must be one of: ${Object.values(DISCOVERY_TYPES).join(', ')}`);
  }
  
  return {
    coord: discovery.coord,
    type: discovery.type,
    data: discovery.data || {},
    timestamp: discovery.timestamp || Date.now(),
    id: discovery.id || `discovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

// ============================================================================
// 🤖 DRONE EXPLORING ACTIONS - Actions principales avec préfixes drone
// ============================================================================

/**
 * Actions d'exploration spécialisées pour drones avec nommage explicite
 */
export const droneExploringActions = {
  
  // ========================================================================
  // 🤖 ACTIONS DRONE DEPLOYMENT - Déploiement et contrôle des drones
  // ========================================================================

  /**
   * Déploie un drone vers une zone cible pour exploration
   */
  droneDeployForExploration: (context, event) => {
    try {
      // Validation simple interne
      const droneType = event.droneType || DRONE_TYPES.explorer;
      const range = event.range || 3;
      
      // Vérifier si le drone existe dans la flotte
      if (!context.droneFleet?.drones[droneType]) {
        return {
          ...context,
          error: `Drone ${droneType} not found in fleet`,
          lastAction: 'droneDeployForExploration_failed'
        };
      }

      // Utiliser le tileStore pour obtenir une position réelle dans un rayon de 3 tuiles
      const targetPosition = selectTargetTileInRadiusForDrone(context, range);

      const updatedDrone = {
        ...context.droneFleet.drones[droneType],
        state: DRONE_VISUAL_STATES.deploying,
        targetPosition,
        isActive: true,
        lastUpdate: Date.now()
      };

      return {
        ...context,
        droneFleet: {
          ...context.droneFleet,
          currentMission: {
            type: 'exploration',
            target: `${range}unit-radius`,
            drone: droneType,
            startTime: Date.now(),
            estimatedReturn: Date.now() + (range * 2000)
          },
          missionStartTime: Date.now(),
          drones: {
            ...context.droneFleet.drones,
            [droneType]: updatedDrone
          }
        },
        lastAction: 'droneDeployForExploration_success'
      };
    } catch (error) {
      return {
        ...context,
        error: error.message,
        lastAction: 'droneDeployForExploration_failed'
      };
    }
  },

  /**
   * Rappelle le drone au vaisseau
   */
  droneRecallToShip: (context, event = {}) => {
    const droneType = event.droneType || DRONE_TYPES.explorer;
    
    if (!context.droneFleet?.drones[droneType]?.isActive) {
      return {
        ...context,
        error: `Drone ${droneType} is not active`,
        lastAction: 'droneRecallToShip_failed'
      };
    }

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [droneType]: {
            ...context.droneFleet.drones[droneType],
            state: DRONE_VISUAL_STATES.returning,
            targetPosition: context.vehicle?.position || null,
            lastUpdate: Date.now()
          }
        }
      },
      lastAction: 'droneRecallToShip_success'
    };
  },

  /**
   * Finalise le retour du drone (drone ancré au ship)
   */
  droneDockToShip: (context, event = {}) => {
    const droneType = event.droneType || DRONE_TYPES.explorer;
    
    if (!context.droneFleet?.drones[droneType]) {
      return {
        ...context,
        error: `Drone ${droneType} not found`,
        lastAction: 'droneDockToShip_failed'
      };
    }

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        currentMission: null,
        missionStartTime: null,
        drones: {
          ...context.droneFleet.drones,
          [droneType]: {
            ...context.droneFleet.drones[droneType],
            state: DRONE_VISUAL_STATES.docked,
            position: context.vehicle?.position || null,
            targetPosition: null,
            missionTarget: null,
            isActive: false,
            lastUpdate: Date.now()
          }
        }
      },
      lastAction: 'droneDockToShip_success'
    };
  },

  /**
   * Met à jour la position du drone dans la flotte
   */
  droneUpdatePosition: (context, event) => {
    const { droneType = DRONE_TYPES.explorer, position, state } = event;
    
    if (!context.droneFleet?.drones[droneType]) {
      return context;
    }
    
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [droneType]: {
            ...context.droneFleet.drones[droneType],
            position,
            state: state || context.droneFleet.drones[droneType].state,
            lastUpdate: Date.now()
          }
        }
      },
      lastAction: 'droneUpdatePosition_success'
    };
  },

  // ========================================================================
  // 🔍 ACTIONS DRONE EXPLORATION - Exploration et découverte
  // ========================================================================

  /**
   * Démarre une mission d'exploration par drone
   */
  droneStartExploration: (context, event) => {
    try {
      const validatedZone = validateExplorationZone(event.explorationZone);
      
      // Validation simple interne
      if (context.explorationState?.status === EXPLORATION_STATES.EXPLORING) {
        return { ...context, error: 'Cannot start drone exploration: exploration already in progress' };
      }
      
      if (context.vehicle?.isMoving) {
        return { ...context, error: 'Cannot start drone exploration: vehicle is moving' };
      }
      
      return {
        ...context,
        explorationState: {
          status: EXPLORATION_STATES.SEARCHING_TARGET,
          zone: validatedZone,
          startTime: Date.now(),
          targetCoord: null,
          progress: 0
        },
        currentExplorationZone: validatedZone,
        lastAction: 'droneStartExploration_success'
      };
    } catch (error) {
      return { ...context, error: error.message, lastAction: 'droneStartExploration_failed' };
    }
  },

  /**
   * Marque une tuile comme explorée par drone
   */
  droneMarkTileExplored: (context, event) => {
    if (!event.tileCoord) {
      return { ...context, error: 'Tile coordinate is required to mark as explored by drone' };
    }
    
    const exploredTiles = new Set(context.exploredTiles || []);
    exploredTiles.add(event.tileCoord);
    
    return {
      ...context,
      exploredTiles: Array.from(exploredTiles),
      lastExploration: {
        coord: event.tileCoord,
        timestamp: Date.now(),
        exploredBy: 'drone'
      },
      explorationCount: (context.explorationCount || 0) + 1,
      lastAction: 'droneMarkTileExplored_success'
    };
  },

  /**
   * Enregistre une découverte de ressource ou autre par drone
   */
  droneRecordDiscovery: (context, event) => {
    try {
      const validatedDiscovery = validateDiscovery(event.discovery);
      
      const discoveries = [...(context.resourceDiscoveries || [])];
      discoveries.push({
        ...validatedDiscovery,
        discoveredBy: 'drone'
      });
      
      return {
        ...context,
        resourceDiscoveries: discoveries,
        hasNewDiscovery: true,
        lastDiscovery: validatedDiscovery,
        discoveryCount: (context.discoveryCount || 0) + 1,
        lastAction: 'droneRecordDiscovery_success'
      };
    } catch (error) {
      return { ...context, error: error.message, lastAction: 'droneRecordDiscovery_failed' };
    }
  },

  /**
   * Met à jour le statut d'exploration par drone
   */
  droneUpdateExplorationStatus: (context, event) => {
    if (!context.explorationState) {
      return { ...context, error: 'No active drone exploration to update' };
    }
    
    if (!Object.values(EXPLORATION_STATES).includes(event.newStatus)) {
      return { ...context, error: `Invalid drone exploration status: ${event.newStatus}` };
    }
    
    const updatedState = {
      ...context.explorationState,
      status: event.newStatus,
      lastUpdate: Date.now()
    };
    
    if (event.targetCoord) {
      updatedState.targetCoord = event.targetCoord;
    }
    
    if (event.newStatus === EXPLORATION_STATES.COMPLETED) {
      updatedState.endTime = Date.now();
      updatedState.duration = updatedState.endTime - updatedState.startTime;
    }
    
    return {
      ...context,
      explorationState: updatedState,
      lastAction: 'droneUpdateExplorationStatus_success'
    };
  },

  /**
   * Termine l'exploration actuelle par drone
   */
  droneCompleteExploration: (context, event) => {
    if (!context.explorationState) {
      return context;
    }
    
    const endTime = Date.now();
    const duration = endTime - context.explorationState.startTime;
    
    return {
      ...context,
      explorationState: {
        ...context.explorationState,
        status: EXPLORATION_STATES.COMPLETED,
        endTime,
        duration,
        reason: event?.reason || 'completed',
        completedBy: 'drone'
      },
      lastCompletedExploration: {
        zone: context.explorationState.zone,
        duration,
        tilesExplored: context.explorationCount || 0,
        discoveries: context.discoveryCount || 0,
        timestamp: endTime,
        completedBy: 'drone'
      },
      lastAction: 'droneCompleteExploration_success'
    };
  },

  /**
   * Annule l'exploration en cours par drone
   */
  droneCancelExploration: (context, event) => {
    if (!context.explorationState) {
      return context;
    }
    
    return {
      ...context,
      explorationState: null,
      currentExplorationZone: null,
      hasNewDiscovery: false,
      error: event?.reason || 'Drone exploration cancelled',
      lastAction: 'droneCancelExploration_success'
    };
  },

  /**
   * Marque les découvertes comme traitées par drone
   */
  droneMarkDiscoveriesProcessed: (context) => {
    return {
      ...context,
      hasNewDiscovery: false,
      lastAction: 'droneMarkDiscoveriesProcessed_success'
    };
  }
};

// ============================================================================
// 🔄 RÉTROCOMPATIBILITÉ - Actions héritées (utilise droneExploringActions)
// ============================================================================

/**
 * Actions drone fleet héritées
 * @deprecated Utilisez droneExploringActions avec préfixes explicites
 */
export const droneFleetActions = {
  /**
   * Déploie un drone vers une zone cible pour exploration
   * @deprecated Utilisez droneExploringActions.droneDeployForExploration
   */
  deployDroneForExploration: (context, event) => droneExploringActions.droneDeployForExploration(context, event),

  /**
   * Rappelle le drone au vaisseau
   * @deprecated Utilisez droneExploringActions.droneRecallToShip
   */
  recallDroneToShip: (context, event) => droneExploringActions.droneRecallToShip(context, event),

  /**
   * Finalise le retour du drone (drone ancré au ship)
   * @deprecated Utilisez droneExploringActions.droneDockToShip
   */
  dockDroneToShip: (context, event) => droneExploringActions.droneDockToShip(context, event),

  /**
   * Met à jour la position du drone dans la flotte
   * @deprecated Utilisez droneExploringActions.droneUpdatePosition
   */
  updateDroneFleetPosition: (context, event) => droneExploringActions.droneUpdatePosition(context, event)
};

/**
 * Actions drone deployment héritées
 * @deprecated Utilisez droneExploringActions avec préfixes explicites
 */
export const droneDeploymentActions = {
  /**
   * Déploie un drone vers une zone cible
   * @deprecated Utilisez droneExploringActions.droneDeployForExploration
   */
  deployDrone: (context, event) => droneExploringActions.droneDeployForExploration(context, event),

  /**
   * Rappelle le drone au vaisseau
   * @deprecated Utilisez droneExploringActions.droneRecallToShip
   */
  recallDrone: (context, event) => droneExploringActions.droneRecallToShip(context, event),

  /**
   * Finalise le retour du drone (drone ancré)
   * @deprecated Utilisez droneExploringActions.droneDockToShip
   */
  dockDrone: (context, event) => droneExploringActions.droneDockToShip(context, event),

  /**
   * Met à jour la position du drone
   * @deprecated Utilisez droneExploringActions.droneUpdatePosition
   */
  updateDronePosition: (context, event) => droneExploringActions.droneUpdatePosition(context, event)
};

/**
 * Actions exploration héritées
 * @deprecated Utilisez droneExploringActions avec préfixes explicites
 */
export const explorationActions = {
  /**
   * Démarre une mission d'exploration
   * @deprecated Utilisez droneExploringActions.droneStartExploration
   */
  startExploration: (context, event) => droneExploringActions.droneStartExploration(context, event),

  /**
   * Marque une tuile comme explorée
   * @deprecated Utilisez droneExploringActions.droneMarkTileExplored
   */
  markTileExplored: (context, event) => droneExploringActions.droneMarkTileExplored(context, event),

  /**
   * Enregistre une découverte de ressource ou autre
   * @deprecated Utilisez droneExploringActions.droneRecordDiscovery
   */
  recordDiscovery: (context, event) => droneExploringActions.droneRecordDiscovery(context, event),

  /**
   * Met à jour le statut d'exploration
   * @deprecated Utilisez droneExploringActions.droneUpdateExplorationStatus
   */
  updateExplorationStatus: (context, event) => droneExploringActions.droneUpdateExplorationStatus(context, event),

  /**
   * Termine l'exploration actuelle
   * @deprecated Utilisez droneExploringActions.droneCompleteExploration
   */
  completeExploration: (context, event) => droneExploringActions.droneCompleteExploration(context, event),

  /**
   * Annule l'exploration en cours
   * @deprecated Utilisez droneExploringActions.droneCancelExploration
   */
  cancelExploration: (context, event) => droneExploringActions.droneCancelExploration(context, event),

  /**
   * Marque les découvertes comme traitées
   * @deprecated Utilisez droneExploringActions.droneMarkDiscoveriesProcessed
   */
  markDiscoveriesProcessed: (context) => droneExploringActions.droneMarkDiscoveriesProcessed(context)
};

// ============================================================================
// EVENTS SPÉCIALISÉS NÉCESSAIRES
// ============================================================================

export const droneExploringEvents = {
  /**
   * Crée un événement de déploiement de drone
   * @param {string} targetArea - Zone cible pour l'exploration
   * @param {string} droneType - Type de drone
   * @param {Object} options - Options supplémentaires
   * @returns {Object} - Événement formaté
   */
  createDroneDeployEvent: (targetArea, droneType = DRONE_TYPES.explorer, options = {}) => ({
    type: 'DRONE_DEPLOY_FOR_EXPLORATION',
    targetArea,
    droneType,
    range: options.range,
    priority: options.priority,
    timestamp: Date.now()
  }),

  /**
   * Crée un événement de rappel de drone
   * @returns {Object} - Événement formaté
   */
  createDroneRecallEvent: () => ({
    type: 'DRONE_RECALL_TO_SHIP',
    timestamp: Date.now()
  }),

  /**
   * Crée un événement d'ancrage de drone
   * @param {Object} returnData - Données de retour
   * @returns {Object} - Événement formaté
   */
  createDroneDockEvent: (returnData = null) => ({
    type: 'DRONE_DOCK_TO_SHIP',
    returnData,
    timestamp: Date.now()
  }),

  /**
   * Crée un événement de mise à jour de position de drone
   * @param {Object} position - Position du drone
   * @returns {Object} - Événement formaté
   */
  createDronePositionUpdateEvent: (position) => ({
    type: 'DRONE_POSITION_UPDATE',
    position,
    timestamp: Date.now()
  }),

  /**
   * Crée un événement de découverte par drone
   * @param {Object} discovery - Découverte effectuée
   * @returns {Object} - Événement formaté
   */
  createDroneDiscoveryEvent: (discovery) => ({
    type: 'DRONE_DISCOVERY_RECORDED',
    discovery: {
      ...discovery,
      discoveredBy: 'drone'
    },
    timestamp: Date.now()
  })
};

// ============================================================================
// UTILITAIRES PUBLICS
// ============================================================================

/**
 * @deprecated Utilisez calculateDroneFleetStatus
 */
export const calculateFleetStatus = (context) => calculateDroneFleetStatus(context);

// ============================================================================
// EXPORT PAR DÉFAUT - NOUVELLES ACTIONS MÉTIER
// ============================================================================

export default {
  // Actions principales - nouvelles avec préfixes
  actions: droneExploringActions,
  
  // Actions de rétrocompatibilité
  fleetActions: droneFleetActions,
  deploymentActions: droneDeploymentActions,
  explorationActions: explorationActions,
  
  // Events spécialisés
  events: droneExploringEvents,
  
  // Constants
  constants: {
    droneDeploymentStates: DRONE_DEPLOYMENT_STATES,
    droneTypes: DRONE_TYPES,
    droneVisualStates: DRONE_VISUAL_STATES,
    droneConfig: DRONE_CONFIG,
    explorationStates: EXPLORATION_STATES,
    discoveryTypes: DISCOVERY_TYPES,
    explorationConfig: EXPLORATION_CONFIG
  },
  
  // Utilitaires
  utils: {
    calculateDroneFleetStatus,
    calculateFleetStatus, // Rétrocompatibilité
    selectTargetTileInRadiusForDrone,
    validateExplorationZone,
    validateDiscovery
  }
};
