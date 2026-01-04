/**
 * ==========================================================================
 * EVALUATION DOMAIN - Pure Guards (No Side Effects, No External Dependencies)
 * ==========================================================================
 * 
 * These guards are 100% testable in Node.js without R3F, Zustand, or React.
 * They accept only FSMContext and return boolean.
 * 
 * All guards follow the pattern: GuardPredicate<FSMContext, MachineEvents>
 * 
 * ⚠️ EXCEPTION: hasUnexploredTilesInRadius reads from TileStore for consistency
 * with assignDroneDeployingContext action (Bug #7 fix)
 */

import { calculateDistanceGrid } from '../../../../../core/spatial/distance.ts';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import type { XStateV5Guard } from '../../../../../types/xstate.v5.types.ts';

/**
 * Pure guard: Check if tiles are available in FSM context
 * 
 * Sources checked in order:
 * 1. context.gridInfo.tiles (full grid snapshot - spatial cache)
 * 2. context.memory.knownTiles (bot's personal exploration history)
 * 
 * Returns true if ANY tiles are available from either source.
 * This ensures transitions can proceed when exploration data exists.
 * 
 * @returns true if tiles data is available in context
 */
export const hasTilesAvailable: XStateV5Guard = ({ context }) => {
  // Check gridInfo.tiles (spatial cache - all tiles in world)
  const gridTiles = context.gridInfo?.tiles;
  if (gridTiles && Object.keys(gridTiles).length > 0) return true;
  
  // Fallback: check known tiles in memory (bot's personal exploration history)
  const knownTiles = context.memory?.knownTiles || [];
  if (knownTiles.length > 0) return true;
  
  // No tiles available from any source
  return false;
};

/**
 * Pure guard: Combined check for tiles available AND exploration conditions
 * 
 * Combines hasTilesAvailable + shouldExplore + hasUnexploredTilesInRadius into a single guard.
 * This is a pure version that only reads FSM context.
 * 
 * Returns true when:
 * - Tiles are available in gridInfo.tiles or memory.knownTiles
 * - Exploration cycle limit not reached
 * - Vehicle state is good (fuel, damage, capacity)
 * - ✅ NEW: At least one unexplored tile exists within exploration radius
 * 
 * @returns true if exploration can start
 */
export const canStartExploring: XStateV5Guard = ({ context }) => {
  // Check 1: Tiles must be available
  const tiles = context.gridInfo?.tiles || {};
  const knownTiles = context.memory?.knownTiles || [];
  const hasTiles = (Object.keys(tiles).length > 0) || knownTiles.length > 0;
  
  if (!hasTiles) return false;
  
  // Check 2: Exploration cycle limit
  const exploredThisCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
  const MAX_EXPLORATIONS_PER_CYCLE = 2;
  
  if (exploredThisCycle > MAX_EXPLORATIONS_PER_CYCLE) return false;
  
  // Check 3: Vehicle state
  const fuel = context.vehicle?.fuel ?? 0;
  const damage = context.vehicle?.damage ?? 0;
  const fuelThreshold = context.config?.fuelThreshold ?? 20;
  const isAtCapacity = context.vehicle?.isAtCapacity ?? false;
  
  const DAMAGE_THRESHOLD = 80;
  
  if (fuel < fuelThreshold) return false;
  if (damage > DAMAGE_THRESHOLD) return false;
  if (isAtCapacity) return false;
  
  // ✅ NEW Check 4: At least one unexplored tile must exist in exploration radius
  const shipCoord = context.vehicle?.coord || context.vehicle?.baseCoord;
  const exploringRadius = context.config?.exploringRadius ?? 2;
  
  if (!shipCoord) return false;
  
  // Parse ship coordinate
  const [shipCol, shipRow] = shipCoord.split(',').map(Number);
  if (isNaN(shipCol) || isNaN(shipRow)) return false;
  
  // Get explored coords from memory.knownTiles - PRIMARY SOURCE OF TRUTH
  const exploredCoords = new Set(
    knownTiles
      .filter(t => t?.explored)
      .map(t => t?.position?.coord)
  );
  
  // Check for at least one unexplored tile in radius
  let hasUnexploredTile = false;
  let tilesInRadius = 0;
  let exploredInRadius = 0;
  
  for (const [coord, tile] of Object.entries(tiles)) {
    const [col, row] = coord.split(',').map(Number);
    if (isNaN(col) || isNaN(row)) continue;
    
    // Calculate distance (Chebyshev)
    const distance = Math.max(Math.abs(col - shipCol), Math.abs(row - shipRow));
    
    if (distance <= exploringRadius) {
      // Skip base tile
      if ((tile as unknown as Record<string, unknown>)?.type === 'depart') continue;
      
      tilesInRadius++;
      
      // ✅ FIX: Use ONLY memory.knownTiles as source of truth
      const isExploredInMemory = exploredCoords.has(coord as `${number},${number}`);
      
      if (isExploredInMemory) {
        exploredInRadius++;
      } else {
        hasUnexploredTile = true;
      }
    }
  }
  
  // ⚠️ If no unexplored tiles in radius, cannot start exploring
  console.log(`🔍 [DEBUG canStartExploring] ship=${shipCoord}, radius=${exploringRadius}`, {
    tilesInRadius,
    exploredInRadius,
    hasUnexploredTile,
    exploredCoordsSize: exploredCoords.size,
    exploredCoordsSample: Array.from(exploredCoords).slice(0, 5)
  });
  
  if (!hasUnexploredTile) {
    console.log(`❌ [DEBUG canStartExploring] BLOCKING - no unexplored tiles in radius`);
    return false;
  }
  
  console.log(`✅ [DEBUG canStartExploring] ALLOWING - has unexplored tiles`);
  return true;
};

/**
 * 🆕 Bug #7 Fix: Combined guard that checks BOTH conditions
 * 
 * This guard combines:
 * 1. canStartExploring (checks context.gridInfo.tiles)
 * 2. hasUnexploredTilesInRadius (checks TileStore - same as action)
 * 
 * Both must return true to allow transition to exploring.
 * This prevents the FSM from getting stuck in drone_deploying with targetTile="unknown".
 */
export const canStartExploringWithValidTarget: XStateV5Guard = (args) => {
  const canStart = canStartExploring(args);
  if (!canStart) return false;
  
  const hasValidTargets = hasUnexploredTilesInRadius(args);
  if (!hasValidTargets) {
    console.log(`⚠️ [canStartExploringWithValidTarget] canStartExploring=true but hasUnexploredTilesInRadius=false - BLOCKING to prevent stuck state`);
  }
  
  return hasValidTargets;
};

/**
 * 🆕 Bug #7 Fix: Guard that GUARANTEES assignDroneDeployingContext will succeed
 * 
 * This guard uses the EXACT same logic as assignDroneDeployingContext:
 * - Reads fresh tiles from TileStore
 * - Filters out explored tiles from memory.knownTiles
 * - Excludes base tile (type='depart')
 * - Returns true ONLY if at least one valid unexplored tile exists
 * 
 * This prevents the FSM from transitioning to exploring.drone_deploying
 * when no valid target exists, which would leave it stuck with 0 scheduled events.
 * 
 * @param context FSMContext
 * @returns true if at least one unexplored tile exists that can be targeted
 */
export const hasUnexploredTilesInRadius: XStateV5Guard = ({ context }) => {
  const tiles = context.gridInfo?.tiles || {};
  const knownTiles = context.memory?.knownTiles || [];
  const shipCoord = context.vehicle?.coord || context.vehicle?.baseCoord;
  const exploringRadius = context.config?.exploringRadius ?? 2;
  
  if (!shipCoord) {
    console.log(`❌ [hasUnexploredTilesInRadius] No ship coord`);
    return false;
  }
  
  // Read fresh tiles from TileStore (same as action)
  const tileStoreState = useTileStore.getState();
  const freshTiles = tileStoreState?.tiles || tiles;
  
  // Build explored coords set from memory.knownTiles (same as action)
  const exploredCoords = new Set(
    knownTiles
      .filter(t => t?.explored)
      .map(t => t?.position?.coord)
      .filter(Boolean)
  );
  
  // Get candidate tiles in radius (same as action)
  const candidateTiles = Object.entries(freshTiles)
    .filter(([coord, _tile]) => {
      const distance = calculateDistanceGrid(shipCoord, coord as `${number},${number}`);
      return distance <= exploringRadius && distance > 0;
    })
    .map(([_coord, tile]) => tile);
  
  // Filter unexplored tiles (EXACT same logic as action)
  const unexploredTiles = candidateTiles.filter(tile => {
    const coord = tile.position?.coord;
    if (!coord) return false;
    
    // Exclude if explored in TileStore OR in memory
    const freshTile = freshTiles[coord];
    if (freshTile?.explored) return false;
    if (exploredCoords.has(coord as `${number},${number}`)) return false;
    
    // Exclude base tile
    if (tile.type === 'depart') return false;
    
    return true;
  });
  
  const result = unexploredTiles.length > 0;
  
  console.log(`🔍 [hasUnexploredTilesInRadius] ship=${shipCoord}, radius=${exploringRadius}`, {
    candidatesCount: candidateTiles.length,
    unexploredCount: unexploredTiles.length,
    exploredCoordsSize: exploredCoords.size,
    result
  });
  
  return result;
};

/**
 * Pure guard: Check if exploration is appropriate based on vehicle state
 * 
 * Returns true when:
 * - Explored tiles in cycle <= 2 (limit per cycle)
 * - Fuel >= fuelThreshold
 * - Damage <= 80%
 * - Vehicle is NOT at capacity
 * 
 * @param context FSMContext containing vehicle state and memory stats
 * @returns true if exploration should proceed
 * 
 * @example
 * // In Node.js test:
 * const context = {
 *   vehicle: { fuel: 50, damage: 20, isAtCapacity: false },
 *   config: { fuelThreshold: 20 },
 *   memory: { stats: { tilesExploredInCycle: 1 } }
 * };
 * const result = shouldExplore({ context, event: {} });
 * console.log(result); // true
 */
export const shouldExplore: XStateV5Guard = ({ context }) => {
  // Limit: max 2 explorations per cycle
  const exploredThisCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
  const MAX_EXPLORATIONS_PER_CYCLE = 2;
  
  if (exploredThisCycle > MAX_EXPLORATIONS_PER_CYCLE) {
    return false;
  }

  // ⚠️ NOTE: Cannot check TileStore here (pure guard, no side effects)
  // The assignDroneDeployingContext action will handle empty TileStore gracefully
  
  // Vehicle state checks
  const fuel = context.vehicle?.fuel ?? 0;
  const damage = context.vehicle?.damage ?? 0;
  const fuelThreshold = context.config?.fuelThreshold ?? 20;
  const isAtCapacity = context.vehicle?.isAtCapacity ?? false;
  
  const DAMAGE_THRESHOLD = 80;
  
  if (fuel < fuelThreshold) return false;
  if (damage > DAMAGE_THRESHOLD) return false;
  if (isAtCapacity) return false;
  
  return true;
};

/**
 * Pure guard: Check if maintenance is necessary
 * 
 * Returns true when:
 * - Fuel < 30%, OR
 * - Damage > 50%
 * 
 * @param context FSMContext containing vehicle state
 * @returns true if maintenance is needed
 * 
 * @example
 * // In Node.js test:
 * const context = { vehicle: { fuel: 25, damage: 10 } };
 * const result = shouldMaintain({ context, event: {} });
 * console.log(result); // true (low fuel)
 * 
 * const context2 = { vehicle: { fuel: 50, damage: 60 } };
 * const result2 = shouldMaintain({ context: context2, event: {} });
 * console.log(result2); // true (high damage)
 */
export const shouldMaintain: XStateV5Guard = ({ context }) => {
  const fuel = context.vehicle?.fuel ?? 100;
  const damage = context.vehicle?.damage ?? 0;
  
  const FUEL_MAINTENANCE_THRESHOLD = 30;
  const DAMAGE_MAINTENANCE_THRESHOLD = 50;
  
  return fuel < FUEL_MAINTENANCE_THRESHOLD || damage > DAMAGE_MAINTENANCE_THRESHOLD;
};

/**
 * 🔍 Pure guard: Check if collection is appropriate based on explored tiles and vehicle state
 * 
 * Returns true when:
 * - Known explored tiles with resources exist in memory (SOURCE OF TRUTH)
 * - Vehicle is NOT at capacity
 * - Vehicle has sufficient fuel
 * 
 * PRIMARY: Uses context.memory.knownTiles (always in sync with drone exploration)
 * This ensures bot only collects tiles it has actually explored via drone scans.
 * 
 * @param context FSMContext containing memory.knownTiles with explored flag
 * @returns true if collection should proceed
 * 
 * @example
 * // In Node.js test (with memory.knownTiles):
 * const context = {
 *   vehicle: { fuel: 50, isAtCapacity: false },
 *   config: { fuelThreshold: 20 },
 *   memory: { 
 *     knownTiles: [
 *       { coord: '1,1', explored: true, hasResources: true, collected: false, resources: { total: 100 } }
 *     ]
 *   }
 * };
 * const result = shouldCollect({ context, event: {} });
 * console.log(result); // true
 */
export const shouldCollect: XStateV5Guard = ({ context }) => {
  // ✅ PRIMARY: Check memory.knownTiles (always in sync with drone scans)
  const knownTiles = context.memory?.knownTiles || [];
  
  // Must have at least one explored tile with resources that hasn't been collected
  const hasCollectibleTiles = knownTiles.some(tile => 
    tile?.explored === true &&
    tile?.hasResources && 
    !tile?.collected && 
    tile?.resources?.total > 0
  );
  
  if (!hasCollectibleTiles) return false;
  
  // Vehicle state checks
  const isAtCapacity = context.vehicle?.isAtCapacity ?? false;
  const fuel = context.vehicle?.fuel ?? 0;
  const fuelThreshold = context.config?.fuelThreshold ?? 20;
  
  if (isAtCapacity) return false;
  if (fuel < fuelThreshold) return false;
  
  return true;
};

/**
 * Pure guard: Check if all tiles within exploration radius are already explored
 * 
 * Returns true when:
 * - All tiles in gridInfo.tiles within the exploration radius are marked as explored
 * - No unexplored tiles remain in the current area
 * 
 * This guard is used to trigger ship relocation to explore new areas.
 * 
 * @param context FSMContext containing gridInfo.tiles and memory.knownTiles
 * @returns true if all local tiles are explored and ship should relocate
 */
export const allLocalTilesExplored: XStateV5Guard = ({ context }) => {
  const tiles = context.gridInfo?.tiles || {};
  const shipCoord = context.vehicle?.coord || context.vehicle?.baseCoord;
  const exploringRadius = context.config?.exploringRadius ?? 2;
  
  if (!shipCoord || Object.keys(tiles).length === 0) return false;
  
  // Parse ship coordinate
  const [shipCol, shipRow] = shipCoord.split(',').map(Number);
  if (isNaN(shipCol) || isNaN(shipRow)) return false;
  
  // Get explored coords from memory.knownTiles
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
    
    // Calculate distance (Manhattan or Chebyshev)
    const distance = Math.max(Math.abs(col - shipCol), Math.abs(row - shipRow));
    
    if (distance <= exploringRadius) {
      // Skip base tile
      if ((tile as unknown as Record<string, unknown>)?.type === 'depart') continue;
      
      tilesInRadius++;
      
      // Check if tile is explored (in TileStore OR in memory)
      const isExploredInStore = (tile as unknown as Record<string, unknown>)?.explored === true;
      const isExploredInMemory = exploredCoords.has(coord as `${number},${number}`);
      
      if (isExploredInStore || isExploredInMemory) {
        exploredInRadius++;
      }
    }
  }
  
  // All local tiles explored if we have tiles AND all are explored
  return tilesInRadius > 0 && exploredInRadius >= tilesInRadius;
};

/**
 * Pure guard: Check if ship should relocate to explore new area
 * 
 * Returns true when:
 * - All local tiles are explored (allLocalTilesExplored)
 * - No collectible tiles exist
 * - Vehicle has sufficient fuel to relocate
 */
export const shouldRelocateShip: XStateV5Guard = ({ context }) => {
  // First check if all local tiles are explored
  if (!allLocalTilesExplored({ context } as Parameters<XStateV5Guard>[0])) {
    return false;
  }
  
  // Check no collectible tiles
  const knownTiles = context.memory?.knownTiles || [];
  const hasCollectibleTiles = knownTiles.some(tile => 
    tile?.explored === true &&
    tile?.hasResources && 
    !tile?.collected && 
    tile?.resources?.total > 0
  );
  
  if (hasCollectibleTiles) return false;
  
  // Check fuel
  const fuel = context.vehicle?.fuel ?? 0;
  const fuelThreshold = context.config?.fuelThreshold ?? 20;
  
  return fuel >= fuelThreshold;
};
