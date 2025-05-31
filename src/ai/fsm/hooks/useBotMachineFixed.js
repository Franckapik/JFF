import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useBotMachineShared } from '../contexts/FSMContext.jsx';
import { getMainVehicle, isMoving } from '../machine/context/initialContext.js';
import { BOT_STATES } from '../machine/constants.js';
import { SYSTEM_EVENT_TYPES } from '../machine/events/systemEvents.js';

/**
 * Hook pour gérer un bot avec la machine FSM (version corrigée)
 */
export const useBotMachineFixed = (botId, entityType) => {
  const { current, send } = useBotMachineShared(botId, entityType);
  const autoIntervalRef = useRef(null);
  
  // Données principales
  const entity = useMemo(() => current.context, [current.context]);
  const vehicle = useMemo(() => getMainVehicle(entity), [entity]);
  const state = useMemo(() => current.name, [current.name]); // ✅ CORRIGÉ: Lire l'état de Robot3 directement
  
  // Actions de base
  const moveTo = useCallback((coord, position = null) => {
    send('MOVE_TO', { targetTile: { coord, position } });
  }, [send]);

  const stopMovement = useCallback(() => send('STOP'), [send]);
  const startExploration = useCallback(() => send('START_EXPLORING'), [send]);
  const startCollecting = useCallback(() => send('START_COLLECTING'), [send]);
  const returnToBase = useCallback(() => send('RETURN_TO_BASE'), [send]);
  const updateProgress = useCallback((progress) => send('UPDATE_PROGRESS', { progress }), [send]);
  
  const forceState = useCallback((newState) => {
    if (Object.values(BOT_STATES).includes(newState)) {
      send(newState);
    }
  }, [send]);

  // Utilitaires
  const isMovingState = useMemo(() => isMoving(entity), [entity]);

  const getMetrics = useCallback(() => ({
    state,
    fuel: vehicle?.fuel || 0,
    health: vehicle?.health || 100,
    resources: vehicle?.resources || { food: 0, debris: 0, special: 0 },
    position: vehicle?.coord || null,
    isMoving: isMoving(entity),
    lastAction: entity.lastAction,
    error: entity.error,
    stateHistory: entity.memory?.stateHistory || [],
    uptime: Date.now() - (entity.timestamps?.stateChange || Date.now())
  }), [state, vehicle, entity]);

  // Gestion des événements autonomes
  const startAutoEvents = useCallback(() => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
    }
    
    const interval = entity.config?.explorationInterval || 5000;
    autoIntervalRef.current = setInterval(() => {
      console.log('\n🔥 SENDING ASSESSMENT_COMPLETE EVENT');
      console.log('  - Current state name:', current.name);
      console.log('  - Current state context.currentState:', current.context?.currentState);
      console.log('  - Interval:', interval);
      console.log('  - Full current object keys:', Object.keys(current));
      send(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE);
      console.log('  - Event sent!');
    }, interval);
  }, [entity.config?.explorationInterval, send]);

  const stopAutoEvents = useCallback(() => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  }, []);

  // Effets - Démarrage automatique des événements
  useEffect(() => {
    startAutoEvents();
    return stopAutoEvents;
  }, [startAutoEvents, stopAutoEvents]);

  return {
    // Données
    entity,
    vehicle,
    state,
    context: current.context, // Ajouter le contexte complet pour le debug
    
    // Actions
    moveTo,
    stopMovement,
    startExploration,
    startCollecting,
    returnToBase,
    updateProgress,
    forceState,
    
    // Utilitaires
    isMoving: isMovingState,
    getMetrics,
    
    // Machine
    current,
    send,
    
    // Auto events - Structure corrigée
    autoEvents: {
      start: startAutoEvents,
      stop: stopAutoEvents,
      isActive: autoIntervalRef.current !== null
    }
  };
};

export default useBotMachineFixed;
