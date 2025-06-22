/**
 * ============================================================================
 * CONTEXT REDUCERS - Réducteurs centralisés pour le contexte FSM
 * ============================================================================
 * 
 * Ce fichier centralise tous les réducteurs qui modifient le contexte FSM.
 * Ces fonctions sont pures et permettent des mises à jour cohérentes du contexte
 * à travers l'application.
 * 
 * Les reducers structurent les mises à jour du contexte en réutilisant
 * les actions core existantes.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { BOT_STATES } from '../constants/constants.js';
import { shipCollectingActions } from '../actions/core/shipCollectingActions.js'; // NOUVEAU - Remplace movementActions
import { droneExploringActions } from '../actions/core/droneExploringActions.js'; // NOUVEAU - Remplace explorationActions et droneDeploymentActions
import { fuelActions } from '../actions/core/fuelActions.js';
import { resourceActions } from '../actions/core/resourcesActions.js';
import fsmLogger from '../../../../logger/fsmLogger.js'; // Ajout de l'import manquant

// ============================================================================
// RÉDUCTEURS D'ÉTAT - Mises à jour du contexte lors des transitions d'état
// ============================================================================

/**
 * Met à jour l'état courant dans le contexte avec gestion d'historique
 * @param {Object} context - Contexte FSM actuel
 * @param {string} newState - Nouvel état
 * @returns {Object} - Contexte mis à jour
 */
export const updateStateReducer = (context, newState) => {
  const maxHistoryLength = 10;
  
  // Vérifier que le nouvel état est valide
  if (!Object.values(BOT_STATES).includes(newState)) {
    console.warn(`Invalid state transition attempted: ${newState}`);
    return context;
  }
  
  return {
    ...context,
    currentState: newState,
    timestamps: {
      ...context.timestamps,
      stateChange: Date.now()
    },
    memory: {
      ...context.memory,
      stateHistory: [
        newState,
        ...context.memory.stateHistory.slice(0, maxHistoryLength - 1)
      ],
      transitionHistory: [
        {
          from: context.currentState,
          to: newState,
          timestamp: Date.now()
        },
        ...context.memory.transitionHistory.slice(0, maxHistoryLength - 1)
      ]
    }
  };
};

// ============================================================================
// RÉDUCTEURS PAR CATÉGORIE
// ============================================================================

/**
 * Réducteurs pour les transitions entre états
 */
export const stateTransitionReducers = {
  /**
   * Prepare une transition vers l'état EXPLORING
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de transition
   * @returns {Object} - Contexte mis à jour pour exploration
   */
  prepareExploring: (context, event) => ({
    ...context,
    currentAction: 'exploring',
    lastDecision: 'start_exploration',
    hasExplored: false,
    explorationTarget: event.target || null,
    lastStateChange: Date.now()
  }),

  /**
   * Prepare une transition vers l'état COLLECTING
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de transition
   * @returns {Object} - Contexte mis à jour pour collecte
   */
  prepareCollecting: (context, event) => {
    // Utiliser la nouvelle structure mémoire unifiée pour trouver des tuiles collectibles
    const collectibleTiles = Array.from(context.memory.knownTiles.values()).filter(
      tile => tile.explored && tile.hasResources && !tile.collected
    );
    const targetTile = event.tileCoord ? context.memory.knownTiles.get(event.tileCoord) : collectibleTiles[0];
    
    return {
      ...context,
      currentAction: 'collecting',
      lastDecision: 'collect_resources',
      targetTile: targetTile || null,
      lastStateChange: Date.now()
    };
  },

  /**
   * Prepare une transition vers l'état RETURNING
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de transition
   * @returns {Object} - Contexte mis à jour pour retour
   */
  prepareReturning: (context, event) => {
    // ✅ CORRECTION: Définir updatedDrone à partir du contexte existant
    const currentDrone = context.droneFleet?.drones?.explorer || {};
    // ✅ CORRECTION: Utiliser la position réelle du vaisseau au lieu de la position codée en dur
    const shipPosition = context.vehicle?.position || { x: 0, y: 0.5, z: 0 }; // Fallback sécurisé
    
    const updatedDrone = {
      ...currentDrone,
      state: 'returning',  // ✅ État visuel du drone (DRONE_VISUAL_STATES)
      targetPosition: shipPosition,           // Position du vaisseau pour le retour
      isReturning: true,
      returnStartTime: Date.now(),
      lastUpdate: Date.now()
    };
    
    return {
      ...context,
      currentAction: 'returning',
      lastDecision: event.reason || 'returning_to_base',
      emergencyReason: event.emergencyReason || null,
      emergencyFlag: Boolean(event.emergencyReason),
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          explorer: updatedDrone
        }
      },
      lastStateChange: Date.now()
    };
  },

  /**
   * Prepare une transition vers l'état IDLE_AT_BASE
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de transition
   * @returns {Object} - Contexte mis à jour pour idle
   */
  prepareIdleAtBase: (context, event) => ({
    ...context,
    currentAction: 'idling',
    lastDecision: 'at_base',
    emergencyFlag: false,
    emergencyReason: null,
    lastStateChange: Date.now()
  }),

  /**
   * Prepare une transition vers l'état EVALUATING
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de transition
   * @returns {Object} - Contexte mis à jour pour évaluation
   */
  prepareEvaluating: (context, event) => ({
    ...context,
    currentAction: 'evaluating',
    lastDecision: event.reason || 'decision_needed',
    lastStateChange: Date.now(),
    // ⭐ Nettoyer les données de mouvement pour éviter les boucles
    targetPosition: null,
    selectedTileForCollection: null,
    vehicle: {
      ...context.vehicle,
      isMoving: false,
      targetPosition: null,
      targetTile: null
    }
  }),

  /**
   * Prepare une transition vers l'état COLLECTING_MOVING_TO_TARGET
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de transition
   * @returns {Object} - Contexte mis à jour pour déplacement vers tuile cible
   */
  prepareCollectingMovingToTarget: (context, event) => {
    const targetTile = context.selectedTileForCollection;
    
    if (!targetTile) {
      fsmLogger.error(`[${context.entityId}] Cannot prepare collection movement: no target tile selected`);
      return context;
    }
    
    fsmLogger.info(`[${context.entityId}] Preparing ship movement to collection target: ${targetTile.coord}`, {
      targetPosition: targetTile.position
    });
    
    return {
      ...context,
      currentAction: 'moving_to_target',
      lastDecision: 'collect_best_tile',
      targetTile: targetTile,
      targetPosition: targetTile.position, // Pour l'animation
      vehicle: {
        ...context.vehicle,
        isMoving: true,
        targetPosition: targetTile.position,
        targetTile: targetTile
      },
      lastStateChange: Date.now()
    };
  },
  
  /**
   * Prepare une transition vers l'état COLLECTING_RETURNING_TO_BASE
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de transition
   * @returns {Object} - Contexte mis à jour pour retour à la base après collecte
   */
  prepareReturningToBase: (context, event) => {
    // 🏠 UTILISER LA BASE POSITION DÉFINIE AUTOMATIQUEMENT PAR LE TRACKER
    const basePosition = context.vehicle?.basePosition;
    
    if (!basePosition) {
      fsmLogger.error("🚨 [prepareReturningToBase] No basePosition found in context", {
        hasVehicle: !!context.vehicle,
        vehiclePosition: context.vehicle?.position,
        vehicleBasePosition: context.vehicle?.basePosition,
        botId: context.entityId
      });
      // Ne pas utiliser de fallback codé en dur, laisser le système se débrouiller
      return {
        ...context,
        currentAction: 'returning_to_base',
        lastDecision: 'return_after_collection_no_base',
        lastStateChange: Date.now(),
        error: 'no_base_position_found'
      };
    }

    fsmLogger.info("🏠 [prepareReturningToBase] Using base position from context", {
      basePosition,
      botId: context.entityId
    });

    return {
      ...context,
      currentAction: 'returning_to_base',
      lastDecision: 'return_after_collection',
      lastStateChange: Date.now(),
      // 🎯 UTILISER LA VRAIE BASE POSITION DU CONTEXTE
      targetPosition: basePosition,
      vehicle: {
        ...context.vehicle,
        targetPosition: basePosition,
        isMoving: true // 🚀 DÉCLENCHER LE MOUVEMENT
      }
    };
  }
};

/**
 * Réducteurs pour les opérations de mouvement
 */
export const movementReducers = {
  /**
   * Démarre un mouvement vers une cible
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec targetTile
   * @returns {Object} - Contexte avec mouvement démarré
   */
  startMovement: (context, event) => {
    // Réutilise les actions core ship movement
    return shipCollectingActions.shipMoveToTile(context, event);
  },

  /**
   * Met à jour la progression du mouvement
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec progress
   * @returns {Object} - Contexte avec progression mise à jour
   */
  updateMovementProgress: (context, event) => {
    // Réutilise les actions core ship movement
    return shipCollectingActions.shipUpdateProgress(context, event);
  },

  /**
   * Finalise un mouvement
   * @param {Object} context - Contexte FSM actuel
   * @returns {Object} - Contexte avec mouvement terminé
   */
  completeMovement: (context) => {
    // Réutilise les actions core ship movement
    return shipCollectingActions.shipCompleteMovement(context);
  },

  /**
   * Annule un mouvement en cours
   * @param {Object} context - Contexte FSM actuel
   * @returns {Object} - Contexte avec mouvement annulé
   */
  cancelMovement: (context) => {
    // Réutilise les actions core ship movement
    return shipCollectingActions.shipStopMovement(context);
  }
};

/**
 * Réducteurs pour les opérations de ressources
 */
export const resourceReducers = {
  /**
   * Ajoute une ressource collectée à l'inventaire
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec ressource et quantité
   * @returns {Object} - Contexte avec inventaire mis à jour
   */
  addResource: (context, event) => {
    // Réutilise les actions core resources
    return resourceActions.addResource(context, event);
  },
  
  /**
   * Dépose toutes les ressources
   * @param {Object} context - Contexte FSM actuel
   * @returns {Object} - Contexte avec inventaire vidé
   */
  depositResources: (context) => {
    // Réutilise les actions core resources
    return resourceActions.depositResources(context);
  },
  
  /**
   * Enregistre une tuile découverte dans la mémoire unifiée
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec nouvelle tuile découverte
   * @returns {Object} - Contexte avec mémoire mise à jour
   */
  recordDiscoveredTile: (context, event) => {
    if (!event.tileCoord || !event.resourcesFound) return context;
    
    const coord = typeof event.tileCoord === 'string' ? event.tileCoord : `${event.tileCoord.x},${event.tileCoord.z}`;
    
    // Vérifier si la tuile est déjà connue
    if (context.memory.knownTiles.has(coord)) {
      return context;
    }
    
    // Créer directement les données de tuile (même logique que markTileExplored)
    const tileData = {
      coord,
      explored: true,
      collected: false,
      exploredAt: Date.now(),
      hasResources: event.resourcesFound.food > 0 || event.resourcesFound.debris > 0 || event.resourcesFound.special > 0,
      resources: { ...event.resourcesFound },
      position: event.position, // ⭐ Inclure la position 3D de la tuile
      collectedAt: null,
      collectedBy: null
    };
    
    const newKnownTiles = new Map(context.memory.knownTiles);
    newKnownTiles.set(coord, tileData);
    
    const totalResources = event.resourcesFound.food + event.resourcesFound.debris + event.resourcesFound.special;
    
    return {
      ...context,
      memory: {
        ...context.memory,
        knownTiles: newKnownTiles,
        stats: {
          ...context.memory.stats,
          tilesExplored: context.memory.stats.tilesExplored + 1,
          totalResourcesFound: context.memory.stats.totalResourcesFound + totalResources,
          lastExploration: Date.now()
        }
      },
      hasNewResourceDiscovery: true
    };
  }
};

/**
 * Réducteurs pour les opérations de carburant
 */
export const fuelReducers = {
  /**
   * Consomme du carburant
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec quantité
   * @returns {Object} - Contexte avec carburant réduit
   */
  consumeFuel: (context, event) => {
    // Réutilise les actions core fuel
    return fuelActions.consumeFuel(context, event);
  },
  
  /**
   * Fait le plein de carburant
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec quantité optionnelle
   * @returns {Object} - Contexte avec carburant rechargé
   */
  refuel: (context, event) => {
    // Réutilise les actions core fuel
    return fuelActions.refuel(context, event);
  }
};

/**
 * Réducteurs pour les opérations d'exploration
 */
export const explorationReducers = {
  /**
   * Démarre une nouvelle exploration
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec zone d'exploration
   * @returns {Object} - Contexte avec exploration démarrée
   */
  startExploration: (context, event) => {
    // Réutilise les actions core exploration
    return explorationActions.startExploration(context, event);
  },
  
  /**
   * Met à jour la progression de l'exploration
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec progression
   * @returns {Object} - Contexte avec exploration mise à jour
   */
  updateExploration: (context, event) => {
    // Réutilise les actions core exploration
    return explorationActions.updateExplorationProgress(context, event);
  },
  
  /**
   * Termine une exploration
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec résultats
   * @returns {Object} - Contexte avec exploration terminée
   */
  completeExploration: (context, event) => {
    // Réutilise les actions core exploration
    return explorationActions.completeExploration(context, event);
  },
  
  /**
   * Marque une section comme explorée
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec sections complétées
   * @returns {Object} - Contexte avec sections mises à jour
   */
  markAreaExplored: (context, event) => {
    if (!event.completedSections || !Array.isArray(event.completedSections)) {
      return context;
    }
    
    return {
      ...context,
      hasExplored: true,
      completedSections: [
        ...(context.completedSections || []),
        ...event.completedSections
      ],
      lastExplorationTime: Date.now()
    };
  }
};

/**
 * Réducteurs pour les opérations d'urgence et sécurité
 */
export const emergencyReducers = {
  /**
   * Active le mode d'urgence
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec raison d'urgence
   * @returns {Object} - Contexte avec mode urgence activé
   */
  triggerEmergency: (context, event) => {
    return {
      ...context,
      emergencyFlag: true,
      emergencyReason: event.reason || 'unknown',
      currentAction: 'emergency_return',
      lastDecision: 'emergency',
      lastStateChange: Date.now()
    };
  },
  
  /**
   * Désactive le mode d'urgence
   * @param {Object} context - Contexte FSM actuel
   * @returns {Object} - Contexte avec mode urgence désactivé
   */
  clearEmergency: (context) => {
    return {
      ...context,
      emergencyFlag: false,
      emergencyReason: null
    };
  }
};

/**
 * Réducteurs pour le contrôle manuel
 */
export const manualControlReducers = {
  /**
   * Active le contrôle manuel
   * @param {Object} context - Contexte FSM actuel
   * @returns {Object} - Contexte avec mode manuel activé
   */
  enableManualControl: (context) => {
    return {
      ...context,
      autonomousMode: false,
      manualOverrideActive: true,
      lastDecision: 'manual_override',
      lastStateChange: Date.now()
    };
  },
  
  /**
   * Désactive le contrôle manuel et retourne à l'autonomie
   * @param {Object} context - Contexte FSM actuel
   * @returns {Object} - Contexte avec mode autonome réactivé
   */
  disableManualControl: (context) => {
    return {
      ...context,
      autonomousMode: true,
      manualOverrideActive: false,
      lastDecision: 'autonomous_resumed',
      lastStateChange: Date.now()
    };
  },
  
  /**
   * Enregistre une commande manuelle
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec commande et paramètres
   * @returns {Object} - Contexte avec commande enregistrée
   */
  recordManualCommand: (context, event) => {
    return {
      ...context,
      manualCommand: event.command,
      manualParams: event.params,
      lastDecision: 'manual_command',
      lastStateChange: Date.now()
    };
  }
};

/**
 * Réducteurs pour les opérations à la base
 */
export const baseReducers = {
  /**
   * Démarre le processus de ravitaillement
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de ravitaillement
   * @returns {Object} - Contexte avec ravitaillement démarré
   */
  startRefueling: (context, event) => {
    return {
      ...context,
      currentAction: 'refueling',
      refuelStartTime: Date.now(),
      refuelStatus: 'in_progress'
    };
  },
  
  /**
   * Démarre le déchargement des ressources
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de déchargement
   * @returns {Object} - Contexte avec déchargement démarré
   */
  startUnloading: (context, event) => {
    return {
      ...context,
      currentAction: 'unloading',
      unloadStartTime: Date.now(),
      unloadStatus: 'in_progress'
    };
  },
  
  /**
   * Démarre le processus de réparation
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de réparation
   * @returns {Object} - Contexte avec réparation démarrée
   */
  startRepairing: (context, event) => {
    return {
      ...context,
      currentAction: 'repairing',
      repairStartTime: Date.now(),
      repairStatus: 'in_progress'
    };
  },
  
  /**
   * Termine et nettoie les opérations de maintenance
   * @param {Object} context - Contexte FSM actuel
   * @returns {Object} - Contexte avec maintenance terminée
   */
  completeAllMaintenance: (context) => {
    return {
      ...context,
      maintenanceStatus: 'complete',
      lastMaintenanceTime: Date.now(),
      currentAction: 'maintenance_complete',
      // Reset tous les statuts
      emergencyFlag: false,
      emergencyReason: null,
      capacityWarning: false
    };
  }
};

/**
 * Réducteurs pour le déploiement et contrôle des drones
 */
export const droneDeploymentReducers = {
  /**
   * Déploie un drone vers une zone cible
   */
  deployDrone: (context, event) => {
    return droneExploringActions.droneDeployForExploration(context, event);
  },

  /**
   * Rappelle le drone au vaisseau
   */
  recallDrone: (context, event) => {
    return droneExploringActions.droneRecallToShip(context, event);
  },

  /**
   * Finalise le retour du drone (ancrage)
   */
  dockDrone: (context, event) => {
    return droneExploringActions.droneDockToShip(context, event);
  },

  /**
   * Met à jour la position du drone en temps réel
   */
  updateDronePosition: (context, event) => {
    return droneExploringActions.droneUpdatePosition(context, event);
  }
};

/**
 * Réducteurs pour la mémoire unifiée des tuiles
 */
export const memoryReducers = {
  /**
   * Marque une tuile comme explorée dans la mémoire unifiée
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec coordonnées et ressources
   * @returns {Object} - Contexte avec tuile marquée comme explorée
   */
  markTileExplored: (context, event) => {
    if (!event.tileCoord || !event.resourcesFound) return context;
    
    const coord = typeof event.tileCoord === 'string' ? event.tileCoord : `${event.tileCoord.x},${event.tileCoord.z}`;
    const tileData = {
      coord,
      explored: true,
      collected: false,
      exploredAt: Date.now(),
      hasResources: event.resourcesFound.food > 0 || event.resourcesFound.debris > 0 || event.resourcesFound.special > 0,
      resources: { ...event.resourcesFound },
      position: event.position, // ⭐ Inclure la position 3D de la tuile
      collectedAt: null,
      collectedBy: null
    };
    
    const newKnownTiles = new Map(context.memory.knownTiles);
    newKnownTiles.set(coord, tileData);
    
    const totalResources = event.resourcesFound.food + event.resourcesFound.debris + event.resourcesFound.special;
    
    return {
      ...context,
      memory: {
        ...context.memory,
        knownTiles: newKnownTiles,
        stats: {
          ...context.memory.stats,
          tilesExplored: context.memory.stats.tilesExplored + 1,
          totalResourcesFound: context.memory.stats.totalResourcesFound + totalResources,
          lastExploration: Date.now()
        }
      }
    };
  },

  /**
   * Marque une tuile comme collectée dans la mémoire unifiée
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec coordonnées et collecteur
   * @returns {Object} - Contexte avec tuile marquée comme collectée
   */
  markTileCollected: (context, event) => {
    if (!event.tileCoord) return context;
    
    const coord = typeof event.tileCoord === 'string' ? event.tileCoord : `${event.tileCoord.x},${event.tileCoord.z}`;
    const existingTile = context.memory.knownTiles.get(coord);
    
    if (!existingTile || !existingTile.explored || existingTile.collected) {
      return context; // Tuile inexistante, non explorée ou déjà collectée
    }
    
    const updatedTile = {
      ...existingTile,
      collected: true,
      collectedAt: Date.now(),
      collectedBy: event.collectedBy || 'ship'
    };
    
    const newKnownTiles = new Map(context.memory.knownTiles);
    newKnownTiles.set(coord, updatedTile);
    
    return {
      ...context,
      memory: {
        ...context.memory,
        knownTiles: newKnownTiles,
        stats: {
          ...context.memory.stats,
          tilesCollected: context.memory.stats.tilesCollected + 1,
          lastCollection: Date.now()
        }
      }
    };
  }
};

/**
 * Fonctions utilitaires pour la mémoire unifiée
 */
export const memoryUtils = {
  /**
   * Retourne toutes les tuiles explorées
   * @param {Object} context - Contexte FSM actuel
   * @returns {Array} - Liste des tuiles explorées
   */
  getExploredTiles: (context) => {
    return Array.from(context.memory.knownTiles.values()).filter(tile => tile.explored);
  },

  /**
   * Retourne toutes les tuiles collectibles (explorées, avec ressources, non collectées)
   * @param {Object} context - Contexte FSM actuel
   * @returns {Array} - Liste des tuiles collectibles
   */
  getCollectibleTiles: (context) => {
    return Array.from(context.memory.knownTiles.values()).filter(
      tile => tile.explored && tile.hasResources && !tile.collected
    );
  },

  /**
   * Vérifie si une tuile est connue (dans la mémoire)
   * @param {Object} context - Contexte FSM actuel
   * @param {string|Object} coord - Coordonnées de la tuile
   * @returns {boolean} - true si la tuile est connue
   */
  isTileKnown: (context, coord) => {
    const coordStr = typeof coord === 'string' ? coord : `${coord.x},${coord.z}`;
    return context.memory.knownTiles.has(coordStr);
  },

  /**
   * Vérifie si une tuile peut être collectée
   * @param {Object} context - Contexte FSM actuel
   * @param {string|Object} coord - Coordonnées de la tuile
   * @returns {boolean} - true si la tuile peut être collectée
   */
  isTileCollectible: (context, coord) => {
    const coordStr = typeof coord === 'string' ? coord : `${coord.x},${coord.z}`;
    const tile = context.memory.knownTiles.get(coordStr);
    return tile && tile.explored && tile.hasResources && !tile.collected;
  },

  /**
   * Obtient les données d'une tuile spécifique
   * @param {Object} context - Contexte FSM actuel
   * @param {string|Object} coord - Coordonnées de la tuile
   * @returns {Object|null} - Données de la tuile ou null si inconnue
   */
  getTileData: (context, coord) => {
    const coordStr = typeof coord === 'string' ? coord : `${coord.x},${coord.z}`;
    return context.memory.knownTiles.get(coordStr) || null;
  }
};

// ============================================================================
// EXPORT
// ============================================================================

export const contextReducers = {
  // Catégories de réducteurs
  state: stateTransitionReducers,
  movement: movementReducers,
  resource: resourceReducers,
  fuel: fuelReducers,
  exploration: explorationReducers,
  memory: memoryReducers, // NOUVEAU - Reducers pour mémoire unifiée
  emergency: emergencyReducers,
  manual: manualControlReducers,
  base: baseReducers,
  droneDeployment: droneDeploymentReducers,  
  // Réducteur d'état (fonction principale)
  updateState: updateStateReducer,
  // Utilitaires pour la mémoire
  utils: memoryUtils
};

export default contextReducers;
