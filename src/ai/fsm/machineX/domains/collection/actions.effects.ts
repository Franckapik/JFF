/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';

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
export const onShipMovingToTileEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🚢 [${context.entityId}] Entrée dans l'état SHIP_MOVING_TO_TILE`);
  // Le déplacement et la détection d'arrivée sont maintenant gérés par le tracker
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
export const onShipCollectingEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`📦 [${context.entityId}] Entrée dans l'état SHIP_COLLECTING`);
  // La simulation de collecte et l'envoi de SHIP_LOAD_RESOURCES sont maintenant gérés par le tracker
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
export const onShipReturningEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🔙 [${context.entityId}] Entrée dans l'état SHIP_RETURNING`);
  // Le retour et la détection d'arrivée à la base sont maintenant gérés par le tracker
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
