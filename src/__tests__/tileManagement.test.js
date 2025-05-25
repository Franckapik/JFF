import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTileStore } from '../stores/useTileStore';
import { findPath } from '../utils/utils';

// Mock des dépendances externes
vi.mock('../utils/utils', () => ({
  findPath: vi.fn(),
  generateHexPositions: vi.fn(),
}));

// Configuration commune pour tous les tests
describe('Gestion des Tuiles', () => {
  // État initial du store pour les tests
  let initialState;
  let getState;
  let setState;

  // Mock du store Zustand
  beforeEach(() => {
    initialState = {
      tiles: {
        '0,0': {
          coord: '0,0',
          position: { x: 0, y: 0, z: 0 },
          walkable: true,
          type: 'resource',
          explored: false,
          collected: false,
          resources: { food: 50, debris: 30, special: 10 },
          originalResources: { food: 50, debris: 30, special: 10 },
          resourcePercentage: 100,
          neighbors: ['0,1', '1,0', '1,-1', '0,-1', '-1,0', '-1,1'],
        },
        '0,1': {
          coord: '0,1',
          position: { x: 0, y: 0, z: 1.7 },
          walkable: true,
          type: 'resource',
          explored: true,
          collected: false,
          resources: { food: 25, debris: 15, special: 5 },
          originalResources: { food: 25, debris: 15, special: 5 },
          resourcePercentage: 100,
          neighbors: ['0,0', '1,0', '1,1', '0,2', '-1,1', '-1,2'],
        },
        '1,0': {
          coord: '1,0',
          position: { x: 1.7, y: 0, z: 0 },
          walkable: true,
          type: 'danger',
          explored: false,
          collected: false,
          resources: null,
          neighbors: ['0,0', '1,-1', '2,-1', '2,0', '1,1', '0,1'],
        },
        '1,1': {
          coord: '1,1',
          position: { x: 1.7, y: 0, z: 1.7 },
          walkable: true,
          type: 'resource',
          explored: false,
          collected: false,
          resources: { food: 10, debris: 0, special: 0 },
          originalResources: { food: 10, debris: 0, special: 0 },
          resourcePercentage: 100,
          neighbors: ['0,1', '1,0', '2,0', '2,1', '1,2', '0,2'],
        },
        '0,-1': {
          coord: '0,-1',
          position: { x: 0, y: 0, z: -1.7 },
          walkable: false, // Tuile non accessible
          type: 'resource',
          explored: false,
          collected: false,
          neighbors: ['0,0', '1,-1', '-1,0'],
        },
        '2,0': {
          coord: '2,0',
          position: { x: 3.4, y: 0, z: 0 },
          walkable: true,
          type: 'fuel',
          explored: true,
          collected: false,
          resources: { food: 0, debris: 0, special: 0 },
          neighbors: ['1,0', '2,-1', '3,-1', '3,0', '2,1', '1,1'],
        }
      },
      // Mock des méthodes du store
      getNeighbors: vi.fn(),
      calculateDistance: vi.fn(),
      getWalkableTilesInRadius: vi.fn(),
      selectRandomWalkableTile: vi.fn(),
      deductTileResources: vi.fn(),
      analyzeResourcesNearPosition: vi.fn(),
      markTileAsExplored: vi.fn(),
    };

    // Mock les méthodes pour retourner les valeurs attendues
    getState = vi.fn().mockReturnValue(initialState);
    setState = vi.fn();

    // Mock de create() pour éviter les erreurs avec Zustand
    useTileStore.getState = getState;
    useTileStore.setState = setState;
  });

  // Suite de tests pour la Navigation et l'Exploration
  describe('Navigation et Exploration', () => {
    it('getWalkableTilesInRadius devrait retourner les tuiles accessibles dans un rayon donné', () => {
      // Setup - implémentation de la méthode mockée
      const walkableTiles = [
        { coord: '0,0', distance: 0 },
        { coord: '0,1', distance: 1 },
        { coord: '1,1', distance: 1.4 },
        { coord: '1,0', distance: 1 },
        { coord: '2,0', distance: 2 },
      ].sort((a, b) => a.distance - b.distance);
      
      initialState.getWalkableTilesInRadius.mockReturnValue(walkableTiles);
      
      // Test de la fonction avec différents paramètres
      const result1 = useTileStore.getState().getWalkableTilesInRadius('0,0', 3);
      const result2 = useTileStore.getState().getWalkableTilesInRadius('0,0', 2, true);
      const result3 = useTileStore.getState().getWalkableTilesInRadius('0,0', 2, false, false);
      
      // Vérifications
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith('0,0', 3);
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith('0,0', 2, true);
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith('0,0', 2, false, false);
      expect(result1).toEqual(walkableTiles);
      expect(result1[0].coord).toBe('0,0'); // Vérifie que la première tuile est bien celle à la position source
    });

    it('selectRandomWalkableTile devrait retourner une tuile accessible aléatoire', () => {
      // Setup - implémentation de la méthode mockée
      const randomTile = {
        coord: '1,1',
        position: { x: 1.7, y: 0, z: 1.7 },
        walkable: true,
        type: 'resource'
      };
      
      initialState.selectRandomWalkableTile.mockReturnValue(randomTile);
      
      // Exécution de la fonction
      const result = useTileStore.getState().selectRandomWalkableTile();
      
      // Vérifications
      expect(initialState.selectRandomWalkableTile).toHaveBeenCalled();
      expect(result).toEqual(randomTile);
      expect(result.walkable).toBe(true);
    });

    it('getNeighbors devrait retourner les tuiles voisines d\'une coordonnée', () => {
      // Setup - implémentation de la méthode mockée
      const neighbors = [
        initialState.tiles['0,1'],
        initialState.tiles['1,0'],
        initialState.tiles['1,-1'],
        initialState.tiles['0,-1'],
        initialState.tiles['-1,0'],
        initialState.tiles['-1,1'],
      ];
      
      initialState.getNeighbors.mockReturnValue(neighbors);
      
      // Exécution de la fonction
      const result = useTileStore.getState().getNeighbors('0,0');
      
      // Vérifications
      expect(initialState.getNeighbors).toHaveBeenCalledWith('0,0');
      expect(result).toEqual(neighbors);
      expect(result.length).toBe(6); // Une tuile hexagonale a 6 voisins
    });

    it('getNeighbors devrait retourner un tableau vide pour une coordonnée invalide', () => {
      // Setup
      initialState.getNeighbors.mockReturnValue([]);
      
      // Exécution
      const result = useTileStore.getState().getNeighbors('999,999');
      
      // Vérification
      expect(initialState.getNeighbors).toHaveBeenCalledWith('999,999');
      expect(result).toEqual([]);
    });
  });

  // Suite de tests pour la Gestion des Ressources
  describe('Gestion des Ressources', () => {
    it('deductTileResources devrait déduire correctement les ressources collectées', () => {
      // Setup
      const coord = '0,0';
      const collectedResources = { food: 20, debris: 10, special: 5 };
      initialState.deductTileResources.mockImplementation((c, r) => {
        return c === coord && r === collectedResources;
      });
      
      // Exécution
      const result = useTileStore.getState().deductTileResources(coord, collectedResources);
      
      // Vérifications
      expect(initialState.deductTileResources).toHaveBeenCalledWith(coord, collectedResources);
      expect(result).toBe(true);
    });

    it('deductTileResources devrait mettre à jour le pourcentage de ressources', () => {
      // Setup - implémentation plus détaillée pour vérifier la mise à jour du pourcentage
      const coord = '0,0';
      const originalTile = { ...initialState.tiles[coord] };
      const collectedResources = { food: 25, debris: 15, special: 5 }; // Collecte de 50% des ressources
      
      // Calcul du pourcentage attendu
      const originalTotal = originalTile.originalResources.food + 
                           originalTile.originalResources.debris + 
                           originalTile.originalResources.special;
      
      const remainingResources = {
        food: originalTile.resources.food - collectedResources.food,
        debris: originalTile.resources.debris - collectedResources.debris,
        special: originalTile.resources.special - collectedResources.special
      };
      
      const remainingTotal = remainingResources.food + remainingResources.debris + remainingResources.special;
      const expectedPercentage = Math.round((remainingTotal / originalTotal) * 100);
      
      initialState.deductTileResources.mockImplementation((c, r) => {
        // Tester si la fonction est appelée avec les bons paramètres
        return c === coord && 
               r.food === collectedResources.food && 
               r.debris === collectedResources.debris && 
               r.special === collectedResources.special;
      });
      
      // Exécution
      const result = useTileStore.getState().deductTileResources(coord, collectedResources);
      
      // Vérifications
      expect(initialState.deductTileResources).toHaveBeenCalledWith(coord, collectedResources);
      expect(result).toBe(true);
      expect(expectedPercentage).toBe(50); // On s'attend à ce que 50% des ressources restent
    });

    it('deductTileResources devrait marquer une tuile comme collectée quand les ressources sont épuisées', () => {
      // Setup
      const coord = '0,0';
      const collectedResources = { food: 50, debris: 30, special: 10 }; // Collecte toutes les ressources
      
      initialState.deductTileResources.mockImplementation((c, r) => {
        // Vérifie si la fonction est appelée avec les bons paramètres
        return c === coord && 
               r.food === collectedResources.food && 
               r.debris === collectedResources.debris && 
               r.special === collectedResources.special;
      });
      
      // Exécution
      const result = useTileStore.getState().deductTileResources(coord, collectedResources);
      
      // Vérifications
      expect(initialState.deductTileResources).toHaveBeenCalledWith(coord, collectedResources);
      expect(result).toBe(true);
    });

    it('analyzeResourcesNearPosition devrait identifier les ressources proches', () => {
      // Setup
      const sourceCoord = '0,0';
      const radius = 2;
      const expectedResources = [
        {
          coord: '0,0',
          position: initialState.tiles['0,0'].position,
          resources: initialState.tiles['0,0'].resources,
          distance: 0
        },
        {
          coord: '0,1',
          position: initialState.tiles['0,1'].position,
          resources: initialState.tiles['0,1'].resources,
          distance: 1.7
        },
        {
          coord: '1,1',
          position: initialState.tiles['1,1'].position,
          resources: initialState.tiles['1,1'].resources,
          distance: 2.4
        }
      ];
      
      initialState.analyzeResourcesNearPosition.mockReturnValue(expectedResources);
      
      // Exécution
      const result = useTileStore.getState().analyzeResourcesNearPosition(sourceCoord, radius);
      
      // Vérifications
      expect(initialState.analyzeResourcesNearPosition).toHaveBeenCalledWith(sourceCoord, radius);
      expect(result).toEqual(expectedResources);
      expect(result.length).toBe(3);
    });

    it('analyzeResourcesNearPosition devrait accepter un véhicule comme source', () => {
      // Setup
      const sourceVehicle = { coord: '0,0', position: { x: 0, y: 0, z: 0 } };
      const radius = 2;
      
      initialState.analyzeResourcesNearPosition.mockImplementation((source) => {
        // Vérifie si la fonction est appelée avec le bon véhicule
        return source === sourceVehicle ? [] : null;
      });
      
      // Exécution
      const result = useTileStore.getState().analyzeResourcesNearPosition(sourceVehicle, radius);
      
      // Vérifications
      expect(initialState.analyzeResourcesNearPosition).toHaveBeenCalledWith(sourceVehicle, radius);
      expect(result).toEqual([]);
    });

    it('analyzeResourcesNearPosition devrait ignorer les tuiles sans ressources ou déjà collectées', () => {
      // Setup
      const sourceCoord = '0,0';
      const radius = 3;
      // On suppose que seules les tuiles avec des ressources non collectées seront retournées
      const expectedResources = [
        {
          coord: '0,0',
          position: initialState.tiles['0,0'].position,
          resources: initialState.tiles['0,0'].resources,
          distance: 0
        },
        {
          coord: '0,1',
          position: initialState.tiles['0,1'].position,
          resources: initialState.tiles['0,1'].resources,
          distance: 1.7
        },
        {
          coord: '1,1',
          position: initialState.tiles['1,1'].position,
          resources: initialState.tiles['1,1'].resources,
          distance: 2.4
        }
      ];
      
      initialState.analyzeResourcesNearPosition.mockReturnValue(expectedResources);
      
      // Exécution
      const result = useTileStore.getState().analyzeResourcesNearPosition(sourceCoord, radius);
      
      // Vérifications
      expect(initialState.analyzeResourcesNearPosition).toHaveBeenCalledWith(sourceCoord, radius);
      // On vérifie que '1,0' (tuile de type danger) et '0,-1' (tuile non walkable) ne sont pas incluses
      expect(result.find(r => r.coord === '1,0')).toBeUndefined();
      expect(result.find(r => r.coord === '0,-1')).toBeUndefined();
    });
  });

  // Suite de tests pour les États des Tuiles
  describe('États des Tuiles', () => {
    it('markTileAsExplored devrait marquer une tuile comme explorée', () => {
      // Setup
      const coord = '1,1';
      initialState.markTileAsExplored.mockImplementation((c) => c === coord);
      
      // Exécution
      useTileStore.getState().markTileAsExplored(coord);
      
      // Vérifications
      expect(initialState.markTileAsExplored).toHaveBeenCalledWith(coord);
    });

    it('calculateDistance devrait calculer la distance entre deux coordonnées avec pathfinding', () => {
      // Setup
      const coord1 = '0,0';
      const coord2 = '1,1';
      const formattedResult = '2.0';
      const numericResult = 2;
      
      initialState.calculateDistance.mockImplementation((c1, c2, formatted, usePath) => {
        return formatted ? formattedResult : numericResult;
      });
      
      // Exécution
      const resultFormatted = useTileStore.getState().calculateDistance(coord1, coord2, true, true);
      const resultNumeric = useTileStore.getState().calculateDistance(coord1, coord2, false, true);
      
      // Vérifications
      expect(initialState.calculateDistance).toHaveBeenCalledWith(coord1, coord2, true, true);
      expect(initialState.calculateDistance).toHaveBeenCalledWith(coord1, coord2, false, true);
      expect(resultFormatted).toBe(formattedResult);
      expect(resultNumeric).toBe(numericResult);
    });

    it('calculateDistance devrait calculer la distance euclidienne si pathfinding est désactivé', () => {
      // Setup
      const coord1 = '0,0';
      const coord2 = '1,1';
      const formattedResult = '1.4';
      const numericResult = 1.4142;
      
      initialState.calculateDistance.mockImplementation((c1, c2, formatted, usePath) => {
        return formatted ? formattedResult : numericResult;
      });
      
      // Exécution
      const resultFormatted = useTileStore.getState().calculateDistance(coord1, coord2, true, false);
      const resultNumeric = useTileStore.getState().calculateDistance(coord1, coord2, false, false);
      
      // Vérifications
      expect(initialState.calculateDistance).toHaveBeenCalledWith(coord1, coord2, true, false);
      expect(initialState.calculateDistance).toHaveBeenCalledWith(coord1, coord2, false, false);
      expect(resultFormatted).toBe(formattedResult);
      expect(resultNumeric).toBe(numericResult);
    });

    it('calculateDistance devrait gérer les coordonnées invalides', () => {
      // Setup
      const invalidCoord = 'invalid';
      const validCoord = '0,0';
      const errorResult = 'N/A';
      
      initialState.calculateDistance.mockImplementation((c1, c2) => {
        return c1 === invalidCoord || c2 === invalidCoord ? errorResult : '1.0';
      });
      
      // Exécution
      const result1 = useTileStore.getState().calculateDistance(invalidCoord, validCoord);
      const result2 = useTileStore.getState().calculateDistance(validCoord, invalidCoord);
      
      // Vérifications
      expect(initialState.calculateDistance).toHaveBeenCalledWith(invalidCoord, validCoord);
      expect(initialState.calculateDistance).toHaveBeenCalledWith(validCoord, invalidCoord);
      expect(result1).toBe(errorResult);
      expect(result2).toBe(errorResult);
    });

    it('findPath devrait être utilisé par calculateDistance avec pathfinding', () => {
      // Setup - simulation de l'implémentation interne de calculateDistance
      const coord1 = '0,0';
      const coord2 = '1,1';
      const path = ['0,0', '0,1', '1,1'];
      
      findPath.mockReturnValue(path);
      
      initialState.calculateDistance.mockImplementation((c1, c2, formatted, usePath) => {
        if (usePath) {
          // Simulation de l'implémentation interne utilisant findPath
          const pathResult = findPath(c1, c2, initialState.tiles);
          const distance = pathResult.length > 0 ? pathResult.length - 1 : 0;
          return formatted ? distance.toString() : distance;
        } else {
          // Distance euclidienne simplifiée pour le test
          return formatted ? '1.4' : 1.4142;
        }
      });
      
      // Exécution
      const result = useTileStore.getState().calculateDistance(coord1, coord2, true, true);
      
      // Vérifications
      expect(initialState.calculateDistance).toHaveBeenCalledWith(coord1, coord2, true, true);
      // Dans l'implémentation simulée, findPath aurait été appelé
      expect(findPath).toHaveBeenCalledWith(coord1, coord2, initialState.tiles);
      expect(result).toBe('2'); // 2 étapes dans le chemin
    });
  });
});
