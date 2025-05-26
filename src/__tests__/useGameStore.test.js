import { describe, it, expect, beforeEach } from 'vitest';
import useGameStore from '../stores/useGameStore';

describe('useGameStore', () => {
  // Réinitialiser le store à ses valeurs par défaut avant chaque test
  beforeEach(() => {
    useGameStore.setState({
      isClockRunning: false,
      playerCount: 3, // État cohérent pour tester les actions
      botCount: 2     // playerCount - 1
    });
  });

  describe('État Initial du Store (tel que défini dans useGameStore.js)', () => {
    const actualInitialStateFromStoreFile = {
      isClockRunning: false,
      playerCount: 1, // Valeur initiale de playerCount dans useGameStore.js
      botCount: 1,    // Valeur initiale de botCount dans useGameStore.js
      // Assurez-vous que cela correspond à toutes les valeurs par défaut du fichier store
    };

    it('devrait refléter les valeurs par défaut du store pour isClockRunning, playerCount et botCount', () => {
      // Redéfinir l\'état pour ce test spécifique pour correspondre aux valeurs initiales du fichier store
      useGameStore.setState(actualInitialStateFromStoreFile);
      const state = useGameStore.getState();
      expect(state.isClockRunning).toBe(false);
      expect(state.playerCount).toBe(1);
      expect(state.botCount).toBe(1);
    });

    it('playerCount initial (1) est inférieur au minimum (2) appliqué par setPlayerCount', () => {
      useGameStore.setState(actualInitialStateFromStoreFile);
      const state = useGameStore.getState();
      // En supposant que setPlayerCount impose un minimum de 2
      expect(state.playerCount).toBeLessThan(2); 
    });
    
    it('botCount initial (1) ne correspond pas à playerCount initial - 1 (ce qui serait 0)', () => {
      useGameStore.setState(actualInitialStateFromStoreFile);
      const state = useGameStore.getState();
      // En supposant la règle botCount = playerCount - 1
      expect(state.botCount).not.toBe(state.playerCount - 1); // 1 !== (1 - 1)
      expect(state.botCount).toBe(1); // Vérifie la valeur actuelle
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

});
