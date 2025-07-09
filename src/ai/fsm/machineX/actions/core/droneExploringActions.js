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
import {
  DRONE_STATES,
  DRONE_TYPES
} from '../../config/constants.ts';


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
      state: DRONE_STATES.VISUAL.deploying,
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

// ============================================================================
// EXPORTS ORGANISÉS
// ============================================================================

/**
 * Groupe principal des actions drone
 */
export const droneExploringActions = {
  droneDeployForExploration,
};

/**
 * Export par défaut avec structure organisée
 */
export default {
  // Actions principales
  actions: droneExploringActions,
  
  // Constants
  constants: {
    droneTypes: DRONE_TYPES,
    droneVisualStates: DRONE_STATES.VISUAL,
  }
};
