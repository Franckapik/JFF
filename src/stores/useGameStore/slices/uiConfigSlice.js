/**
 * ============================================================================
 * UI CONFIG SLICE - Configuration de l'interface et des couleurs
 * ============================================================================
 * 
 * Ce slice gère la configuration visuelle du jeu :
 * - Palette de couleurs pour les bots
 * - Configuration des couleurs de bases
 * - Autres éléments de configuration UI
 */

const createUiConfigSlice = (set, get) => ({
  
  /* ========================================
   * CONFIGURATION DES COULEURS
   * ======================================== */
  
  // Color palette for different bots
  botColors: ["red", "orange", "green", "purple", "teal", "brown", "magenta", "cyan"],
  
  // Human player color
  humanPlayerColor: "blue",
  
  /* ========================================
   * UTILITAIRES DE COULEURS
   * ======================================== */
  
  /**
   * Récupère la couleur d'un bot par son index
   * @param {number} botIndex - Index du bot
   * @returns {string} Couleur du bot
   */
  getBotColor: (botIndex) => {
    const { botColors } = get();
    return botColors[botIndex % botColors.length];
  },

  /**
   * Récupère la couleur d'un bot par son ID
   * @param {string} botId - ID du bot (ex: 'bot-0', 'bot-1')
   * @returns {string} Couleur du bot
   */
  getBotColorById: (botId) => {
    const { botColors } = get();
    // Extraire l'index numérique du botId (ex: 'bot-0' -> 0)
    const botIndex = parseInt(botId.split('-')[1] || '0', 10);
    return botColors[botIndex % botColors.length];
  },
  
  /**
   * Récupère la couleur de base d'un joueur
   * @param {number} playerIndex - Index du joueur (0 = humain)
   * @returns {string} Couleur de la base
   */
  getPlayerBaseColor: (playerIndex) => {
    const { humanPlayerColor, getBotColor } = get();
    return playerIndex === 0 ? humanPlayerColor : getBotColor(playerIndex - 1);
  },
  
  /**
   * Convert color name to RGBA background color
   * @param {string} color - Color name
   * @returns {string} RGBA color string
   */
  getBackgroundColor: (color) => {
    const colorMap = {
      'red': 'rgba(200,50,0,0.8)',
      'orange': 'rgba(255,140,0,0.8)',
      'green': 'rgba(0,150,50,0.8)',
      'purple': 'rgba(100,0,150,0.8)',
      'teal': 'rgba(0,128,128,0.8)',
      'brown': 'rgba(139,69,19,0.8)',
      'magenta': 'rgba(255,0,255,0.8)',
      'cyan': 'rgba(0,180,180,0.8)',
      'blue': 'rgba(0,50,200,0.8)'
    };
    
    return colorMap[color] || 'rgba(100,100,100,0.8)';
  },
});

export default createUiConfigSlice;
