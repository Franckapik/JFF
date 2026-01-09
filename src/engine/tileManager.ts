/**
 * ==========================================================================
 * TILE MANAGER - Singleton pour la gestion des tuiles
 * ==========================================================================
 * 
 * Remplace useTileStore avec un module singleton.
 * Stocke les données de tuiles et expose les fonctions de génération/pathfinding.
 * 
 * Les fonctions de calcul restent dans src/core/spatial/pure/ pour la réutilisation.
 * Ce module gère uniquement le stockage et la coordination.
 * 
 * @example
 * ```ts
 * import { tileManager } from './engine/tileManager';
 * 
 * // Génération
 * tileManager.initializeGrid(3, -0.2);
 * 
 * // Accès
 * const tile = tileManager.getTile('2,1');
 * const path = tileManager.findPath('0,0', '3,2');
 * ```
 */

import type { 
  GridCoordinate, 
  Tile, 
  TileMap,
  TileBiome,
  TileType 
} from '../types/index.ts';
import type { ResourceStats } from '../types/resources.ts';

// ==========================================================================
// TYPES
// ==========================================================================

export interface TileManagerState {
  tiles: TileMap;
  radius: number;
  spacing: number;
  hoveredTile: GridCoordinate | null;
}

type StateChangeCallback = (state: TileManagerState) => void;

// ==========================================================================
// CONSTANTS
// ==========================================================================

const HEX_DIRECTIONS = [
  { q: 1, r: 0 },   // East
  { q: -1, r: 0 },  // West
  { q: 0, r: 1 },   // Southeast
  { q: 0, r: -1 },  // Northwest
  { q: 1, r: -1 },  // Northeast
  { q: -1, r: 1 },  // Southwest
];

const TILE_CONSTANTS = {
  hexSize: 1.2,
  sqrt3: Math.sqrt(3),
  defaultY: 0,
  foodMax: 100,
  debrisMax: 1000,
  specialMax: 2,
};

// Valid biomes from types/tile.d.ts
const BIOMES: TileBiome[] = ['space', 'asteroid', 'nebula', 'station', 'grassland'];

// ==========================================================================
// SINGLETON CLASS
// ==========================================================================

class TileManager {
  // State
  private _tiles: TileMap = {};
  private _radius: number = 3;
  private _spacing: number = -0.2;
  private _hoveredTile: GridCoordinate | null = null;
  
  // Subscribers
  private subscribers = new Set<StateChangeCallback>();

  // ========================================================================
  // STATE ACCESS (READ-ONLY)
  // ========================================================================

  get tiles(): TileMap {
    return this._tiles;
  }

  get radius(): number {
    return this._radius;
  }

  get spacing(): number {
    return this._spacing;
  }

  get hoveredTile(): GridCoordinate | null {
    return this._hoveredTile;
  }

  getState(): TileManagerState {
    return {
      tiles: this._tiles,
      radius: this._radius,
      spacing: this._spacing,
      hoveredTile: this._hoveredTile,
    };
  }

  // ========================================================================
  // TILE ACCESS
  // ========================================================================

  getTile(coord: GridCoordinate): Tile | undefined {
    return this._tiles[coord];
  }

  getTileCount(): number {
    return Object.keys(this._tiles).length;
  }

  getAllTiles(): Tile[] {
    return Object.values(this._tiles);
  }

  getTilesByType(type: TileType): Tile[] {
    return Object.values(this._tiles).filter((t): t is Tile => 
      typeof t === 'object' && t !== null && 'type' in t && (t as Tile).type === type
    );
  }

  // ========================================================================
  // STATE MUTATIONS
  // ========================================================================

  setTiles(tiles: TileMap): void {
    this._tiles = tiles;
    this.notifySubscribers();
  }

  updateTile(coord: GridCoordinate, updates: Partial<Tile>): void {
    if (this._tiles[coord]) {
      this._tiles[coord] = { ...this._tiles[coord], ...updates };
      this.notifySubscribers();
    }
  }

  setHoveredTile(coord: GridCoordinate | null): void {
    this._hoveredTile = coord;
    // Don't notify for hover changes (too frequent)
  }

  // ========================================================================
  // GRID GENERATION
  // ========================================================================

  initializeGrid(radius: number, spacing: number): TileMap {
    this._radius = radius;
    this._spacing = spacing;

    const tiles: TileMap = {};
    const hexSize = TILE_CONSTANTS.hexSize;
    const sqrt3 = TILE_CONSTANTS.sqrt3;

    // Generate hexagonal grid
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      
      for (let r = r1; r <= r2; r++) {
        const coord: GridCoordinate = `${q},${r}`;
        
        // Calculate world position
        const x = hexSize * sqrt3 * (q + r / 2) * (1 + spacing);
        const z = hexSize * (3 / 2) * r * (1 + spacing);
        
        // Generate neighbors
        const neighbors = this.calculateNeighbors(q, r, radius);
        
        // Random biome and resources
        const biome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
        const resources = this.generateResources(biome);
        
        tiles[coord] = {
          position: { x, y: 0, z, coord },
          type: 'resource',
          biome,
          walkable: biome !== 'space', // space tiles are not walkable
          explorable: true,
          collectable: resources.total > 0,
          explored: false,
          collected: false,
          neighbors,
          resources,
          hasResources: resources.total > 0,
          color: this.getBiomeColor(biome),
        };
      }
    }

    this._tiles = tiles;
    this.notifySubscribers();
    
    console.log(`🗺️ [TileManager] Grid generated: ${Object.keys(tiles).length} tiles`);
    return tiles;
  }

  // ========================================================================
  // TILE ASSIGNMENT
  // ========================================================================

  assignStartingTiles(botIds: string[]): void {
    const allTiles = Object.values(this._tiles) as Tile[];
    const availableTiles = allTiles.filter(t => t.type === 'resource' && t.walkable);
    
    if (availableTiles.length < botIds.length) {
      // eslint-disable-next-line no-console
      console.warn('[TileManager] Not enough tiles for all bots');
      return;
    }

    // Shuffle and pick starting tiles
    const shuffled = [...availableTiles].sort(() => Math.random() - 0.5);
    
    botIds.forEach((botId, index) => {
      const tile = shuffled[index];
      const coord = tile.position.coord;
      
      this._tiles[coord] = {
        ...tile,
        type: 'depart',
        assignedToBot: botId,
        explored: true,
        resources: { food: 100, debris: 100, special: 50, total: 250 },
        hasResources: true,
      };
    });

    this.notifySubscribers();
    // eslint-disable-next-line no-console
    console.log(`🏠 [TileManager] Starting tiles assigned to: ${botIds.join(', ')}`);
  }

  placeGameStations(): void {
    const allTiles = Object.values(this._tiles) as Tile[];
    const resourceTiles = allTiles.filter(t => t.type === 'resource' && t.walkable);
    
    if (resourceTiles.length < 2) return;

    // Place fuel station
    const fuelTile = resourceTiles[Math.floor(Math.random() * resourceTiles.length)];
    this._tiles[fuelTile.position.coord] = {
      ...fuelTile,
      type: 'fuel_station',
      resources: { food: 0, debris: 0, special: 0, total: 0 },
      hasResources: false,
    };

    // Place repair station (different tile)
    const remainingTiles = resourceTiles.filter(t => t.position.coord !== fuelTile.position.coord);
    if (remainingTiles.length > 0) {
      const repairTile = remainingTiles[Math.floor(Math.random() * remainingTiles.length)];
      this._tiles[repairTile.position.coord] = {
        ...repairTile,
        type: 'repair_station',
        resources: { food: 0, debris: 0, special: 0, total: 0 },
        hasResources: false,
      };
    }

    this.notifySubscribers();
    // eslint-disable-next-line no-console
    console.log('🔧 [TileManager] Game stations placed');
  }

  // ========================================================================
  // EXPLORATION & COLLECTION
  // ========================================================================

  markTileAsExplored(coord: GridCoordinate): void {
    if (this._tiles[coord] && !this._tiles[coord].explored) {
      this._tiles[coord] = {
        ...this._tiles[coord],
        explored: true,
      };
      this.notifySubscribers();
    }
  }

  markTileAsCollected(coord: GridCoordinate): void {
    if (this._tiles[coord] && !this._tiles[coord].collected) {
      this._tiles[coord] = {
        ...this._tiles[coord],
        collected: true,
        resources: { food: 0, debris: 0, special: 0, total: 0 },
        hasResources: false,
      };
      this.notifySubscribers();
    }
  }

  // ========================================================================
  // PATHFINDING (simplified - use core/spatial/pure for complex paths)
  // ========================================================================

  findPath(from: GridCoordinate, to: GridCoordinate): GridCoordinate[] {
    // Simple BFS pathfinding
    if (from === to) return [from];
    
    const queue: { coord: GridCoordinate; path: GridCoordinate[] }[] = [
      { coord: from, path: [from] }
    ];
    const visited = new Set<GridCoordinate>([from]);
    
    while (queue.length > 0) {
      const { coord, path } = queue.shift()!;
      const tile = this._tiles[coord];
      
      if (!tile) continue;
      
      for (const neighbor of tile.neighbors || []) {
        if (neighbor === to) {
          return [...path, neighbor];
        }
        
        if (!visited.has(neighbor)) {
          const neighborTile = this._tiles[neighbor];
          if (neighborTile?.walkable) {
            visited.add(neighbor);
            queue.push({ coord: neighbor, path: [...path, neighbor] });
          }
        }
      }
    }
    
    return []; // No path found
  }

  calculateDistance(from: GridCoordinate, to: GridCoordinate): number {
    const [q1, r1] = from.split(',').map(Number);
    const [q2, r2] = to.split(',').map(Number);
    
    return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
  }

  // ========================================================================
  // SUBSCRIPTIONS
  // ========================================================================

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    const state = this.getState();
    this.subscribers.forEach(callback => callback(state));
  }

  // ========================================================================
  // PRIVATE HELPERS
  // ========================================================================

  private calculateNeighbors(q: number, r: number, radius: number): GridCoordinate[] {
    return HEX_DIRECTIONS
      .map(dir => ({ q: q + dir.q, r: r + dir.r }))
      .filter(pos => {
        const s = -pos.q - pos.r;
        return Math.max(Math.abs(pos.q), Math.abs(pos.r), Math.abs(s)) <= radius;
      })
      .map(pos => `${pos.q},${pos.r}` as GridCoordinate);
  }

  private generateResources(biome: TileBiome): ResourceStats {
    // Space biome has no resources
    if (biome === 'space' || Math.random() < 0.3) {
      return { food: 0, debris: 0, special: 0, total: 0 };
    }
    
    const food = Math.floor(Math.random() * TILE_CONSTANTS.foodMax);
    const debris = Math.floor(Math.random() * TILE_CONSTANTS.debrisMax);
    const special = Math.random() < 0.1 ? Math.floor(Math.random() * TILE_CONSTANTS.specialMax) + 1 : 0;
    
    return { food, debris, special, total: food + debris + special };
  }

  private getBiomeColor(biome: TileBiome): string {
    const colors: Record<TileBiome, string> = {
      space: '#1a1a2e',
      asteroid: '#6b6b6b',
      nebula: '#8b5cf6',
      station: '#3498db',
      grassland: '#4a7c23',
    };
    return colors[biome] || '#888888';
  }

  // ========================================================================
  // RESET
  // ========================================================================

  reset(): void {
    this._tiles = {};
    this._radius = 3;
    this._spacing = -0.2;
    this._hoveredTile = null;
    this.notifySubscribers();
    console.log('🔄 [TileManager] Reset complete');
  }
}

// ==========================================================================
// SINGLETON EXPORT
// ==========================================================================

export const tileManager = new TileManager();

export default tileManager;
