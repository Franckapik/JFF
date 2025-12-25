/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 */

import type { FSMContext } from '../../../../../types/fsm.d.ts';

/**
 * Action d'entrée de l'état collecting
 */
export const onCollectingEntry = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action de sortie de l'état collecting
 */
export const onCollectingExit = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action d'entrée de l'état ship_moving_to_tile
 */
export const onShipMovingToTileEntry = ({ context: _context }: { context: FSMContext }) => {
  // Le déplacement et la détection d'arrivée sont maintenant gérés par le tracker
};

/**
 * Action de sortie de l'état ship_moving_to_tile
 */
export const onShipMovingToTileExit = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action d'entrée de l'état ship_collecting
 */
export const onShipCollectingEntry = ({ context: _context }: { context: FSMContext }) => {
  // La simulation de collecte et l'envoi de SHIP_LOAD_RESOURCES sont maintenant gérés par le tracker
};

/**
 * Action de sortie de l'état ship_collecting
 */
export const onShipCollectingExit = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action d'entrée de l'état ship_returning
 */
export const onShipReturningEntry = ({ context: _context }: { context: FSMContext }) => {
  // Le retour et la détection d'arrivée à la base sont maintenant gérés par le tracker
};

/**
 * Action de sortie de l'état ship_returning
 */
export const onShipReturningExit = ({ context: _context }: { context: FSMContext }) => {
};

// Placeholder pour éviter les erreurs d'import
export const __collectionEffectsPlaceholder = ({ context: _context }: { context: FSMContext }) => {
};
