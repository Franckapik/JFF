/**
 * ============================================================================
 * DRONE EXPLORING ACTIONS CORE - Actions d'exploration des drones (SIMPLIFIÉ)
 * ============================================================================
 * 
 * Actions simplifiées pour l'exploration par drones.
 * Suppression de la logique de prospection complexe.
 * 
 * 📋 ACTION PRINCIPALE:
 * ====================
 * 
 * 🤖 ACTION UNIFIÉE:
 * - droneExploresTile(context, event) : Drone explore et découvre une tuile
 * 
 * 🔄 ACTIONS DÉPLOIEMENT:
 * - droneDeployForExploration(context, event) : Déploie drone vers zone cible
 * - droneRecallToShip(context, event) : Rappelle drone au vaisseau
 * - droneDockToShip(context, event) : Finalise ancrage drone
 * - droneUpdatePosition(context, event) : Met à jour position drone
 * 
 * 🔄 UTILITAIRES:
 * - calculateDroneFleetStatus(context) : Calcule statut flotte
 * - selectTargetTileInRadiusForDrone(context, range) : Sélectionne tuile cible
 * 
 * @author Migration FSM - Simplification Mémoire
 * @version 4.0.0
 */

import fsmLogger from '../../../../../logger/fsmLogger.js';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import {
  DRONE_CONFIG,
  DRONE_TYPES,
  DRONE_VISUAL_STATES
} from '../../config/constants.js';

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
 * RÈGLE STRICTE : Maximum 3 tuiles de rayon. Si aucune tuile valide, retourne null.
 */
const selectTargetTileInRadiusForDrone = (context, range = 3) => {
  try {
    const tileStore = useTileStore.getState();
    const vehicle = context.vehicle || context.botVehicle;
    console.log(vehicle)
    
    if (!vehicle || !vehicle.coord) {
      fsmLogger.debug('[selectTargetTileInRadiusForDrone] Vehicle or vehicle.coord not found in context');
      return null;
    }

    // Enforcer la règle du rayon maximum de 3
    const maxRadius = Math.min(range, 3);

    const walkableTiles = tileStore.getWalkableTilesInRadius(
      vehicle.coord,
      maxRadius,
      {
        onlyUnexplored: true,
        excludeDanger: true
      }
    );
    
    const validTargets = walkableTiles.filter(tile => 
      tile.coord !== vehicle.coord && 
      tile.position && 
      tile.distance > 0
    );
    
    if (validTargets.length === 0) {
      fsmLogger.debug(`[selectTargetTileInRadiusForDrone] No valid tiles found within radius ${maxRadius}, exploration complete in this area`);
      return null; // Pas de fallback - retourner null pour déclencher le retour en évaluation
    }

    const targetTile = validTargets[0];
    
    fsmLogger.debug(`[selectTargetTileInRadiusForDrone] Target selected within radius ${maxRadius}:`, {
      coord: targetTile.coord,
      distance: targetTile.distance,
      position: targetTile.position
    });
    
    return {
      x: targetTile.position.x,
      y: targetTile.position.y + 0.5,
      z: targetTile.position.z
    };
    
  } catch (error) {
    fsmLogger.debug('[selectTargetTileInRadiusForDrone] Error selecting target tile:', error);
    return null; // En cas d'erreur, retourner null au lieu d'un fallback
  }
};

// ============================================================================
// 🤖 ACTIONS PRINCIPALES - Exploration et déploiement simplifiés
// ============================================================================

/**
 * Action unifiée : Drone explore une tuile et découvre les ressources
 * Remplace toutes les actions de prospection complexes
 * @param {Object} context - Contexte FSM actuel
 * @param {Object} event - Événement avec coord et resources
 * @returns {Object} - Contexte mis à jour avec mémoire unifiée
 */
export const droneExploresTile = (context, event) => {
  const { coord, resources, position } = event;
  
  if (!coord) {
    return { 
      ...context, 
      error: 'Tile coordinate is required for exploration',
      lastAction: 'droneExploresTile_failed'
    };
  }

  // Protection contre les appels multiples - vérifier si la tuile est déjà explorée
  const existingKnownTiles = context.memory?.knownTiles || new Map();
  if (existingKnownTiles.has(coord)) {
    return context; // Retourner le contexte inchangé si déjà exploré
  }

  // Initialiser knownTiles si nécessaire
  const knownTiles = new Map(existingKnownTiles);
  
  // Créer les données de la tuile explorée
  const tileData = {
    coord,
    explored: true,
    exploredAt: Date.now(),
    hasResources: Boolean(resources && Object.values(resources).some(val => val > 0)),
    resources: resources || null,
    position: position, // ⭐ Inclure la position 3D de la tuile
    originalResources: resources ? { ...resources } : null, // Conserver les ressources originales
    resourcePercentage: resources && Object.values(resources).some(val => val > 0) ? 100 : 0, // 100% si ressources, 0% sinon
    lastCollectedTimestamp: null
  };
  
  // Ajouter la tuile à la mémoire
  knownTiles.set(coord, tileData);

  // ...existing code...
  
  // Mettre à jour les statistiques
  const currentStats = context.memory?.stats || {
    tilesExplored: 0,
    tilesCollected: 0,
    totalResourcesFound: 0,
    lastExploration: null,
    lastCollection: null
  };
  
  const newStats = {
    ...currentStats,
    tilesExplored: currentStats.tilesExplored + 1,
    totalResourcesFound: currentStats.totalResourcesFound + (tileData.hasResources ? 1 : 0),
    lastExploration: {
      coord,
      timestamp: Date.now(),
      hasResources: tileData.hasResources
    }
  };
  
  return {
    ...context,
    memory: {
      ...context.memory,
      knownTiles,
      stats: newStats
    },
    lastAction: 'droneExploresTile_success'
  };
};

/**
 * Déploie un drone vers une zone cible pour exploration
 */
export const droneDeployForExploration = (context, event) => {
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

    // Si aucune cible valide dans le rayon autorisé, déclencher un retour en évaluation
    if (!targetPosition) {
      fsmLogger.debug(`[droneDeployForExploration] No valid exploration targets within radius ${range}, area exploration complete`);
      return {
        ...context,
        explorationComplete: true, // Flag pour indiquer que l'exploration locale est terminée
        lastAction: 'droneDeployForExploration_noTargets'
      };
    }

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
      explorationComplete: false, // Reset le flag si on trouve une cible
      lastAction: 'droneDeployForExploration_success'
    };
  } catch (error) {
    return {
      ...context,
      error: error.message,
      lastAction: 'droneDeployForExploration_failed'
    };
  }
};

/**
 * Rappelle le drone au vaisseau
 */
export const droneRecallToShip = (context, event = {}) => {
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
};

/**
 * Finalise le retour du drone (drone ancré au ship)
 */
export const droneDockToShip = (context, event = {}) => {
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
};

/**
 * Met à jour la position du drone dans la flotte
 */
export const droneUpdatePosition = (context, event) => {
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
};

// ============================================================================
// EXPORTS ORGANISÉS
// ============================================================================

/**
 * Groupe principal des actions drone
 */
export const droneExploringActions = {
  droneExploresTile,
  droneDeployForExploration,
  droneRecallToShip,
  droneDockToShip,
  droneUpdatePosition
};

/**
 * Export par défaut avec structure organisée
 */
export default {
  // Actions principales
  actions: droneExploringActions,
  
  // Utilitaires
  utils: {
    calculateDroneFleetStatus,
    selectTargetTileInRadiusForDrone
  },
  
  // Constants
  constants: {
    droneTypes: DRONE_TYPES,
    droneVisualStates: DRONE_VISUAL_STATES,
    droneConfig: DRONE_CONFIG
  }
};
