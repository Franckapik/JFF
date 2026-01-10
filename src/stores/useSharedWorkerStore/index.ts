/**
 * ==========================================================================
 * USE SHARED WORKER STORE - Hook pour se connecter au SharedWorker FSM
 * ==========================================================================
 * 
 * Ce store Zustand se connecte au SharedWorker et synchronise l'état FSM
 * pour toutes les vues (vue1, vue2).
 * 
 * Utilisation:
 * ```tsx
 * import { useSharedWorkerStore } from '../stores/useSharedWorkerStore';
 * 
 * function MyComponent() {
 *   const { botStates, instanceId, updateCounter, isConnected } = useSharedWorkerStore();
 *   // ...
 * }
 * ```
 */

import { create } from 'zustand';

import type { FSMContext } from '../../types/fsm.d.ts';
import type { MachineEvents } from '../../ai/fsm/machineX/events.pure.v5.ts';

// =========================================================================
// TYPES
// =========================================================================

type BotId = 'bot-0' | 'bot-1';

interface BotState {
  value: unknown;
  context: FSMContext;
  status: string;
}

interface WorkerResponse {
  type: 'STATE_UPDATE' | 'INIT_COMPLETE' | 'CONNECTED' | 'ERROR';
  instanceId: string;
  updateCounter: number;
  botStates: Record<BotId, BotState>;
  activeBots: BotId[];
  timestamp: number;
}

interface SharedWorkerStoreState {
  // Connection state
  isConnected: boolean;
  isInitialized: boolean;
  
  // Synchronization proof
  instanceId: string;
  updateCounter: number;
  lastUpdateTimestamp: number;
  
  // Bot states (synced from worker)
  botStates: Record<BotId, BotState>;
  activeBots: BotId[];
  
  // Worker reference
  worker: SharedWorker | null;
  port: MessagePort | null;
}

interface SharedWorkerStoreActions {
  // Connection
  connect: () => void;
  disconnect: () => void;
  
  // Initialize game (send tiles to worker)
  initGame: (tiles: Record<string, unknown>) => void;
  
  // Send event to bot
  sendEvent: (botId: BotId, event: MachineEvents) => void;
  
  // Request current state
  requestState: () => void;
  
  // Reset game (reinitialize bots without killing worker)
  resetGame: () => void;
}

type SharedWorkerStore = SharedWorkerStoreState & SharedWorkerStoreActions;

// =========================================================================
// STORE
// =========================================================================

export const useSharedWorkerStore = create<SharedWorkerStore>((set, get) => {
  // =========================================================================
  // MESSAGE HANDLER
  // =========================================================================
  
  const handleWorkerMessage = (event: MessageEvent<WorkerResponse>) => {
    const data = event.data;
    
    switch (data.type) {
      case 'CONNECTED':
        console.log(`🔌 [STORE] Connected to worker. Instance: ${data.instanceId}`);
        set({
          isConnected: true,
          instanceId: data.instanceId,
          updateCounter: data.updateCounter,
          botStates: data.botStates,
          activeBots: data.activeBots,
          lastUpdateTimestamp: data.timestamp
        });
        break;
        
      case 'INIT_COMPLETE':
        console.log(`✅ [STORE] Game initialized in worker`);
        set({
          isInitialized: true,
          instanceId: data.instanceId,
          updateCounter: data.updateCounter,
          activeBots: data.activeBots,
          lastUpdateTimestamp: data.timestamp
        });
        break;
        
      case 'STATE_UPDATE':
        set({
          instanceId: data.instanceId,
          updateCounter: data.updateCounter,
          botStates: data.botStates,
          activeBots: data.activeBots,
          lastUpdateTimestamp: data.timestamp
        });
        break;
        
      case 'ERROR':
        console.error('[STORE] Worker error:', data);
        break;
    }
  };
  
  // =========================================================================
  // INITIAL STATE
  // =========================================================================
  
  const initialState: SharedWorkerStoreState = {
    isConnected: false,
    isInitialized: false,
    instanceId: '',
    updateCounter: 0,
    lastUpdateTimestamp: 0,
    botStates: {} as Record<BotId, BotState>,
    activeBots: [],
    worker: null,
    port: null
  };
  
  // =========================================================================
  // ACTIONS
  // =========================================================================
  
  const actions: SharedWorkerStoreActions = {
    connect: () => {
      const state = get();
      if (state.worker) {
        console.log('[STORE] Already connected');
        return;
      }
      
      try {
        console.log('🔌 [STORE] Creating SharedWorker...');
        
        // Create SharedWorker connection with correct path
        // Note: The path must be relative to this file's location
        const workerUrl = new URL('../../workers/fsm-shared-worker.ts', import.meta.url);
        console.log('🔌 [STORE] Worker URL:', workerUrl.href);
        
        const worker = new SharedWorker(
          workerUrl,
          { type: 'module', name: 'fsm-shared-worker' }
        );
        
        // Handle worker errors
        worker.onerror = (e) => {
          console.error('❌ [STORE] SharedWorker error:', e);
          console.error('❌ [STORE] Error message:', e.message);
          set({ isConnected: false });
        };
        
        const port = worker.port;
        
        port.onmessage = handleWorkerMessage;
        port.onmessageerror = (e) => {
          console.error('[STORE] Message error:', e);
        };
        
        port.start();
        
        set({ worker, port });
        
        // Request connection acknowledgment
        port.postMessage({ type: 'CONNECT' });
        
        console.log('🔌 [STORE] Connecting to SharedWorker...');
      } catch (error) {
        console.error('[STORE] Failed to connect to SharedWorker:', error);
        set({ isConnected: false });
      }
    },
    
    disconnect: () => {
      const state = get();
      if (state.port) {
        state.port.close();
      }
      set({
        worker: null,
        port: null,
        isConnected: false,
        isInitialized: false
      });
      console.log('🔌 [STORE] Disconnected from SharedWorker');
    },
    
    initGame: (tiles: Record<string, unknown>) => {
      const state = get();
      if (!state.port) {
        console.error('[STORE] Cannot init game: not connected');
        return;
      }
      
      state.port.postMessage({
        type: 'INIT',
        tiles
      });
      
      console.log('🎮 [STORE] Initializing game in worker...');
    },
    
    sendEvent: (botId: BotId, event: MachineEvents) => {
      const state = get();
      if (!state.port) {
        console.error('[STORE] Cannot send event: not connected');
        return;
      }
      
      state.port.postMessage({
        type: 'SEND_EVENT',
        botId,
        event
      });
    },
    
    requestState: () => {
      const state = get();
      if (!state.port) return;
      
      state.port.postMessage({ type: 'REQUEST_STATE' });
    },
    
    resetGame: () => {
      const state = get();
      if (!state.port) {
        console.error('[STORE] Cannot reset game: not connected');
        return;
      }
      
      console.log('🔄 [STORE] Sending reset command to worker...');
      const message = { type: 'RESET' };
      console.log('🔄 [STORE] Message content:', message);
      state.port.postMessage(message);
    }
  };
  
  return {
    ...initialState,
    ...actions
  };
});

export default useSharedWorkerStore;
