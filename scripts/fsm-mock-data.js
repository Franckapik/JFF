// Centralisation des données mockées pour test-fsm-cycle.js

// Mock tile de départ
export const mockDepartTile = {
  position: { x: 0, y: 0.5, z: 0, coord: '0,0' },
  type: 'depart',
  assignedToBot: 'test-bot-0',
  walkable: true,
  collected: false,
  neighbors: ['1,1', '2,0'] // Tiles adjacentes dans le rayon
};

// Position initiale
export const initialPosition = {
  x: mockDepartTile.position.x,
  y: 0.5,
  z: mockDepartTile.position.z,
  coord: mockDepartTile.position.coord
};

// Mock tiles pour la grille
export const mockTiles = {
  '0,0': mockDepartTile,
  '1,1': {
    position: { x: 1, y: 0, z: 1, coord: '1,1' },
    resources: { food: 50, debris: 25, special: 0, total: 75 },
    hasResources: true,
    type: 'resource',
    biome: 'plains',
    walkable: true,
    collected: false,
    neighbors: ['0,0', '2,0']
  },
  '2,0': {
    position: { x: 2, y: 0, z: 0, coord: '2,0' },
    resources: { food: 80, debris: 40, special: 0, total: 120 },
    hasResources: true,
    type: 'resource',
    biome: 'forest',
    walkable: true,
    collected: false,
    neighbors: ['0,0', '1,1', '3,3']
  },
  '3,3': {
    position: { x: 3, y: 0, z: 3, coord: '3,3' },
    resources: { food: 100, debris: 50, special: 0, total: 150 },
    hasResources: true,
    type: 'resource',
    biome: 'forest',
    walkable: true,
    collected: false,
    neighbors: ['2,0', '7,7']
  },
  '7,7': {
    position: { x: 7, y: 0, z: 7, coord: '7,7' },
    resources: { food: 50, debris: 100, special: 0, total: 150 },
    hasResources: true,
    type: 'resource',
    biome: 'desert',
    walkable: true,
    collected: false,
    neighbors: ['3,3']
  }
};

// Tiles disponibles pour l'injection
export const availableTiles = [
  mockTiles['1,1'],
  mockTiles['2,0'],
  mockTiles['3,3'],
  mockTiles['7,7']
];

// Paramètres de ressources pour les tests de collecte
export const collectAmounts = [
  { food: 300, debris: 400, special: 0 },
  { food: 500, debris: 600, special: 0 },
  { food: 10, debris: 10, special: 0 }
];

// Utilitaire pour générer un contexte initialisé
import { createMachineContext } from '../src/ai/fsm/machineX/context/initialContext.ts';
export function makeInitialContext(botId = 'test-bot-0', mode = 'auto') {
  const baseContext = createMachineContext(botId, mode);
  return {
    ...baseContext,
    vehicle: {
      ...baseContext.vehicle,
      position: initialPosition,
      basePosition: initialPosition,
    },
    droneFleet: {
      ...baseContext.droneFleet,
      drones: {
        ...baseContext.droneFleet.drones,
        explorer: {
          ...baseContext.droneFleet.drones.explorer,
          position: initialPosition,
        },
        combat: {
          ...baseContext.droneFleet.drones.combat,
          position: initialPosition,
        },
        special: {
          ...baseContext.droneFleet.drones.special,
          position: initialPosition,
        }
      }
    },
    gridInfo: {
      tiles: mockTiles,
      spacing: 1.2,
      radius: 3,
      departTileCoord: '0,0',
      syncedAt: Date.now(),
    },
    injectedData: {
      availableTiles,
      injectedAt: Date.now(),
    },
  };
}
