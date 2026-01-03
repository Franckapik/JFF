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
 */
export const onEvaluatingEntry = ({ context, self }: { context: FSMContext, self: ActorRef<any, MachineEvents> }) => {
  
  const vehicle = context?.vehicle;
  const fuel = vehicle?.fuel || 100;
  const damage = vehicle?.damage || 0;
  const isDroneAvailable = context.droneFleet?.drones?.explorer?.visualState === 'docked';
  
  // ✅ FIX: Check which tiles have resources and are not collected
  const knownTiles = context.memory?.knownTiles || [];
  const hasCollectibleTiles = knownTiles.some(tile => 
    tile?.hasResources && !tile.collected && tile.resources?.total > 0
  );
  
  fsmLogger.info(`[Evaluating] Conditions`, {
    fuel,
    damage,
    needsMaintenance: fuel < 30 || damage > 50,
    hasCollectibleTiles, // ✅ Now uses actual known tiles
    isShipNotFull: !context.vehicle?.isAtCapacity,
    isDroneAvailable,
    explorationQueueLength: context.explorationQueue?.length,
    droneState: context.droneFleet?.drones?.explorer?.visualState,
    knownTilesCount: knownTiles.length
  });
  
  setTimeout(() => {
    if (fuel < 30 || damage > 50) {
      fsmLogger.info(`[Evaluating] → NEED_MAINTENANCE (maintenance needed)`);
      self.send({ type: 'NEED_MAINTENANCE' } as MachineEvents);
    } 
    // ✅ PRIORITY 1: COLLECT before exploring (if collectible tiles exist)
    else if (hasCollectibleTiles && !vehicle?.isAtCapacity) {
      fsmLogger.info(`[Evaluating] → NEED_COLLECTING (collectible tiles available)`, {
        tilesCount: knownTiles.filter(t => t?.hasResources && !t.collected).length
      });
      self.send({ type: 'NEED_COLLECTING' } as MachineEvents);
    }
    // ✅ PRIORITY 2: EXPLORE if no collectible tiles or ship is at capacity
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
