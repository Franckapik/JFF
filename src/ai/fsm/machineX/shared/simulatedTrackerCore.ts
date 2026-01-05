/**
 * ==========================================================================
 * SIMULATED TRACKER CORE - Logique pure partagée (Test + Front)
 * ==========================================================================
 * 
 * Module partagé entre le test Node.js et le front React/R3F
 * Contient toute la logique de calcul des distances, durées, et événements
 * 
 * ✅ Logique pure (pas de side-effects)
 * ✅ Compatible Node + Browser
 * ✅ Source unique de vérité pour les timings
 */

import { gridToWorld } from '../../../../core/spatial/coordinates.ts';
import type { GridCoordinate, WorldPosition } from '../../../../types/coordinates';
import type { FSMContext } from '../../../../types/fsm.d.ts';
import type { Tile } from '../../../../types/tile.d.ts';
import type { MachineEvents } from '../events.pure.v5.ts';

// ========================================
// Configuration des durées (en ms)
// ========================================

export const DURATIONS = {
  // Vitesses de déplacement (unités par seconde)
  DRONE_SPEED: 2.0,
  SHIP_SPEED: 1.5,
  
  // Limites de temps de déplacement
  MIN_TRAVEL_TIME: 500,    // ms minimum
  MAX_TRAVEL_TIME: 3000,   // ms maximum
  
  // Durées d'actions
  SCAN_DURATION: 800,
  DOCK_DURATION: 500,      // Drone docking time before redeploy
  COLLECT_DURATION: 1200,
  DEPOSIT_DURATION: 1500,
  REFUEL_DURATION: 1000,
  REPAIR_DURATION: 1500,
} as const;

// ========================================
// Types
// ========================================

/**
 * Convertit une GridCoordinate en WorldPosition pour les calculs
 */
function coordToWorldPosition(coord: GridCoordinate | undefined, spacing: number = -0.2): WorldPosition | null {
  if (!coord) return null;
  return gridToWorld(coord, { spacing, defaultY: 0.5 });
}

export type ScheduledEvent = {
  event: MachineEvents;
  delay: number;
  reason?: string;
};

export type StateInfo = {
  mainState: string;
  subState: string | null;
};

// ========================================
// Utilitaires de calcul
// ========================================

/**
 * Calcule la distance euclidienne entre deux positions
 */
export function calculateDistance(pos1: WorldPosition | null | undefined, pos2: WorldPosition | null | undefined): number {
  if (!pos1 || !pos2) return 0;
  
  const dx = (pos2.x ?? 0) - (pos1.x ?? 0);
  const dz = (pos2.z ?? 0) - (pos1.z ?? 0);
  
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Calcule le temps de déplacement basé sur la distance et la vitesse
 */
export function calculateTravelTime(distance: number, speed: number): number {
  if (distance === 0) return DURATIONS.MIN_TRAVEL_TIME;
  
  // Temps = distance / vitesse (converti en ms)
  const travelTime = (distance / speed) * 1000;
  
  // Limiter entre MIN et MAX
  return Math.max(
    DURATIONS.MIN_TRAVEL_TIME,
    Math.min(travelTime, DURATIONS.MAX_TRAVEL_TIME)
  );
}

// ========================================
// Détection d'état FSM
// ========================================

/**
 * Parse le snapshot.value pour détecter l'état principal et le sous-état
 */
export function detectCurrentState(snapshotValue: string | object): StateInfo {
  if (typeof snapshotValue === 'string') {
    return { mainState: snapshotValue, subState: null };
  }
  
  // Format XState v5 : { exploring: 'drone_deploying' }
  const keys = Object.keys(snapshotValue);
  if (keys.length > 0) {
    const mainState = keys[0];
    const subState = (snapshotValue as Record<string, unknown>)[mainState];
    return { mainState, subState: typeof subState === 'string' ? subState : null };
  }
  
  return { mainState: 'unknown', subState: null };
}

// ========================================
// Extraction de positions/cibles
// ========================================

/**
 * Extrait les positions et cibles du contexte FSM
 * Convertit les GridCoordinate en WorldPosition pour les calculs de distance
 */
export function extractPositionsAndTargets(context: FSMContext) {
  const spacing = context.gridInfo?.spacing ?? -0.2;
  
  const droneCoord = context.droneFleet?.drones?.explorer?.coord;
  const shipCoord = context.vehicle?.coord;
  const baseCoord = context.vehicle?.baseCoord;
  
  const dronePos = coordToWorldPosition(droneCoord, spacing);
  const shipPos = coordToWorldPosition(shipCoord, spacing);
  const basePos = coordToWorldPosition(baseCoord, spacing);
  
  const targetDroneTile = context.droneFleet?.drones?.explorer?.targetDroneTile;
  const targetVehicleTile = context.vehicle?.targetVehicleTile;
  const tiles = context.gridInfo?.tiles || {};
  
  return {
    dronePos,
    shipPos,
    basePos,
    targetDroneTile,
    targetVehicleTile,
    tiles,
    spacing,
  };
}

// ========================================
// Logique de planification d'événements
// ========================================

/**
 * Détermine les événements à planifier pour un état d'exploration
 */
export function getExploringEvents(
  subState: string,
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const { dronePos, basePos, targetDroneTile, tiles: _tiles, spacing } = extractPositionsAndTargets(context);
  const events: ScheduledEvent[] = [];
  
  if (subState === 'drone_deploying') {
    if (verbose && targetDroneTile) {
      // eslint-disable-next-line no-console
      console.log(`🛸 [TRACKER] Drone → ${targetDroneTile.position?.coord || 'unknown'}`);
    }
    
    if (targetDroneTile?.position?.coord) {
      const targetPos = coordToWorldPosition(targetDroneTile.position.coord as GridCoordinate, spacing);
      if (targetPos) {
        const distance = calculateDistance(dronePos, targetPos);
        const travelTime = calculateTravelTime(distance, DURATIONS.DRONE_SPEED);
        
        // ✅ FIX: Si la distance est pratiquement nulle (drone déjà sur place)
        // programmer l'événement immédiatement pour éviter les boucles
        const isAlreadyOnTile = distance < 0.01; // Tolérance de 0.01 unité
        const effectiveDelay = isAlreadyOnTile ? 0 : travelTime;
        
        if (verbose) {
        // eslint-disable-next-line no-console
          console.log(`   Distance: ${distance.toFixed(2)} units, Travel time: ${effectiveDelay}ms${isAlreadyOnTile ? ' (already on tile)' : ''}`);
        }
        
        events.push({
          event: { type: 'DRONE_REACHES_TILE' },
          delay: effectiveDelay,
          reason: `Drone traveling to ${targetDroneTile.position.coord}`
        });
      }
    } else {
      // 🆕 Recovery: Pas de cible valide → retour à evaluating
      if (verbose) {
        // eslint-disable-next-line no-console
        console.log(`   ⚠️  No valid target tile → sending NO_TARGET_FOUND`);
      }
      events.push({
        event: { type: 'NO_TARGET_FOUND' },
        delay: 100, // Petit délai pour éviter boucle synchrone
        reason: 'No unexplored tiles in radius - returning to evaluating'
      });
    }
  } else if (subState === 'drone_scanning') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`🔍 [TRACKER] Scanning (${DURATIONS.SCAN_DURATION}ms)`);
    }
    
    events.push({
      event: { type: 'DRONE_HAS_SCANNED' },
      delay: DURATIONS.SCAN_DURATION,
      reason: 'Scanning tile'
    });
  } else if (subState === 'drone_returning') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`🏠 [TRACKER] Drone returning`);
    }
    
    if (basePos && dronePos) {
      const distance = calculateDistance(dronePos, basePos);
      const travelTime = calculateTravelTime(distance, DURATIONS.DRONE_SPEED);
      
      if (verbose) {
      // eslint-disable-next-line no-console
        console.log(`   Distance: ${distance.toFixed(2)} units, Travel time: ${travelTime}ms`);
      }
      
      events.push({
        event: { type: 'DRONE_REACHES_BASE' },
        delay: travelTime,
        reason: 'Drone returning to base'
      });
    }
  } else if (subState === 'drone_docked') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`⚓ [TRACKER] Drone docking (${DURATIONS.DOCK_DURATION}ms)`);
    }
    
    // 🔄 Après docking, redéployer automatiquement
    events.push({
      event: { type: 'DRONE_READY_FOR_REDEPLOY' },
      delay: DURATIONS.DOCK_DURATION,
      reason: 'Drone ready to redeploy after docking'
    });
  }
  
  return events;
}

/**
 * Détermine les événements à planifier pour un état de collecte
 */
export function getCollectingEvents(
  subState: string,
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const { shipPos, basePos, targetVehicleTile, spacing } = extractPositionsAndTargets(context);
  const events: ScheduledEvent[] = [];
  
  if (subState === 'ship_moving_to_tile') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`🚢 [TRACKER] Ship moving`);
    }
    
    if (targetVehicleTile?.position?.coord && shipPos) {
      const targetPos = coordToWorldPosition(targetVehicleTile.position.coord as GridCoordinate, spacing);
      if (!targetPos) return events;
      const distance = calculateDistance(shipPos, targetPos);
      const travelTime = calculateTravelTime(distance, DURATIONS.SHIP_SPEED);
      
      // ✅ FIX: Si la distance est pratiquement nulle (bot déjà sur place)
      // programmer l'événement immédiatement pour éviter les boucles
      const isAlreadyOnTile = distance < 0.01; // Tolérance de 0.01 unité
      const effectiveDelay = isAlreadyOnTile ? 0 : travelTime;
      
      if (verbose) {
      // eslint-disable-next-line no-console
        console.log(`   Target: ${targetVehicleTile.position.coord}`);
      // eslint-disable-next-line no-console
        console.log(`   Distance: ${distance.toFixed(2)} units, Travel time: ${effectiveDelay}ms${isAlreadyOnTile ? ' (already on tile)' : ''}`);
      }
      
      events.push({
        event: { type: 'SHIP_REACHES_TILE' },
        delay: effectiveDelay,
        reason: `Ship traveling to ${targetVehicleTile.position.coord}`
      });
    }
  } else if (subState === 'ship_collecting') {
    if (verbose) {
       
      // eslint-disable-next-line no-console
      console.log(`\n🚢 [TRACKER-CORE] ship_collecting (${DURATIONS.COLLECT_DURATION}ms)`);
    }
    
    events.push({
      event: { 
        type: 'SHIP_LOAD_RESOURCES'
      },
      delay: DURATIONS.COLLECT_DURATION,
      reason: 'Collecting resources'
    });
  } else if (subState === 'ship_returning') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`🔙 [TRACKER] Ship returning`);
    }
    
    if (basePos && shipPos) {
      const distance = calculateDistance(shipPos, basePos);
      const travelTime = calculateTravelTime(distance, DURATIONS.SHIP_SPEED);
      
      // ✅ FIX: Si la distance est pratiquement nulle (ship déjà à la base)
      // programmer l'événement immédiatement pour éviter les boucles
      const isAlreadyAtBase = distance < 0.01; // Tolérance de 0.01 unité
      const effectiveDelay = isAlreadyAtBase ? 0 : travelTime;
      
      events.push({
        event: { type: 'SHIP_REACHES_BASE' },
        delay: effectiveDelay,
        reason: 'Ship returning to base'
      });
    }
  }
  
  return events;
}

/**
 * Détermine les événements à planifier pour un état de maintenance
 * 🆕 Inclut maintenant le sous-état 'relocating'
 */
export function getMaintainingEvents(
  subState: string,
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const events: ScheduledEvent[] = [];
  
  // 🆕 Sous-état relocating: ship se déplace vers nouvelle zone
  if (subState === 'relocating') {
    return getRelocatingEvents(context, verbose);
  }
  
  if (subState === 'depositing') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`💰 [TRACKER] Depositing (${DURATIONS.DEPOSIT_DURATION}ms)`);
    }
    
    events.push({
      event: { type: 'SHIP_DEPOSIT_COMPLETE' },
      delay: DURATIONS.DEPOSIT_DURATION,
      reason: 'Depositing resources'
    });
  } else if (subState === 'refueling') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`⛽ [TRACKER] Refueling (${DURATIONS.REFUEL_DURATION}ms)`);
    }
    
    events.push({
      event: { type: 'SHIP_REFUEL_COMPLETE' },
      delay: DURATIONS.REFUEL_DURATION,
      reason: 'Refueling ship'
    });
  } else if (subState === 'repairing') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`🔧 [TRACKER] Repairing (${DURATIONS.REPAIR_DURATION}ms)`);
    }
    
    events.push({
      event: { type: 'SHIP_REPAIR_COMPLETE' },
      delay: DURATIONS.REPAIR_DURATION,
      reason: 'Repairing ship'
    });
  }
  
  return events;
}

/**
 * Type pour injecter l'accès aux tuiles externes (ex: tileStore dans React)
 */
export type TileProvider = {
  tiles: Record<string, Tile>;
  findAssignedDepartTile?: (entityId: string) => Tile | undefined;
};

/**
 * Détermine les événements d'initialisation à planifier
 */
export function getInitializingEvents(
  context: FSMContext,
  verbose: boolean = false,
  tileProvider?: TileProvider
): ScheduledEvent[] {
  const events: ScheduledEvent[] = [];
  const spacing = context.gridInfo?.spacing ?? -0.2;
  
  let departTile: Tile | undefined = undefined;
  
  // ✅ Chercher d'abord dans le provider externe (tileStore)
  if (tileProvider?.findAssignedDepartTile) {
    departTile = tileProvider.findAssignedDepartTile(context.entityId);
    
    // verbose logging omitted - use fsmLogger instead
  }
  
  // ✅ Fallback : chercher dans le contexte FSM (pour compatibilité)
  if (!departTile) {
    const tiles = context.gridInfo?.tiles || {};
    departTile = Object.values(tiles).find(
      tile => tile.type === 'depart' && tile.assignedToBot === context.entityId
    );
  }
  
  // Bot initialization tracking omitted - use fsmLogger if needed
  
  // Utiliser la tuile de départ si trouvée, sinon fallback à '0,0'
  const defaultCoord: GridCoordinate = departTile?.position?.coord || '0,0';
  const baseCoord = context.vehicle?.baseCoord || defaultCoord;
  
  // Vérifier si le vaisseau doit être initialisé
  const shipCoord = context.vehicle?.coord;
  if (!shipCoord) {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log('🚀 [TRACKER] Init ship');
    }
    const initialPosition = coordToWorldPosition(defaultCoord, spacing) || { x: 0, y: 0.5, z: 0 };
    events.push({
      event: { 
        type: 'SHIP_INITIALIZE_REQUEST',
        initialPosition,
        shipType: 'main-ship'
      },
      delay: 50,
      reason: 'Initialize ship'
    });
  }
  
  // Vérifier si le drone doit être initialisé
  const droneState = context.droneFleet?.drones?.explorer?.visualState;
  if (droneState === 'uninitialized') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log('🔧 [TRACKER] Init drone');
    }
    const initialPosition = coordToWorldPosition(baseCoord, spacing) || { x: 0, y: 0.5, z: 0 };
    events.push({
      event: { 
        type: 'DRONE_INITIALIZE_REQUEST',
        droneType: 'explorer',
        initialPosition,
      },
      delay: 100, // After ship initialization
      reason: 'Initialize drone'
    });
  }
  
  return events;
}

/**
 * Détermine les événements d'évaluation à planifier
 * 
 * Logique de décision selon les scenarios:
 * 1. Si hasCollectibleTiles → NEED_COLLECTING
 * 2. Si exploration cycle atteint (>= 3 tuiles explorées) → NEED_COLLECTING
 * 3. Si toutes les tuiles locales sont explorées → NEED_SHIP_RELOCATION
 * 4. Sinon → NEED_EXPLORING
 */
export function getEvaluatingEvents(
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const events: ScheduledEvent[] = [];
  
  const isDroneAvailable = context.droneFleet?.drones?.explorer?.visualState !== 'uninitialized';
  if (!isDroneAvailable) return events;
  
  // ✅ Check for collectible tiles in memory.knownTiles
  const knownTiles = context.memory?.knownTiles || [];
  const collectibleTiles = knownTiles.filter(tile => 
    tile?.explored === true &&
    tile?.hasResources && 
    !tile?.collected && 
    tile?.resources?.total > 0
  );
  const hasCollectibleTiles = collectibleTiles.length > 0;
  
  // ✅ Check if exploration cycle limit reached (3 tiles = cycle complete)
  const tilesExploredInCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
  const EXPLORATION_CYCLE_LIMIT = 3;
  const isCycleComplete = tilesExploredInCycle >= EXPLORATION_CYCLE_LIMIT;
  
  // ✅ Decision logic: Collect if we have tiles AND (cycle complete OR enough tiles)
  if (hasCollectibleTiles && (isCycleComplete || collectibleTiles.length >= 2)) {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`🚢 [TRACKER] NEED_COLLECTING (${collectibleTiles.length} collectible tiles, cycle: ${tilesExploredInCycle}/${EXPLORATION_CYCLE_LIMIT})`);
    }
    events.push({
      event: { type: 'NEED_COLLECTING' },
      delay: 100,
      reason: `Start collection (${collectibleTiles.length} tiles available)`
    });
  } else {
    // ✅ NEW: Check if all local tiles are explored (need relocation)
    const allLocalExplored = checkAllLocalTilesExplored(context);
    
    if (allLocalExplored && !hasCollectibleTiles) {
      if (verbose) {
        // eslint-disable-next-line no-console
        console.log(`🚢 [TRACKER] NEED_SHIP_RELOCATION (all local tiles explored, no collectibles)`);
      }
      events.push({
        event: { type: 'NEED_SHIP_RELOCATION' },
        delay: 100,
        reason: 'Relocate to explore new area'
      });
    } else {
      if (verbose) {
        // eslint-disable-next-line no-console
        console.log(`🔧 [TRACKER] NEED_EXPLORING (collectible: ${collectibleTiles.length}, cycle: ${tilesExploredInCycle}/${EXPLORATION_CYCLE_LIMIT})`);
      }
      events.push({
        event: { type: 'NEED_EXPLORING' },
        delay: 100,
        reason: 'Continue exploration cycle'
      });
    }
  }
  
  return events;
}

/**
 * Helper: Check if all tiles within exploration radius are already explored
 * Uses memory.knownTiles as the primary source of truth for exploration status
 */
function checkAllLocalTilesExplored(context: FSMContext): boolean {
  const tiles = context.gridInfo?.tiles || {};
  const shipCoord = context.vehicle?.coord || context.vehicle?.baseCoord;
  const exploringRadius = context.config?.exploringRadius ?? 2;
  
  if (!shipCoord || Object.keys(tiles).length === 0) return false;
  
  // Parse ship coordinate
  const [shipCol, shipRow] = shipCoord.split(',').map(Number);
  if (isNaN(shipCol) || isNaN(shipRow)) return false;
  
  // Get explored coords from memory.knownTiles - PRIMARY SOURCE OF TRUTH
  const exploredCoords = new Set(
    (context.memory?.knownTiles ?? [])
      .filter(t => t?.explored)
      .map(t => t?.position?.coord)
  );
  
  // Check all tiles in radius
  let tilesInRadius = 0;
  let exploredInRadius = 0;
  
  for (const [coord, tile] of Object.entries(tiles)) {
    const [col, row] = coord.split(',').map(Number);
    if (isNaN(col) || isNaN(row)) continue;
    
    // Calculate distance (Chebyshev)
    const distance = Math.max(Math.abs(col - shipCol), Math.abs(row - shipRow));
    
    if (distance <= exploringRadius) {
      // Skip base tile
      if ((tile as Tile)?.type === 'depart') continue;
      
      tilesInRadius++;
      
      // ✅ FIX: Use ONLY memory.knownTiles as source of truth
      // gridInfo.tiles.explored may not be updated in real-time
      const isExploredInMemory = exploredCoords.has(coord as GridCoordinate);
      
      if (isExploredInMemory) {
        exploredInRadius++;
      }
    }
  }
  
  // All local tiles explored if we have tiles AND all are explored
  return tilesInRadius > 0 && exploredInRadius >= tilesInRadius;
}

/**
 * Fonction principale : détermine tous les événements à planifier pour un snapshot donné
 */
export function getScheduledEvents(
  snapshotValue: string | object,
  context: FSMContext,
  verbose: boolean = false,
  tileProvider?: TileProvider
): ScheduledEvent[] {
  if (verbose) {
    const stateStr = typeof snapshotValue === 'string' ? snapshotValue : JSON.stringify(snapshotValue);
    // eslint-disable-next-line no-console
    console.log(`📋 [TRACKER] State: ${stateStr}`);
  }
  
  const { mainState, subState } = detectCurrentState(snapshotValue);
  
  // Gestion des états sans sous-état
  if (!subState) {
    switch (mainState) {
      case 'initializing':
        return getInitializingEvents(context, verbose, tileProvider);
      case 'evaluating':
        return getEvaluatingEvents(context, verbose);
      // 🆕 'relocating' est maintenant un sous-état de 'maintaining', géré dans getMaintainingEvents
      default:
        return [];
    }
  }
  
  // Gestion des états avec sous-états
  switch (mainState) {
    case 'exploring':
      return getExploringEvents(subState, context, verbose);
    case 'collecting':
      return getCollectingEvents(subState, context, verbose);
    case 'maintaining':
      return getMaintainingEvents(subState, context, verbose);
    default:
      return [];
  }
}

/**
 * 🆕 Événements pour le sous-état 'relocating'
 * 
 * ✅ OPTION A: Envoie RELOCATING_COMPLETE après 500ms pour visibilité UI
 */
export function getRelocatingEvents(
  _context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const events: ScheduledEvent[] = [];
  
  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(`🔄 [TRACKER] Relocating (500ms)`);
  }
  
  // ✅ OPTION A: Délai de 500ms pour rendre l'état visible dans l'UI
  events.push({
    event: { type: 'RELOCATING_COMPLETE' },
    delay: 500,
    reason: 'Relocating complete - checking radius'
  });
  
  return events;
}
