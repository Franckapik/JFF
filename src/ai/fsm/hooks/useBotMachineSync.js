import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useMachine } from 'react-robot';
import { createEntityContext } from '../machine/context/initialContext.js';
import { ENTITY_TYPES } from '../machine/constants/constants.js';
import { createBotMachine } from '../machine/machineFactory.js';
import { useFSMSync } from '../contexts/FSMSyncContext.jsx';
import { SYSTEM_EVENT_TYPES } from '../machine/events/systemEvents.js';
import { useTileStore } from '../../../stores/useTileStore/index.js';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Hook FSM simplifié - Gestion autonome avec exploration automatique
 */
export const useBotMachineFixed = (botId, entityType) => {
  // Créer une machine FSM locale
  const initialContext = useMemo(() => createEntityContext(botId, entityType), [botId, entityType]);
  const machine = useMemo(() => createBotMachine(botId, initialContext), [botId, initialContext]);
  const [current, send] = useMachine(machine, initialContext);
  
  // Système de synchronisation FSM
  const { registerSyncCallback, syncEvent } = useFSMSync();
  
  // Enregistrer ce hook pour la synchronisation
  useEffect(() => {
    const cleanup = registerSyncCallback(botId, (eventName, eventData) => {
      if (eventName === 'CONTEXT_UPDATE') {
        // Pour les mises à jour de contexte, on ne peut pas forcer directement
        // mais on peut déclencher un événement interne pour synchroniser
        fsmLogger.info(`[useBotMachineFixed] Received context sync for ${botId}:`, eventData);
      } else {
        // Pour les événements normaux, les transmettre
        fsmLogger.info(`[useBotMachineFixed] Received sync event ${eventName} for ${botId}`);
        send(eventName, eventData);
      }
    });
    
    return cleanup;
  }, [botId, registerSyncCallback, send]);
  
  // Wrapper pour send qui synchronise vers toutes les instances
  const syncedSend = useCallback((eventName, eventData = {}) => {
    fsmLogger.info(`[useBotMachineFixed] Sending ${eventName} for bot ${botId}`);
    
    // Envoyer localement
    const result = send(eventName, eventData);
    
    // Synchroniser vers les autres instances
    syncEvent(botId, eventName, eventData);
    
    return result;
  }, [send, botId, syncEvent]);

  const timeoutRef = useRef(null);
  const hasStartedExploring = useRef(false);
  const positionSyncRef = useRef(false);
  
  // Accès au store de tuiles via hook Zustand
  const tiles = useTileStore(state => state.tiles);
  
  // Synchronisation de position au démarrage
  useEffect(() => {
    if (!positionSyncRef.current && current?.context && tiles) {
      // Vérifier si la position du véhicule est manquante
      if (!current.context.vehicle?.position || !current.context.vehicle?.coord) {
        fsmLogger.info(`[useBotMachineFixed] Bot ${botId} needs position synchronization`);
        
        // Récupérer la tuile de départ assignée à ce bot
        const assignedTile = Object.values(tiles).find(tile => 
          tile.type === "depart" && tile.playerId === botId
        );

        if (assignedTile) {
          fsmLogger.info(`[B4] [useBotMachineFixed] Found starting tile for bot ${botId}:`);
          
          // Utiliser l'action updatePosition mise à jour qui gère position ET coord
          syncedSend('UPDATE_POSITION', {
            position: assignedTile.position,
            coord: assignedTile.coord,
            newCoord: assignedTile.coord
          });
          
          positionSyncRef.current = true;
        } else {
          fsmLogger.error(`[useBotMachineFixed] No starting tile found for bot ${botId}`);
        }
      } else {
        positionSyncRef.current = true;
        fsmLogger.info(`[useBotMachineFixed] Bot ${botId} already has position:`, current.context.vehicle.position);
      }
    }
  }, [botId, current?.context, syncedSend, tiles]);
  
  // Données essentielles - accès direct au contexte
  const entity = useMemo(() => current.context, [current.context]);
  const vehicle = useMemo(() => current.context?.vehicle, [current.context?.vehicle]);
  const state = useMemo(() => current.name, [current.name]);
  
  // isMoving basé directement sur les propriétés du véhicule
  const isMoving = useMemo(() => {
    return vehicle?.isMoving || false;
  }, [vehicle?.isMoving]);
  
  // Démarrage automatique après 2 secondes (une seule fois)
  useEffect(() => {
    if (!hasStartedExploring.current && state === 'evaluating') {
      timeoutRef.current = setTimeout(() => {
        console.log(`[useBotMachineFixed] Sending ASSESSMENT_COMPLETE for bot ${botId}`);
        syncedSend(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE);
        hasStartedExploring.current = true;
      }, 2000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [state === 'evaluating' && !hasStartedExploring.current, syncedSend, botId]);

  // ===================================================================
  // HYBRID ARCHITECTURE - Position tracking handled by Fleet.jsx + useFSMPositionTracker
  // ===================================================================

  return {
    entity,
    vehicle,
    state,
    context: current.context,
    isMoving,
    current,
    send: syncedSend, // Utiliser la version synchronisée
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
};

export default useBotMachineFixed;