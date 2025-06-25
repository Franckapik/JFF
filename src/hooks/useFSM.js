import { useCentralFSMStore } from '../stores/useCentralFSMStore';

/**
 * Hook pour accéder facilement à l'état et aux actions de la machine FSM centrale
 */
export function useFSM() {
  const fsmState = useCentralFSMStore((state) => state.fsm);
  const send = useCentralFSMStore((state) => state.send);
  return { fsmState, send };
}
