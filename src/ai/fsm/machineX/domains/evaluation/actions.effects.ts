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
  const isDroneAvailable = context.droneFleet?.drones?.explorer?.state === 'docked';
  fsmLogger.info(`[Evaluating] Conditions`, {
    fuel,
    damage,
    needsMaintenance: fuel < 30 || damage > 50,
    hasCollectibleTiles: false,
    isShipNotFull: !context.vehicle?.isAtCapacity,
    isDroneAvailable,
    explorationQueueLength: context.explorationQueue?.length,
    droneState: context.droneFleet?.drones?.explorer?.state
  });
  setTimeout(() => {
    if (fuel < 30 || damage > 50) {
      fsmLogger.info(`[Evaluating] → NEED_MAINTENANCE (maintenance needed)`);
      self.send({ type: 'NEED_MAINTENANCE' } as MachineEvents);
    //} else if (isDroneAvailable && !context.vehicle?.isAtCapacity) { TODO : l'état du drone reste à uninitialized
    } else if (1) {
      fsmLogger.info(`[Evaluating] → NEED_EXPLORING (need more exploration)`);
      self.send({ type: 'NEED_EXPLORING' } as MachineEvents);
    } else {
    }
  }, 100);
};

/**
 * Action de sortie de l'état evaluating : simple log
 */
export const onEvaluatingExit = ({ context: _context }: { context: FSMContext }) => {
  fsmLogger.action('onEvaluatingExit');
};
