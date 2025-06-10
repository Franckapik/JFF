/**
 * ============================================================================
 * État RETURNING - Retour à la base
 * ============================================================================
 * 
 * État de retour à la base pour diverses raisons :
 * - Carburant faible
 * - Inventaire plein
 * - Récupération de drone
 * - Urgences
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce, guard } from 'robot3';
import { BOT_STATES } from '../constants/constants.js';
import { contextReducers } from '../reducers/context.js';
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents.js';
import { USER_EVENT_TYPES } from '../events/userEvents.js';
import { MOVEMENT_EVENT_TYPES } from '../events/movementEvents.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';

/**
 * État RETURNING - Retour à la base
 */
export const returningState = state(
  // === ÉVÉNEMENTS DE PROGRESSION ===
  
  // Arrivé à la base
  transition(MOVEMENT_EVENT_TYPES.BASE_REACHED,
    BOT_STATES.IDLE_AT_BASE,
    (context, event) => baseGuards.isAtBase(context, event),
    reduce((context, event) => {
      // Mettre à jour la position et récupérer le drone
      const updatedContext = {
        ...context,
        position: event.coord,
        arrivalTime: event.timestamp || Date.now(),
        isDroneAtShip: true
      };
      
      // Préparer l'état idle à la base
      return contextReducers.state.prepareIdleAtBase(updatedContext, {
        reason: 'at_base'
      });
    })
  ),

  // Mouvement en cours vers la base
  transition(MOVEMENT_EVENT_TYPES.MOVEMENT_STARTED,
    BOT_STATES.RETURNING, // Reste en returning
    () => true,
    reduce((context, event) => {
      // Utiliser le reducer de mouvement
      const movementContext = contextReducers.movement.startMovement(context, {
        targetTile: {
          coord: event.targetCoord
        }
      });
      
      // Mettre à jour le statut du contexte
      return {
        ...movementContext,
        movementStatus: 'en_route',
        currentAction: 'moving_to_base'
      };
    })
  ),

  // Progression du mouvement
  transition(MOVEMENT_EVENT_TYPES.MOVEMENT_PROGRESS,
    BOT_STATES.RETURNING, // Reste en returning
    () => true,
    reduce((context, event) => ({
      ...context,
      position: event.currentPosition,
      movementProgress: event.progress,
      estimatedArrival: event.estimatedArrival
    }))
  ),

  // === GESTION DES URGENCES ===
  
  // Urgence résolue pendant le retour
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_RESOLVED,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      emergencyFlag: false,
      emergencyReason: null,
      resolvedCondition: event.condition,
      resolutionTime: Date.now(),
      currentAction: 'emergency_resolved',
      lastStateChange: Date.now()
    }))
  ),

  // === TIMEOUTS ET ÉCHECS ===
  
  // Timeout de navigation (45s)
  transition(SYSTEM_EVENT_TYPES.NAVIGATION_TIMEOUT,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => ({
      ...context,
      navigationStatus: 'timeout',
      currentAction: 'navigation_timeout',
      // En cas de timeout, considérer qu'on est arrivé à la base
      isDroneAtShip: true,
      emergencyFlag: false,
      lastStateChange: Date.now()
    }))
  ),

  // Échec de navigation
  transition(EMERGENCY_EVENT_TYPES.NAVIGATION_FAILED,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      navigationStatus: 'failed',
      errorReason: event.reason,
      currentAction: 'navigation_failed',
      // En cas d'échec, reset l'état d'urgence
      emergencyFlag: false,
      lastStateChange: Date.now()
    }))
  ),

  // === VÉRIFICATIONS CRITIQUES ===
  
  // Carburant critique pendant le retour
  transition(EMERGENCY_EVENT_TYPES.CRITICAL_FUEL,
    BOT_STATES.IDLE_AT_BASE,
    () => true,
    reduce((context) => ({
      ...context,
      fuelStatus: 'critical',
      emergencyLanding: true,
      currentAction: 'emergency_landing',
      // Forcer l'arrivée à la base
      isDroneAtShip: true,
      lastStateChange: Date.now()
    }))
  ),

  // === TRANSITIONS D'URGENCE ===
  
  // Override manuel
  transition(USER_EVENT_TYPES.MANUAL_OVERRIDE,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      manualCommand: event.command,
      manualParams: event.params,
      lastDecision: 'manual_override',
      // Reset l'urgence si override manuel
      emergencyFlag: false,
      lastStateChange: Date.now()
    }))
  ),

  // Nouvelle urgence détectée
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED,
    BOT_STATES.RETURNING, // Reste en returning mais update le contexte
    () => true,
    reduce((context, event) => ({
      ...context,
      emergencyFlag: true,
      emergencyReason: event.reason || 'unknown',
      emergencyStack: [
        ...(context.emergencyStack || []),
        {
          reason: event.reason,
          timestamp: Date.now()
        }
      ],
      currentAction: 'multiple_emergencies'
    }))
  ),

  // Stop demandé
  transition(USER_EVENT_TYPES.STOP,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => ({
      ...context,
      stopFlag: true,
      currentAction: 'stop_requested',
      lastStateChange: Date.now()
    }))
  )
);
