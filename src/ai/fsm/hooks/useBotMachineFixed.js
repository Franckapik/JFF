import { useEffect, useRef, useMemo } from 'react';
import { useBotMachineShared } from '../contexts/FSMContext.jsx';
import { SYSTEM_EVENT_TYPES } from '../machine/events/systemEvents.js';
import { useTileStore } from '../../../stores/useTileStore/index.js';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Hook FSM simplifié - Gestion autonome avec exploration automatique
 */
export const useBotMachineFixed = (botId, entityType) => {
  const { current, send } = useBotMachineShared(botId, entityType);
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
          fsmLogger.info(`[useBotMachineFixed] Found starting tile for bot ${botId}:`, assignedTile.coord, assignedTile.position);
          
          // Utiliser l'action updatePosition mise à jour qui gère position ET coord
          send({
            type: 'UPDATE_POSITION',
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
  }, [botId, current?.context, send, tiles]);
  
  // Données essentielles - accès direct au contexte
  const entity = useMemo(() => current.context, [current.context]);
  const vehicle = useMemo(() => current.context?.vehicle, [current.context?.vehicle]);
  const state = useMemo(() => current.name, [current.name]);
  
  // isMoving basé directement sur les propriétés du véhicule
  const isMoving = useMemo(() => {
    return vehicle?.isMoving || false;
  }, [vehicle?.isMoving]);
  
  // Démarrage automatique après 5 secondes (une seule fois)
  useEffect(() => {
    if (!hasStartedExploring.current && state === 'evaluating') {
      timeoutRef.current = setTimeout(() => {
        console.log(`[useBotMachineFixed] Sending ASSESSMENT_COMPLETE for bot ${botId}`);
        send(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE);
        hasStartedExploring.current = true;
      }, 5000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [state === 'evaluating' && !hasStartedExploring.current, send, botId]);

  return {
    entity,
    vehicle,
    state,
    context: current.context,
    isMoving, // Utiliser directement la valeur calculée
    current,
    send,
    autoEvents: {
      start: () => {},
      stop: () => {},
      isActive: !hasStartedExploring.current
    }
  };
};

export default useBotMachineFixed;
