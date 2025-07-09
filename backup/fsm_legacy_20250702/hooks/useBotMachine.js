/**
 * ============================================================================
 * UNIFIED BOT MACHINE HOOK - Hook FSM unifié avec synchronisation
 * ============================================================================
 * 
 * Hook unifié consolidant toutes les fonctionnalités FSM :
 * - Synchronisation entre instances
 * - Instances partagées optionnelles
 * - Position sync automatique
 * - Auto-exploration
 * 
 * @version 2.0.0
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useMachine } from 'react-robot';
import fsmLogger from '../../../logger/fsmLogger.js';
import { ENTITY_TYPES } from '../../../src/ai/fsm/machine/constants/constants.js';
import { movementEvents } from '../../../src/ai/fsm/machine/events/movementEvents.js';
import { SYSTEM_EVENT_TYPES } from '../../../src/ai/fsm/machine/events/systemEvents.js';
import { createBotMachine } from '../../../src/ai/fsm/machine/machineFactory.js';
import { useTileStore } from '../../../stores/useTileStore/index.ts';
import { createMachineContext } from '../machineX/context/initialContext.js';

// Map globale pour les instances partagées (optionnel)
const globalMachineInstances = new Map();

/**
 * Hook FSM unifié avec synchronisation et options d'instance partagée
 * @param {string} botId - ID du bot
 * @param {string} entityType - Type d'entité
 * @param {Object} options - Options de configuration
 * @param {boolean} options.useSharedInstance - Utiliser une instance partagée globalement
 */
export const useBotMachine = (botId, entityType = ENTITY_TYPES.auto, options = {}) => {
  const { useSharedInstance = false } = options;
  
  // Gestion des instances partagées
  if (useSharedInstance && globalMachineInstances.has(botId)) {
    // fsmLogger.info(`[useBotMachine] Using existing shared instance for bot: ${botId}`);
    return globalMachineInstances.get(botId);
  }
  
  // Créer une machine FSM locale
  const initialContext = useMemo(() => createMachineContext(botId, entityType), [botId, entityType]);
  const machine = useMemo(() => createBotMachine(botId, initialContext), [botId, initialContext]);
  const [current, send] = useMachine(machine, initialContext);
  
  // Wrapper pour send qui synchronise vers toutes les instances
  const syncedSend = useCallback((eventName, eventData = {}) => {
    return send(eventName, eventData);
  }, [send]);

  const timeoutRef = useRef(null);
  const hasStartedExploring = useRef(false);
  const positionSyncRef = useRef(false);
  
  const tiles = useTileStore(state => state.tiles);
  
  // Synchronisation de position au démarrage
  useEffect(() => {
    if (!positionSyncRef.current && current?.context && tiles) {
      if (!current.context.vehicle?.position || !current.context.vehicle?.coord) {
        // fsmLogger.info(`[useBotMachine] Bot ${botId} needs position synchronization`);
        
        const assignedTile = Object.values(tiles).find(tile => 
          tile.type === "depart" && tile.playerId === botId
        );

        if (assignedTile) {
          // fsmLogger.info(`[useBotMachine] Found starting tile for bot ${botId}`);
          
          const updatePositionEvent = movementEvents.createUpdatePositionEvent(
            assignedTile.position,
            'ship',
            assignedTile.coord,
            assignedTile.coord
          );
          syncedSend(updatePositionEvent);
          
          positionSyncRef.current = true;
        } else {
          fsmLogger.error(`[useBotMachine] No starting tile found for bot ${botId}`);
        }
      } else {
        positionSyncRef.current = true;
        // fsmLogger.info(`[useBotMachine] Bot ${botId} already has position:`, current.context.vehicle.position);
      }
    }
  }, [botId, current?.context, syncedSend, tiles]);
  
  // Données essentielles
  const entity = useMemo(() => current.context, [current.context]);
  const vehicle = useMemo(() => current.context?.vehicle, [current.context?.vehicle]);
  const state = useMemo(() => current.name, [current.name]);
  const isMoving = useMemo(() => vehicle?.isMoving || false, [vehicle?.isMoving]);
  
  // Démarrage automatique avec logging de debug
  useEffect(() => {
    // Réinitialiser le flag quand on entre en état evaluating
    if (state === 'evaluating' && hasStartedExploring.current) {
      fsmLogger.info(`🔄 [useBotMachine] Resetting evaluation flag for new cycle - ${botId}`);
      hasStartedExploring.current = false;
    }
    
    const shouldStartEvaluation = !hasStartedExploring.current && state === 'evaluating';
    
    if (shouldStartEvaluation) {
      timeoutRef.current = setTimeout(() => {
        fsmLogger.info(`🎯 [useBotMachine] Sending EVALUATION_COMPLETE for ${botId}`);
        syncedSend(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE);
        hasStartedExploring.current = true;
      }, 2000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [state, syncedSend, botId, current?.context]);

  const instance = {
    entity,
    vehicle,
    state,
    context: current.context,
    isMoving,
    current,
    send: syncedSend,
    autoEvents: {
      start: () => {},
      stop: () => {},
      isActive: !hasStartedExploring.current
    },
    actions: {
      startExploration: () => {
        hasStartedExploring.current = true;
        syncedSend(SYSTEM_EVENT_TYPES.EXPLORE);
      }
    }
  };

  // Stocker l'instance si mode partagé
  if (useSharedInstance) {
    globalMachineInstances.set(botId, instance);
  }

  return instance;
};

// Utilitaires pour les instances partagées
export const clearBotMachineInstance = (botId) => {
  if (globalMachineInstances.has(botId)) {
    // fsmLogger.info(`[useBotMachine] Clearing instance for bot: ${botId}`);
    globalMachineInstances.delete(botId);
  }
};

export const clearAllBotMachineInstances = () => {
  // fsmLogger.info(`[useBotMachine] Clearing all instances`);
  globalMachineInstances.clear();
};

// Export par défaut et alias pour la compatibilité
export const useBotMachineFixed = useBotMachine;
export const useBotMachineSharedInstance = (botId, entityType) => 
  useBotMachine(botId, entityType, { useSharedInstance: true });

export default useBotMachine;
