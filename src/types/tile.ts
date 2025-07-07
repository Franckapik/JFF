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

import type { GridCoordinate, TileCoordinate, WorldPosition } from './coordinates';
import type { ResourceStats } from './resources';

// ============================================================================
// TYPES DE TUILES
// ============================================================================

/** Types de tuiles disponibles dans le jeu */
export type TileType = 
  | 'depart'     // Tuile de départ des joueurs
  | 'fuel'       // Station de carburant
  | 'repair'     // Station de réparation
  | 'food'       // Tuile avec ressources alimentaires
  | 'debris'     // Tuile avec débris/matériaux
  | 'special'    // Tuile avec ressources spéciales
  | 'danger'     // Tuile dangereuse
  | 'empty'      // Tuile vide
  | 'water';     // Tuile d'eau (non praticable)

/** Biome/environnement de la tuile */
export type TileBiome = 'grassland' | 'desert' | 'snow' | 'water' | 'rock';

// ============================================================================
// INTERFACE PRINCIPALE DES TUILES
// ============================================================================

/** Interface complète d'une tuile du jeu */
export interface Tile {
  // Identification et positionnement
  coord: GridCoordinate;              // Coordonnée sous forme "x,z"
  position: WorldPosition;            // Position 3D dans le monde
  tileCoord: TileCoordinate;          // Coordonnée objet {x, z}
  
  // Type et propriétés visuelles
  type: TileType;                     // Type de la tuile
  biome: TileBiome;                   // Biome/environnement
  color?: string;                     // Couleur personnalisée
  
  // État de navigation
  walkable: boolean;                  // Peut-on marcher dessus ?
  neighbors?: GridCoordinate[];       // Coordonnées des tuiles voisines
  
  // État d'exploration et collecte
  explored: boolean;                  // A été explorée ?
  exploredAt?: number;                // Timestamp d'exploration
  exploredBy?: string;                // ID de l'entité qui l'a explorée
  collected: boolean;                 // A été collectée ?
  collectedAt?: number;               // Timestamp de collecte
  collectedBy?: string;               // ID de l'entité qui l'a collectée
  
  // Ressources
  resources: ResourceStats;           // Ressources disponibles
  hasResources: boolean;              // Indicateur rapide de présence de ressources
  
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
  coord: TileCoordinate;
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
  path?: GridCoordinate[];    // Chemin si calculé par pathfinding
  isReachable: boolean;       // La destination est-elle atteignable ?
}

// ============================================================================
// TYPES POUR LE STORE
// ============================================================================

/** État du store de tuiles */
export interface TileStoreState {
  // Données principales
  tiles: TileMap;
  radius: number;
  spacing: number;
  
  // État d'interaction
  hoveredTile: GridCoordinate | null;
  selectedTile: GridCoordinate | null;
  
  // Configuration
  autoExploreEnabled: boolean;
  debugMode: boolean;
}

/** Actions du store de tuiles */
export interface TileStoreActions {
  // Base
  updateHoveredTile: (coord: GridCoordinate | null) => void;
  setTiles: (tiles: TileMap) => void;
  getTile: (coord: GridCoordinate) => Tile | undefined;
  getNeighbors: (coord: GridCoordinate) => Tile[];
  updateTile: (coord: GridCoordinate, updates: Partial<Tile>) => void;
  updateTileState: (coord: GridCoordinate, updates: Partial<Tile>) => void;
  clearTiles: () => void;
  
  // Ressources
  collectResources: (coord: GridCoordinate, collector: string) => ResourceStats;
  deductResources: (coord: GridCoordinate, amount: Partial<ResourceStats>) => boolean;
  hasResources: (coord: GridCoordinate, minimum?: Partial<ResourceStats>) => boolean;
  markTileAsCollected: (coord: GridCoordinate, collector?: string) => boolean;
  resetTileResources: (coord: GridCoordinate) => void;
  resetAllTileResources: () => void;
  analyzeResourcesNearPosition: (source: GridCoordinate | { coord: GridCoordinate }, radius?: number) => Array<{
    coord: GridCoordinate;
    position: { x: number; y: number; z: number };
    resources: ResourceStats;
    distance: number;
  }>;
  
  // Pathfinding
  findPath: (startCoord: GridCoordinate, targetCoord: GridCoordinate, tiles?: TileMap) => GridCoordinate[];
  calculateDistance: (
    from: GridCoordinate | TileCoordinate | WorldPosition, 
    to: GridCoordinate | TileCoordinate | WorldPosition, 
    usePathfinding?: boolean, 
    detailed?: boolean
  ) => number;
  calculatePathDistance: (path: GridCoordinate[], tiles?: TileMap) => number;
  findTileAtPosition: (position: WorldPosition, tiles?: TileMap) => Tile | null;
  isReachable: (from: GridCoordinate, to: GridCoordinate, tiles?: TileMap) => boolean;
  
  // Marquage
  markTileAsExplored: (coord: GridCoordinate, explorer?: string) => void;
  
  // Filtrage
  getWalkableTiles: () => Tile[];
  getWalkableTilesInRadius: (centerCoord: GridCoordinate, radius: number, options?: TileSearchOptions) => TileWithDistance[];
  selectRandomWalkableTile: () => Tile | null;
  getDepartTiles: () => Tile[];
  syncDepartTilesWithActiveBots: () => void;
  getFuelStations: () => Tile[];
  getRepairStations: () => Tile[];
  
  // Coordonnées
  isValidGridCoord: (coord: any) => coord is GridCoordinate;
  isValidWorldPosition: (position: any) => position is WorldPosition;
  gridToWorld: (coord: TileCoordinate) => WorldPosition;
  worldToGrid: (position: WorldPosition) => TileCoordinate;
  normalizeCoordinate: (coord: any) => GridCoordinate | null;
  
  // Génération
  initializeGameGrid: (radius: number, spacing: number) => TileMap;
  syncStartingTilesWithFSMBots: (activeBotIds: string[]) => void;
}

/** Type complet du store de tuiles */
export type TileStore = TileStoreState & TileStoreActions;

// ============================================================================
// TYPES GUARDS ET VALIDATEURS
// ============================================================================

/** Vérifie qu'un objet est une tuile valide */
export const isTile = (obj: any): obj is Tile => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.coord === 'string' &&
    typeof obj.position === 'object' &&
    typeof obj.tileCoord === 'object' &&
    typeof obj.type === 'string' &&
    typeof obj.biome === 'string' &&
    typeof obj.walkable === 'boolean' &&
    typeof obj.explored === 'boolean' &&
    typeof obj.collected === 'boolean' &&
    typeof obj.resources === 'object' &&
    typeof obj.hasResources === 'boolean'
  );
};

/** Vérifie qu'un type de tuile est valide */
export const isTileType = (type: any): type is TileType => {
  const validTypes: TileType[] = ['depart', 'fuel', 'repair', 'food', 'debris', 'special', 'danger', 'empty', 'water'];
  return validTypes.includes(type);
};

/** Vérifie qu'un biome est valide */
export const isTileBiome = (biome: any): biome is TileBiome => {
  const validBiomes: TileBiome[] = ['grassland', 'desert', 'snow', 'water', 'rock'];
  return validBiomes.includes(biome);
};

// ============================================================================
// TYPES POUR LES COMPOSANTS
// ============================================================================

/** Interface pour les propriétés du composant Tile */
export interface TileProps {
  /** Position [x, y, z] de la tuile dans l'espace 3D */
  position: [number, number, number];
  /** Rayon de la tuile hexagonale */
  radius: number;
  /** Couleur de la tuile */
  color: string;
  /** Indique si la tuile est surélevée */
  isHighTile?: boolean;
  /** Gestionnaire d'événement au clic */
  onClick?: () => void;
  /** Coordonnées de la tuile au format "x,z" */
  coord: GridCoordinate;
  /** Indique si c'est une tuile de départ (base joueur) */
  isDepart?: boolean;
  /** Couleur de la base du joueur (pour les tuiles de départ) */
  baseColor?: string;
  /** Couleur de fond du label (pour les tuiles de départ) */
  backgroundColor?: string;
  /** Texte du label (pour les tuiles de départ) */
  labelText?: string;
  /** Indice du joueur (pour les tuiles de départ) */
  playerIndex?: number;
  /** Affiche un indicateur FSM au-dessus de la tuile de départ */
  showFSMIndicator?: boolean;
}
