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

import { DRONE_DEPLOYMENT_STATES, DRONE_TYPES, DRONE_VISUAL_STATES, DRONE_CONFIG } from '../../constants/constants.js';

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
 * Valide les paramètres de déploiement d'un drone
 */
const validateDroneDeployment = (deployment) => {
  if (!deployment || typeof deployment !== 'object') {
    throw new Error('Drone deployment must be a valid object');
  }
  
  if (!deployment.targetArea || typeof deployment.targetArea !== 'string') {
    throw new Error('Target area must be a valid coordinate string');
  }
  
  const droneType = deployment.droneType || DRONE_TYPES.explorer;
  if (!Object.values(DRONE_TYPES).includes(droneType)) {
    throw new Error(`Invalid drone type. Must be one of: ${Object.values(DRONE_TYPES).join(', ')}`);
  }
  
  return {
    targetArea: deployment.targetArea,
    droneType,
    range: deployment.range || DRONE_CONFIG[droneType].range,
    priority: deployment.priority || 'normal',
    timestamp: deployment.timestamp || Date.now()
  };
};

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
    // NOUVEAU: Vérifier avec la structure droneFleet (recommandé)
    if (context.droneFleet?.status === 'active') {
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
    // NOUVEAU: Vérifier avec la structure droneFleet (recommandé)
    if (context.droneFleet?.status === 'active') {
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
    // NOUVEAU: Vérifier avec la structure droneFleet (recommandé)
    if (context.droneFleet?.status === 'docked' || !context.droneFleet) {
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
      const validatedDeployment = validateDroneDeployment(event);
      
      if (!droneDeploymentGuards.canDeployDrone(context, event)) {
        return {
          ...context,
          error: 'Cannot deploy drone: conditions not met',
          lastAction: 'deployDrone_failed'
        };
      }
      
      const droneType = validatedDeployment.droneType;
      
      // NOUVEAU: Utilise la structure droneFleet compatible avec initialContext.js
      if (!context.droneFleet || !context.droneFleet.drones[droneType]) {
        return {
          ...context,
          error: `Drone type ${droneType} not found in fleet`,
          lastAction: 'deployDrone_failed'
        };
      }

      // Calculer la position cible du drone
      const targetPosition = context.vehicle?.position ? {
        x: context.vehicle.position.x + (Math.random() - 0.5) * validatedDeployment.range * 2,
        y: context.vehicle.position.y + 0.5,
        z: context.vehicle.position.z + (Math.random() - 0.5) * validatedDeployment.range * 2
      } : null;

      const updatedDrone = {
        ...context.droneFleet.drones[droneType],
        state: DRONE_VISUAL_STATES.deploying,
        targetPosition,
        missionTarget: validatedDeployment.targetArea,
        isActive: true,
        lastUpdate: Date.now()
      };

      return {
        ...context,
        droneFleet: {
          ...context.droneFleet,
          status: 'active',
          currentMission: {
            type: 'exploration',
            target: validatedDeployment.targetArea,
            drone: droneType,
            startTime: Date.now(),
            estimatedReturn: Date.now() + (validatedDeployment.range * 2000)
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
        status: 'returning',
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
        status: 'docked',
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
      targetArea,
      5 // range
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
        status: 'active',
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
        status: 'returning',
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
        status: 'docked',
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
 * Sélecteurs pour extraire des informations sur les drones
 */
export const droneDeploymentSelectors = {
  /**
   * Obtient l'état actuel du déploiement
   * @param {Object} context - Contexte actuel
   * @returns {string} - État du déploiement
   */
  getCurrentDeploymentState: (context) => {
    // NOUVEAU: Priorité à la structure droneFleet
    if (context.droneFleet?.status) {
      return context.droneFleet.status;
    }
    
    // ANCIEN: Fallback vers droneDeployment (déprécié)
    return context.droneDeployment?.status || DRONE_DEPLOYMENT_STATES.docked;
  },

  /**
   * Vérifie si un drone est en mission
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si drone en mission
   */
  isDroneOnMission: (context) => {
    // NOUVEAU: Priorité à la structure droneFleet
    if (context.droneFleet) {
      const status = context.droneFleet.status;
      return status === 'active' || status === 'returning';
    }
    
    // ANCIEN: Fallback vers droneDeployment (déprécié)
    const status = context.droneDeployment?.status;
    return status === DRONE_DEPLOYMENT_STATES.active || 
           status === DRONE_DEPLOYMENT_STATES.returning;
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
   * Calcule le temps restant estimé de la mission
   * @param {Object} context - Contexte actuel
   * @returns {number} - Temps restant en millisecondes
   */
  getEstimatedMissionTimeRemaining: (context) => {
    // NOUVEAU: Priorité à la structure droneFleet
    if (context.droneFleet?.currentMission?.startTime && context.droneFleet.status === 'active') {
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
  },
  utils: {
    validateDroneDeployment
  }
};
