/**
 * ==========================================================================
 * EVALUATION DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 * 
 * CONVENTION : on[State][Event]
 * Actions pour effets de bord (logging, API calls, notifications)
 */

import type { ActorRef } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5';

/**
 * Action d'entrée de l'état evaluating : logique de décision prioritaire
 * Envoie un événement selon la situation du contexte
 */
export const onEvaluatingEntry = ({ context, self }: { context: FSMContext, self: ActorRef<any, MachineEvents> }) => {
  fsmLogger.action('onEvaluatingEntry');
  
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
      fsmLogger.info(`[Evaluating] → Testing NEED_EXPLORING`);
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
  fsmLogger.action('onEvaluatingExit');
};
