/**
 * Slice pour la gestion de l'horloge du jeu
 * Contrôle l'état de l'horloge (en marche ou arrêtée)
 */
import fsmLogger from '../../../logger/fsmLogger.ts';

const createClockSlice = (set) => ({
  // État de base de l'horloge
  isClockRunning: false,
  
  // Actions pour modifier l'état de l'horloge
  setClockRunning: (isRunning) => {
    fsmLogger.game(`Clock ${isRunning ? 'started' : 'stopped'}`, { isRunning });
    set({ isClockRunning: isRunning });
  },
});

export default createClockSlice;
