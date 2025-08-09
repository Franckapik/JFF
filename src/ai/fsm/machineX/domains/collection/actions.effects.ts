/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 */

import type { ActorRef } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5';

/**
 * Action d'entrée de l'état collecting
 */
export const onCollectingEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`📦 [${context.entityId}] Entrée dans l'état COLLECTING`);
};

/**
 * Action de sortie de l'état collecting
 */
export const onCollectingExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`📦 [${context.entityId}] Sortie de l'état COLLECTING`);
};

/**
 * Action d'entrée de l'état ship_moving_to_tile
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onShipMovingToTileEntry = ({ context, self }: { context: FSMContext, self: ActorRef<any, MachineEvents> }) => {
  fsmLogger.action(`🚢 [${context.entityId}] Entrée dans l'état SHIP_MOVING_TO_TILE`);
  
  // Simule le déplacement du vaisseau (à adapter selon la logique métier)
  setTimeout(() => {
    fsmLogger.action(`🚢 [${context.entityId}] Vaisseau arrivé à destination, envoi de SHIP_REACHES_TILE`);
    self.send({ type: 'SHIP_REACHES_TILE' });
  }, 3000); // 3 secondes de déplacement simulé
};

/**
 * Action de sortie de l'état ship_moving_to_tile
 */
export const onShipMovingToTileExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🚢 [${context.entityId}] Sortie de l'état SHIP_MOVING_TO_TILE`);
};

/**
 * Action d'entrée de l'état ship_collecting
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onShipCollectingEntry = ({ context, self }: { context: FSMContext, self: ActorRef<any, MachineEvents> }) => {
  fsmLogger.action(`📦 [${context.entityId}] Entrée dans l'état SHIP_COLLECTING`);
  
  // Simule la collecte de ressources (à adapter selon la logique métier)
  setTimeout(() => {
    fsmLogger.action(`📦 [${context.entityId}] Collecte terminée, envoi de SHIP_LOAD_RESOURCES`);
    self.send({ type: 'SHIP_LOAD_RESOURCES' });
  }, 2000); // 2 secondes de collecte simulée
};

/**
 * Action de sortie de l'état ship_collecting
 */
export const onShipCollectingExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`📦 [${context.entityId}] Sortie de l'état SHIP_COLLECTING`);
};

/**
 * Action d'entrée de l'état ship_returning
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onShipReturningEntry = ({ context, self }: { context: FSMContext, self: ActorRef<any, MachineEvents> }) => {
  fsmLogger.action(`🔙 [${context.entityId}] Entrée dans l'état SHIP_RETURNING`);
  
  // Simule le retour à la base (à adapter selon la logique métier)
  setTimeout(() => {
    fsmLogger.action(`🔙 [${context.entityId}] Vaisseau arrivé à la base, envoi de SHIP_REACHES_BASE`);
    self.send({ type: 'SHIP_REACHES_BASE' });
  }, 3000); // 3 secondes de retour simulé
};

/**
 * Action de sortie de l'état ship_returning
 */
export const onShipReturningExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🔙 [${context.entityId}] Sortie de l'état SHIP_RETURNING`);
};

// Placeholder pour éviter les erreurs d'import
export const __collectionEffectsPlaceholder = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🎭 [${context.entityId}] Collection effects placeholder`);
};
