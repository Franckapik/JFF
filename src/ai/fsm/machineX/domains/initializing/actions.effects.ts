
import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';

/**
 * Action d'entrée de l'état initializing
 */
export const onInitializingEntry = ({ context }: { context: FSMContext }) => {
	fsmLogger.action(`🟢 [${context.entityId}] Entrée dans l'état INITIALIZING`);
};

/**
 * Action de sortie de l'état initializing
 */
export const onInitializingExit = ({ context }: { context: FSMContext }) => {
	fsmLogger.action(`🟢 [${context.entityId}] Sortie de l'état INITIALIZING`);
};

