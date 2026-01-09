/**
 * ==========================================================================
 * USE FSM CONTEXT - Hook unifié pour accéder au contexte FSM d'un bot
 * ==========================================================================
 * 
 * ✅ Phase 4 Migration: Encapsule l'accès au contexte FSM via SharedWorkerStore
 * 
 * Ce hook permet aux composants d'accéder au contexte FSM d'un bot spécifique
 * sans connaître l'implémentation sous-jacente (Worker vs XFSMStore).
 * 
 * Usage:
 * ```tsx
 * const { context, state, isReady, send } = useFSMContext('bot-0');
 * 
 * // Access context data
 * const fuel = context.vehicle?.fuel ?? 100;
 * const exploredTiles = context.memory?.knownTiles ?? [];
 * 
 * // Send events
 * send({ type: 'CLOCK_TOGGLE' });
 * ```
 */

import { useCallback, useMemo } from 'react';

import type { MachineEvents } from '../ai/fsm/machineX/events.pure.v5.ts';
import type { FSMContext, BotId } from '../types/fsm.d.ts';
import { useSharedWorkerStore } from '../stores/useSharedWorkerStore/index.ts';

// Empty context for uninitialized bots - cast to bypass strict typing
const EMPTY_CONTEXT = {
  entityId: '' as BotId,
  memory: { 
    knownTiles: [], 
    knownDangers: [],
    stats: {},
    stateHistory: [],
    transitionHistory: [],
  },
  config: {
    exploringRadius: 1,
    collectingRadius: 1,
    fuelThreshold: 20,
    capacityThreshold: 80,
    movementSpeed: 1,
    explorationInterval: 1000,
    enableLogging: false,
  },
  explorationQueue: [],
  currentPath: [],
  lastAction: null,
  lastEvent: null,
} as unknown as FSMContext;

interface UseFSMContextResult {
  /** Full FSM context for this bot */
  context: FSMContext;
  /** Current state value (e.g., 'idle', 'exploring.deploying') */
  state: unknown;
  /** True if bot is initialized and context is available */
  isReady: boolean;
  /** True if connected to SharedWorker */
  isConnected: boolean;
  /** Send an event to this bot's FSM */
  send: (event: MachineEvents) => void;
}

/**
 * Hook to access FSM context for a specific bot
 * Uses SharedWorkerStore as the single source of truth
 */
export function useFSMContext(botId: BotId): UseFSMContextResult {
  // Get data from SharedWorkerStore
  const botStates = useSharedWorkerStore((state) => state.botStates);
  const isConnected = useSharedWorkerStore((state) => state.isConnected);
  const sendEvent = useSharedWorkerStore((state) => state.sendEvent);
  
  // Extract bot state
  const botState = botStates[botId];
  
  // Memoize context to prevent unnecessary re-renders
  const context = useMemo<FSMContext>(() => {
    if (!botState?.context) return EMPTY_CONTEXT;
    return botState.context as FSMContext;
  }, [botState?.context]);
  
  // Memoize state value
  const state = useMemo(() => {
    return botState?.value ?? 'uninitialized';
  }, [botState?.value]);
  
  // Memoize send function
  const send = useCallback((event: MachineEvents) => {
    sendEvent(botId as 'bot-0' | 'bot-1', event);
  }, [botId, sendEvent]);
  
  // Check if bot is ready (has valid context)
  const isReady = useMemo(() => {
    return !!(botState?.context?.entityId);
  }, [botState?.context?.entityId]);
  
  return {
    context,
    state,
    isReady,
    isConnected,
    send,
  };
}

/**
 * Hook to access FSM context for multiple bots
 */
export function useAllBotsFSMContext(): Record<BotId, UseFSMContextResult> {
  const bot0 = useFSMContext('bot-0');
  const bot1 = useFSMContext('bot-1');
  
  return useMemo(() => ({
    'bot-0': bot0,
    'bot-1': bot1,
  }), [bot0, bot1]);
}

/**
 * Hook to get just the context (for simple reads)
 */
export function useFSMContextOnly(botId: BotId): FSMContext {
  const { context } = useFSMContext(botId);
  return context;
}

/**
 * Hook to get game config from any bot's context
 * (GameConfig is synced across all bots)
 */
export function useGameConfig() {
  const { context, isReady } = useFSMContext('bot-0');
  
  return useMemo(() => ({
    gameConfig: context.gameConfig,
    isReady,
  }), [context.gameConfig, isReady]);
}

export default useFSMContext;
