/**
 * ============================================================================
 * HOOK USEBOTMACHINE FIXED - Version corrigée sans instances multiples
 * ============================================================================
 * 
 * Version corrigée du hook useBotMachine qui utilise des machines FSM partagées
 * pour éviter les boucles infinies et les instances multiples.
 * 
 * @author FSM Fix
 * @version 2.1.0 - Version corrigée anti-boucle
 */

import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useBotMachineShared } from '../contexts/FSMContext.jsx';
import { createEntityContext, ENTITY_TYPES, isAutonomous, canManualControl, getMainVehicle, isMoving } from '../machine/context/initialContext.js';
import { BOT_STATES } from '../machine/constants.js';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Hook pour gérer un bot avec la machine FSM (version corrigée)
 * 
 * @param {string} botId - ID unique du bot (ex: 'bot-0')
 * @param {string} entityType - Type d'entité (auto, manual, human)
 * @returns {Object} - Interface simplifiée pour contrôler le bot
 */
export const useBotMachineFixed = (botId, entityType = ENTITY_TYPES.AUTO) => {
  
  // ========================================================================
  // ÉTAPE 1: UTILISER LA MACHINE PARTAGÉE
  // ========================================================================
  
  // Utiliser la machine FSM partagée au lieu d'en créer une nouvelle
  const { current, send } = useBotMachineShared(botId, entityType);
  
  // Référence pour gérer l'intervalle du mode autonome
  const autoIntervalRef = useRef(null);
  
  // ========================================================================
  // ÉTAPE 2: EXTRACTION DES DONNÉES PRINCIPALES (MEMOÏSÉES)
  // ========================================================================
  
  // Extraire les données importantes du contexte actuel avec mémoïsation
  const entity = useMemo(() => current.context, [current.context]);
  const vehicle = useMemo(() => getMainVehicle(entity), [entity]);
  const state = useMemo(() => current.context.currentState, [current.context.currentState]);
  
  // ========================================================================
  // ÉTAPE 3: ACTIONS DISPONIBLES POUR CONTRÔLER LE BOT (MEMOÏSÉES)
  // ========================================================================
  
  /**
   * Actions de déplacement
   */
  const moveTo = useCallback((coord, position = null) => {
    const targetTile = { coord, position };
    send('MOVE_TO', { targetTile });
  }, [send]);

  const stopMovement = useCallback(() => {
    send('STOP');
  }, [send]);

  /**
   * Actions de comportement
   */
  const startExploration = useCallback(() => {
    send('START_EXPLORING');
  }, [send]);

  const startCollecting = useCallback(() => {
    send('START_COLLECTING');
  }, [send]);

  const returnToBase = useCallback(() => {
    send('RETURN_TO_BASE');
  }, [send]);

  const updateProgress = useCallback((progress) => {
    send('UPDATE_PROGRESS', { progress });
  }, [send]);

  const forceState = useCallback((newState) => {
    if (Object.values(BOT_STATES).includes(newState)) {
      send(newState);
    }
  }, [send]);

  // ========================================================================
  // ÉTAPE 4: FONCTIONS UTILITAIRES MEMOÏSÉES
  // ========================================================================
  
  const isAutonomousMode = useMemo(() => isAutonomous(entity), [entity]);
  const canManualControlMode = useMemo(() => canManualControl(entity), [entity]);
  const isMovingState = useMemo(() => isMoving(entity), [entity]);

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
  // ÉTAPE 5: SYSTÈME D'ÉVÉNEMENTS AUTONOMES (OPTIMISÉ)
  // ========================================================================
  
  const startAutoEvents = useCallback(() => {
    if (!isAutonomous(entity)) return;
    
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
    }
    
    const interval = entity.config?.explorationInterval || 3000;
    
    autoIntervalRef.current = setInterval(() => {
      send('AUTO');
    }, interval);
  }, [entity.config?.explorationInterval, entity.type, send]); // Dépendances stables

  const stopAutoEvents = useCallback(() => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  }, []);

  // ========================================================================
  // ÉTAPE 6: GESTION DES EFFETS REACT (OPTIMISÉE)
  // ========================================================================
  
  useEffect(() => {
    if (isAutonomous(entity)) {
      startAutoEvents();
    } else {
      stopAutoEvents();
    }
    
    return stopAutoEvents;
  }, [entity.type, startAutoEvents, stopAutoEvents]); // Évite entity.autonomousMode qui change souvent
  
  useEffect(() => {
    return () => {
      stopAutoEvents();
    };
  }, [stopAutoEvents]);

  // ========================================================================
  // ÉTAPE 7: INTERFACE PUBLIQUE OPTIMISÉE
  // ========================================================================
  
  const actions = useMemo(() => ({
    moveTo,
    stopMovement,
    startExploration,
    startCollecting,
    returnToBase,
    updateProgress,
    forceState
  }), [moveTo, stopMovement, startExploration, startCollecting, returnToBase, updateProgress, forceState]);

  const helpers = useMemo(() => ({
    isAutonomous: () => isAutonomousMode,
    canManualControl: () => canManualControlMode,
    isMoving: () => isMovingState,
    getMetrics
  }), [isAutonomousMode, canManualControlMode, isMovingState, getMetrics]);

  const autoEvents = useMemo(() => ({
    start: startAutoEvents,
    stop: stopAutoEvents,
    isActive: autoIntervalRef.current !== null
  }), [startAutoEvents, stopAutoEvents]);

  const machine = useMemo(() => ({
    current,
    send
  }), [current, send]);

  return {
    // Données principales
    entity,
    vehicle,
    state,
    context: entity, // Alias pour compatibilité
    
    // Actions et helpers memoïsés
    actions,
    helpers,
    machine,
    autoEvents,
    
    // Raccourcis pour compatibilité avec l'ancien code
    isAutonomous: isAutonomousMode,
    canManualControl: canManualControlMode,
    isMoving: isMovingState,
    send
  };
};

export default useBotMachineFixed;
