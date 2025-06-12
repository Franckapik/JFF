/**
 * ============================================================================
 * DRONE DEPLOYMENT ACTIONS CORE - Actions de déploiement des drones
 * ============================================================================
 * 
 * Actions pures pour le déploiement et le contrôle des drones d'exploration.
 * Ces fonctions sont réutilisables par Bot et Player.
 * 
 * 📋 FONCTIONS DISPONIBLES DANS CE FICHIER:
 * ==========================================
 * 
 * 🔧 ACTIONS PRINCIPALES (droneDeploymentActions):
 * - deployDrone(context, event) : Déploie drone vers zone cible
 * - recallDrone(context, event) : Rappelle drone au vaisseau
 * - dockDrone(context, event) : Finalise retour drone (ancré)
 * - updateDronePosition(context, event) : Met à jour position drone
 * 
 * 🔧 UTILITAIRES INTERNES:
 * - calculateFleetStatus(context) : Calcule statut flotte depuis états individuels
 * - selectTargetTileInRadius(context, range) : Sélectionne tuile cible
 * - droneDeploymentStates : États déploiement (DRONE_DEPLOYMENT_STATES)
 * - droneTypes : Types drones (DRONE_TYPES)
 * - droneVisualStates : États visuels (DRONE_VISUAL_STATES)
 * - droneConfig : Configuration drones (DRONE_CONFIG)
 * 
 * 🔄 COMPATIBILITÉ:
 * - Support structure droneFleet (NOUVEAU - source unique vérité)
 * - Support structure droneDeployment (ANCIEN - déprécié)
 * - Calcul automatique statut flotte depuis états individuels
 * 
 * ❌ FONCTIONNALITÉS COMMENTÉES (Éviter confusion/conflits):
 * - Actions FSM spécialisées (fsmDroneFleetActions) - SUPPRIMÉES
 * - Guards (droneDeploymentGuards) - COMMENTÉS
 * - Events (droneDeploymentEvents) - COMMENTÉS  
 * - Selectors (droneDeploymentSelectors) - COMMENTÉS
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

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
// ACTIONS PRINCIPALES - SEULES FONCTIONS PUBLIQUES
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
      // Validation simple interne
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
    const droneType = event.droneType || DRONE_TYPES.explorer;
    
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
      lastAction: 'updateDronePosition_success'
    };
  }
};

// ============================================================================
// UTILITAIRES INTERNES
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
 * Sélectionne une tuile cible dans un rayon donné autour du véhicule
 */
const selectTargetTileInRadius = (context, range = 3) => {
  try {
    const tileStore = useTileStore.getState();
    const vehicle = context.vehicle || context.botVehicle;
    
    if (!vehicle || !vehicle.coord) {
      console.warn('[selectTargetTileInRadius] Vehicle or vehicle.coord not found in context');
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
      console.warn('[selectTargetTileInRadius] No valid tiles found, falling back to random tile');
      
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
    console.error('[selectTargetTileInRadius] Error selecting target tile:', error);
    
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

// ============================================================================
// ❌ FONCTIONNALITÉS COMMENTÉES POUR ÉVITER CONFUSION/CONFLITS
// ============================================================================

/*
// ============================================================================
// ACTIONS FSM SPÉCIALISÉES - SUPPRIMÉES (CAUSES CONFUSION)
// ============================================================================

// ❌ SUPPRIMÉ: fsmDroneFleetActions
// Ces actions dupliquent droneDeploymentActions et créent de la confusion.
// La logique de déploiement doit être centralisée dans droneDeploymentActions.

export const fsmDroneFleetActions = {
  deployDroneWithPosition: (context, event) => { ... },
  updateDronePosition: (context, event) => { ... },
  recallDrone: (context, event) => { ... },
  dockDrone: (context, event) => { ... }
};
*/

/*
// ============================================================================
// GUARDS - COMMENTÉS (ÉVITER CONFLITS AVEC GUARDS CENTRALISÉS)
// ============================================================================

export const droneDeploymentGuards = {
  canDeployDrone: (context, event) => {
    const explorer = context.droneFleet?.drones?.explorer;
    if (explorer?.isActive) return false;
    
    if (context.droneDeployment?.status === DRONE_DEPLOYMENT_STATES.active) return false;
    
    const vehicle = context.vehicle || context.botVehicle;
    if (!vehicle || vehicle.fuel < 20) return false;
    
    return true;
  },

  isDroneDeployed: (context) => {
    const explorer = context.droneFleet?.drones?.explorer;
    if (explorer?.isActive) return true;
    
    return context.droneDeployment?.status === DRONE_DEPLOYMENT_STATES.active;
  },

  isDroneDocked: (context) => {
    const explorer = context.droneFleet?.drones?.explorer;
    if (!explorer || (!explorer.isActive && explorer.state === 'docked')) return true;
    
    return context.droneDeployment?.status === DRONE_DEPLOYMENT_STATES.docked ||
           !context.droneDeployment;
  }
};
*/

/*
// ============================================================================
// SELECTORS - COMMENTÉS (ÉVITER CONFLITS AVEC SELECTORS CENTRALISÉS)
// ============================================================================

export const droneDeploymentSelectors = {
  getCurrentDeploymentState: (context) => {
    return calculateFleetStatus(context);
  },

  isDroneOnMission: (context) => {
    const fleetStatus = calculateFleetStatus(context);
    return fleetStatus === 'active' || fleetStatus === 'returning';
  },

  getDroneTargetArea: (context) => {
    if (context.droneFleet?.currentMission?.target) {
      return context.droneFleet.currentMission.target;
    }
    
    return context.droneDeployment?.targetArea || context.currentDroneTarget || null;
  },

  getEstimatedMissionTimeRemaining: (context) => {
    const fleetStatus = calculateFleetStatus(context);
    if (context.droneFleet?.currentMission?.startTime && fleetStatus === 'active') {
      const elapsed = Date.now() - context.droneFleet.currentMission.startTime;
      const estimatedDuration = 10000;
      return Math.max(0, estimatedDuration - elapsed);
    }
    
    const deployment = context.droneDeployment;
    if (!deployment || deployment.status !== DRONE_DEPLOYMENT_STATES.active) {
      return 0;
    }
    
    const remaining = deployment.estimatedReturn - Date.now();
    return Math.max(0, remaining);
  }
};
*/

/*
// ============================================================================
// EVENTS - COMMENTÉS (UTILISER LES EVENTS CENTRALISÉS DANS movementEvents.js)
// ============================================================================

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
*/

// ============================================================================
// EXPORT PAR DÉFAUT - SIMPLIFIÉ
// ============================================================================

export default {
  actions: droneDeploymentActions,
  // selectors: droneDeploymentSelectors, // ❌ COMMENTÉ
  // guards: droneDeploymentGuards, // ❌ COMMENTÉ
  // events: droneDeploymentEvents, // ❌ COMMENTÉ
  constants: {
    droneDeploymentStates: DRONE_DEPLOYMENT_STATES,
    droneTypes: DRONE_TYPES,
    droneConfig: DRONE_CONFIG
  },
  utils: {
    calculateFleetStatus
  }
};

// ============================================================================
// ❌ EXPORT TEMPORAIRE POUR ÉVITER ERREUR D'IMPORT
// ============================================================================

/**
 * Export temporaire vide pour éviter l'erreur d'import dans context.js
 * TODO: Supprimer cet export quand context.js sera mis à jour
 */
export const fsmDroneFleetActions = {
  // Actions temporaires vides - utilisez droneDeploymentActions à la place
  deployDroneWithPosition: () => ({ error: 'Use droneDeploymentActions.deployDrone instead' }),
  updateDronePosition: () => ({ error: 'Use droneDeploymentActions.updateDronePosition instead' }),
  recallDrone: () => ({ error: 'Use droneDeploymentActions.recallDrone instead' }),
  dockDrone: () => ({ error: 'Use droneDeploymentActions.dockDrone instead' })
};

export const droneDeploymentGuards = {
  // Guards temporaires vides - utilisez les guards centralisés à la place
  canDeployDrone: () => false,
  isDroneDeployed: () => false,
  isDroneDocked: () => true
};

export const droneDeploymentSelectors = {
  // Selectors temporaires vides - utilisez les selectors centralisés à la place
  getCurrentDeploymentState: () => 'docked',
  isDroneOnMission: () => false,
  getDroneTargetArea: () => null,
  getEstimatedMissionTimeRemaining: () => 0
};

export const droneDeploymentEvents = {
  // Events temporaires vides - utilisez les events centralisés à la place
  deployDrone: () => ({ type: 'DEPRECATED' }),
  recallDrone: () => ({ type: 'DEPRECATED' }),
  droneDocked: () => ({ type: 'DEPRECATED' }),
  dronePositionUpdate: () => ({ type: 'DEPRECATED' })
};
