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
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import type { WorldPosition } from '../../../../../types/coordinates';
import type { DroneType, DroneVisualState } from '../../../../../types/drone';
import type { FSMContext, FSMEvent } from '../../../../../types/fsm';
import type { TileStoreType } from '../../../../../types/stores';
import type { Tile } from '../../../../../types/tile';

// Type guards pour les événements
interface DroneDeployEvent extends FSMEvent {
  droneType?: DroneType;
  range?: number;
}

/**
 * Sélectionne une tuile cible dans un rayon donné pour le drone
 */
function selectTargetTileInRadiusForDrone(context: FSMContext, range: number): WorldPosition | null {
  try {
    const shipPosition = context.vehicle?.position || context.vehicle?.basePosition;
    if (!shipPosition) {
      fsmLogger.debug(`[selectTargetTileInRadiusForDrone] No ship position available`);
      return null;
    }
    
    // Accéder au tileStore pour obtenir les tuiles disponibles
    const tileStore = useTileStore.getState() as TileStoreType;
    const tiles = tileStore.tiles;
    
    if (!tiles || Object.keys(tiles).length === 0) {
      fsmLogger.debug(`[selectTargetTileInRadiusForDrone] No tiles available in store`);
      // Fallback : générer une position aléatoire dans le rayon
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * range + 1;
      return {
        x: shipPosition.x + Math.cos(angle) * distance,
        y: shipPosition.y + 0.5,
        z: shipPosition.z + Math.sin(angle) * distance
      };
    }
    
    // Filtrer les tuiles dans le rayon spécifié
    const tilesInRange = Object.values(tiles).filter((tile: Tile) => {
      let tilePos: WorldPosition;
      if (Array.isArray(tile.position)) {
        tilePos = { x: tile.position[0], y: tile.position[1], z: tile.position[2] };
      } else {
        tilePos = { x: tile.position.x, y: tile.position.y || 0, z: tile.position.z };
      }
      
      const distance = Math.sqrt(
        Math.pow(tilePos.x - shipPosition.x, 2) +
        Math.pow(tilePos.z - shipPosition.z, 2)
      );
      
      return distance > 0.5 && distance <= range; // Exclure la tuile du vaisseau
    });
    
    if (tilesInRange.length === 0) {
      fsmLogger.debug(`[selectTargetTileInRadiusForDrone] No tiles found in range ${range}`);
      // Fallback : générer une position aléatoire dans le rayon
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * range + 1;
      return {
        x: shipPosition.x + Math.cos(angle) * distance,
        y: shipPosition.y + 0.5,
        z: shipPosition.z + Math.sin(angle) * distance
      };
    }
    
    // Sélectionner une tuile au hasard
    const randomTile: Tile = tilesInRange[Math.floor(Math.random() * tilesInRange.length)];
    let targetPosition: WorldPosition;
    
    if (Array.isArray(randomTile.position)) {
      targetPosition = { 
        x: randomTile.position[0], 
        y: randomTile.position[1] + 0.5, // Légèrement au-dessus de la tuile
        z: randomTile.position[2] 
      };
    } else {
      targetPosition = { 
        x: randomTile.position.x, 
        y: (randomTile.position.y || 0) + 0.5,
        z: randomTile.position.z 
      };
    }
    
    fsmLogger.debug(`[selectTargetTileInRadiusForDrone] Selected target tile`, {
      shipPosition,
      targetPosition,
      range,
      tilesInRange: tilesInRange.length,
      selectedTile: randomTile.coord
    });
    
    return targetPosition;
    
  } catch (error) {
    fsmLogger.error(`[selectTargetTileInRadiusForDrone] Error selecting target:`, error);
    // Fallback en cas d'erreur
    const shipPosition = context.vehicle?.position || context.vehicle?.basePosition;
    if (shipPosition) {
      return {
        x: shipPosition.x + 2,
        y: shipPosition.y + 0.5,
        z: shipPosition.z + 2
      };
    }
    return null;
  }
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
      isMoving: true, // ✅ IMPORTANT: Le drone est en mouvement vers sa cible
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
