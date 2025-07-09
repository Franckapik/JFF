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

import fsmLogger from '../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../types/coordinates.d.ts';
import type { DroneType, DroneVisualState } from '../../../../../types/drone.d.ts';
import type { FSMContext, FSMEvent } from '../../../../../types/fsm.d.ts';

// Type guards pour les événements
interface DroneDeployEvent extends FSMEvent {
  droneType?: DroneType;
  range?: number;
}

/**
 * Sélectionne une tuile cible dans un rayon donné pour le drone
 */
function selectTargetTileInRadiusForDrone(_context: FSMContext, _range: number): WorldPosition | null {
  // Fonction utilitaire - implémentation à compléter selon la logique du tileStore
  // Pour l'instant, on retourne null pour indiquer qu'aucune cible n'est trouvée
  return null;
}

/**
 * Déploie un drone vers une zone cible pour exploration
 */
export const droneDeployForExploration = (context: FSMContext, event: DroneDeployEvent): FSMContext => {
  try {
    // Validation simple interne
    const droneType: DroneType = event.droneType || 'explorer';
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
        explorationCycle: {
          ...context.explorationCycle,
          isActive: false,
          phase: 'idle'
        },
        lastAction: 'droneDeployForExploration_noTargets'
      };
    }

    const droneVisualState: DroneVisualState = 'deploying';
    const updatedDrone = {
      ...context.droneFleet.drones[droneType],
      state: droneVisualState,
      targetPosition,
      isActive: true,
      lastUpdate: Date.now()
    };

    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        currentMission: {
          type: 'explore',
          target: context.vehicle.coord,
          drones: [droneType]
        },
        missionStartTime: Date.now(),
        drones: {
          ...context.droneFleet.drones,
          [droneType]: updatedDrone
        }
      },
      explorationCycle: {
        ...context.explorationCycle,
        isActive: true,
        phase: 'exploring'
      },
      lastAction: 'droneDeployForExploration_success'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      ...context,
      error: errorMessage,
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
    droneTypes: ['explorer', 'combat', 'special'] as DroneType[],
    droneVisualStates: ['docked', 'deploying', 'scanning', 'returning', 'failed'] as DroneVisualState[],
  }
};
