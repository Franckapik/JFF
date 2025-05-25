
import { findPath, calculatePathDistance, findTileAtPosition, generateHexPositions } from '../utils/utils';
import { Vector3 } from 'three';

// Mock the external store dependencies since we're testing the functions in isolation
jest.mock('../stores/useGameStore', () => ({
  getState: jest.fn().mockReturnValue({
    playerCount: 2
  })
}));

describe('Section 5: Pathfinding et Navigation', () => {
  describe('findPath', () => {
    it('should find a direct path between adjacent tiles', () => {
      // Simple grid with two adjacent tiles
      const tiles = {
        'A0': {
          coord: 'A0',
          walkable: true,
          neighbors: ['B0']
        },
        'B0': {
          coord: 'B0',
          walkable: true,
          neighbors: ['A0']
        }
      };

      const path = findPath('A0', 'B0', tiles);
      expect(path).toEqual(['A0', 'B0']);
    });

    it('should find a path through multiple tiles', () => {
      // Create a simple path A0 -> B0 -> C0
      const tiles = {
        'A0': {
          coord: 'A0',
          walkable: true,
          neighbors: ['B0']
        },
        'B0': {
          coord: 'B0',
          walkable: true,
          neighbors: ['A0', 'C0']
        },
        'C0': {
          coord: 'C0',
          walkable: true,
          neighbors: ['B0']
        }
      };

      const path = findPath('A0', 'C0', tiles);
      expect(path).toEqual(['A0', 'B0', 'C0']);
    });

    it('should return empty array when no path exists', () => {
      // Create tiles with no valid path between A0 and C0
      const tiles = {
        'A0': {
          coord: 'A0',
          walkable: true,
          neighbors: ['B0']
        },
        'B0': {
          coord: 'B0',
          walkable: false, // B0 is not walkable
          neighbors: ['A0', 'C0']
        },
        'C0': {
          coord: 'C0',
          walkable: true,
          neighbors: ['B0']
        }
      };

      const path = findPath('A0', 'C0', tiles);
      expect(path).toEqual([]);
    });

    it('should return direct path when start and target are the same', () => {
      const tiles = {
        'A0': {
          coord: 'A0',
          walkable: true,
          neighbors: ['B0']
        },
        'B0': {
          coord: 'B0',
          walkable: true,
          neighbors: ['A0']
        }
      };

      const path = findPath('A0', 'A0', tiles);
      expect(path).toEqual(['A0']);
    });

    it('should find the shortest path when multiple paths exist', () => {
      // Create a grid with multiple possible paths
      const tiles = {
        'A0': {
          coord: 'A0',
          walkable: true,
          neighbors: ['B0', 'A1']
        },
        'B0': {
          coord: 'B0',
          walkable: true,
          neighbors: ['A0', 'C0']
        },
        'C0': {
          coord: 'C0',
          walkable: true,
          neighbors: ['B0', 'C1']
        },
        'A1': {
          coord: 'A1',
          walkable: true,
          neighbors: ['A0', 'B1']
        },
        'B1': {
          coord: 'B1',
          walkable: true,
          neighbors: ['A1', 'C1']
        },
        'C1': {
          coord: 'C1',
          walkable: true,
          neighbors: ['C0', 'B1']
        }
      };

      const path = findPath('A0', 'C0', tiles);
      // The shortest path should be A0 -> B0 -> C0 (not going through A1)
      expect(path).toEqual(['A0', 'B0', 'C0']);
    });
  });

  describe('calculatePathDistance', () => {
    it('should calculate the total distance of a path', () => {
      const tiles = {
        'A0': {
          coord: 'A0',
          position: { x: 0, y: 0, z: 0 }
        },
        'B0': {
          coord: 'B0',
          position: { x: 1, y: 0, z: 0 }
        },
        'C0': {
          coord: 'C0',
          position: { x: 2, y: 0, z: 0 }
        }
      };

      const path = ['A0', 'B0', 'C0'];
      const distance = calculatePathDistance(path, tiles);
      
      // The distance should be 1 (A0 to B0) + 1 (B0 to C0) = 2
      expect(distance).toBe(2);
    });

    it('should return 0 for a path with only one tile', () => {
      const tiles = {
        'A0': {
          coord: 'A0',
          position: { x: 0, y: 0, z: 0 }
        }
      };

      const path = ['A0'];
      const distance = calculatePathDistance(path, tiles);
      expect(distance).toBe(0);
    });

    it('should return 0 for an empty path', () => {
      const tiles = {};
      const path = [];
      const distance = calculatePathDistance(path, tiles);
      expect(distance).toBe(0);
    });

    it('should handle diagonal distances correctly', () => {
      const tiles = {
        'A0': {
          coord: 'A0',
          position: { x: 0, y: 0, z: 0 }
        },
        'B1': {
          coord: 'B1',
          position: { x: 1, y: 0, z: 1 }
        }
      };

      const path = ['A0', 'B1'];
      const distance = calculatePathDistance(path, tiles);
      
      // The distance should be sqrt(2) ≈ 1.414...
      // Use toBeCloseTo for floating point comparison
      expect(distance).toBeCloseTo(Math.sqrt(2), 5);
    });

    it('should handle missing tiles gracefully', () => {
      const tiles = {
        'A0': {
          coord: 'A0',
          position: { x: 0, y: 0, z: 0 }
        },
        // B0 is missing
        'C0': {
          coord: 'C0',
          position: { x: 2, y: 0, z: 0 }
        }
      };

      const path = ['A0', 'B0', 'C0'];
      const distance = calculatePathDistance(path, tiles);
      
      // Should only calculate the distance for valid tiles, which is 0 here
      expect(distance).toBe(0);
    });
  });

  describe('findTileAtPosition', () => {
    it('should find a tile at the exact position', () => {
      const tiles = {
        'A0': {
          coord: 'A0',
          position: { x: 0, y: 0, z: 0 }
        },
        'B0': {
          coord: 'B0',
          position: { x: 1, y: 0, z: 0 }
        }
      };

      const position = { x: 0, y: 0, z: 0 };
      const tile = findTileAtPosition(position, tiles);
      
      expect(tile).toEqual(tiles['A0']);
    });

    it('should find a tile within the threshold', () => {
      const tiles = {
        'A0': {
          coord: 'A0',
          position: { x: 0, y: 0, z: 0 }
        },
        'B0': {
          coord: 'B0',
          position: { x: 1, y: 0, z: 0 }
        }
      };

      // Position is a little off, but within threshold
      const position = { x: 0.1, y: 0, z: 0.1 };
      const tile = findTileAtPosition(position, tiles);
      
      expect(tile).toEqual(tiles['A0']);
    });

    it('should return undefined when no tile is found at the position', () => {
      const tiles = {
        'A0': {
          coord: 'A0',
          position: { x: 0, y: 0, z: 0 }
        },
        'B0': {
          coord: 'B0',
          position: { x: 1, y: 0, z: 0 }
        }
      };

      // Position is too far from any tile
      const position = { x: 0.5, y: 0, z: 0.5 };
      const tile = findTileAtPosition(position, tiles);
      
      expect(tile).toBeUndefined();
    });

    it('should handle Vector3 objects as position', () => {
      const tiles = {
        'A0': {
          coord: 'A0',
          position: { x: 0, y: 0, z: 0 }
        }
      };

      const position = new Vector3(0, 0, 0);
      const tile = findTileAtPosition(position, tiles);
      
      expect(tile).toEqual(tiles['A0']);
    });
  });

  describe('generateHexPositions', () => {
    it('should generate a hexagonal grid with the correct radius', () => {
      const radius = 2;
      const spacing = 0.1;
      
      const hexPositions = generateHexPositions(radius, spacing);
      
      // For radius = 2, we should have 19 tiles in total (formula: 3r² + 3r + 1)
      // Where r is the radius
      expect(hexPositions.length).toBe(3 * radius * radius + 3 * radius + 1);
    });

    it('should set correct tile properties', () => {
      const radius = 1;
      const spacing = 0;
      
      const hexPositions = generateHexPositions(radius, spacing);
      
      // Check that each tile has the required properties
      hexPositions.forEach(tile => {
        expect(tile).toHaveProperty('coord');
        expect(tile).toHaveProperty('position');
        expect(tile).toHaveProperty('walkable');
        expect(tile).toHaveProperty('explored');
        expect(tile).toHaveProperty('collected');
        expect(tile).toHaveProperty('type');
        expect(tile).toHaveProperty('neighbors');
        expect(tile).toHaveProperty('resources');
      });
    });

    it('should set correct neighbor relationships', () => {
      const radius = 1;
      const spacing = 0;
      
      const hexPositions = generateHexPositions(radius, spacing);
      
      // Convert array to object for easier lookup
      const tilesObject = {};
      hexPositions.forEach(tile => {
        tilesObject[tile.coord] = tile;
      });
      
      // Check that neighbor relationships are bidirectional
      hexPositions.forEach(tile => {
        tile.neighbors.forEach(neighborCoord => {
          const neighbor = tilesObject[neighborCoord];
          expect(neighbor).toBeDefined();
          expect(neighbor.neighbors).toContain(tile.coord);
        });
      });
    });

    it('should set player starting positions', () => {
      const radius = 2;
      const spacing = 0.1;
      
      const hexPositions = generateHexPositions(radius, spacing);
      
      // We should have starting positions for players (type = "depart")
      const startTiles = hexPositions.filter(tile => tile.type === "depart");
      expect(startTiles.length).toBeGreaterThan(0);
    });

    it('should create fuel and repair stations', () => {
      const radius = 3;
      const spacing = 0.1;
      
      const hexPositions = generateHexPositions(radius, spacing);
      
      // Check for fuel stations
      const fuelStations = hexPositions.filter(tile => tile.type === "fuel");
      expect(fuelStations.length).toBe(2);
      
      // Check for repair stations
      const repairStations = hexPositions.filter(tile => tile.type === "repair");
      expect(repairStations.length).toBe(2);
    });

    it('should set danger tiles', () => {
      const radius = 3;
      const spacing = 0.1;
      
      const hexPositions = generateHexPositions(radius, spacing);
      
      // Check that there are danger tiles
      const dangerTiles = hexPositions.filter(tile => tile.type === "danger");
      expect(dangerTiles.length).toBeGreaterThan(0);
      
      // Danger tiles should have no resources
      dangerTiles.forEach(tile => {
        expect(tile.resources).toBeNull();
      });
    });
  });
});
