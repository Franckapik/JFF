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
import { movementActions } from '../actions/core/movementActions.js';
import { fuelActions } from '../actions/core/fuelActions.js';
import { resourceActions } from '../actions/core/resourcesActions.js';
import { explorationActions } from '../actions/core/explorationActions.js';
import { droneDeploymentActions, fsmDroneFleetActions } from '../actions/core/droneActions.js';

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
  prepareCollecting: (context, event) => ({
    ...context,
    currentAction: 'collecting',
    lastDecision: 'collect_resources',
    targetResource: event.resource || context.knownResources?.[0] || null,
    lastStateChange: Date.now()
  }),

  /**
   * Prepare une transition vers l'état RETURNING
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement de transition
   * @returns {Object} - Contexte mis à jour pour retour
   */
  prepareReturning: (context, event) => {
    // ✅ CORRECTION: Définir updatedDrone à partir du contexte existant
    const currentDrone = context.droneFleet?.drones?.explorer || {};
    const shipPosition = { x: 5, y: 0, z: 0 }; //CORRIGER CETTE POSITION EN FONCTION DU VRAI Vaisseau
    //La position du vaisseau doit etre mise a jour dès le depart du jeu
    //les autres reducers ci dessus doivent etre utilisés dans le fichier exploration.js .
    const updatedDrone = {
      ...currentDrone,
      state: 'returning',  // ✅ Utiliser le bon état
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
    lastStateChange: Date.now()
  })
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
    // Réutilise les actions core movement
    return movementActions.startMoveTo(context, event);
  },

  /**
   * Met à jour la progression du mouvement
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec progress
   * @returns {Object} - Contexte avec progression mise à jour
   */
  updateMovementProgress: (context, event) => {
    // Réutilise les actions core movement
    return movementActions.updateMovementProgress(context, event);
  },

  /**
   * Finalise un mouvement
   * @param {Object} context - Contexte FSM actuel
   * @returns {Object} - Contexte avec mouvement terminé
   */
  completeMovement: (context) => {
    // Réutilise les actions core movement
    return movementActions.completeMovement(context);
  },

  /**
   * Annule un mouvement en cours
   * @param {Object} context - Contexte FSM actuel
   * @returns {Object} - Contexte avec mouvement annulé
   */
  cancelMovement: (context) => {
    // Réutilise les actions core movement
    return movementActions.stopMovement(context);
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
   * Ajoute une ressource découverte à la mémoire
   * @param {Object} context - Contexte FSM actuel
   * @param {Object} event - Événement avec nouvelle ressource
   * @returns {Object} - Contexte avec mémoire mise à jour
   */
  recordDiscoveredResource: (context, event) => {
    if (!event.resource) return context;
    
    const alreadyKnown = context.memory.knownResources.some(
      r => r.id === event.resource.id
    );
    
    if (alreadyKnown) return context;
    
    return {
      ...context,
      memory: {
        ...context.memory,
        knownResources: [...context.memory.knownResources, event.resource]
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
    return droneDeploymentActions.deployDrone(context, event);
  },

  /**
   * Rappelle le drone au vaisseau
   */
  recallDrone: (context, event) => {
    return droneDeploymentActions.recallDrone(context, event);
  },

  /**
   * Finalise le retour du drone (ancrage)
   */
  dockDrone: (context, event) => {
    return droneDeploymentActions.dockDrone(context, event);
  },

  /**
   * Met à jour la position du drone en temps réel
   */
  updateDronePosition: (context, event) => {
    return droneDeploymentActions.updateDronePosition(context, event);
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
  emergency: emergencyReducers,
  manual: manualControlReducers,
  base: baseReducers,
  droneDeployment: droneDeploymentReducers,  
  // Réducteur d'état (fonction principale)
  updateState: updateStateReducer
};

export default contextReducers;
