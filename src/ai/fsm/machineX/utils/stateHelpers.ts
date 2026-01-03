/**
 * ==========================================================================
 * STATE HELPERS - Helpers typés pour la validation des événements
 * ==========================================================================
 * 
 * Fonctions utilitaires pour créer des configurations d'états avec 
 * validation TypeScript des événements utilisés.
 * 
 * @author Migration TypeScript
 * @version 1.0.0
 */

import type { MachineEventType } from '../../../../types/events.d.ts';

/**
 * Helper pour créer des transitions typées avec validation des événements
 */
export function createTypedTransitions<T extends Record<MachineEventType, string>>(
  transitions: Partial<T>
): Partial<T> {
  return transitions;
}

/**
 * Helper pour valider qu'un événement fait partie du type union MachineEventType
 */
export function validateEvent(eventType: string): eventType is MachineEventType {
  const validEvents: MachineEventType[] = [
    'SHIP_POSITION_UPDATE',
    'SHIP_INITIALIZE_REQUEST',
    'DRONE_POSITION_UPDATE', 
    'DRONE_INITIALIZE_REQUEST',
    'DRONE_REACHES_TILE',
    'DRONE_HAS_SCANNED',
    'DRONE_REACHES_BASE',
    'DRONE_READY_FOR_REDEPLOY',
    'SHIP_REACHES_TILE',
    'SHIP_LOAD_RESOURCES',
    'SHIP_REACHES_BASE',
    'SHIP_DEPOSIT_COMPLETE',
    'SHIP_REPAIR_COMPLETE',
    'SHIP_REFUEL_COMPLETE'
  ];
  
  return validEvents.includes(eventType as MachineEventType);
}

/**
 * Helper pour créer une configuration d'état avec validation des événements
 */
export function createStateConfig(config: {
  entry?: { type: string };
  exit?: { type: string };
  initial?: string;
  on?: Record<MachineEventType, string>;
  states?: Record<string, unknown>;
}) {
  return config;
}
