/**
 * Slice pour la configuration du nombre de joueurs
 * Gère le nombre de joueurs humains et de bots
 */
import type { GameStoreType, PlayerCountSliceActions } from '../../../types/stores.d.ts';

const createPlayerCountSlice = (set: (updater: (state: GameStoreType) => Partial<GameStoreType>) => void, _get: () => GameStoreType): PlayerCountSliceActions => ({
  // Configuration des joueurs
  playerCount: 1, // Nombre de joueurs humains
  botCount: 1,    // Nombre de bots
  
  // Action pour mettre à jour le nombre de joueurs
  setPlayerCount: (count: number): void => {
    // Assurer que le nombre de joueurs est valide (minimum 1)
    const validCount = Math.max(1, count);
    set((state) => ({ 
      ...state,
      playerCount: validCount,
    }));
  },
  
  // Action pour mettre à jour le nombre de bots
  setBotCount: (count: number): void => {
    // Assurer que le nombre de bots est valide (minimum 0)
    const validCount = Math.max(0, count);
    set((state) => ({ 
      ...state,
      botCount: validCount,
    }));
  },
});

export default createPlayerCountSlice;
