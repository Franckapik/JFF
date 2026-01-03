/**
 * ============================================================================
 * TYPES POUR LES TUILES
 * ============================================================================
 * 
 * Types TypeScript pour la gestion complète des tuiles du jeu.
 * Basés sur l'architecture existante du tile store et la logique FSM.
 * 
 * @author TypeScript Migration
 * @version 1.0.0
 */

import type { GridCoordinate, Path, WorldGridPosition, WorldPosition } from './coordinates';
import type { ResourceStats } from './resources';

// ============================================================================
// TYPES DE TUILES
// ============================================================================

/** Types de tuiles disponibles dans le jeu */
export type TileType = 
  | 'empty'
  | 'resource'
  | 'obstacle'
  | 'danger'
  | 'fuel'
  | 'repair'
  | 'depart';

/** Biome/environnement de la tuile */
export type TileBiome = 
  | 'space'
  | 'asteroid'
  | 'nebula'
  | 'station'
  | 'grassland';

// ============================================================================
// INTERFACE PRINCIPALE DES TUILES
// ============================================================================

/** Interface complète d'une tuile du jeu */
export interface Tile {
  // Identification et positionnement unifié
  position: WorldGridPosition;        // Position 3D + coordonnée de grille
  
  // Type et propriétés visuelles
  type: TileType | string;            // Type de la tuile (string pour compatibilité)
  biome: TileBiome | string;          // Biome/environnement (string pour compatibilité)
  color?: string;                     // Couleur personnalisée
  
  // État de navigation
  walkable?: boolean;                 // Peut-on marcher dessus ? (optionnel pour compatibilité)
  isWalkable?: boolean;               // Alias pour compatibilité avec anciens types
  neighbors?: GridCoordinate[];       // Coordonnées des tuiles voisines
  
  // État d'exploration et collecte
  explored?: boolean;                 // A été explorée ?
  exploredAt?: number;                // Timestamp d'exploration
  exploredBy?: string;                // ID de l'entité qui l'a explorée
  collected?: boolean;                // A été collectée ?
  collectedAt?: number;               // Timestamp de collecte
  collectedBy?: string;               // ID de l'entité qui l'a collectée
  
  // Ressources
  resources: ResourceStats;           // Ressources disponibles
  hasResources?: boolean;             // Indicateur rapide de présence de ressources
  resourcePercentage?: number;        // Pourcentage de ressources restantes
  lastCollectedTimestamp?: number;    // Timestamp de dernière collecte
  
  // Assignation aux entités
  assignedToBot?: string;             // ID du bot assigné (pour tuiles de départ)
  
  // Métadonnées
  isHovered?: boolean;                // Est survolée par la souris ?
  isSelected?: boolean;               // Est sélectionnée ?
  lastUpdate?: number;                // Dernière mise à jour
}

// ============================================================================
// TYPES POUR LES COLLECTIONS DE TUILES
// ============================================================================

/** Dictionnaire de tuiles indexées par coordonnées */
export type TileMap = Record<GridCoordinate, Tile>;

/** Tuile avec distance calculée (pour les recherches par rayon) */
export interface TileWithDistance {
  coord: GridCoordinate;
  position: WorldPosition;
  tile: Tile;
  distance: number;
}

/** Options de recherche de tuiles */
export interface TileSearchOptions {
  onlyUnexplored?: boolean;       // Seulement les tuiles non explorées
  excludeDanger?: boolean;        // Exclure les tuiles dangereuses
  maxRadius?: number;             // Rayon maximum (contrainte de sécurité)
  includeTypes?: TileType[];      // Types de tuiles à inclure
  excludeTypes?: TileType[];      // Types de tuiles à exclure
  minResources?: number;          // Ressources minimales requises
}

// ============================================================================
// TYPES POUR LA GÉNÉRATION
// ============================================================================

/** Configuration pour la génération de tuiles */
export interface TileGenerationConfig {
  radius: number;               // Rayon de la grille hexagonale
  spacing: number;              // Espacement entre les tuiles
  centerX?: number;             // Centre X de la grille
  centerZ?: number;             // Centre Z de la grille
  biomeDistribution?: Record<TileBiome, number>; // Distribution des biomes en %
  resourceDensity?: number;     // Densité des ressources (0-1)
}

/** Données de génération hexagonale */
export interface HexPosition {
  x: number;
  z: number;
  coord: GridCoordinate;
  position: WorldPosition;
}

// ============================================================================
// TYPES POUR LE PATHFINDING
// ============================================================================

/** Nœud pour le calcul de chemin */
export interface PathNode {
  coord: GridCoordinate;
  position: WorldPosition;
  gCost: number;              // Coût depuis le début
  hCost: number;              // Heuristique vers la fin
  fCost: number;              // Coût total (g + h)
  parent?: PathNode;          // Nœud parent dans le chemin
}

/** Résultat d'un calcul de distance */
export interface DistanceResult {
  distance: number;
  path?: Path;                // Chemin si calculé par pathfinding
  isReachable: boolean;       // La destination est-elle atteignable ?
}

// ============================================================================
// TYPES GUARDS ET VALIDATEURS
// ============================================================================

/** Vérifie qu'un objet est une tuile valide */
export const isTile = (obj: unknown): obj is Tile => {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.coord === 'string' &&
    typeof o.position === 'object' && o.position !== null &&
    typeof o.type === 'string' &&
    typeof o.biome === 'string' &&
    typeof o.resources === 'object' && o.resources !== null
  );
};

/** Vérifie qu'un type de tuile est valide */
export const isTileType = (type: unknown): type is TileType => {
  const validTypes: TileType[] = ['depart', 'fuel', 'repair', 'food', 'debris', 'special', 'danger', 'empty', 'water'];
  return typeof type === 'string' && validTypes.includes(type as TileType);
};

/** Vérifie qu'un biome est valide */
export const isTileBiome = (biome: unknown): biome is TileBiome => {
  const validBiomes: TileBiome[] = ['grassland', 'desert', 'snow', 'water', 'rock'];
  return typeof biome === 'string' && validBiomes.includes(biome as TileBiome);
};

// ============================================================================
// TYPES POUR LES COMPOSANTS
// ============================================================================


