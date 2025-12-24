/**
 * ============================================================================
 * HEX GRID GENERATION - Test Suite
 * ============================================================================
 * 
 * Tests complets pour les fonctions de génération de grille hexagonale.
 * Coverage: 100% de hexGrid.ts
 * 
 * @vitest
 */

import { describe, expect, it } from 'vitest';

import {
  assignStartingTilesToBots,
  calculateHexNeighbors,
  calculateHexPosition,
  generateRandomColor,
  generateTileResources,
  getStationCount,
  initializeGameGrid,
  placeDangerTiles,
  placeGameStations,
  placeStartingTiles,
} from './hexGrid';

describe('core/spatial/hexGrid', () => {
  // ============================================================================
  // generateRandomColor
  // ============================================================================

  describe('generateRandomColor', () => {
    it('should generate valid hex color', () => {
      const color = generateRandomColor();
      
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('should generate consistent color with seed', () => {
      const color1 = generateRandomColor(42);
      const color2 = generateRandomColor(42);
      
      expect(color1).toBe(color2);
    });

    it('should generate different colors with different seeds', () => {
      const color1 = generateRandomColor(1);
      const color2 = generateRandomColor(2);
      
      expect(color1).not.toBe(color2);
    });

    it('should handle seed 0', () => {
      const color = generateRandomColor(0);
      
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  // ============================================================================
  // calculateHexNeighbors
  // ============================================================================

  describe('calculateHexNeighbors', () => {
    it('should return 6 neighbors for center tile', () => {
      const neighbors = calculateHexNeighbors(0, 0, 5);
      
      expect(neighbors).toHaveLength(6);
    });

    it('should return fewer neighbors for edge tiles', () => {
      const neighbors = calculateHexNeighbors(5, 0, 5);
      
      expect(neighbors.length).toBeLessThan(6);
    });

    it('should return valid grid coordinates', () => {
      const neighbors = calculateHexNeighbors(0, 0, 5);
      
      neighbors.forEach(coord => {
        expect(coord).toMatch(/^-?\d+,-?\d+$/);
      });
    });

    it('should not include out-of-bounds neighbors', () => {
      const neighbors = calculateHexNeighbors(5, 5, 5);
      
      // Tile at (5,5) is out of hex bounds, should return empty
      // Valid hex: |q| + |r| + |q+r| <= radius, so 5+5+10 > 5*2
      expect(neighbors.length).toBe(0);
    });

    it('should handle radius 0 (single tile)', () => {
      const neighbors = calculateHexNeighbors(0, 0, 0);
      
      expect(neighbors).toHaveLength(0); // No neighbors in radius 0
    });

    it('should handle radius 1', () => {
      const neighbors = calculateHexNeighbors(0, 0, 1);
      
      expect(neighbors).toHaveLength(6); // Center has all 6 neighbors
    });
  });

  // ============================================================================
  // calculateHexPosition
  // ============================================================================

  describe('calculateHexPosition', () => {
    it('should calculate center position correctly', () => {
      const pos = calculateHexPosition(0, 0, { radius: 5, spacing: -0.2 });
      
      expect(pos.x).toBe(0);
      expect(pos.y).toBe(0);
      expect(pos.z).toBe(0);
      expect(pos.coord).toBe('5,5');
    });

    it('should respect spacing parameter', () => {
      const pos1 = calculateHexPosition(1, 0, { radius: 5, spacing: 0 });
      const pos2 = calculateHexPosition(1, 0, { radius: 5, spacing: -0.2 });
      
      expect(pos1.x).toBeGreaterThan(pos2.x);
    });

    it('should encode coordinate correctly', () => {
      const pos = calculateHexPosition(2, 3, { radius: 5 });
      
      expect(pos.coord).toBe('7,8'); // 2+5, 3+5
    });

    it('should handle negative coordinates', () => {
      const pos = calculateHexPosition(-2, -3, { radius: 5 });
      
      expect(pos.coord).toBe('3,2'); // -2+5, -3+5
    });

    it('should return consistent WorldGridPosition', () => {
      const pos = calculateHexPosition(1, 2, { radius: 5 });
      
      expect(pos).toHaveProperty('x');
      expect(pos).toHaveProperty('y');
      expect(pos).toHaveProperty('z');
      expect(pos).toHaveProperty('coord');
    });
  });

  // ============================================================================
  // generateTileResources
  // ============================================================================

  describe('generateTileResources', () => {
    it('should generate resources with valid ranges', () => {
      const resources = generateTileResources();
      
      expect(resources.food).toBeGreaterThanOrEqual(0);
      expect(resources.food).toBeLessThanOrEqual(100);
      expect(resources.debris).toBeGreaterThanOrEqual(0);
      expect(resources.debris).toBeLessThanOrEqual(1000);
      expect(resources.special).toBeGreaterThanOrEqual(0);
      expect(resources.special).toBeLessThanOrEqual(2);
    });

    it('should calculate total correctly', () => {
      const resources = generateTileResources();
      
      expect(resources.total).toBe(
        resources.food + resources.debris + resources.special
      );
    });

    it('should generate consistent resources with seed', () => {
      const res1 = generateTileResources(42);
      const res2 = generateTileResources(42);
      
      expect(res1).toEqual(res2);
    });

    it('should generate different resources with different seeds', () => {
      const res1 = generateTileResources(1);
      const res2 = generateTileResources(2);
      
      expect(res1).not.toEqual(res2);
    });
  });

  // ============================================================================
  // getStationCount
  // ============================================================================

  describe('getStationCount', () => {
    it('should return 0 for radius 0', () => {
      expect(getStationCount(0, 'fuel')).toBe(0);
      expect(getStationCount(0, 'repair')).toBe(0);
    });

    it('should return 1 for radius 1', () => {
      expect(getStationCount(1, 'fuel')).toBe(1);
      expect(getStationCount(1, 'repair')).toBe(1);
    });

    it('should return 2 for radius >= 2', () => {
      expect(getStationCount(2, 'fuel')).toBe(2);
      expect(getStationCount(5, 'fuel')).toBe(2);
      expect(getStationCount(10, 'repair')).toBe(2);
    });
  });

  // ============================================================================
  // initializeGameGrid
  // ============================================================================

  describe('initializeGameGrid', () => {
    it('should generate correct number of tiles for radius 0', () => {
      const tiles = initializeGameGrid({ radius: 0 });
      
      expect(Object.keys(tiles)).toHaveLength(1); // Only center tile
    });

    it('should generate correct number of tiles for radius 1', () => {
      const tiles = initializeGameGrid({ radius: 1 });
      
      // Formula: 3r² + 3r + 1 = 3(1)² + 3(1) + 1 = 7
      expect(Object.keys(tiles)).toHaveLength(7);
    });

    it('should generate correct number of tiles for radius 2', () => {
      const tiles = initializeGameGrid({ radius: 2 });
      
      // Formula: 3(2)² + 3(2) + 1 = 12 + 6 + 1 = 19
      expect(Object.keys(tiles)).toHaveLength(19);
    });

    it('should generate tiles with all required properties', () => {
      const tiles = initializeGameGrid({ radius: 1 });
      const tile = Object.values(tiles)[0];
      
      expect(tile).toHaveProperty('position');
      expect(tile).toHaveProperty('type');
      expect(tile).toHaveProperty('biome');
      expect(tile).toHaveProperty('walkable');
      expect(tile).toHaveProperty('neighbors');
      expect(tile).toHaveProperty('resources');
      expect(tile).toHaveProperty('color');
    });

    it('should generate tiles with valid resources', () => {
      const tiles = initializeGameGrid({ radius: 1 });
      
      Object.values(tiles).forEach(tile => {
        expect(tile.resources.total).toBe(
          tile.resources.food + tile.resources.debris + tile.resources.special
        );
      });
    });

    it('should generate consistent grid with seed', () => {
      const tiles1 = initializeGameGrid({ radius: 2, seed: 42 });
      const tiles2 = initializeGameGrid({ radius: 2, seed: 42 });
      
      expect(Object.keys(tiles1)).toEqual(Object.keys(tiles2));
      expect(Object.values(tiles1)[0].color).toBe(Object.values(tiles2)[0].color);
    });

    it('should respect spacing parameter', () => {
      const tiles1 = initializeGameGrid({ radius: 1, spacing: 0 });
      const tiles2 = initializeGameGrid({ radius: 1, spacing: -0.2 });
      
      const tile1 = Object.values(tiles1).find(t => t.position.coord === '2,1');
      const tile2 = Object.values(tiles2).find(t => t.position.coord === '2,1');
      
      expect(tile1).toBeDefined();
      expect(tile2).toBeDefined();
      expect(tile1!.position.x).toBeGreaterThan(tile2!.position.x);
    });
  });

  // ============================================================================
  // placeGameStations
  // ============================================================================

  describe('placeGameStations', () => {
    it('should place correct number of fuel stations', () => {
      const initialTiles = initializeGameGrid({ radius: 2 });
      const withStations = placeGameStations(initialTiles, { radius: 2 });
      
      const fuelStations = Object.values(withStations).filter(t => t.type === 'fuel');
      expect(fuelStations).toHaveLength(2);
    });

    it('should place correct number of repair stations', () => {
      const initialTiles = initializeGameGrid({ radius: 2 });
      const withStations = placeGameStations(initialTiles, { radius: 2 });
      
      const repairStations = Object.values(withStations).filter(t => t.type === 'repair');
      expect(repairStations).toHaveLength(2);
    });

    it('should set fuel station properties correctly', () => {
      const initialTiles = initializeGameGrid({ radius: 2 });
      const withStations = placeGameStations(initialTiles, { radius: 2 });
      
      const fuelStations = Object.values(withStations).filter(t => t.type === 'fuel');
      expect(fuelStations.length).toBeGreaterThan(0);
      
      const fuelStation = fuelStations[0];
      expect(fuelStation.color).toBe('orange');
      expect(fuelStation.hasResources).toBe(false);
      expect(fuelStation.resources.total).toBe(0);
    });

    it('should set repair station properties correctly', () => {
      const initialTiles = initializeGameGrid({ radius: 2 });
      const withStations = placeGameStations(initialTiles, { radius: 2 });
      
      const repairStations = Object.values(withStations).filter(t => t.type === 'repair');
      expect(repairStations.length).toBeGreaterThan(0);
      
      const repairStation = repairStations[0];
      expect(repairStation.color).toBe('green');
      expect(repairStation.hasResources).toBe(false);
      expect(repairStation.resources.total).toBe(0);
    });

    it('should not mutate original tileMap', () => {
      const initialTiles = initializeGameGrid({ radius: 1 });
      const originalCount = Object.values(initialTiles).filter(t => t.type === 'food').length;
      
      placeGameStations(initialTiles, { radius: 1 });
      
      const afterCount = Object.values(initialTiles).filter(t => t.type === 'food').length;
      expect(afterCount).toBe(originalCount);
    });
  });

  // ============================================================================
  // placeDangerTiles
  // ============================================================================

  describe('placeDangerTiles', () => {
    it('should place danger tiles (approximately 10%)', () => {
      const initialTiles = initializeGameGrid({ radius: 5 });
      const withDanger = placeDangerTiles(initialTiles);
      
      const dangerTiles = Object.values(withDanger).filter(t => t.type === 'danger');
      const totalTiles = Object.keys(initialTiles).length;
      
      expect(dangerTiles.length).toBeGreaterThanOrEqual(1);
      expect(dangerTiles.length).toBeLessThanOrEqual(Math.ceil(totalTiles * 0.15));
    });

    it('should set danger tile properties correctly', () => {
      const initialTiles = initializeGameGrid({ radius: 2, seed: 42 });
      const withDanger = placeDangerTiles(initialTiles, 42);
      
      const dangerTile = Object.values(withDanger).find(t => t.type === 'danger');
      expect(dangerTile?.color).toBe('red');
      expect(dangerTile?.walkable).toBe(false);
      expect(dangerTile?.hasResources).toBe(false);
    });

    it('should place at least 1 danger tile', () => {
      const initialTiles = initializeGameGrid({ radius: 1 });
      const withDanger = placeDangerTiles(initialTiles);
      
      const dangerTiles = Object.values(withDanger).filter(t => t.type === 'danger');
      expect(dangerTiles.length).toBeGreaterThanOrEqual(1);
    });

    it('should not mutate original tileMap', () => {
      const initialTiles = initializeGameGrid({ radius: 1 });
      const originalDanger = Object.values(initialTiles).filter(t => t.type === 'danger').length;
      
      placeDangerTiles(initialTiles);
      
      const afterDanger = Object.values(initialTiles).filter(t => t.type === 'danger').length;
      expect(afterDanger).toBe(originalDanger);
    });
  });

  // ============================================================================
  // placeStartingTiles
  // ============================================================================

  describe('placeStartingTiles', () => {
    it('should place correct number of starting tiles', () => {
      const initialTiles = initializeGameGrid({ radius: 3 });
      const withStarts = placeStartingTiles(initialTiles, 4);
      
      const startTiles = Object.values(withStarts).filter(t => t.type === 'depart');
      expect(startTiles).toHaveLength(4);
    });

    it('should set starting tile properties correctly', () => {
      const initialTiles = initializeGameGrid({ radius: 2 });
      const withStarts = placeStartingTiles(initialTiles, 2);
      
      const startTile = Object.values(withStarts).find(t => t.type === 'depart');
      expect(startTile?.color).toBe('#4CAF50');
      expect(startTile?.hasResources).toBe(true);
      expect(startTile?.resources.food).toBe(100);
      expect(startTile?.resources.debris).toBe(100);
      expect(startTile?.resources.special).toBe(50);
      expect(startTile?.resources.total).toBe(250);
    });

    it('should not exceed available food tiles', () => {
      const initialTiles = initializeGameGrid({ radius: 1 });
      const foodTiles = Object.values(initialTiles).filter(t => t.type === 'food').length;
      
      const withStarts = placeStartingTiles(initialTiles, foodTiles + 10);
      const startTiles = Object.values(withStarts).filter(t => t.type === 'depart');
      
      expect(startTiles.length).toBeLessThanOrEqual(foodTiles);
    });

    it('should generate consistent placement with seed', () => {
      const tiles = initializeGameGrid({ radius: 2, seed: 42 });
      const starts1 = placeStartingTiles(tiles, 3, 42);
      const starts2 = placeStartingTiles(tiles, 3, 42);
      
      const coords1 = Object.values(starts1).filter(t => t.type === 'depart').map(t => t.position.coord);
      const coords2 = Object.values(starts2).filter(t => t.type === 'depart').map(t => t.position.coord);
      
      expect(coords1).toEqual(coords2);
    });
  });

  // ============================================================================
  // assignStartingTilesToBots
  // ============================================================================

  describe('assignStartingTilesToBots', () => {
    it('should assign starting tiles to bots', () => {
      const initialTiles = initializeGameGrid({ radius: 3 });
      const withStarts = placeStartingTiles(initialTiles, 3);
      const assigned = assignStartingTilesToBots(withStarts, ['bot-0', 'bot-1', 'bot-2']);
      
      const assignedTiles = Object.values(assigned).filter(t => t.assignedToBot);
      expect(assignedTiles).toHaveLength(3);
    });

    it('should assign correct bot IDs', () => {
      const initialTiles = initializeGameGrid({ radius: 3 });
      const withStarts = placeStartingTiles(initialTiles, 2);
      const assigned = assignStartingTilesToBots(withStarts, ['bot-0', 'bot-1']);
      
      const bot0Tile = Object.values(assigned).find(t => t.assignedToBot === 'bot-0');
      const bot1Tile = Object.values(assigned).find(t => t.assignedToBot === 'bot-1');
      
      expect(bot0Tile).toBeDefined();
      expect(bot1Tile).toBeDefined();
    });

    it('should not exceed available starting tiles', () => {
      const initialTiles = initializeGameGrid({ radius: 2 });
      const withStarts = placeStartingTiles(initialTiles, 2);
      const assigned = assignStartingTilesToBots(withStarts, ['bot-0', 'bot-1', 'bot-2', 'bot-3']);
      
      const assignedTiles = Object.values(assigned).filter(t => t.assignedToBot);
      expect(assignedTiles.length).toBeLessThanOrEqual(2);
    });

    it('should not mutate original tileMap', () => {
      const initialTiles = initializeGameGrid({ radius: 2 });
      const withStarts = placeStartingTiles(initialTiles, 2);
      const originalAssigned = Object.values(withStarts).filter(t => t.assignedToBot).length;
      
      assignStartingTilesToBots(withStarts, ['bot-0']);
      
      const afterAssigned = Object.values(withStarts).filter(t => t.assignedToBot).length;
      expect(afterAssigned).toBe(originalAssigned);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration: Full grid generation', () => {
    it('should generate complete game grid with all features', () => {
      const tiles = initializeGameGrid({ radius: 5 });
      const withStations = placeGameStations(tiles, { radius: 5 });
      const withDanger = placeDangerTiles(withStations);
      const withStarts = placeStartingTiles(withDanger, 4);
      const final = assignStartingTilesToBots(withStarts, ['bot-0', 'bot-1', 'bot-2', 'bot-3']);
      
      // Verify all features present
      const foodTiles = Object.values(final).filter(t => t.type === 'food');
      const fuelStations = Object.values(final).filter(t => t.type === 'fuel');
      const repairStations = Object.values(final).filter(t => t.type === 'repair');
      const dangerTiles = Object.values(final).filter(t => t.type === 'danger');
      const startTiles = Object.values(final).filter(t => t.type === 'depart');
      
      expect(foodTiles.length).toBeGreaterThan(0);
      expect(fuelStations.length).toBe(2);
      expect(repairStations.length).toBe(2);
      expect(dangerTiles.length).toBeGreaterThan(0);
      expect(startTiles.length).toBe(4);
    });

    it('should generate deterministic grid with seed', () => {
      const generate = (seed: number) => {
        const tiles = initializeGameGrid({ radius: 3, seed });
        const withStations = placeGameStations(tiles, { radius: 3, seed });
        const withDanger = placeDangerTiles(withStations, seed);
        const withStarts = placeStartingTiles(withDanger, 2, seed);
        return assignStartingTilesToBots(withStarts, ['bot-0', 'bot-1']);
      };
      
      const grid1 = generate(42);
      const grid2 = generate(42);
      
      expect(Object.keys(grid1)).toEqual(Object.keys(grid2));
      expect(Object.values(grid1)[0].color).toBe(Object.values(grid2)[0].color);
    });
  });
});
