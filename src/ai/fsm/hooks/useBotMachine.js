/**
 * ============================================================================
 * HOOK USEBOTMACHINE - Interface React pour la machine FSM Bot
 * ============================================================================
 * 
 * Hook principal qui encapsule la machine FSM avec Robot3.
 * Interface publique unifiée pour contrôler les bots autonomes.
 * 
 * @author Migration FSM Phase 2
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useMachine } from 'react-robot';
import { createEntityContext, ENTITY_TYPES, isAutonomous, canManualControl, getMainVehicle, isMoving } from '../machine/context/initialContext.js';
import botMachine, { FSM_STATES } from '../machine/botMachine.js';
import { movementActions } from '../../../shared/actions/core/movement.js';

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook pour gérer un bot avec la machine FSM
 * 
 * @param {string} botId - ID unique du bot (ex: 'bot-0')
 * @param {string} entityType - Type d'entité (auto, manual, human)
 * @returns {Object} - Interface complète du bot
 */
export const useBotMachine = (botId, entityType = ENTITY_TYPES.AUTO) => {
  
  // ========================================================================
  // INITIALISATION MACHINE FSM
  // ========================================================================
  
  // Créer le contexte initial
  const initialContext = createEntityContext(botId, entityType);
  
  // Utiliser le hook Robot3 useMachine avec le contexte initial
  const [current, send] = useMachine(botMachine, initialContext);
  
  // Référence pour les intervalles auto
  const autoIntervalRef = useRef(null);
  
  // ========================================================================
  // ÉTAT DÉRIVÉ
  // ========================================================================
  
  const entity = current.context;
  const vehicle = getMainVehicle(entity);
  const state = current.context.currentState;
  
  // ========================================================================
  // ACTIONS PUBLIQUES
  // ========================================================================
  
  /**
   * Déplace le bot vers une coordonnée
   */
  const moveTo = useCallback((coord, position = null) => {
    const targetTile = {
      coord,
      position
    };
    
    send('MOVE_TO', { targetTile });
  }, [send]);

  /**
   * Arrête le mouvement du bot
   */
  const stopMovement = useCallback(() => {
    send('STOP');
  }, [send]);

  /**
   * Lance l'exploration autonome
   */
  const startExploration = useCallback(() => {
    send('START_EXPLORING');
  }, [send]);

  /**
   * Lance la collecte de ressources
   */
  const startCollecting = useCallback(() => {
    send('START_COLLECTING');
  }, [send]);

  /**
   * Retourne à la base
   */
  const returnToBase = useCallback(() => {
    send('RETURN_TO_BASE');
  }, [send]);

  /**
   * Toggle entre mode autonome et manuel
   */
  const toggleAutonomous = useCallback(() => {
    if (!canManualControl(entity)) return;
    
    // Créer un nouveau contexte avec autonomousMode inversé
    const newContext = {
      ...entity,
      autonomousMode: !entity.autonomousMode
    };
    
    // Envoyer un événement de mise à jour du contexte
    send('UPDATE_CONTEXT', { context: newContext });
  }, [entity, send]);

  /**
   * Met à jour la progression du mouvement
   */
  const updateProgress = useCallback((progress) => {
    send('UPDATE_PROGRESS', { progress });
  }, [send]);

  /**
   * Force une transition d'état (pour debug)
   */
  const forceState = useCallback((newState) => {
    if (Object.values(FSM_STATES).includes(newState)) {
      send(newState);
    }
  }, [send]);

  // ========================================================================
  // HELPERS PUBLIQUES
  // ========================================================================
  
  /**
   * Vérifie si le bot est en mode autonome
   */
  const isAutonomousMode = useCallback(() => {
    return isAutonomous(entity);
  }, [entity]);

  /**
   * Vérifie si le contrôle manuel est possible
   */
  const canManualControlMode = useCallback(() => {
    return canManualControl(entity);
  }, [entity]);

  /**
   * Vérifie si le bot est en mouvement
   */
  const isMovingState = useCallback(() => {
    return isMoving(entity);
  }, [entity]);

  /**
   * Récupère les métriques du bot
   */
  const getMetrics = useCallback(() => {
    return {
      state: state,
      fuel: vehicle?.fuel || 0,
      health: vehicle?.health || 100,
      resources: vehicle?.resources || { food: 0, debris: 0, special: 0 },
      position: vehicle?.coord || null,
      isMoving: isMoving(entity),
      isAutonomous: isAutonomous(entity),
      lastAction: entity.lastAction,
      error: entity.error,
      stateHistory: entity.memory?.stateHistory || [],
      uptime: Date.now() - (entity.timestamps?.stateChange || Date.now())
    };
  }, [state, vehicle, entity]);

  // ========================================================================
  // GESTION DES ÉVÉNEMENTS AUTOMATIQUES
  // ========================================================================
  
  /**
   * Démarre les événements automatiques pour les bots autonomes
   */
  const startAutoEvents = useCallback(() => {
    if (!isAutonomous(entity)) return;
    
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
    }
    
    const interval = entity.config?.explorationInterval || 3000;
    
    autoIntervalRef.current = setInterval(() => {
      // Envoyer l'événement AUTO pour déclencher les transitions
      send('AUTO');
    }, interval);
  }, [entity, send]);

  /**
   * Arrête les événements automatiques
   */
  const stopAutoEvents = useCallback(() => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  }, []);

  // ========================================================================
  // EFFETS
  // ========================================================================
  
  // Démarrer/arrêter les événements auto selon le mode
  useEffect(() => {
    if (isAutonomous(entity)) {
      startAutoEvents();
    } else {
      stopAutoEvents();
    }
    
    return stopAutoEvents;
  }, [entity.autonomousMode, startAutoEvents, stopAutoEvents]);
  
  // Cleanup au démontage
  useEffect(() => {
    return () => {
      stopAutoEvents();
    };
  }, [stopAutoEvents]);

  // ========================================================================
  // INTERFACE PUBLIQUE
  // ========================================================================
  
  return {
    // Données principales
    entity,
    vehicle,
    state,
    context: entity, // Alias pour compatibilité
    
    // Actions de contrôle
    actions: {
      moveTo,
      stopMovement,
      startExploration,
      startCollecting,
      returnToBase,
      toggleAutonomous,
      updateProgress,
      forceState
    },
    
    // Helpers d'état
    helpers: {
      isAutonomous: isAutonomousMode,
      canManualControl: canManualControlMode,
      isMoving: isMovingState,
      getMetrics
    },
    
    // Machine FSM brute (pour debug avancé)
    machine: {
      current,
      send,
      botMachine
    },
    
    // Gestion des événements auto
    autoEvents: {
      start: startAutoEvents,
      stop: stopAutoEvents,
      isActive: autoIntervalRef.current !== null
    }
  };
};

// ============================================================================
// EXPORT
// ============================================================================

export default useBotMachine;
