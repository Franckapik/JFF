/**
 * ==========================================================================
 * USE SIMULATED TRACKER - Hook React pour tracker simulé
 * ==========================================================================
 * 
 * Hook React qui utilise le core partagé pour envoyer automatiquement
 * les événements FSM dans le front (mode développement/test)
 * 
 * ✅ Utilise simulatedTrackerCore (logique partagée avec test Node)
 * ✅ Gère les timers et la déduplication
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

export type UseSimulatedTrackerOptions = {
  verbose?: boolean;
  enabled?: boolean;
};

// ========================================
// Hook
// ========================================

/**
 * Hook qui active le tracker simulé pour un acteur XState
 * Envoie automatiquement les événements en fonction de l'état FSM
 * 
 * @param actor - Acteur XState à tracker
 * @param options - Options (verbose, enabled)
 * 
 * @example
 * ```tsx
 * const actor = useXFSMStore(state => state.actors.get('bot-0'));
 * useSimulatedTracker(actor, { verbose: true, enabled: config.testMode });
 * ```
 */
export function useSimulatedTracker(
  actor: Actor<typeof machineXV5Pure> | null,
  options: UseSimulatedTrackerOptions = {}
): void {
  const { verbose = false, enabled = true } = options;
  
  // Stocker les timers et états en Ref pour éviter les re-renders
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pendingEventsRef = useRef<Map<string, boolean>>(new Map());
  const lastStateRef = useRef<string | null>(null);

  useEffect(() => {
    // Ne rien faire si désactivé ou pas d'acteur
    if (!enabled || !actor) {
      return;
    }

    // Copier les refs au début pour le cleanup
    const timers = timersRef.current;
    const pendingEvents = pendingEventsRef.current;

    if (verbose) {
      // eslint-disable-next-line no-console
      console.log('\n🤖 [useSimulatedTracker] Starting...\n');
    }

    /**
     * Planifie l'envoi d'un événement après un délai
     * ✅ Vérifie que l'état n'a pas changé avant d'envoyer
     */
    const scheduleEvent = (event: MachineEvents, delay: number, reason?: string): void => {
      const eventType = event.type;
      
      // Capturer l'état actuel au moment de la planification
      const stateAtSchedule = lastStateRef.current;
      
      if (verbose) {
        // eslint-disable-next-line no-console
        console.log(`📌 [TRACKER] ${eventType} in ${delay}ms`);
      }
      
      // Éviter les doublons
      if (pendingEvents.has(eventType)) {
        if (verbose) {
          // eslint-disable-next-line no-console
          console.log(`⚠️ [TRACKER] ${eventType} already scheduled`);
        }
        return;
      }

      pendingEvents.set(eventType, true);

      const timer = setTimeout(() => {
        // ✅ CRITICAL FIX: Vérifier que l'état n'a pas changé
        // avant d'envoyer l'événement. Cela évite d'envoyer NEED_EXPLORING
        // quand on est déjà passé à ship_moving_to_tile par exemple.
        if (lastStateRef.current !== stateAtSchedule) {
          if (verbose) {
            // eslint-disable-next-line no-console
            console.log(`⚠️ [TRACKER] ${eventType} canceled - state changed from ${stateAtSchedule} to ${lastStateRef.current}`);
          }
          pendingEvents.delete(eventType);
          return;
        }
        
        if (verbose) {
          // eslint-disable-next-line no-console
          console.log(`🤖 [TRACKER] Sending: ${eventType}${reason ? ` (${reason})` : ''}`);
        }
        
        actor.send(event);
        pendingEvents.delete(eventType);
      }, delay);

      timers.push(timer);
    };

    // Définir le callback de traitement
    const handleSnapshot = (snapshot: any) => {
      const state = snapshot.value;
      const stateStr = JSON.stringify(state);
      
      // Éviter de traiter le même état plusieurs fois
      if (stateStr === lastStateRef.current) return;
      lastStateRef.current = stateStr;

      // ✅ Récupérer les tiles depuis le contexte FSM (TileStore a été supprimé)
      const currentTiles = (snapshot.context?.gridInfo?.tiles || {}) as Record<string, Tile>;
      const tileProvider: TileProvider = {
        tiles: currentTiles,
        findAssignedDepartTile: (entityId: string): Tile | undefined => {
          return Object.values(currentTiles).find(
            (tile: Tile) => tile.type === 'depart' && tile.assignedToBot === entityId
          );
        }
      };

      // Utiliser le core partagé pour obtenir les événements à planifier
      const scheduledEvents = getScheduledEvents(
        state, 
        snapshot.context as FSMContext, 
        verbose,
        tileProvider
      );
      
      // eslint-disable-next-line no-console
      console.log(`📋 [TRACKER] Scheduling ${scheduledEvents.length} events for:`, JSON.stringify(state));
      
      // Planifier tous les événements retournés
      scheduledEvents.forEach(({ event, delay, reason }) => {
        scheduleEvent(event, delay, reason);
      });
    };

    // Subscribe aux changements d'état
    const subscription = actor.subscribe(handleSnapshot);

    // 🔥 CRITICAL: Traiter l'état actuel immédiatement pour ne pas rater les événements initiaux
    handleSnapshot(actor.getSnapshot());

    // Cleanup au unmount
    return () => {
      if (verbose) {
        // eslint-disable-next-line no-console
        console.log('\n🤖 [useSimulatedTracker] Stopping...\n');
      }
      
      // Nettoyer tous les timers (utilise les refs capturées)
      timers.forEach(timer => clearTimeout(timer));
      pendingEvents.clear();
      
      // Unsubscribe
      subscription.unsubscribe();
    };
  }, [actor, enabled, verbose]);
}
