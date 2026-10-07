import { useEffect, useRef, useState } from 'react';

import type { SessionEvent, SessionSnapshot } from '../../engine/model';
import type { BotId, Coord } from '../../engine/world';

import { incidentMessage, incidentVisible, type IncidentMessage } from './incidents';

const NOTICE_DURATION = 8000;

export interface ActiveIncident {
  event: SessionEvent;
  message: IncidentMessage;
  receivedAt: number;
  expiresAt: number;
}

export function useIncidentAlerts(snapshot: SessionSnapshot | null, gameId: string | null, perspective: BotId | 'developer', currentCoords: readonly Coord[]): ActiveIncident[] {
  const [alerts, setAlerts] = useState<ActiveIncident[]>([]);
  const lastSeen = useRef<{ gameId: string; sequence: number } | null>(null);

  useEffect(() => {
    if (!snapshot || !gameId) {
      lastSeen.current = null;
      setAlerts(previous => previous.length ? [] : previous);
      return;
    }
    if (lastSeen.current?.gameId !== gameId || snapshot.eventSequence < lastSeen.current.sequence) {
      lastSeen.current = { gameId, sequence: snapshot.eventSequence };
      setAlerts(previous => previous.length ? [] : previous);
      return;
    }
    const sequence = lastSeen.current.sequence;
    if (snapshot.eventSequence === sequence) return;
    lastSeen.current.sequence = snapshot.eventSequence;
    const receivedAt = Date.now();
    const visibleCoords = new Set(currentCoords);
    const additions = snapshot.events
      .filter(event => event.sequence > sequence && incidentVisible(event, perspective, visibleCoords))
      .map(event => ({ event, message: incidentMessage(event), receivedAt, expiresAt: receivedAt + NOTICE_DURATION }))
      .filter((item): item is ActiveIncident => item.message !== null)
      .slice(-3);
    if (additions.length) setAlerts(previous => [...previous.filter(item => item.expiresAt > receivedAt), ...additions].slice(-3));
  }, [snapshot, gameId, perspective, currentCoords]);

  useEffect(() => {
    if (!alerts.length) return;
    const delay = Math.max(0, Math.min(...alerts.map(alert => alert.expiresAt)) - Date.now());
    const timeout = window.setTimeout(() => setAlerts(previous => previous.filter(item => item.expiresAt > Date.now())), delay);
    return () => window.clearTimeout(timeout);
  }, [alerts]);

  return alerts.filter(alert => incidentVisible(alert.event, perspective, new Set(currentCoords)));
}
