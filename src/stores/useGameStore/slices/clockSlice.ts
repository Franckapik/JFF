/**
 * Slice pour la gestion de l'horloge du jeu
 * Contrôle l'état de l'horloge (en marche ou arrêtée)
 */
import fsmLogger from '../../../logger/fsmLogger.ts';
import type { ClockSliceActions, GameStoreType } from '../../../types/stores.d.ts';

const createClockSlice = (set: (updater: (state: GameStoreType) => Partial<GameStoreType>) => void, _get: () => GameStoreType): ClockSliceActions => ({
  // État de base de l'horloge
  isClockRunning: false,
  
  // Actions pour modifier l'état de l'horloge
  setClockRunning: (isRunning: boolean): void => {
    fsmLogger.game(`Clock ${isRunning ? 'started' : 'stopped'}`, { isRunning });
    set((state) => ({ ...state, isClockRunning: isRunning }));
  },
});

export default createClockSlice;
