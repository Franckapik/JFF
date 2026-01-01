/**
 * ==========================================================================
 * MOCK DATA - Données partagées pour tests (Test + Front)
 * ==========================================================================
 * 
 * Module partagé contenant les données mockées pour les tests autonomes
 * Permet de garantir que le test et le front utilisent exactement les mêmes données
 */

import type { FSMContext } from '../../../../types/fsm.d';
import type { TileState } from '../../../../types/tile.d';
import { createMachineContext } from '../context/initialContext';

// ========================================
// Positions et tuiles mock
// ========================================

/** Position initiale (tile de départ) */
export const initialPosition = {
  x: 0,
  y: 0.5,
  z: 0,
  coord: '0,0'
} as const;

/** Tuile de départ */
export const mockDepartTile: TileState = {
  position: { x: 0, y: 0.5, z: 0, coord: '0,0' },
  type: 'depart',
  assignedToBot: 'test-bot-0',
  walkable: true,
  collected: false,
  neighbors: ['1,1', '2,0'],
  resources: { food: 0, debris: 0, special: 0, total: 0 },
  hasResources: false,
  biome: 'plains',
  discovered: true,
  scanned: false,
};

/** Tuiles de ressources mockées */
export const mockTiles: Record<string, TileState> = {
  '0,0': mockDepartTile,
  '1,1': {
    position: { x: 1, y: 0, z: 1, coord: '1,1' },
    resources: { food: 50, debris: 25, special: 0, total: 75 },
    hasResources: true,
    type: 'resource',
    biome: 'plains',
    walkable: true,
    collected: false,
    neighbors: ['0,0', '2,0'],
    discovered: false,
    scanned: false,
  },
  '2,0': {
    position: { x: 2, y: 0, z: 0, coord: '2,0' },
    resources: { food: 80, debris: 40, special: 0, total: 120 },
    hasResources: true,
    type: 'resource',
    biome: 'forest',
    walkable: true,
    collected: false,
    neighbors: ['0,0', '1,1', '3,3'],
    discovered: false,
    scanned: false,
  },
  '3,3': {
    position: { x: 3, y: 0, z: 3, coord: '3,3' },
    resources: { food: 100, debris: 50, special: 0, total: 150 },
    hasResources: true,
    type: 'resource',
    biome: 'forest',
    walkable: true,
    collected: false,
    neighbors: ['2,0', '7,7'],
    discovered: false,
    scanned: false,
  },
  '7,7': {
    position: { x: 7, y: 0, z: 7, coord: '7,7' },
    resources: { food: 50, debris: 100, special: 0, total: 150 },
    hasResources: true,
    type: 'resource',
    biome: 'desert',
    walkable: true,
    collected: false,
    neighbors: ['3,3'],
    discovered: false,
    scanned: false,
  }
};

/** Tuiles disponibles pour l'injection (exclut la tuile de départ) */
export const availableTiles: TileState[] = [
  mockTiles['1,1'],
  mockTiles['2,0'],
  mockTiles['3,3'],
  mockTiles['7,7']
];

// ========================================
// Paramètres de test
// ========================================

/** Quantités de ressources pour tests de collecte */
export const collectAmounts = [
  { food: 300, debris: 400, special: 0 },
  { food: 500, debris: 600, special: 0 },
  { food: 10, debris: 10, special: 0 }
] as const;

/** Configuration de la grille mock */
export const mockGridConfig = {
  spacing: 1.2,
  radius: 3,
  departTileCoord: '0,0'
} as const;

// ========================================
// Fonction de génération de contexte
// ========================================

/**
 * Génère un contexte initial avec les données mockées
 * 
 * @param botId - ID du bot (défaut: 'test-bot-0')
 * @param mode - Mode d'initialisation (défaut: 'auto')
 * @returns Contexte FSM prêt à l'emploi avec tuiles mockées
 */
export function makeInitialContext(botId: string = 'test-bot-0', mode: 'auto' | 'manual' = 'auto'): FSMContext {
  const baseContext = createMachineContext(botId, mode);
  
  return {
    ...baseContext,
    vehicle: {
      ...baseContext.vehicle,
      position: { ...initialPosition },
      basePosition: { ...initialPosition },
    },
    droneFleet: {
      ...baseContext.droneFleet,
      drones: {
        explorer: {
          ...baseContext.droneFleet.drones.explorer,
          position: { ...initialPosition },
        },
        combat: {
          ...baseContext.droneFleet.drones.combat,
          position: { ...initialPosition },
        },
        special: {
          ...baseContext.droneFleet.drones.special,
          position: { ...initialPosition },
        }
      }
    },
    gridInfo: {
      tiles: mockTiles,
      spacing: mockGridConfig.spacing,
      radius: mockGridConfig.radius,
      departTileCoord: mockGridConfig.departTileCoord,
      syncedAt: Date.now(),
    },
    injectedData: {
      availableTiles,
      injectedAt: Date.now(),
    },
  };
}
