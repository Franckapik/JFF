/**
 * ============================================================================
 * XSTATE EVENTS CONFIG - Événements utilisés par la machine XState (minimal)
 * ============================================================================
 * 
 * Ce fichier centralise uniquement les types d'événements utilisés dans la machine XState
 * (machine.xstate.js) + urgences. Les autres événements sont exclus pour l'instant.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

// -----------------------------------------------------------------------------
// Événements principaux de la machine (machine.xstate.js)
// -----------------------------------------------------------------------------
export const MACHINE_EVENT_TYPES = {
  // === Événements de transition principaux ===
  needExploring: 'needExploring',
  needCollecting: 'needCollecting',
  needMaintenance: 'needMaintenance',
  RESET_CONTEXT: 'RESET_CONTEXT',
  FORCE_STATE: 'FORCE_STATE',

  // === Exploring (drone) ===
  DRONE_REACHES_TILE: 'DRONE_REACHES_TILE',
  DRONE_SCANS_TILE: 'DRONE_SCANS_TILE',
  DRONE_REACHES_BASE: 'DRONE_REACHES_BASE',

  // === Collecting (ship) ===
  SHIP_REACHES_TILE: 'SHIP_REACHES_TILE',
  SHIP_LOAD_RESOURCES: 'SHIP_LOAD_RESOURCES',
  SHIP_REACHES_BASE: 'SHIP_REACHES_BASE',

  // === Maintaining (ship at base) ===
  SHIP_START_DEPOSIT: 'SHIP_START_DEPOSIT',
  SHIP_START_REPAIR: 'SHIP_START_REPAIR',
  SHIP_START_REFUEL: 'SHIP_START_REFUEL',
  SHIP_DEPOSIT_COMPLETE: 'SHIP_DEPOSIT_COMPLETE',
  SHIP_REPAIR_COMPLETE: 'SHIP_REPAIR_COMPLETE',
  SHIP_REFUEL_COMPLETE: 'SHIP_REFUEL_COMPLETE',

  // --- Événements exploration/drone custom (non autorisés) ---
  // TILE_EXPLORED: 'TILE_EXPLORED', // ❌ Retiré (événement custom non autorisé)
  // DRONE_REACHED_SHIP: 'DRONE_REACHED_SHIP' // ❌ Retiré (événement custom non autorisé)
  // Ajouter ici d'autres événements si besoin (DRONE_DEPLOYED, etc.)
};

// -----------------------------------------------------------------------------
// Événements d'Urgence (optionnel, pour transitions critiques)
// -----------------------------------------------------------------------------
export const EMERGENCY_EVENT_TYPES = {
  EMERGENCY_DETECTED: 'EMERGENCY_DETECTED',
  CRITICAL_FUEL: 'CRITICAL_FUEL',
  LOW_FUEL_DETECTED: 'LOW_FUEL_DETECTED',
  EMERGENCY_RESOLVED: 'EMERGENCY_RESOLVED'
};

// -----------------------------------------------------------------------------
// Export global pour usage machine
// -----------------------------------------------------------------------------
export const ALL_EVENT_TYPES = {
  ...MACHINE_EVENT_TYPES,
  ...EMERGENCY_EVENT_TYPES
};

export default ALL_EVENT_TYPES;
