/**
 * ============================================================================
 * BOT MACHINE FSM - Machine d'état pour bots autonomes avec Robot3
 * ============================================================================
 * 
 * Machine FSM unifiée utilisant les actions core existantes (movement.js).
 * États : IDLE, EXPLORING, COLLECTING, RETURNING
 * 
 * @author Migration FSM Phase 2
 * @version 1.0.0
 */

import { createMachine } from 'robot3';
import { FSM_STATES, updateStateHistory } from './context/initialContext.js';
import { movementActions, movementGuards } from '../../../shared/actions/core/movement.js';

// ============================================================================
// GUARDS FSM - Basés sur BotConditions.js existant
// ============================================================================

/**
 * Guards pour les transitions FSM
 */
const fsmGuards = {
  
  /**
   * Vérifie si le bot a assez de carburant pour continuer
   */
  hasEnoughFuel: (context) => {
    const fuelThreshold = context.config?.fuelThreshold || 20;
    return (context.vehicle?.fuel || 0) > fuelThreshold;
  },

  /**
   * Vérifie si le véhicule est proche de la capacité maximale
   */
  isNearCapacity: (context) => {
    const threshold = context.config?.capacityThreshold || 80;
    const vehicle = context.vehicle;
    
    if (!vehicle?.resources || !vehicle?.maxCapacity) return false;
    
    const currentLoad = vehicle.resources.food + vehicle.resources.debris + vehicle.resources.special;
    const maxLoad = vehicle.maxCapacity.food + vehicle.maxCapacity.debris + vehicle.maxCapacity.special;
    
    return (currentLoad / maxLoad) * 100 >= threshold;
  },

  /**
   * Vérifie si le bot a des ressources à déposer
   */
  hasResources: (context) => {
    const resources = context.vehicle?.resources;
    if (!resources) return false;
    
    return resources.food > 0 || resources.debris > 0 || resources.special > 0;
  },

  /**
   * Vérifie si le bot est à sa base
   */
  isAtBase: (context) => {
    const vehicle = context.vehicle;
    const startCoord = vehicle?.startCoord;
    const currentCoord = vehicle?.coord;
    
    return startCoord && currentCoord && startCoord === currentCoord;
  },

  /**
   * Vérifie si le bot a une cible d'exploration
   */
  hasExplorationTarget: (context) => {
    return context.currentTarget !== null || context.explorationQueue.length > 0;
  },

  /**
   * Vérifie si le mouvement est terminé
   */
  isMovementComplete: (context) => {
    return movementGuards.isMovementComplete(context);
  },

  /**
   * Vérifie si le bot est en mode autonome
   */
  isAutonomous: (context) => {
    return context.autonomousMode === true;
  },

  /**
   * Vérifie si le véhicule est opérationnel
   */
  canOperate: (context) => {
    return movementGuards.isVehicleOperational(context) && 
           movementGuards.canUseVehicle(context);
  }
};

// ============================================================================
// ACTIONS FSM - Utilisant les actions core existantes
// ============================================================================

/**
 * Actions FSM qui orchestrent les actions core
 */
const fsmActions = {
  
  /**
   * Entre en état IDLE
   */
  enterIdle: (context) => {
    const newContext = updateStateHistory(context, FSM_STATES.IDLE);
    return {
      ...newContext,
      currentTarget: null,
      lastAction: 'enterIdle',
      error: null
    };
  },

  /**
   * Entre en état EXPLORING
   */
  enterExploring: (context) => {
    const newContext = updateStateHistory(context, FSM_STATES.EXPLORING);
    
    // Si pas de cible, créer une file d'exploration basique
    if (!newContext.currentTarget && newContext.explorationQueue.length === 0) {
      return {
        ...newContext,
        explorationQueue: ['explore_random'], // Placeholder pour exploration
        lastAction: 'enterExploring'
      };
    }
    
    return {
      ...newContext,
      lastAction: 'enterExploring'
    };
  },

  /**
   * Entre en état COLLECTING
   */
  enterCollecting: (context) => {
    const newContext = updateStateHistory(context, FSM_STATES.COLLECTING);
    return {
      ...newContext,
      lastAction: 'enterCollecting',
      timestamps: {
        ...newContext.timestamps,
        lastCollection: Date.now()
      }
    };
  },

  /**
   * Entre en état RETURNING
   */
  enterReturning: (context) => {
    const newContext = updateStateHistory(context, FSM_STATES.RETURNING);
    
    // Utiliser l'action de mouvement pour retourner à la base
    if (newContext.vehicle?.startCoord) {
      const moveEvent = {
        targetTile: {
          coord: newContext.vehicle.startCoord,
          position: null // Sera résolu par le système de mouvement
        }
      };
      
      const movedContext = movementActions.moveToTile(newContext, moveEvent);
      
      return {
        ...movedContext,
        lastAction: 'enterReturning'
      };
    }
    
    return {
      ...newContext,
      lastAction: 'enterReturning'
    };
  },

  /**
   * Déplace vers une cible
   */
  moveToTarget: (context, event) => {
    // Utiliser l'action core de mouvement
    const result = movementActions.moveToTile(context, event);
    
    return {
      ...result,
      lastAction: 'moveToTarget'
    };
  },

  /**
   * Arrête le mouvement
   */
  stopMovement: (context) => {
    const result = movementActions.stopMovement(context);
    
    return {
      ...result,
      lastAction: 'stopMovement'
    };
  },

  /**
   * Met à jour la progression
   */
  updateProgress: (context, event) => {
    const result = movementActions.updateProgress(context, event);
    
    return {
      ...result,
      lastAction: 'updateProgress'
    };
  },

  /**
   * Gère les erreurs
   */
  handleError: (context, event) => {
    return {
      ...context,
      error: event.error || 'Unknown error',
      lastAction: 'handleError'
    };
  }
};

// ============================================================================
// MACHINE FSM PRINCIPALE
// ============================================================================

/**
 * Machine d'état pour les bots autonomes
 */
export const botMachine = createMachine({
  // État initial
  [FSM_STATES.IDLE]: {
    // Transitions depuis IDLE
    AUTO: (context) => {
      // Auto-transition basée sur les conditions
      if (!fsmGuards.canOperate(context)) {
        return FSM_STATES.IDLE; // Rester en IDLE si pas opérationnel
      }
      
      if (!fsmGuards.hasEnoughFuel(context)) {
        return FSM_STATES.RETURNING; // Retourner à la base pour le carburant
      }
      
      if (fsmGuards.isNearCapacity(context)) {
        return FSM_STATES.RETURNING; // Retourner à la base pour déposer
      }
      
      if (fsmGuards.hasExplorationTarget(context)) {
        return FSM_STATES.EXPLORING; // Commencer l'exploration
      }
      
      return FSM_STATES.IDLE; // Rester en IDLE
    },
    
    // Événements manuels pour debug/contrôle
    START_EXPLORING: FSM_STATES.EXPLORING,
    START_COLLECTING: FSM_STATES.COLLECTING,
    RETURN_TO_BASE: FSM_STATES.RETURNING,
    
    // Actions d'entrée
    ENTER: fsmActions.enterIdle
  },

  // ========================================================================
  
  [FSM_STATES.EXPLORING]: {
    // Transitions depuis EXPLORING
    AUTO: (context) => {
      if (!fsmGuards.canOperate(context)) {
        return FSM_STATES.IDLE;
      }
      
      if (!fsmGuards.hasEnoughFuel(context) || fsmGuards.isNearCapacity(context)) {
        return FSM_STATES.RETURNING;
      }
      
      // Si des ressources ont été trouvées, passer à la collecte
      if (fsmGuards.hasResources(context)) {
        return FSM_STATES.COLLECTING;
      }
      
      return FSM_STATES.EXPLORING; // Continuer l'exploration
    },
    
    // Événements manuels
    COLLECT_RESOURCES: FSM_STATES.COLLECTING,
    RETURN_TO_BASE: FSM_STATES.RETURNING,
    STOP: FSM_STATES.IDLE,
    
    // Actions
    ENTER: fsmActions.enterExploring,
    MOVE_TO: fsmActions.moveToTarget
  },

  // ========================================================================
  
  [FSM_STATES.COLLECTING]: {
    // Transitions depuis COLLECTING
    AUTO: (context) => {
      if (!fsmGuards.canOperate(context)) {
        return FSM_STATES.IDLE;
      }
      
      if (!fsmGuards.hasEnoughFuel(context) || fsmGuards.isNearCapacity(context)) {
        return FSM_STATES.RETURNING;
      }
      
      // Si plus de ressources à collecter, retourner à l'exploration
      if (!fsmGuards.hasExplorationTarget(context)) {
        return FSM_STATES.EXPLORING;
      }
      
      return FSM_STATES.COLLECTING; // Continuer la collecte
    },
    
    // Événements manuels
    EXPLORE: FSM_STATES.EXPLORING,
    RETURN_TO_BASE: FSM_STATES.RETURNING,
    STOP: FSM_STATES.IDLE,
    
    // Actions
    ENTER: fsmActions.enterCollecting,
    MOVE_TO: fsmActions.moveToTarget
  },

  // ========================================================================
  
  [FSM_STATES.RETURNING]: {
    // Transitions depuis RETURNING
    AUTO: (context) => {
      if (!fsmGuards.canOperate(context)) {
        return FSM_STATES.IDLE;
      }
      
      // Si arrivé à la base, retourner à IDLE
      if (fsmGuards.isAtBase(context)) {
        return FSM_STATES.IDLE;
      }
      
      return FSM_STATES.RETURNING; // Continuer le retour
    },
    
    // Événements manuels
    EXPLORE: FSM_STATES.EXPLORING,
    COLLECT_RESOURCES: FSM_STATES.COLLECTING,
    STOP: FSM_STATES.IDLE,
    
    // Actions
    ENTER: fsmActions.enterReturning,
    MOVE_TO: fsmActions.moveToTarget
  }
}, FSM_STATES.IDLE); // État initial

// ============================================================================
// EXPORT
// ============================================================================

export default botMachine;

export {
  fsmGuards,
  fsmActions,
  FSM_STATES
};
