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
  fsmLogger.info(`[Evaluating] Conditions`, {
    fuel,
    damage,
    needsMaintenance: fuel < 30 || damage > 50,
    hasCollectibleTiles: false,
    isShipNotFull: !context.vehicle?.isAtCapacity,
    isDroneAvailable,
    explorationQueueLength: context.explorationQueue?.length,
    droneState: context.droneFleet?.drones?.explorer?.visualState
  });
  setTimeout(() => {
    if (fuel < 30 || damage > 50) {
      fsmLogger.info(`[Evaluating] → NEED_MAINTENANCE (maintenance needed)`);
      self.send({ type: 'NEED_MAINTENANCE' } as MachineEvents);
    } else {
      // Tester d'abord l'exploration avec le guard shouldExplore
      self.send({ type: 'NEED_EXPLORING' } as MachineEvents);
      
      // Si shouldExplore échoue ET que le drone n'est pas en cours d'exploration,
      // alors tester la collecte après un délai
      const isDroneExploring = context.droneFleet?.drones?.explorer?.visualState === 'deploying' || 
                              context.droneFleet?.drones?.explorer?.visualState === 'scanning' ||
                              context.droneFleet?.drones?.explorer?.visualState === 'returning';
      
      if (!isDroneExploring) {
        setTimeout(() => {
          fsmLogger.info(`[Evaluating] → Testing NEED_COLLECTING (exploration may be complete)`);
          self.send({ type: 'NEED_COLLECTING' } as MachineEvents);
        }, 50);
      }
    }
  }, 100);
};

/**
 * Action de sortie de l'état evaluating : simple log
 */
export const onEvaluatingExit = ({ context: _context }: { context: FSMContext }) => {
};
