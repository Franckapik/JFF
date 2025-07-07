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
import fsmLogger from '../../../logger/fsmLogger';

const createInitializationFlagsSlice = (set, get) => ({
  
  /* ========================================
   * ÉTATS D'INITIALISATION
   * ======================================== */
  
  // Flags d'initialisation
  playersInitialized: false,
  botsInitialized: false,
  tilesInitialized: false,
  
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
   * Vérifie si le jeu est complètement initialisé
   * @returns {boolean} True si tout est initialisé
   */
  isGameInitialized: () => {
    const { playersInitialized, botsInitialized, tilesInitialized } = get();
    const isInitialized = playersInitialized && botsInitialized && tilesInitialized;
    
    if (isInitialized) {
      fsmLogger.game('Game fully initialized', { 
        players: playersInitialized,
        bots: botsInitialized,
        tiles: tilesInitialized
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