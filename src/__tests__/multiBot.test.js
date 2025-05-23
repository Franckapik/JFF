import { describe, it, expect, beforeEach, vi } from 'vitest';
import useBotStore from '../stores/useBotStore';
import useGameStore from '../stores/useGameStore';
import usePlayerStore from '../stores/playerStore';
import { getBotPlayerId } from '../ai/constants/playerConstants';

// Mock the dependent stores
vi.mock('../stores/useGameStore', () => ({
  default: vi.fn(() => ({
    botCount: 3
  })),
  getState: vi.fn(() => ({
    botCount: 3
  }))
}));

vi.mock('../stores/playerStore', () => ({
  default: {
    getState: vi.fn(() => ({
      players: {
        player2: { vehicles: { ship: { fuel: 100, coord: [0, 0] } } },
        player3: { vehicles: { ship: { fuel: 90, coord: [1, 1] } } },
        player4: { vehicles: { ship: { fuel: 80, coord: [2, 2] } } }
      },
      updateVehicle: vi.fn()
    }))
  }
}));

describe('MultiBotSystem', () => {
  let store;
  
  beforeEach(() => {
    // Clear and reset the store before each test
    store = useBotStore.getState();
    store._test.resetState();
  });

  it('should initialize the bot store with default values', () => {
    const state = useBotStore.getState();
    expect(state.botState).toBe('idle');
    expect(state.isRunning).toBe(false);
    expect(state.currentBotIndex).toBe(0);
    expect(state.currentBotId).toBe('player2');
    expect(state.actionQueue).toEqual([]);
  });

  it('should switch between bots correctly', () => {
    const store = useBotStore.getState();
    
    // Initial state
    expect(store.currentBotIndex).toBe(0);
    expect(store.currentBotId).toBe('player2');
    
    // Switch to bot 1
    store.switchActiveBot(1);
    expect(store.currentBotIndex).toBe(1);
    expect(store.currentBotId).toBe('player3');
    
    // Switch to bot 2
    store.switchActiveBot(2);
    expect(store.currentBotIndex).toBe(2);
    expect(store.currentBotId).toBe('player4');
    
    // Switch back to bot 0
    store.switchActiveBot(0);
    expect(store.currentBotIndex).toBe(0);
    expect(store.currentBotId).toBe('player2');
  });

  it('should maintain separate state for different bots', () => {
    const store = useBotStore.getState();
    
    // Setup: initialize different states for different bots
    store.switchActiveBot(0);
    store.changeState('exploring');
    store.addAction('moveToRandomTile', 2); // Add action to bot 0
    
    store.switchActiveBot(1);
    store.changeState('collecting');
    store.addAction('collectResource', 2); // Add action to bot 1
    
    // Verify that switching back restores the correct state
    store.switchActiveBot(0);
    expect(store.botState).toBe('exploring');
    expect(store.actionQueue.length).toBe(1);
    expect(store.actionQueue[0].type).toBe('moveToRandomTile');
    
    store.switchActiveBot(1);
    expect(store.botState).toBe('collecting');
    expect(store.actionQueue.length).toBe(1);
    expect(store.actionQueue[0].type).toBe('collectResource');
  });

  it('should process all bots in parallel mode', () => {
    const store = useBotStore.getState();
    const processBotSpy = vi.spyOn(store, 'processBot');
    
    // Start processing
    store.toggleBotProcessing(); // Start processing
    
    // Process all bots
    store.processAllBots();
    
    // Check that processBot was called for each bot
    expect(processBotSpy).toHaveBeenCalledTimes(3);
  });
});
