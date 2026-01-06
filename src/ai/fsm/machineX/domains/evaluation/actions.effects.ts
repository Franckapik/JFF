/**
 * ==========================================================================
 * EVALUATION DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 * 
 * CONVENTION : on[State][Event]
 * Actions pour effets de bord (logging, API calls, notifications)
 * 
 * ✅ Phase 4: Uses context.gridInfo and pure spatial functions
 */

import type { ActorRef } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger.ts';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

/**
 * ⚠️ DEPRECATED: This action is no longer needed.
 * 
 * Guards now read directly from context.gridInfo.tiles which is already
 * populated by TILES_UPDATED event or initial sync in useXFSMStore.
 * 
 * The injectedData pattern was an intermediate solution that is now obsolete.
 * All guards have been updated to use gridInfo.tiles directly.
 * 
 * @deprecated Use context.gridInfo.tiles directly in guards
 */
/*
export const assignInjectTileData = assign({
  injectedData: ({ context }) => {
    
    try {
      const tiles = context.gridInfo?.tiles || {};
      const shipPosition = context.vehicle?.position;
      const collectingRadius = context.config?.collectingRadius ?? 3;
      const shipCoord = shipPosition?.coord;
      
      const availableTiles = shipCoord ? findTilesInRadius(shipCoord, collectingRadius, tiles) : [];
      
      fsmLogger.info('[assignInjectTileData] Query result:', {
        shipPosition,
        shipCoord,
        collectingRadius,
        availableTilesCount: availableTiles.length,
        gridInfoTilesCount: Object.keys(tiles).length,
        injectedAt: Date.now()
      });
      
      return {
        ...context.injectedData,
        availableTiles: Array.isArray(availableTiles) ? availableTiles : [availableTiles].filter(Boolean),
        injectedAt: Date.now(),
      };
    } catch (error) {
      return {
        ...context.injectedData,
        availableTiles: [],
        injectedAt: Date.now(),
      };
    }
  },
});
*/

/**
 * Action d'entrée de l'état evaluating : logique de décision prioritaire
 * Envoie un événement selon la situation du contexte
 * 
 * PRIORITÉS (ordre d'évaluation):
 * 0. NEED_DRONE_PURCHASE - Si drone détruit (destroyed) ou failed (needs replacement)
 * 1. NEED_MAINTENANCE - Si fuel < 30% ou damage > 50%
 * 2. NEED_RELOCATING - Si toutes tuiles locales explorées ET pas de collectibles ET fuel OK
 * 3. NEED_COLLECTING - Si tuiles collectibles disponibles ET ship pas plein
 * 4. NEED_EXPLORING - Sinon, continuer l'exploration
 */
export const onEvaluatingEntry = ({ context, self }: { context: FSMContext, self: ActorRef<any, MachineEvents> }) => {
  
  const vehicle = context?.vehicle;
  const fuel = vehicle?.fuel || 100;
  const damage = vehicle?.damage || 0;
  const droneState = context.droneFleet?.drones?.explorer?.visualState;
  const isDroneAvailable = droneState === 'docked';
  const needsDronePurchase = droneState === 'failed' || droneState === 'destroyed';
  
  // ✅ FIX: Check which tiles have resources and are not collected
  const knownTiles = context.memory?.knownTiles || [];
  const hasCollectibleTiles = knownTiles.some(tile => 
    tile?.hasResources && !tile.collected && tile.resources?.total > 0
  );
  
  // 🆕 Check if ship is stuck using TileStore (EXACT same logic as hasUnexploredTilesInRadius guard)
  const tileStoreState = useTileStore.getState();
  const tiles = context.gridInfo?.tiles || {};
  const freshTiles = tileStoreState?.tiles || tiles;
  const shipCoord = context.vehicle?.coord || context.vehicle?.baseCoord;
  const exploringRadius = context.config?.exploringRadius ?? 2;
  
  // Helper: euclidean distance (same as calculateDistanceGrid in guard)
  const calculateDistance = (coordA: string, coordB: string): number => {
    const [x1, z1] = coordA.split(',').map(Number);
    const [x2, z2] = coordB.split(',').map(Number);
    if (isNaN(x1) || isNaN(z1) || isNaN(x2) || isNaN(z2)) return Infinity;
    const dx = x2 - x1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dz * dz);
  };
  
  let hasUnexploredInRadius = false;
  if (shipCoord && Object.keys(freshTiles).length > 0) {
    // Build explored coords set from memory.knownTiles (same as guard)
    const exploredCoords = new Set(
      knownTiles
        .filter(t => t?.explored)
        .map(t => t?.position?.coord)
        .filter(Boolean)
    );
    
    // Get candidate tiles in radius (same as guard - using euclidean distance)
    const candidateTiles = Object.entries(freshTiles)
      .filter(([coord]) => {
        const distance = calculateDistance(shipCoord, coord);
        return distance <= exploringRadius && distance > 0;
      })
      .map(([_coord, tile]) => tile);
    
    // Filter unexplored tiles (EXACT same logic as guard)
    for (const tile of candidateTiles) {
      const coord = (tile as any).position?.coord;
      if (!coord) continue;
      
      // Exclude if explored in TileStore OR in memory
      const freshTile = freshTiles[coord as keyof typeof freshTiles];
      if ((freshTile as any)?.explored) continue;
      if (exploredCoords.has(coord as `${number},${number}`)) continue;
      
      // Exclude base tile
      if ((tile as any).type === 'depart') continue;
      
      // Found an unexplored tile
      hasUnexploredInRadius = true;
      break;
    }
  }
  
  // shouldRelocate = NO unexplored tiles in radius AND no collectibles AND fuel OK
  const shouldRelocate = !hasUnexploredInRadius && !hasCollectibleTiles && fuel >= (context.config?.fuelThreshold ?? 20);
  
  fsmLogger.info(`[Evaluating] Conditions`, {
    fuel,
    damage,
    needsMaintenance: fuel < 30 || damage > 50,
    hasUnexploredInRadius,
    shouldRelocate,
    hasCollectibleTiles,
    isShipNotFull: !context.vehicle?.isAtCapacity,
    isDroneAvailable,
    explorationQueueLength: context.explorationQueue?.length,
    droneState: context.droneFleet?.drones?.explorer?.visualState,
    knownTilesCount: knownTiles.length
  });
  
  // 🚧 PHASE 1: Éviter la boucle infinie de relocating
  // Si on vient de passer par relocating, ne pas re-déclencher immédiatement
  const justRelocated = context.lastAction === 'shipRelocation_requested' || 
                        context.lastAction === 'shipRelocation_complete';
  
  setTimeout(() => {
    // PRIORITY 0: Drone purchase (drone destroyed/failed)
    if (needsDronePurchase) {
      fsmLogger.info(`[Evaluating] → NEED_DRONE_PURCHASE (drone needs replacement)`, {
        droneState,
        destroyedCount: context.droneFleet?.drones?.explorer?.stats?.totalDestroyed
      });
      self.send({ type: 'NEED_DRONE_PURCHASE' } as MachineEvents);
    }
    // PRIORITY 1: Maintenance urgente
    else if (fuel < 30 || damage > 50) {
      fsmLogger.info(`[Evaluating] → NEED_MAINTENANCE (maintenance needed)`);
      self.send({ type: 'NEED_MAINTENANCE' } as MachineEvents);
    }
    // 🆕 PRIORITY 2: Ship bloqué - doit se relocaliser (sauf si on vient de le faire)
    else if (shouldRelocate && !justRelocated) {
      fsmLogger.info(`[Evaluating] → NEED_RELOCATING (ship stuck, all local tiles explored)`);
      self.send({ type: 'NEED_RELOCATING' } as MachineEvents);
    }
    // PRIORITY 3: COLLECT si tuiles collectibles disponibles
    else if (hasCollectibleTiles && !vehicle?.isAtCapacity) {
      fsmLogger.info(`[Evaluating] → NEED_COLLECTING (collectible tiles available)`, {
        tilesCount: knownTiles.filter(t => t?.hasResources && !t.collected).length
      });
      self.send({ type: 'NEED_COLLECTING' } as MachineEvents);
    }
    // PRIORITY 4: EXPLORE (fallback - même si shouldRelocate=true après relocating)
    else {
      fsmLogger.info(`[Evaluating] → NEED_EXPLORING (no collectible tiles or ship at capacity)`);
      self.send({ type: 'NEED_EXPLORING' } as MachineEvents);
    }
  }, 100);
};

/**
 * Action de sortie de l'état evaluating : simple log
 */
export const onEvaluatingExit = ({ context: _context }: { context: FSMContext }) => {
};
