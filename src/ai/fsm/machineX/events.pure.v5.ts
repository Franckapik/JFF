/**
 * ==========================================================================
 * EVENTS XState v5 - Types d'événements corrects pour XState v5
 * ==========================================================================
 */

import type { DroneType } from '../../../types/drone.d';
import type { Tile } from '../../../types/tile.d';
import type { WorldPosition } from '../../../types/index';

/**
 * Types d'événements avec payloads typés pour XState v5
 */
export type MachineEvents = 
  | {
      type: 'SHIP_POSITION_UPDATE';
      position: WorldPosition;
      shipType: string;
    }
  | {
      type: 'SHIP_INITIALIZE_REQUEST';
      shipType: string;
      initialPosition: WorldPosition;
    }
  | {
      type: 'DRONE_POSITION_UPDATE';
      position: WorldPosition;
      droneType: DroneType;
    }
  | {
      type: 'DRONE_INITIALIZE_REQUEST';
      droneType: DroneType;
      initialPosition: WorldPosition;
    }
  | { type: 'DRONE_REACHES_TILE' }
  | { type: 'DRONE_HAS_SCANNED' }
  | { type: 'DRONE_REACHES_BASE' }
  | { type: 'SHIP_REACHES_TILE' }
  | { type: 'SHIP_LOAD_RESOURCES' }
  | { type: 'SHIP_REACHES_BASE' }
  | { type: 'SHIP_START_DEPOSIT' }
  | { type: 'SHIP_START_REPAIR' }
  | { type: 'SHIP_START_REFUEL' }
  | { type: 'SHIP_DEPOSIT_COMPLETE' }
  | { type: 'SHIP_REPAIR_COMPLETE' }
  | { type: 'SHIP_REFUEL_COMPLETE' }
  | { type: 'RESOURCE_DEPLETED' }
  | { type: 'EMERGENCY_STOP' }
  | { type: 'LOW_FUEL_WARNING' }
  | { type: 'NEED_EXPLORING' }
  | { type: 'NEED_COLLECTING' }
  | { type: 'NEED_MAINTENANCE' }
  // Phase 2: Grid synchronization event
  | {
      type: 'TILES_UPDATED';
      tiles: Record<string, Tile>;
      spacing: number;
      radius: number;
    };

/**
 * Type guard pour vérifier le type d'un événement
 */
export function isEventType<T extends MachineEvents['type']>(
  event: MachineEvents,
  type: T
): event is Extract<MachineEvents, { type: T }> {
  return event.type === type;
}
