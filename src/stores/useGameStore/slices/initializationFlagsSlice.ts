/**
 * ============================================================================
 * INITIALIZATION FLAGS SLICE - Gestion des flags d'initialisation
 * ============================================================================
 * 
 * Ce slice gère les flags d'initialisation du jeu :
 * - État d'initialisation des joueurs
 * - État d'initialisation des bots
 * - Prévention des ré-initialisations
 */
import type { GameStoreType, InitializationFlagsSliceActions } from '../../../types/stores.d.ts';

const createInitializationFlagsSlice = (set: (updater: (state: GameStoreType) => Partial<GameStoreType>) => void, get: () => GameStoreType): InitializationFlagsSliceActions => ({
  
  /* ========================================
   * ÉTATS D'INITIALISATION
   * ======================================== */
  
  // Flags d'initialisation
  playersInitialized: false,
  botsInitialized: false,
  tilesInitialized: false,
  startingTilesAssigned: false,
  fleetPositionsInitialized: {},

  
  /* ========================================
   * ACTIONS D'INITIALISATION
   * ======================================== */
  
  /**
   * Marque les joueurs comme initialisés
   */
  markPlayersAsInitialized: (): void => {
    set((state) => ({ ...state, playersInitialized: true }));
  },
  
  /**
   * Marque les bots comme initialisés
   */
  markBotsAsInitialized: (): void => {
    set((state) => ({ ...state, botsInitialized: true }));
  },
  
  /**
   * Marque les tuiles comme initialisées
   */
  markTilesAsInitialized: (): void => {
    set((state) => ({ ...state, tilesInitialized: true }));
  },

  /**
   * Marque les tuiles de départ comme assignées
   */
  markStartingTilesAsAssigned: (): void => {
    set((state) => ({ ...state, startingTilesAssigned: true }));
  },

  /**
   * Marque les positions de fleet comme initialisées pour un bot donné
   */
  markFleetPositionsAsInitialized: (botId: string): void => {
    const { fleetPositionsInitialized } = get();
    set((state) => ({ 
      ...state,
      fleetPositionsInitialized: {
        ...fleetPositionsInitialized,
        [botId]: true
      }
    }));
  },

  /**
   * Vérifie si les positions de fleet sont initialisées pour un bot
   */
  isFleetPositionsInitialized: (botId: string): boolean => {
    const { fleetPositionsInitialized } = get();
    return fleetPositionsInitialized[botId] || false;
  },  
  
  /**
   * Vérifie si le jeu est complètement initialisé
   * @returns True si tout est initialisé
   */
  isGameInitialized: (): boolean => {
    const { playersInitialized, botsInitialized, tilesInitialized, startingTilesAssigned } = get();
    const isInitialized = playersInitialized && botsInitialized && tilesInitialized && startingTilesAssigned;
    return isInitialized;
  },
});

export default createInitializationFlagsSlice;
