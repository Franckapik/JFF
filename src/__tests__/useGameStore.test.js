import { describe, it, expect, beforeEach } from 'vitest';
import useGameStore from '../stores/useGameStore';

describe('useGameStore', () => {
  // Réinitialiser le store à ses valeurs par défaut avant chaque test
  beforeEach(() => {
    useGameStore.setState({
      isClockRunning: false,
      playerCount: 3,
      botCount: 2
    });
  });

  describe('setClockRunning', () => {
    it('devrait mettre isClockRunning à true', () => {
      expect(useGameStore.getState().isClockRunning).toBe(false);
      useGameStore.getState().setClockRunning(true);
      expect(useGameStore.getState().isClockRunning).toBe(true);
    });

    it('devrait mettre isClockRunning à false', () => {
      // D'abord mettre à true
      useGameStore.getState().setClockRunning(true);
      expect(useGameStore.getState().isClockRunning).toBe(true);
      
      // Puis tester le passage à false
      useGameStore.getState().setClockRunning(false);
      expect(useGameStore.getState().isClockRunning).toBe(false);
    });
  });

  describe('setPlayerCount', () => {
    it('devrait mettre à jour playerCount et botCount avec une valeur valide', () => {
      useGameStore.getState().setPlayerCount(4);
      const state = useGameStore.getState();
      expect(state.playerCount).toBe(4);
      expect(state.botCount).toBe(3); // botCount = playerCount - 1
    });

    it('devrait limiter playerCount au minimum de 2', () => {
      useGameStore.getState().setPlayerCount(1); // Essaie de mettre en dessous du minimum
      const state = useGameStore.getState();
      expect(state.playerCount).toBe(2); // Devrait être limité à 2
      expect(state.botCount).toBe(1);    // Devrait être playerCount - 1
    });

    it('devrait limiter playerCount au maximum de 4', () => {
      useGameStore.getState().setPlayerCount(6); // Essaie de mettre au-dessus du maximum
      const state = useGameStore.getState();
      expect(state.playerCount).toBe(4); // Devrait être limité à 4
      expect(state.botCount).toBe(3);    // Devrait être playerCount - 1
    });

    it('devrait gérer correctement les valeurs à la limite', () => {
      // Tester avec la valeur min exacte
      useGameStore.getState().setPlayerCount(2);
      expect(useGameStore.getState().playerCount).toBe(2);
      expect(useGameStore.getState().botCount).toBe(1);
      
      // Tester avec la valeur max exacte
      useGameStore.getState().setPlayerCount(4);
      expect(useGameStore.getState().playerCount).toBe(4);
      expect(useGameStore.getState().botCount).toBe(3);
    });
  });
});
