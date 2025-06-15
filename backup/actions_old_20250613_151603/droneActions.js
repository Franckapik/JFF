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
 * 🔧 ACTIONS PRINCIPALES (droneFleetActions):
 * - deployDroneForExploration(context, event) : Déploie drone vers zone cible
 * - recallDroneToShip(context, event) : Rappelle drone au vaisseau
 * - dockDroneToShip(context, event) : Finalise retour drone (ancré)
 * - updateDroneFleetPosition(context, event) : Met à jour position drone
 * 
 * 🔄 RÉTROCOMPATIBILITÉ (droneDeploymentActions):
 * - deployDrone(context, event) : Déploie drone vers zone cible
 * - recallDrone(context, event) : Rappelle drone au vaisseau
 * - dockDrone(context, event) : Finalise retour drone (ancré)
 * - updateDronePosition(context, event) : Met à jour position drone
 * 
 * 🔧 UTILITAIRES INTERNES:
 * - calculateDroneFleetStatus(context) : Calcule statut flotte depuis états individuels
 * - selectTargetTileInRadiusForDrone(context, range) : Sélectionne tuile cible
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
 * @version 2.0.0
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
// 🤖 DRONE FLEET ACTIONS - Actions avec suffixes pour la clarté
// ============================================================================

/**
 * Actions de déploiement de drones avec nommage explicite
 */
export const droneFleetActions = {
  /**
   * Déploie un drone vers une zone cible pour exploration
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec paramètres de déploiement
   * @returns {Object} - Nouveau contexte avec drone déployé
   */
  deployDroneForExploration: (context, event) => {
    try {
      // Validation simple interne
      const droneType = event.droneType || DRONE_TYPES.explorer;
      const range = event.range || 3;
      
      // Vérifier si le drone existe dans la flotte
      if (!context.droneFleet?.drones[droneType]) {
        return {
          ...context,
          error: `Drone ${droneType} not found in fleet`,
          lastAction: 'deployDroneForExploration_failed'
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
        lastAction: 'deployDroneForExploration_success'
      };
    } catch (error) {
      return {
        ...context,
        error: error.message,
        lastAction: 'deployDroneForExploration_failed'
      };
    }
  },

  /**
   * Rappelle le drone au vaisseau
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec type de drone (optionnel)
   * @returns {Object} - Nouveau contexte avec drone en retour
   */
  recallDroneToShip: (context, event = {}) => {
    const droneType = event.droneType || DRONE_TYPES.explorer;
    
    if (!context.droneFleet?.drones[droneType]?.isActive) {
      return {
        ...context,
        error: `Drone ${droneType} is not active`,
        lastAction: 'recallDroneToShip_failed'
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
      lastAction: 'recallDroneToShip_success'
    };
  },

  /**
   * Finalise le retour du drone (drone ancré au ship)
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec données du retour
   * @returns {Object} - Nouveau contexte avec drone ancré
   */
  dockDroneToShip: (context, event = {}) => {
    const droneType = event.droneType || DRONE_TYPES.explorer;
    
    if (!context.droneFleet?.drones[droneType]) {
      return {
        ...context,
        error: `Drone ${droneType} not found`,
        lastAction: 'dockDroneToShip_failed'
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
      lastAction: 'dockDroneToShip_success'
    };
  },

  /**
   * Met à jour la position du drone dans la flotte
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec nouvelle position
   * @returns {Object} - Nouveau contexte avec position mise à jour
   */
  updateDroneFleetPosition: (context, event) => {
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
      lastAction: 'updateDroneFleetPosition_success'
    };
  }
};

// ============================================================================
// 🔄 RÉTROCOMPATIBILITÉ - Actions héritées (utilise droneFleetActions)
// ============================================================================

/**
 * Actions de déploiement de drones pures
 * @deprecated Utilisez droneFleetActions avec des noms plus explicites
 */
export const droneDeploymentActions = {
  /**
   * Déploie un drone vers une zone cible
   * @deprecated Utilisez droneFleetActions.deployDroneForExploration
   */
  deployDrone: (context, event) => droneFleetActions.deployDroneForExploration(context, event),

  /**
   * Rappelle le drone au vaisseau
   * @deprecated Utilisez droneFleetActions.recallDroneToShip
   */
  recallDrone: (context, event = {}) => droneFleetActions.recallDroneToShip(context, event),

  /**
   * Finalise le retour du drone (drone ancré)
   * @deprecated Utilisez droneFleetActions.dockDroneToShip
   */
  dockDrone: (context, event = {}) => droneFleetActions.dockDroneToShip(context, event),

  /**
   * Met à jour la position du drone
   * @deprecated Utilisez droneFleetActions.updateDroneFleetPosition
   */
  updateDronePosition: (context, event) => droneFleetActions.updateDroneFleetPosition(context, event)
};

// ============================================================================
// UTILITAIRES INTERNES
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

// ============================================================================
// 🔄 RÉTROCOMPATIBILITÉ - Utilitaires héritées
// ============================================================================

/**
 * @deprecated Utilisez calculateDroneFleetStatus
 */
export const calculateFleetStatus = (context) => calculateDroneFleetStatus(context);

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
*/

// ============================================================================
// ✅ GUARDS MOVED TO guards/core/
// ============================================================================

/**
 * Les guards de drones ont été déplacés vers guards/core/ pour une meilleure architecture.
 * Utilisez les guards centralisés depuis guards/core/ au lieu des actions.
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
  // Actions principales
  actions: droneDeploymentActions, // Rétrocompatibilité
  fleetActions: droneFleetActions, // Nouvelles actions avec suffixes
  
  // Constants
  constants: {
    droneDeploymentStates: DRONE_DEPLOYMENT_STATES,
    droneTypes: DRONE_TYPES,
    droneConfig: DRONE_CONFIG
  },
  
  // Utilitaires
  utils: {
    calculateDroneFleetStatus,
    calculateFleetStatus // Rétrocompatibilité
  }
};

// ============================================================================
// ✅ GUARDS & EXPORTS CLEANED
// ============================================================================

/**
 * Les guards et exports temporaires ont été supprimés.
 * Architecture maintenant clean et centralisée dans guards/core/
 */
