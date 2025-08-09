/**
 * ==========================================================================
 * EXPLORATION DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 */


import type { ActorRef } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5';

/**
 * Action d'entrée de l'état exploring
 */
export const onExploringEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🔍 [${context.entityId}] Entrée dans l'état EXPLORING`);
};

/**
 * Action de sortie de l'état exploring
 */
export const onExploringExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🔍 [${context.entityId}] Sortie de l'état EXPLORING`);
};

/**
 * Action d'entrée de l'état drone_deploying
 */
export const onDroneDeployingEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🚁 [${context.entityId}] Entrée dans l'état DRONE_DEPLOYING`);
};

/**
 * Action de sortie de l'état drone_deploying
 */
export const onDroneDeployingExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🚁 [${context.entityId}] Sortie de l'état DRONE_DEPLOYING`);
};

/**
 * Action d'entrée de l'état drone_scanning
 */

export const onDroneScanningEntry = ({ context, self }: { context: FSMContext, self: ActorRef<any, MachineEvents> }) => {
  fsmLogger.action(`📡 [${context.entityId}] Entrée dans l'état DRONE_SCANNING`);
  // Simule un scan de 2 secondes (à adapter selon la logique métier)
  setTimeout(() => {
    fsmLogger.action(`📡 [${context.entityId}] Scan terminé, envoi de DRONE_HAS_SCANNED`);
    self.send({ type: 'DRONE_HAS_SCANNED' });
  }, 2000);
};

/**
 * Action de sortie de l'état drone_scanning
 */
export const onDroneScanningExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`📡 [${context.entityId}] Sortie de l'état DRONE_SCANNING`);
};

/**
 * Action d'entrée de l'état drone_returning
 */
export const onDroneReturningEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🔙 [${context.entityId}] Entrée dans l'état DRONE_RETURNING`);
};

/**
 * Action de sortie de l'état drone_returning
 */
export const onDroneReturningExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🔙 [${context.entityId}] Sortie de l'état DRONE_RETURNING`);
};

