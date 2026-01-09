/**
 * ==========================================================================
 * USE BOT STATE - Hook de compatibilité pour la migration Phase 4
 * ==========================================================================
 * 
 * ✅ Phase 4 Migration: Abstraction pour accéder aux états des bots
 * 
 * Ce hook fournit une interface unifiée pour accéder aux états des bots,
 * permettant de basculer entre useXFSMStore (legacy) et useSharedWorkerStore (target)
 * via un flag de configuration.
 * 
 * Usage (remplace useXFSMStore directement):
 * ```tsx
 * // Avant:
 * const botStates = useXFSMStore((state) => state.botStates);
 * const ctx = botStates['bot-0']?.context;
 * 
 * // Après:
 * const { botStates, getBotContext } = useBotState();
 * const ctx = getBotContext('bot-0');
 * ```
 */

import { useMemo, useCallback } from 'react';

import type { FSMContext, BotId, BotStatesMap } from '../types/fsm.d.ts';
import { useSharedWorkerStore } from '../stores/useSharedWorkerStore/index.ts';
import useXFSMStore from '../stores/useXFSMStore/index.ts';

// =========================================================================
// CONFIGURATION - Toggle source during migration
// =========================================================================

/**
 * Migration flag:
 * - 'xfsm': Use legacy useXFSMStore (current default)
 * - 'worker': Use useSharedWorkerStore (target)
 * - 'auto': Use worker if connected, fallback to xfsm
 */
type DataSource = 'xfsm' | 'worker' | 'auto';

// ✅ Phase 4: Default to 'auto' for gradual migration
const DEFAULT_DATA_SOURCE: DataSource = 'auto';

// =========================================================================
// HOOK
// =========================================================================

interface UseBotStateResult {
  /** Map of bot states (same structure as useXFSMStore.botStates) */
  botStates: BotStatesMap;
  /** Get context for a specific bot */
  getBotContext: (botId: BotId) => FSMContext | null;
  /** Get state value for a specific bot */
  getBotStateValue: (botId: BotId) => unknown;
  /** True if data is available */
  isReady: boolean;
  /** Current data source being used */
  dataSource: DataSource;
}

/**
 * Unified hook to access bot states during migration
 */
export function useBotState(source: DataSource = DEFAULT_DATA_SOURCE): UseBotStateResult {
  // Get data from both stores
  const xfsmBotStates = useXFSMStore((state) => state.botStates);
  const workerBotStates = useSharedWorkerStore((state) => state.botStates);
  const workerConnected = useSharedWorkerStore((state) => state.isConnected);
  
  // Determine which source to use
  const effectiveSource = useMemo<DataSource>(() => {
    if (source === 'auto') {
      // Use worker if connected AND has data, otherwise fallback to xfsm
      const hasWorkerData = workerConnected && Object.keys(workerBotStates || {}).length > 0;
      return hasWorkerData ? 'worker' : 'xfsm';
    }
    return source;
  }, [source, workerConnected, workerBotStates]);
  
  // Select bot states based on source
  const botStates = useMemo<BotStatesMap>(() => {
    if (effectiveSource === 'worker') {
      return workerBotStates as BotStatesMap;
    }
    return xfsmBotStates;
  }, [effectiveSource, workerBotStates, xfsmBotStates]);
  
  // Helper to get bot context
  const getBotContext = useCallback((botId: BotId): FSMContext | null => {
    const state = botStates[botId];
    if (!state) return null;
    // Check if it's a valid snapshot with context
    if ('context' in state && state.context) {
      return state.context as FSMContext;
    }
    return null;
  }, [botStates]);
  
  // Helper to get state value
  const getBotStateValue = useCallback((botId: BotId): unknown => {
    const state = botStates[botId];
    if (!state) return 'uninitialized';
    if ('value' in state) return state.value;
    return 'uninitialized';
  }, [botStates]);
  
  // Check if ready
  const isReady = useMemo(() => {
    return Object.keys(botStates || {}).length > 0;
  }, [botStates]);
  
  return {
    botStates,
    getBotContext,
    getBotStateValue,
    isReady,
    dataSource: effectiveSource,
  };
}

/**
 * Simple hook to get just botStates (drop-in replacement for useXFSMStore selector)
 */
export function useBotStates(): BotStatesMap {
  const { botStates } = useBotState();
  return botStates;
}

/**
 * ✅ Phase 5: Hook to get active bots list
 * Works with both useXFSMStore and useSharedWorkerStore
 */
export function useActiveBots(): BotId[] {
  const xfsmActiveBots = useXFSMStore((state) => state.activeBots);
  const workerActiveBots = useSharedWorkerStore((state) => state.activeBots);
  const workerConnected = useSharedWorkerStore((state) => state.isConnected);
  
  return useMemo(() => {
    // Use worker if connected and has data
    if (workerConnected && workerActiveBots && workerActiveBots.length > 0) {
      return workerActiveBots as BotId[];
    }
    return xfsmActiveBots;
  }, [workerConnected, workerActiveBots, xfsmActiveBots]);
}

export default useBotState;
