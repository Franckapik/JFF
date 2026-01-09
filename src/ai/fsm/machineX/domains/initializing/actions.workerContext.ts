/**
 * ==========================================================================
 * WORKER CONTEXT INITIALIZATION - Actions for SharedWorker
 * ==========================================================================
 * 
 * This module provides actions to initialize FSM context in the SharedWorker.
 * It bridges the gap between the initial botContext passed to createActor
 * and the FSM's internal context.
 */

import { assign } from 'xstate';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

// Global map to store initial contexts (set by the worker before starting actors)
// This is a workaround for XState v5's lack of native input support
export const botInitialContexts = new Map<string, FSMContext>();

/**
 * Action: Initialize bot context from the stored initial context
 * 
 * This action runs in onInitializingEntry and merges the bot-specific
 * initial context (with gridInfo.tiles and memory.knownTiles) into
 * the FSM's context.
 * 
 * ✅ Usage: Call this in the machine's initializing.entry before other actions
 */
export const initializeBotContextFromWorker = assign<FSMContext, MachineEvents, object, MachineEvents, never>(
  ({ context }: { context: FSMContext; event: MachineEvents }) => {
    // Try to get the initial context for this bot
    // The botId is stored in context.entityId
    const botId = context.entityId;
    const initialContext = botInitialContexts.get(botId);
    
    if (!initialContext) {
      console.warn(`⚠️ [initializeBotContextFromWorker] No initial context found for bot ${botId}`);
      return {};
    }
    
    console.log(`✅ [initializeBotContextFromWorker] Merging initial context for ${botId}`, {
      hasGridInfo: !!initialContext.gridInfo,
      tilesCount: Object.keys(initialContext.gridInfo?.tiles || {}).length,
      hasKnownTiles: !!initialContext.memory?.knownTiles,
      knownTilesCount: initialContext.memory?.knownTiles?.length,
    });
    
    // Return the merged context
    return {
      ...initialContext,
      // Preserve any context properties that were already set
      entityId: context.entityId,
      fsmState: context.fsmState,
    };
  }
);
