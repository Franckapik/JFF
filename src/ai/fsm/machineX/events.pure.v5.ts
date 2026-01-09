/**
 * ==========================================================================
 * EVENTS XState v5 - Types d'événements corrects pour XState v5
 * ==========================================================================
 */

import type { DroneType } from '../../../types/drone.d';
import type { WorldPosition } from '../../../types/index';
import type { Tile } from '../../../types/tile.d';

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
  | { type: 'DRONE_READY_FOR_REDEPLOY' }
  | { type: 'DRONE_DESTRUCTION_ACKNOWLEDGED' }  // 🆕 Drone destruction acknowledged after delay
  // 🛤️ PATHFINDING: Ship movement through waypoints
  | { type: 'SHIP_REACHES_WAYPOINT' }  // Intermediate waypoint reached
  | { type: 'SHIP_REACHES_TILE' }      // Final destination reached
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
  | { type: 'NEED_RELOCATING' }
  | { type: 'NEED_DRONE_PURCHASE' }  // 🆕 DRONE DESTRUCTION: Drone destroyed, needs purchase
  | { type: 'NEED_SHIP_RELOCATION' }  // Ship must move to explore new area
  | { type: 'NO_TARGET_FOUND' }  // Recovery: No valid target in exploring.drone_deploying
  // Phase 2: Grid synchronization event
  | {
      type: 'TILES_UPDATED';
      tiles: Record<string, Tile>;
      spacing: number;
      radius: number;
    }
  // Phase 2: Radius expansion & Game Over
  | { type: 'RADIUS_INCREASED'; newRadius: number }
  | { type: 'RADIUS_SYNC'; newRadius: number }  // ✅ Phase 2: Sync radius between bots
  | { type: 'GAME_OVER'; reason: 'max_radius_reached' | 'other' }
  | { type: 'RELOCATING_COMPLETE' }
  // 🆕 DRONE DESTRUCTION: Purchase complete event
  | { type: 'DRONE_PURCHASE_COMPLETE' }
  // ========================================================================
  // 🔄 PHASE 1 MIGRATION: Game config events (from Zustand stores)
  // ========================================================================
  | { type: 'GAME_CONFIG_UPDATE'; config: Partial<import('../../../types/fsm.d').GameConfig> }
  | { type: 'CLOCK_TOGGLE'; isRunning: boolean }
  | { type: 'VIEW_SELECT'; view: 'bot-0' | 'bot-1' | 'both' };

/**
 * Type guard pour vérifier le type d'un événement
 */
export function isEventType<T extends MachineEvents['type']>(
  event: MachineEvents,
  type: T
): event is Extract<MachineEvents, { type: T }> {
  return event.type === type;
}
