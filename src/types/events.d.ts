/**
 * ==========================================================================
 * MACHINE EVENTS TYPES - Types d'événements pour la machine XState
 * ==========================================================================
 * 
 * Types union pour les événements utilisés dans la machine XState.
 * Centralisé pour éviter les typos et assurer la cohérence des types.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0
 */

export type MachineEventType = 
  // Événements globaux (position updates, init)
  | 'SHIP_POSITION_UPDATE'
  | 'DRONE_POSITION_UPDATE'
  | 'DRONE_INITIALIZE_REQUEST'
  
  // Événements drone (exploring)
  | 'DRONE_REACHES_TILE'
  | 'DRONE_SCANS_TILE' 
  | 'DRONE_REACHES_BASE'
  
  // Événements ship (collecting)
  | 'SHIP_REACHES_TILE'
  | 'SHIP_LOAD_RESOURCES'
  | 'SHIP_REACHES_BASE'
  
  // Événements maintenance
  | 'SHIP_START_DEPOSIT'
  | 'SHIP_START_REPAIR'
  | 'SHIP_START_REFUEL'
  | 'SHIP_DEPOSIT_COMPLETE'
  | 'SHIP_REPAIR_COMPLETE'
  | 'SHIP_REFUEL_COMPLETE';

/**
 * Types d'événements avec payload pour XState v5
 */
export type MachineEvents = 
  | { type: 'SHIP_POSITION_UPDATE'; payload?: unknown }
  | { type: 'DRONE_POSITION_UPDATE'; payload?: unknown }
  | { type: 'DRONE_INITIALIZE_REQUEST'; payload?: unknown }
  | { type: 'DRONE_REACHES_TILE' }
  | { type: 'DRONE_SCANS_TILE' }
  | { type: 'DRONE_REACHES_BASE' }
  | { type: 'SHIP_REACHES_TILE' }
  | { type: 'SHIP_LOAD_RESOURCES' }
  | { type: 'SHIP_REACHES_BASE' }
  | { type: 'SHIP_START_DEPOSIT' }
  | { type: 'SHIP_START_REPAIR' }
  | { type: 'SHIP_START_REFUEL' }
  | { type: 'SHIP_DEPOSIT_COMPLETE' }
  | { type: 'SHIP_REPAIR_COMPLETE' }
  | { type: 'SHIP_REFUEL_COMPLETE' };

/**
 * Constantes d'événements pour usage dans les machines XState
 */
export const MACHINE_EVENT_TYPES: Record<Uppercase<MachineEventType>, MachineEventType> = {
  // Événements globaux
  SHIP_POSITION_UPDATE: 'SHIP_POSITION_UPDATE',
  DRONE_POSITION_UPDATE: 'DRONE_POSITION_UPDATE', 
  DRONE_INITIALIZE_REQUEST: 'DRONE_INITIALIZE_REQUEST',
  
  // Événements drone
  DRONE_REACHES_TILE: 'DRONE_REACHES_TILE',
  DRONE_SCANS_TILE: 'DRONE_SCANS_TILE',
  DRONE_REACHES_BASE: 'DRONE_REACHES_BASE',
  
  // Événements ship
  SHIP_REACHES_TILE: 'SHIP_REACHES_TILE',
  SHIP_LOAD_RESOURCES: 'SHIP_LOAD_RESOURCES',
  SHIP_REACHES_BASE: 'SHIP_REACHES_BASE',
  
  // Événements maintenance
  SHIP_START_DEPOSIT: 'SHIP_START_DEPOSIT',
  SHIP_START_REPAIR: 'SHIP_START_REPAIR',
  SHIP_START_REFUEL: 'SHIP_START_REFUEL',
  SHIP_DEPOSIT_COMPLETE: 'SHIP_DEPOSIT_COMPLETE',
  SHIP_REPAIR_COMPLETE: 'SHIP_REPAIR_COMPLETE',
  SHIP_REFUEL_COMPLETE: 'SHIP_REFUEL_COMPLETE'
} as const;
