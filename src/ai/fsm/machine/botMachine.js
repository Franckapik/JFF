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

import { createMachine, state, transition, reduce } from 'robot3';
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
export const botMachine = createMachine(
  FSM_STATES.IDLE, // État initial
  {
    [FSM_STATES.IDLE]: state(
      // Transitions manuelles
      transition('START_EXPLORING', FSM_STATES.EXPLORING),
      transition('START_COLLECTING', FSM_STATES.COLLECTING),
      transition('RETURN_TO_BASE', FSM_STATES.RETURNING),
      transition('MOVE_TO', FSM_STATES.IDLE, {
        reduce: (context, event) => fsmActions.moveToTarget(context, event)
      }),
      transition('STOP', FSM_STATES.IDLE, {
        reduce: (context, event) => fsmActions.stopMovement(context)
      }),
      // Transition automatique basée sur les conditions
      transition('AUTO', (context) => {
        if (!fsmGuards.canOperate(context)) {
          return FSM_STATES.IDLE;
        }
        if (!fsmGuards.hasEnoughFuel(context)) {
          return FSM_STATES.RETURNING;
        }
        if (fsmGuards.isNearCapacity(context)) {
          return FSM_STATES.RETURNING;
        }
        if (fsmGuards.hasExplorationTarget(context)) {
          return FSM_STATES.EXPLORING;
        }
        return FSM_STATES.IDLE;
      }),
      // Action d'entrée
      transition('ENTER', FSM_STATES.IDLE, {
        reduce: (context) => fsmActions.enterIdle(context)
      })
    ),

    [FSM_STATES.EXPLORING]: state(
      // Transitions manuelles
      transition('COLLECT_RESOURCES', FSM_STATES.COLLECTING),
      transition('RETURN_TO_BASE', FSM_STATES.RETURNING),
      transition('STOP', FSM_STATES.IDLE),
      transition('MOVE_TO', FSM_STATES.EXPLORING, {
        reduce: (context, event) => fsmActions.moveToTarget(context, event)
      }),
      // Transition automatique
      transition('AUTO', (context) => {
        if (!fsmGuards.canOperate(context)) {
          return FSM_STATES.IDLE;
        }
        if (!fsmGuards.hasEnoughFuel(context) || fsmGuards.isNearCapacity(context)) {
          return FSM_STATES.RETURNING;
        }
        if (fsmGuards.hasResources(context)) {
          return FSM_STATES.COLLECTING;
        }
        return FSM_STATES.EXPLORING;
      }),
      // Action d'entrée
      transition('ENTER', FSM_STATES.EXPLORING, {
        reduce: (context) => fsmActions.enterExploring(context)
      })
    ),

    [FSM_STATES.COLLECTING]: state(
      // Transitions manuelles
      transition('EXPLORE', FSM_STATES.EXPLORING),
      transition('RETURN_TO_BASE', FSM_STATES.RETURNING),
      transition('STOP', FSM_STATES.IDLE),
      transition('MOVE_TO', FSM_STATES.COLLECTING, {
        reduce: (context, event) => fsmActions.moveToTarget(context, event)
      }),
      // Transition automatique
      transition('AUTO', (context) => {
        if (!fsmGuards.canOperate(context)) {
          return FSM_STATES.IDLE;
        }
        if (!fsmGuards.hasEnoughFuel(context) || fsmGuards.isNearCapacity(context)) {
          return FSM_STATES.RETURNING;
        }
        if (!fsmGuards.hasExplorationTarget(context)) {
          return FSM_STATES.EXPLORING;
        }
        return FSM_STATES.COLLECTING;
      }),
      // Action d'entrée
      transition('ENTER', FSM_STATES.COLLECTING, {
        reduce: (context) => fsmActions.enterCollecting(context)
      })
    ),

    [FSM_STATES.RETURNING]: state(
      // Transitions manuelles
      transition('EXPLORE', FSM_STATES.EXPLORING),
      transition('COLLECT_RESOURCES', FSM_STATES.COLLECTING),
      transition('STOP', FSM_STATES.IDLE),
      transition('MOVE_TO', FSM_STATES.RETURNING, {
        reduce: (context, event) => fsmActions.moveToTarget(context, event)
      }),
      // Transition automatique
      transition('AUTO', (context) => {
        if (!fsmGuards.canOperate(context)) {
          return FSM_STATES.IDLE;
        }
        if (fsmGuards.isAtBase(context)) {
          return FSM_STATES.IDLE;
        }
        return FSM_STATES.RETURNING;
      }),
      // Action d'entrée
      transition('ENTER', FSM_STATES.RETURNING, {
        reduce: (context) => fsmActions.enterReturning(context)
      })
    )
  }
);

// ============================================================================
// EXPORT
// ============================================================================

export default botMachine;

export {
  fsmGuards,
  fsmActions,
  FSM_STATES
};
