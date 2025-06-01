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

// ============================================================================
// CONSTANTS ET TYPES
// ============================================================================

/**
 * États de déploiement des drones
 */
export const DRONE_DEPLOYMENT_STATES = {
  DOCKED: 'docked',
  DEPLOYING: 'deploying',
  ACTIVE: 'active',
  RETURNING: 'returning',
  FAILED: 'failed'
};

/**
 * Types de drones
 */
export const DRONE_TYPES = {
  EXPLORER: 'explorer',
  COMBAT: 'combat', 
  SPECIAL: 'special'
};

/**
 * Configuration des drones par type
 */
export const DRONE_CONFIG = {
  [DRONE_TYPES.EXPLORER]: {
    speed: 2.0,
    range: 5,
    scanRadius: 2,
    fuelConsumption: 1
  },
  [DRONE_TYPES.COMBAT]: {
    speed: 1.5,
    range: 3,
    scanRadius: 1,
    fuelConsumption: 2
  },
  [DRONE_TYPES.SPECIAL]: {
    speed: 1.8,
    range: 4,
    scanRadius: 3,
    fuelConsumption: 1.5
  }
};

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
  
  const droneType = deployment.droneType || DRONE_TYPES.EXPLORER;
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
    // Vérifier qu'il n'y a pas déjà un drone actif
    if (context.droneDeployment?.status === DRONE_DEPLOYMENT_STATES.ACTIVE) {
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
    return context.droneDeployment?.status === DRONE_DEPLOYMENT_STATES.ACTIVE;
  },

  /**
   * Vérifie si un drone est ancré au vaisseau
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si drone ancré
   */
  isDroneDocked: (context) => {
    return context.droneDeployment?.status === DRONE_DEPLOYMENT_STATES.DOCKED ||
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
      
      return {
        ...context,
        droneDeployment: {
          status: DRONE_DEPLOYMENT_STATES.ACTIVE,
          targetArea: validatedDeployment.targetArea,
          droneType: validatedDeployment.droneType,
          range: validatedDeployment.range,
          deployTime: Date.now(),
          estimatedReturn: Date.now() + (validatedDeployment.range * 2000) // 2s par unité de distance
        },
        isDroneAtShip: false,
        currentDroneTarget: validatedDeployment.targetArea,
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
   * @returns {Object} - Nouveau contexte avec drone en retour
   */
  recallDrone: (context) => {
    if (!droneDeploymentGuards.isDroneDeployed(context)) {
      return {
        ...context,
        error: 'No drone to recall',
        lastAction: 'recallDrone_failed'
      };
    }
    
    return {
      ...context,
      droneDeployment: {
        ...context.droneDeployment,
        status: DRONE_DEPLOYMENT_STATES.RETURNING,
        returnStartTime: Date.now()
      },
      currentDroneTarget: null,
      lastAction: 'recallDrone_success'
    };
  },

  /**
   * Finalise le retour du drone (drone ancré)
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec données du retour
   * @returns {Object} - Nouveau contexte avec drone ancré
   */
  dockDrone: (context, event) => {
    return {
      ...context,
      droneDeployment: {
        status: DRONE_DEPLOYMENT_STATES.DOCKED,
        lastMission: context.droneDeployment,
        dockTime: Date.now()
      },
      isDroneAtShip: true,
      currentDroneTarget: null,
      droneReturnData: event?.returnData || null,
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
    if (!droneDeploymentGuards.isDroneDeployed(context)) {
      return context;
    }
    
    return {
      ...context,
      droneDeployment: {
        ...context.droneDeployment,
        currentPosition: event.position,
        lastPositionUpdate: Date.now()
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
    const { targetArea, droneType = DRONE_TYPES.EXPLORER } = event;
    
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
      state: DRONE_VISUAL_STATES.DEPLOYING,
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
      isDroneAtShip: false,
      currentAction: 'drone_deployed'
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
    const { droneType = DRONE_TYPES.EXPLORER } = event;
    
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
            state: DRONE_VISUAL_STATES.RETURNING,
            targetPosition: context.vehicle.position, // Retour au vaisseau
            lastUpdate: Date.now()
          }
        }
      },
      currentAction: 'drone_recalled'
    };
  },

  /**
   * Ancre un drone au vaisseau (fin de mission)
   */
  dockDrone: (context, event) => {
    const { droneType = DRONE_TYPES.EXPLORER } = event;

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
            state: DRONE_VISUAL_STATES.DOCKED,
            position: null, // Position relative au vaisseau
            targetPosition: null,
            missionTarget: null,
            isActive: false,
            lastUpdate: Date.now()
          }
        }
      },
      isDroneAtShip: true,
      currentAction: 'drone_docked'
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
    return context.droneDeployment?.status || DRONE_DEPLOYMENT_STATES.DOCKED;
  },

  /**
   * Vérifie si un drone est en mission
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si drone en mission
   */
  isDroneOnMission: (context) => {
    const status = context.droneDeployment?.status;
    return status === DRONE_DEPLOYMENT_STATES.ACTIVE || 
           status === DRONE_DEPLOYMENT_STATES.RETURNING;
  },

  /**
   * Obtient la zone cible actuelle du drone
   * @param {Object} context - Contexte actuel
   * @returns {string|null} - Coordonnée de la zone cible
   */
  getDroneTargetArea: (context) => {
    return context.droneDeployment?.targetArea || context.currentDroneTarget || null;
  },

  /**
   * Calcule le temps restant estimé de la mission
   * @param {Object} context - Contexte actuel
   * @returns {number} - Temps restant en millisecondes
   */
  getEstimatedMissionTimeRemaining: (context) => {
    const deployment = context.droneDeployment;
    if (!deployment || deployment.status !== DRONE_DEPLOYMENT_STATES.ACTIVE) {
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
  deployDrone: (targetArea, droneType = DRONE_TYPES.EXPLORER, options = {}) => ({
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
    DRONE_DEPLOYMENT_STATES,
    DRONE_TYPES,
    DRONE_CONFIG
  },
  utils: {
    validateDroneDeployment
  }
};
