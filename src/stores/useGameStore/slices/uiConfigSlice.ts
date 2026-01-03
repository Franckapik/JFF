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
import type { GameStoreType, UiConfigSliceActions } from '../../../types/stores.d.ts';

const createUiConfigSlice = (_set: unknown, get: () => GameStoreType): UiConfigSliceActions => ({
  
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
   * @param botIndex - Index du bot
   * @returns Couleur du bot
   */
  getBotColor: (botIndex: number): string => {
    const { botColors } = get();
    return botColors[botIndex % botColors.length];
  },

  /**
   * Récupère la couleur d'un bot par son ID
   * @param botId - ID du bot (ex: 'bot-0', 'bot-1')
   * @returns Couleur du bot
   */
  getBotColorById: (botId: string): string => {
    const { botColors } = get();
    // Extraire l'index numérique du botId (ex: 'bot-0' -> 0)
    const botIndex = parseInt(botId.split('-')[1] || '0', 10);
    return botColors[botIndex % botColors.length];
  },
  
  /**
   * Récupère la couleur de base d'un joueur
   * @param playerIndex - Index du joueur (0 = humain)
   * @returns Couleur de la base
   */
  getPlayerBaseColor: (playerIndex: number): string => {
    const { humanPlayerColor, getBotColor } = get();
    return playerIndex === 0 ? humanPlayerColor : getBotColor(playerIndex - 1);
  },
  
  /**
   * Convert color name to RGBA background color
   * @param color - Color name
   * @returns RGBA color string
   */
  getBackgroundColor: (color: string): string => {
    const colorMap: Record<string, string> = {
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
