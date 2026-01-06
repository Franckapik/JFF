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
  | 'SHIP_INITIALIZE_REQUEST'
  | 'DRONE_POSITION_UPDATE'
  | 'DRONE_INITIALIZE_REQUEST'
  
  // Événements drone (exploring)
  | 'DRONE_REACHES_TILE'
  | 'DRONE_HAS_SCANNED'
  | 'DRONE_DESTROYED'
  | 'DRONE_REACHES_BASE'
  | 'DRONE_READY_FOR_REDEPLOY'
  | 'DRONE_DESTRUCTION_ACKNOWLEDGED'  // 🆕 Drone destruction acknowledged after delay
  
  // Événements ship (collecting)
  | 'SHIP_REACHES_WAYPOINT'  // Pathfinding: intermediate tile reached
  | 'SHIP_REACHES_TILE'
  | 'SHIP_LOAD_RESOURCES'
  | 'SHIP_REACHES_BASE'
  
  // Événements maintenance
  | 'SHIP_DEPOSIT_COMPLETE'
  | 'SHIP_REPAIR_COMPLETE'
  | 'SHIP_REFUEL_COMPLETE'
  
  // Événements de transitions d'état (evaluating)
  | 'NEED_EXPLORING'
  | 'NEED_COLLECTING'
  | 'NEED_MAINTENANCE'
  | 'NEED_RELOCATING'
  | 'NEED_DRONE_PURCHASE'
  
  // Événements de récupération d'erreur
  | 'NO_TARGET_FOUND'
  
  // Événements Phase 2: Radius & Game Over
  | 'RADIUS_INCREASED'
  | 'GAME_OVER'
  | 'RELOCATING_COMPLETE'
  
  // 🆕 DRONE DESTRUCTION: Événements d'achat de drone
  | 'DRONE_PURCHASE_COMPLETE';

/**
 * Types d'événements avec payload pour XState v5
 */
export type MachineEvents = 
  | { type: 'SHIP_POSITION_UPDATE'; payload?: unknown }
  | { type: 'SHIP_INITIALIZE_REQUEST'; payload?: unknown }
  | { type: 'DRONE_POSITION_UPDATE'; payload?: unknown }
  | { type: 'DRONE_INITIALIZE_REQUEST'; payload?: unknown }
  | { type: 'DRONE_REACHES_TILE'; tileCoord?: string; tileType?: string }
  | { type: 'DRONE_HAS_SCANNED' }
  | { type: 'DRONE_DESTROYED'; droneType: string; reason: 'danger' | 'collision' | 'other' }
  | { type: 'DRONE_REACHES_BASE' }
  | { type: 'DRONE_READY_FOR_REDEPLOY' }
  | { type: 'DRONE_DESTRUCTION_ACKNOWLEDGED' }  // 🆕 Drone destruction acknowledged after delay
  | { type: 'SHIP_REACHES_WAYPOINT' }  // Pathfinding: intermediate tile reached
  | { type: 'SHIP_REACHES_TILE' }
  | { type: 'SHIP_LOAD_RESOURCES' }
  | { type: 'SHIP_REACHES_BASE' }
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
  | { type: 'NEED_DRONE_PURCHASE' }
  | { type: 'NO_TARGET_FOUND' }
  // Phase 2: Radius expansion & Game Over
  | { type: 'RADIUS_INCREASED'; newRadius: number }
  | { type: 'GAME_OVER'; reason: 'max_radius_reached' | 'other' }
  // 🆕 DRONE DESTRUCTION: Événements d'achat de drone
  | { type: 'DRONE_PURCHASE_COMPLETE' };

/**
 * Constantes d'événements pour usage dans les machines XState
 */
export const MACHINE_EVENT_TYPES: Record<Uppercase<MachineEventType>, MachineEventType> = {
  // Événements globaux
  SHIP_POSITION_UPDATE: 'SHIP_POSITION_UPDATE',
  SHIP_INITIALIZE_REQUEST: 'SHIP_INITIALIZE_REQUEST',
  DRONE_POSITION_UPDATE: 'DRONE_POSITION_UPDATE', 
  DRONE_INITIALIZE_REQUEST: 'DRONE_INITIALIZE_REQUEST',
  
  // Événements drone
  DRONE_REACHES_TILE: 'DRONE_REACHES_TILE',
  DRONE_HAS_SCANNED: 'DRONE_HAS_SCANNED',
  DRONE_DESTROYED: 'DRONE_DESTROYED',
  DRONE_REACHES_BASE: 'DRONE_REACHES_BASE',
  DRONE_READY_FOR_REDEPLOY: 'DRONE_READY_FOR_REDEPLOY',
  
  // Événements ship
  SHIP_REACHES_WAYPOINT: 'SHIP_REACHES_WAYPOINT',  // Pathfinding
  SHIP_REACHES_TILE: 'SHIP_REACHES_TILE',
  SHIP_LOAD_RESOURCES: 'SHIP_LOAD_RESOURCES',
  SHIP_REACHES_BASE: 'SHIP_REACHES_BASE',
  
  // Événements maintenance
  SHIP_DEPOSIT_COMPLETE: 'SHIP_DEPOSIT_COMPLETE',
  SHIP_REPAIR_COMPLETE: 'SHIP_REPAIR_COMPLETE',
  SHIP_REFUEL_COMPLETE: 'SHIP_REFUEL_COMPLETE',
  
  // Événements d'urgence et d'alerte
  RESOURCE_DEPLETED: 'RESOURCE_DEPLETED',
  EMERGENCY_STOP: 'EMERGENCY_STOP',
  LOW_FUEL_WARNING: 'LOW_FUEL_WARNING',
  
  // Événements de transition
  NEED_EXPLORING: 'NEED_EXPLORING',
  NEED_COLLECTING: 'NEED_COLLECTING',
  NEED_MAINTENANCE: 'NEED_MAINTENANCE',
  NEED_RELOCATING: 'NEED_RELOCATING',
  NEED_DRONE_PURCHASE: 'NEED_DRONE_PURCHASE',
  
  // Événements de récupération d'erreur
  NO_TARGET_FOUND: 'NO_TARGET_FOUND',
  
  // Phase 2: Radius & Game Over
  RADIUS_INCREASED: 'RADIUS_INCREASED',
  GAME_OVER: 'GAME_OVER',
  
  // 🆕 DRONE DESTRUCTION: Événements d'achat de drone
  DRONE_PURCHASE_COMPLETE: 'DRONE_PURCHASE_COMPLETE'
} as const;
