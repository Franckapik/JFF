/**
 * ==========================================================================
 * TILE COLORS CONFIGURATION
 * ==========================================================================
 * 
 * Mapping centralisé des couleurs par type de tuile.
 * Utilisé dans Vue1R3F (3D) et TileMatrix (2D).
 * 
 * NOTE: Le système utilise 'food' comme type par défaut pour les ressources collectables.
 * Les tuiles sont générées en 'food' puis certaines sont converties en autres types.
 */


/**
 * Couleurs associées à chaque type de tuile
 */
export const TILE_COLORS: Record<string, string> = {
  // Tuiles de base
  'food': '#22c55e',         // Vert (ressources collectables - type par défaut)
  'resource': '#22c55e',     // Vert (alias de food pour compatibilité)
  'empty': '#6b7280',        // Gris moyen (tuile vide)
  
  // Obstacles et dangers
  'obstacle': '#92400e',     // Marron (non franchissable)
  'danger': '#ef4444',       // Rouge (danger - dégâts)
  
  // Stations
  'fuel': '#fbbf24',         // Jaune/or (station carburant)
  'repair': '#3b82f6',       // Bleu (station réparation)
  'depart': '#8b5cf6',       // Violet (tuile de départ)
};

/**
 * Obtient la couleur d'une tuile selon son type
 */
export function getTileColor(type: string): string {
  return TILE_COLORS[type] || TILE_COLORS.food;
}

/**
 * Couleurs pour les états dynamiques (explored, collected)
 */
export const TILE_STATE_COLORS = {
  explored: '#3b82f6',       // Bleu pour explorée
  collected: '#8b5cf6',      // Violet pour collectée
  hover: '#ffffff',          // Blanc pour hover
  selected: '#fbbf24',       // Jaune pour selected
} as const;
