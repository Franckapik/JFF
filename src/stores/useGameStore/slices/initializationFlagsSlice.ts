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
import fsmLogger from '../../../logger/fsmLogger.ts';
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
    fsmLogger.game('Players initialized');
    set((state) => ({ ...state, playersInitialized: true }));
  },
  
  /**
   * Marque les bots comme initialisés
   */
  markBotsAsInitialized: (): void => {
    fsmLogger.game('Bots initialized');
    set((state) => ({ ...state, botsInitialized: true }));
  },
  
  /**
   * Marque les tuiles comme initialisées
   */
  markTilesAsInitialized: (): void => {
    fsmLogger.game('Tiles initialized');
    set((state) => ({ ...state, tilesInitialized: true }));
  },

  /**
   * Marque les tuiles de départ comme assignées
   */
  markStartingTilesAsAssigned: (): void => {
    fsmLogger.game('Starting tiles assigned');
    set((state) => ({ ...state, startingTilesAssigned: true }));
  },

  /**
   * Marque les positions de fleet comme initialisées pour un bot donné
   */
  markFleetPositionsAsInitialized: (botId: string): void => {
    const { fleetPositionsInitialized } = get();
    fsmLogger.game(`Fleet positions initialized for ${botId}`);
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
    
    if (isInitialized) {
      fsmLogger.game('Game fully initialized', { 
        players: playersInitialized,
        bots: botsInitialized,
        tiles: tilesInitialized,
        startingTiles: startingTilesAssigned
      });
    }
    
    return isInitialized;
  },
});

export default createInitializationFlagsSlice;
