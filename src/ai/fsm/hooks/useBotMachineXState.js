import { useMachine } from '@xstate/react';
import fsmBotMachine from '../machine/fsmBotMachine.xstate';

/**
 * Hook XState pour un bot FSM
 * @param {object} [options] - options.context pour initialiser le contexte
 * @returns {[state, send, service]}
 */
export function useBotMachineXState(options = {}) {
  // On pourra enrichir le contexte plus tard (actions, guards, etc.)
  const [state, send, service] = useMachine(fsmBotMachine, options);
  return [state, send, service];
}

export default useBotMachineXState;
