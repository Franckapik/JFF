
import { initializeBotContextFromWorker as initializeBotContextFromWorkerImpl } from './actions.workerContext.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';

/**
 * ✅ NEW: Initialize bot context from worker (wrapper export)
 * This action merges the bot-specific initial context into the FSM context
 * Used only in SharedWorker environments
 */
export const initializeBotContextFromWorker = initializeBotContextFromWorkerImpl;

/**
 * Action d'entrée de l'état initializing
 */
export const onInitializingEntry = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action de sortie de l'état initializing
 */
export const onInitializingExit = ({ context: _context }: { context: FSMContext }) => {
};

