import type { MachineEvents } from '../ai/fsm/machineX/events.pure.v5.ts';
import type { FSMContext } from './fsm.d.ts';

export type WorkerBotId = 'bot-0' | 'bot-1';

export interface WorkerBotState {
  value: unknown;
  context: FSMContext;
  status: string;
}

export type WorkerRequest =
  | { type: 'CONNECT' | 'DISCONNECT' | 'INIT' | 'REQUEST_STATE' }
  | { type: 'RESET'; gameId: string | null }
  | { type: 'SEND_EVENT'; gameId: string | null; botId: WorkerBotId; event: MachineEvents };

export interface WorkerResponse {
  type: 'STATE_UPDATE' | 'INIT_COMPLETE' | 'CONNECTED' | 'ERROR';
  instanceId: string;
  gameId: string | null;
  mapSeed: number | null;
  isInitialized: boolean;
  updateCounter: number;
  botStates: Record<WorkerBotId, WorkerBotState>;
  activeBots: WorkerBotId[];
  timestamp: number;
  errorMessage?: string;
}