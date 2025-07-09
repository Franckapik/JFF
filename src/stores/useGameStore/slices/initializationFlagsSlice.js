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

const createInitializationFlagsSlice = (set, get) => ({
  
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
  markPlayersAsInitialized: () => {
    fsmLogger.game('Players initialized');
    set({ playersInitialized: true });
  },
  
  /**
   * Marque les bots comme initialisés
   */
  markBotsAsInitialized: () => {
    fsmLogger.game('Bots initialized');
    set({ botsInitialized: true });
  },
  
  /**
   * Marque les tuiles comme initialisées
   */
  markTilesAsInitialized: () => {
    fsmLogger.game('Tiles initialized');
    set({ tilesInitialized: true });
  },

  /**
   * Marque les tuiles de départ comme assignées
   */
  markStartingTilesAsAssigned: () => {
    fsmLogger.game('Starting tiles assigned');
    set({ startingTilesAssigned: true });
  },

  /**
   * Marque les positions de fleet comme initialisées pour un bot donné
   */
  markFleetPositionsAsInitialized: (botId) => {
    const { fleetPositionsInitialized } = get();
    fsmLogger.game(`Fleet positions initialized for ${botId}`);
    set({ 
      fleetPositionsInitialized: {
        ...fleetPositionsInitialized,
        [botId]: true
      }
    });
  },

  /**
   * Vérifie si les positions de fleet sont initialisées pour un bot
   */
  isFleetPositionsInitialized: (botId) => {
    const { fleetPositionsInitialized } = get();
    return fleetPositionsInitialized[botId] || false;
  },  
  
  /**
   * Vérifie si le jeu est complètement initialisé
   * @returns {boolean} True si tout est initialisé
   */
  isGameInitialized: () => {
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
  
  /**
   * Remet à zéro les états d'initialisation
   */
  resetInitialization: () => {
    fsmLogger.game('Initialization reset', { action: 'reset_all_flags' });
    set({
      playersInitialized: false,
      botsInitialized: false,
      tilesInitialized: false
    });
  },
});

export default createInitializationFlagsSlice;