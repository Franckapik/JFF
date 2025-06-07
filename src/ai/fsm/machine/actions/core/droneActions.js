/**
 * ============================================================================
 * DRONE DEPLOYMENT ACTIONS CORE - Actions de déploiement des drones
 * ============================================================================
 * 
 * Actions pures pour le déploiement et le contrôle des drones d'exploration.
 * Ces fonctions sont réutilisables par Bot et Player.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { range } from 'three/tsl';
import { DRONE_DEPLOYMENT_STATES, DRONE_TYPES, DRONE_VISUAL_STATES, DRONE_CONFIG } from '../../constants/constants.js';
import { useTileStore } from '../../../../../stores/useTileStore/index.js';

// ============================================================================
// CONSTANTS ET TYPES (réexportés pour compatibilité)
// ============================================================================

/**
 * États de déploiement des drones (réexportés depuis constants)
 */
export const droneDeploymentStates = DRONE_DEPLOYMENT_STATES;

/**
 * Types de drones (réexportés depuis constants)
 */
export const droneTypes = DRONE_TYPES;

/**
 * États visuels des drones pour l'animation (réexportés depuis constants)
 */
export const droneVisualStates = DRONE_VISUAL_STATES;

/**
 * Configuration des drones par type (réexportés depuis constants)
 */
export const droneConfig = DRONE_CONFIG;

// ============================================================================
// VALIDATORS ET GUARDS
// ============================================================================


/**
 * Guards pour le déploiement de drones
 */
export const droneDeploymentGuards = {
  /**
   * Vérifie si un drone peut être déployé
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement de déploiement
   * @returns {boolean} - True si déploiement possible
   */
  canDeployDrone: (context, event) => {
    // NOUVEAU: Vérifier avec les états individuels des drones (source unique de vérité)
    const explorer = context.droneFleet?.drones?.explorer;
    if (explorer?.isActive) {
      return false;
    }
    
    // ANCIEN: Support de l'ancienne structure droneDeployment (déprécié)
    if (context.droneDeployment?.status === DRONE_DEPLOYMENT_STATES.active) {
      return false;
    }
    
    // Vérifier qu'il y a assez de carburant pour le déploiement
    const vehicle = context.vehicle || context.botVehicle;
    if (!vehicle || vehicle.fuel < 20) {
      return false;
    }
    
    return true;
  },

  /**
   * Vérifie si un drone est actuellement déployé
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si drone déployé
   */
  isDroneDeployed: (context) => {
    // NOUVEAU: Vérifier avec les états individuels des drones (source unique de vérité)
    const explorer = context.droneFleet?.drones?.explorer;
    if (explorer?.isActive) {
      return true;
    }
    
    // ANCIEN: Support de l'ancienne structure droneDeployment (déprécié)
    return context.droneDeployment?.status === DRONE_DEPLOYMENT_STATES.active;
  },

  /**
   * Vérifie si un drone est ancré au vaisseau
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si drone ancré
   */
  isDroneDocked: (context) => {
    // NOUVEAU: Vérifier avec les états individuels des drones (source unique de vérité)
    const explorer = context.droneFleet?.drones?.explorer;
    if (!explorer || (!explorer.isActive && explorer.state === 'docked')) {
      return true;
    }
    
    // ANCIEN: Support de l'ancienne structure droneDeployment (déprécié)
    return context.droneDeployment?.status === DRONE_DEPLOYMENT_STATES.docked ||
           !context.droneDeployment;
  }
};

// ============================================================================
// ACTIONS PRINCIPALES
// ============================================================================

/**
 * Actions de déploiement de drones pures
 */
export const droneDeploymentActions = {
  /**
   * Déploie un drone vers une zone cible
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec paramètres de déploiement
   * @returns {Object} - Nouveau contexte avec drone déployé
   */
  deployDrone: (context, event) => {
    try {
      if (!droneDeploymentGuards.canDeployDrone(context, event)) {
        return {
          ...context,
          error: 'Cannot deploy drone: conditions not met',
          lastAction: 'deployDrone_failed'
        };
      }

      // Valeurs par défaut pour l'événement
      const droneType = event.droneType || DRONE_TYPES.explorer;
      const range = event.range || 3;
      
      // Vérifier si le drone existe dans la flotte
      if (!context.droneFleet?.drones[droneType]) {
        return {
          ...context,
          error: `Drone ${droneType} not found in fleet`,
          lastAction: 'deployDrone_failed'
        };
      }

      // Utiliser le tileStore pour obtenir une position réelle dans un rayon de 3 tuiles
      const targetPosition = selectTargetTileInRadius(context, range);

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
          // status: 'active', // ❌ SUPPRIMÉ : Calculé automatiquement depuis les états individuels
          currentMission: {
            type: 'exploration',
            target: `${range}unit-radius`, // zone de déploiement
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
        lastAction: 'deployDrone_success'
      };
    } catch (error) {
      return {
        ...context,
        error: error.message,
        lastAction: 'deployDrone_failed'
      };
    }
  },

  /**
   * Rappelle le drone au vaisseau
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec type de drone (optionnel)
   * @returns {Object} - Nouveau contexte avec drone en retour
   */
  recallDrone: (context, event = {}) => {
    if (!droneDeploymentGuards.isDroneDeployed(context)) {
      return {
        ...context,
        error: 'No drone to recall',
        lastAction: 'recallDrone_failed'
      };
    }
    
    const droneType = event.droneType || DRONE_TYPES.explorer;
    
    // NOUVEAU: Utilise la structure droneFleet compatible avec initialContext.js
    if (!context.droneFleet?.drones[droneType]?.isActive) {
      return {
        ...context,
        error: `Drone ${droneType} is not active`,
        lastAction: 'recallDrone_failed'
      };
    }

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        // status: 'returning', // ❌ SUPPRIMÉ : Calculé automatiquement depuis les états individuels
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
      lastAction: 'recallDrone_success'
    };
  },

  /**
   * Finalise le retour du drone (drone ancré)
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec données du retour
   * @returns {Object} - Nouveau contexte avec drone ancré
   */
  dockDrone: (context, event = {}) => {
    const droneType = event.droneType || DRONE_TYPES.explorer;
    
    // NOUVEAU: Utilise la structure droneFleet compatible avec initialContext.js
    if (!context.droneFleet?.drones[droneType]) {
      return {
        ...context,
        error: `Drone ${droneType} not found`,
        lastAction: 'dockDrone_failed'
      };
    }

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        // status: 'docked', // ❌ SUPPRIMÉ : Calculé automatiquement depuis les états individuels
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
      lastAction: 'dockDrone_success'
    };
  },

  /**
   * Met à jour la position du drone
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec nouvelle position
   * @returns {Object} - Nouveau contexte avec position mise à jour
   */
  updateDronePosition: (context, event) => {
    const { droneType = DRONE_TYPES.explorer, position, state } = event;
    
    if (!droneDeploymentGuards.isDroneDeployed(context) || !context.droneFleet?.drones[droneType]) {
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
      lastAction: 'updateDronePosition_success'
    };
  }
};

/**
 * Actions FSM pures pour la gestion de la flotte de drones
 */
export const fsmDroneFleetActions = {
  /**
   * Déploie un drone avec position calculée
   */
  deployDroneWithPosition: (context, event) => {
    const { targetArea, droneType = DRONE_TYPES.explorer } = event;
    
    if (!context.vehicle?.position) {
      return {
        ...context,
        error: 'Ship position required for drone deployment'
      };
    }

    // Calculer la position cible du drone
    const targetPosition = calculateExplorationTargetPosition(
      context.vehicle.position,
      event.range
    );

    const updatedDrone = {
      ...context.droneFleet.drones[droneType],
      state: DRONE_VISUAL_STATES.deploying,
      targetPosition,
      missionTarget: targetArea,
      isActive: true,
      lastUpdate: Date.now()
    };

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        // status: 'active', // ❌ SUPPRIMÉ : Calculé automatiquement depuis les états individuels
        currentMission: {
          type: 'exploration',
          target: targetArea,
          drone: droneType,
          startTime: Date.now()
        },
        drones: {
          ...context.droneFleet.drones,
          [droneType]: updatedDrone
        }
      },
      lastAction: 'deployDrone_success'
    };
  },

  /**
   * Met à jour la position d'un drone en temps réel
   */
  updateDronePosition: (context, event) => {
    const { droneType, position, state } = event;
    
    if (!context.droneFleet.drones[droneType]) {
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
      }
    };
  },

  /**
   * Rappelle un drone au vaisseau
   */
  recallDrone: (context, event) => {
    const { droneType = DRONE_TYPES.explorer } = event;
    
    if (!context.droneFleet.drones[droneType]?.isActive) {
      return context;
    }

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        // status: 'returning', // ❌ SUPPRIMÉ : Calculé automatiquement depuis les états individuels
        drones: {
          ...context.droneFleet.drones,
          [droneType]: {
            ...context.droneFleet.drones[droneType],
            state: DRONE_VISUAL_STATES.returning,
            targetPosition: context.vehicle.position,
            lastUpdate: Date.now()
          }
        }
      },
      lastAction: 'recallDrone_success'
    };
  },

  /**
   * Ancre un drone au vaisseau (fin de mission)
   */
  dockDrone: (context, event) => {
    const { droneType = DRONE_TYPES.explorer } = event;

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        // status: 'docked', // ❌ SUPPRIMÉ : Calculé automatiquement depuis les états individuels
        currentMission: null,
        drones: {
          ...context.droneFleet.drones,
          [droneType]: {
            ...context.droneFleet.drones[droneType],
            state: DRONE_VISUAL_STATES.docked,
            position: context.vehicle.position,
            targetPosition: null,
            missionTarget: null,
            isActive: false,
            lastUpdate: Date.now()
          }
        }
      },
      lastAction: 'dockDrone_success'
    };
  }
};

/**
 * Calcule la position cible pour l'exploration
 */
const calculateExplorationTargetPosition = (shipPosition, targetArea, range) => {
  // Logique simple pour calculer une position d'exploration
  const angle = targetArea === 'auto' ? Math.random() * Math.PI * 2 : 0;
  
  return {
    x: shipPosition.x + Math.cos(angle) * range,
    y: shipPosition.y + 0.5,
    z: shipPosition.z + Math.sin(angle) * range
  };
};

// ============================================================================
// SELECTORS ET UTILITAIRES
// ============================================================================

/**
 * Calcule le statut global de la flotte basé sur les états individuels des drones
 * @param {Object} context - Contexte actuel
 * @returns {string} - Status calculé ('docked', 'active', 'returning')
 */
export const calculateFleetStatus = (context) => {
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
 * Sélecteurs pour extraire des informations sur les drones
 */
export const droneDeploymentSelectors = {
  /**
   * Obtient l'état actuel du déploiement (calculé depuis les états individuels)
   * @param {Object} context - Contexte actuel
   * @returns {string} - État du déploiement
   */
  getCurrentDeploymentState: (context) => {
    // NOUVEAU: Calcul basé sur les états individuels des drones (source unique de vérité)
    return calculateFleetStatus(context);
  },

  /**
   * Vérifie si un drone est en mission (basé sur les états individuels)
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si drone en mission
   */
  isDroneOnMission: (context) => {
    // NOUVEAU: Calcul basé sur les états individuels des drones (source unique de vérité)
    const fleetStatus = calculateFleetStatus(context);
    return fleetStatus === 'active' || fleetStatus === 'returning';
  },

  /**
   * Obtient la zone cible actuelle du drone
   * @param {Object} context - Contexte actuel
   * @returns {string|null} - Coordonnée de la zone cible
   */
  getDroneTargetArea: (context) => {
    // NOUVEAU: Priorité à la structure droneFleet
    if (context.droneFleet?.currentMission?.target) {
      return context.droneFleet.currentMission.target;
    }
    
    // ANCIEN: Fallback vers droneDeployment (déprécié)
    return context.droneDeployment?.targetArea || context.currentDroneTarget || null;
  },

  /**
   * Calcule le temps restant estimé de la mission (basé sur les états individuels)
   * @param {Object} context - Contexte actuel
   * @returns {number} - Temps restant en millisecondes
   */
  getEstimatedMissionTimeRemaining: (context) => {
    // NOUVEAU: Calcul basé sur les états individuels des drones (source unique de vérité)
    const fleetStatus = calculateFleetStatus(context);
    if (context.droneFleet?.currentMission?.startTime && fleetStatus === 'active') {
      const elapsed = Date.now() - context.droneFleet.currentMission.startTime;
      const estimatedDuration = 10000; // 10 secondes par défaut
      return Math.max(0, estimatedDuration - elapsed);
    }
    
    // ANCIEN: Fallback vers droneDeployment (déprécié)
    const deployment = context.droneDeployment;
    if (!deployment || deployment.status !== DRONE_DEPLOYMENT_STATES.active) {
      return 0;
    }
    
    const remaining = deployment.estimatedReturn - Date.now();
    return Math.max(0, remaining);
  }
};

// ============================================================================
// EVENTS ET TRANSFORMATIONS
// ============================================================================

/**
 * Générateurs d'événements pour le déploiement de drones
 */
export const droneDeploymentEvents = {
  deployDrone: (targetArea, droneType = DRONE_TYPES.explorer, options = {}) => ({
    type: 'DEPLOY_DRONE',
    targetArea,
    droneType,
    range: options.range,
    priority: options.priority,
    timestamp: Date.now()
  }),

  recallDrone: () => ({
    type: 'RECALL_DRONE',
    timestamp: Date.now()
  }),

  droneDocked: (returnData = null) => ({
    type: 'DRONE_DOCKED',
    returnData,
    timestamp: Date.now()
  }),

  dronePositionUpdate: (position) => ({
    type: 'DRONE_POSITION_UPDATE',
    position,
    timestamp: Date.now()
  })
};

// ============================================================================
// TILE SELECTION UTILITIES
// ============================================================================

/**
 * Sélectionne une tuile cible dans un rayon donné autour du véhicule
 * Cette fonction remplace l'appel à selectTargetTileInRadius(context, range)
 * et évite les boucles infinies en utilisant une approche robuste
 * 
 * @param {Object} context - Contexte FSM contenant vehicle.position et vehicle.coord
 * @param {number} range - Rayon de recherche (défaut: 3)
 * @returns {Object} - Position cible {x, y, z} ou position par défaut
 */
const selectTargetTileInRadius = (context, range = 3) => {
  try {
    // Obtenir le tileStore
    const tileStore = useTileStore.getState();
    
    // Vérifier que le contexte contient les informations nécessaires
    const vehicle = context.vehicle || context.botVehicle;
    if (!vehicle || !vehicle.coord) {
      console.warn('[selectTargetTileInRadius] Vehicle or vehicle.coord not found in context');
      return { x: 0, y: 0.5, z: 0 }; // Position par défaut
    }

    // Utiliser getWalkableTilesInRadius avec des paramètres sûrs
    const walkableTiles = tileStore.getWalkableTilesInRadius(
      vehicle.coord, // Position source (format "x,y" ou hex)
      range,         // Rayon de recherche
      true,          // Seulement les tuiles non explorées
      true           // Exclure les tuiles dangereuses
    );
    
    // Filtrer pour éviter la position actuelle du véhicule
    const validTargets = walkableTiles.filter(tile => 
      tile.coord !== vehicle.coord && 
      tile.position && 
      tile.distance > 0
    );
    
    if (validTargets.length === 0) {
      console.warn('[selectTargetTileInRadius] No valid tiles found, falling back to random tile');
      
      // Fallback: essayer une tuile walkable aléatoire
      const randomTile = tileStore.selectRandomWalkableTile();
      if (randomTile && randomTile.position) {
        return {
          x: randomTile.position.x,
          y: randomTile.position.y + 0.5, // Élever légèrement pour le drone
          z: randomTile.position.z
        };
      }
      
      // Dernière option: position relative au véhicule
      const fallbackAngle = Math.random() * Math.PI * 2;
      const fallbackDistance = Math.min(range, 2);
      return {
        x: vehicle.position.x + Math.cos(fallbackAngle) * fallbackDistance,
        y: vehicle.position.y + 0.5,
        z: vehicle.position.z + Math.sin(fallbackAngle) * fallbackDistance
      };
    }

    // Sélectionner la tuile la plus proche (première dans la liste triée)
    const targetTile = validTargets[0];
    
    return {
      x: targetTile.position.x,
      y: targetTile.position.y + 0.5, // Élever légèrement pour le drone
      z: targetTile.position.z
    };
    
  } catch (error) {
    console.error('[selectTargetTileInRadius] Error selecting target tile:', error);
    
    // Position de secours basée sur le véhicule si disponible
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
    
    // Position absolue de secours
    return { x: 0, y: 0.5, z: 0 };
  }
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default {
  actions: droneDeploymentActions,
  selectors: droneDeploymentSelectors,
  guards: droneDeploymentGuards,
  events: droneDeploymentEvents,
  constants: {
    droneDeploymentStates: DRONE_DEPLOYMENT_STATES,
    droneTypes: DRONE_TYPES,
    droneConfig: DRONE_CONFIG
  }
};
