/**
 * ==========================================================================
 * USE MULTI SIMULATED TRACKER - Hook React pour tracker multi-bots
 * ==========================================================================
 * 
 * Hook React qui gère plusieurs acteurs FSM simultanément.
 * Chaque bot a ses propres timers et état indépendant.
 * 
 * ✅ Gère plusieurs acteurs en parallèle
 * ✅ Timers séparés par botId
 * ✅ Compatible avec React Strict Mode
 */

import { useEffect, useRef } from 'react';
import type { Actor } from 'xstate';

import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { Tile } from '../../../../../types/tile.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';
import type { machineXV5Pure } from '../../machine.pure.v5.ts';
import { getScheduledEvents, type TileProvider } from '../../shared/simulatedTrackerCore.ts';

// ========================================
// Types
// ========================================

export type BotActor = {
  botId: string;
  actor: Actor<typeof machineXV5Pure>;
};

export type UseMultiSimulatedTrackerOptions = {
  verbose?: boolean;
  enabled?: boolean;
};

// ========================================
// Hook
// ========================================

/**
 * Hook qui active le tracker simulé pour plusieurs acteurs XState
 * Envoie automatiquement les événements en fonction de l'état FSM de chaque bot
 * 
 * @param botActors - Liste des bots avec leurs acteurs
 * @param options - Options (verbose, enabled)
 * 
 * @example
 * ```tsx
 * const botActors = [
 *   { botId: 'bot-0', actor: getActor('bot-0') },
 *   { botId: 'bot-1', actor: getActor('bot-1') }
 * ];
 * useMultiSimulatedTracker(botActors, { verbose: true, enabled: config.testMode });
 * ```
 */
export function useMultiSimulatedTracker(
  botActors: BotActor[],
  options: UseMultiSimulatedTrackerOptions = {}
): void {
  const { verbose = false, enabled = true } = options;
  
  // Stocker les timers et états par botId
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>[]>>(new Map());
  const pendingEventsRef = useRef<Map<string, Map<string, boolean>>>(new Map());
  const lastStateRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!enabled || botActors.length === 0) {
      return;
    }

    // Initialiser les maps pour chaque bot
    const subscriptions: Array<{ unsubscribe: () => void }> = [];
    
    botActors.forEach(({ botId, actor }) => {
      if (!actor) return;
      
      // Initialiser les structures pour ce bot
      if (!timersRef.current.has(botId)) {
        timersRef.current.set(botId, []);
      }
      if (!pendingEventsRef.current.has(botId)) {
        pendingEventsRef.current.set(botId, new Map());
      }
      
      const timers = timersRef.current.get(botId)!;
      const pendingEvents = pendingEventsRef.current.get(botId)!;

      if (verbose) {
        // eslint-disable-next-line no-console
        console.log(`\n🤖 [TRACKER:${botId}] Starting...\n`);
      }

      /**
       * Planifie l'envoi d'un événement après un délai pour un bot spécifique
       */
      const scheduleEvent = (event: MachineEvents, delay: number, reason?: string): void => {
        const eventType = event.type;
        const stateAtSchedule = lastStateRef.current.get(botId) || null;
        
        if (verbose) {
          // eslint-disable-next-line no-console
          console.log(`📌 [TRACKER:${botId}] ${eventType} in ${delay}ms`);
        }
        
        // Éviter les doublons pour ce bot
        if (pendingEvents.has(eventType)) {
          if (verbose) {
            // eslint-disable-next-line no-console
            console.log(`⚠️ [TRACKER:${botId}] ${eventType} already scheduled`);
          }
          return;
        }

        pendingEvents.set(eventType, true);

        const timer = setTimeout(() => {
          // Vérifier que l'état n'a pas changé
          if (lastStateRef.current.get(botId) !== stateAtSchedule) {
            if (verbose) {
              // eslint-disable-next-line no-console
              console.log(`⚠️ [TRACKER:${botId}] ${eventType} canceled - state changed`);
            }
            pendingEvents.delete(eventType);
            return;
          }
          
          if (verbose) {
            // eslint-disable-next-line no-console
            console.log(`🤖 [TRACKER:${botId}] Sending: ${eventType}${reason ? ` (${reason})` : ''}`);
          }
          
          actor.send(event);
          pendingEvents.delete(eventType);
        }, delay);

        timers.push(timer);
      };

      // Handler de snapshot pour ce bot
      const handleSnapshot = (snapshot: any) => {
        const state = snapshot.value;
        const stateStr = JSON.stringify(state);
        
        // Éviter de traiter le même état plusieurs fois
        if (stateStr === lastStateRef.current.get(botId)) return;
        lastStateRef.current.set(botId, stateStr);

        // Récupérer les tiles depuis le contexte FSM (TileStore a été supprimé)
        const currentTiles = (snapshot.context?.gridInfo?.tiles || {}) as Record<string, Tile>;
        const tileProvider: TileProvider = {
          tiles: currentTiles,
          findAssignedDepartTile: (entityId: string): Tile | undefined => {
            return Object.values(currentTiles).find(
              (tile: Tile) => tile.type === 'depart' && tile.assignedToBot === entityId
            );
          }
        };

        // Obtenir les événements à planifier
        const scheduledEvents = getScheduledEvents(
          state, 
          snapshot.context as FSMContext, 
          verbose,
          tileProvider
        );
        
        if (verbose) {
          // eslint-disable-next-line no-console
          console.log(`📋 [TRACKER:${botId}] Scheduling ${scheduledEvents.length} events for:`, JSON.stringify(state));
        }
        
        // Planifier tous les événements
        scheduledEvents.forEach(({ event, delay, reason }) => {
          scheduleEvent(event, delay, reason);
        });
      };

      // Subscribe aux changements d'état
      const subscription = actor.subscribe(handleSnapshot);
      subscriptions.push(subscription);

      // Traiter l'état actuel immédiatement
      handleSnapshot(actor.getSnapshot());
    });

    // Cleanup
    return () => {
      if (verbose) {
        // eslint-disable-next-line no-console
        console.log('\n🤖 [MULTI-TRACKER] Stopping all trackers...\n');
      }
      
      // Nettoyer tous les timers pour tous les bots
      timersRef.current.forEach((timers, botId) => {
        timers.forEach(timer => clearTimeout(timer));
        if (verbose) {
          // eslint-disable-next-line no-console
          console.log(`🧹 [TRACKER:${botId}] Cleaned up`);
        }
      });
      timersRef.current.clear();
      pendingEventsRef.current.clear();
      lastStateRef.current.clear();
      
      // Unsubscribe tous
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [botActors, enabled, verbose]);
}
