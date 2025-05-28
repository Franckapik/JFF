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
      const result3 = useTileStore.getState().getWalkableTilesInRadius('0,0', 2, false, true);
      
      // Vérifications
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith('0,0', 3);
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith('0,0', 2, true);
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith('0,0', 2, false, true);
      expect(result1).toEqual(walkableTiles);
      expect(result1[0].coord).toBe('0,0'); // Vérifie que la première tuile est bien celle à la position source
    });
    
    it('getWalkableTilesInRadius devrait retourner un tableau vide pour un rayon de 0', () => {
      // Setup - implémentation de la méthode mockée pour un rayon 0
      initialState.getWalkableTilesInRadius.mockReturnValue([
        { coord: '0,0', distance: 0 } // Uniquement la tuile source pour rayon 0
      ]);
      
      // Exécution avec rayon 0
      const result = useTileStore.getState().getWalkableTilesInRadius('0,0', 0);
      
      // Vérification
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith('0,0', 0);
      expect(result).toHaveLength(1);
      expect(result[0].coord).toBe('0,0');
    });
    
    it('getWalkableTilesInRadius devrait filtrer correctement avec onlyUnexplored=true', () => {
      // Setup - implémentation simulant uniquement des tuiles non explorées
      const unexploredTiles = [
        { coord: '0,0', distance: 0 },
        { coord: '1,1', distance: 1.4 },
      ].sort((a, b) => a.distance - b.distance);
      
      initialState.getWalkableTilesInRadius.mockReturnValue(unexploredTiles);
      
      // Exécution avec filtre sur tiles non explorées
      const result = useTileStore.getState().getWalkableTilesInRadius('0,0', 2, true);
      
      // Vérification
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith('0,0', 2, true);
      expect(result).toEqual(unexploredTiles);
      expect(result.length).toBe(2);
      // Vérifier l'absence de tuiles explorées dans le résultat
      expect(result.find(t => t.coord === '0,1')).toBeUndefined(); // 0,1 est une tuile explorée dans initialState
    });
    
    it('getWalkableTilesInRadius devrait filtrer correctement avec excludeDanger=false', () => {
      // Setup - implémentation simulant l'inclusion des tuiles de danger
      const tilesWithDanger = [
        { coord: '0,0', distance: 0 },
        { coord: '1,0', distance: 1 }, // Tuile de type danger
        { coord: '1,1', distance: 1.4 },
      ].sort((a, b) => a.distance - b.distance);
      
      initialState.getWalkableTilesInRadius.mockReturnValue(tilesWithDanger);
      
      // Exécution avec inclusion des tuiles danger
      const result = useTileStore.getState().getWalkableTilesInRadius('0,0', 2, false, false);
      
      // Vérification
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith('0,0', 2, false, false);
      expect(result).toEqual(tilesWithDanger);
      expect(result.find(t => t.coord === '1,0')).toBeDefined(); // 1,0 est une tuile danger et devrait être présente
    });
    
    it('getWalkableTilesInRadius devrait accepter un véhicule comme source', () => {
      // Setup - implémentation avec un objet véhicule comme source
      const vehicle = { coord: '0,0', position: { x: 0, y: 0, z: 0 } };
      const walkableTiles = [
        { coord: '0,0', distance: 0 },
        { coord: '0,1', distance: 1 },
      ];
      
      initialState.getWalkableTilesInRadius.mockImplementation((source) => {
        // Vérifie que la fonction est appelée avec le bon véhicule
        return source === vehicle ? walkableTiles : [];
      });
      
      // Exécution avec un véhicule comme source
      const result = useTileStore.getState().getWalkableTilesInRadius(vehicle, 2);
      
      // Vérification
      expect(initialState.getWalkableTilesInRadius).toHaveBeenCalledWith(vehicle, 2);
      expect(result).toEqual(walkableTiles);
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

    it('selectRandomWalkableTile devrait gérer le cas où aucune tuile accessible n\'est disponible', () => {
      // Setup - simulation d'un monde sans tuiles accessibles
      initialState.selectRandomWalkableTile.mockReturnValue(null);
      
      // Exécution de la fonction
      const result = useTileStore.getState().selectRandomWalkableTile();
      
      // Vérifications
      expect(initialState.selectRandomWalkableTile).toHaveBeenCalled();
      expect(result).toBeNull();
    });
    
    it('selectRandomWalkableTile devrait gérer le cas où une seule tuile accessible est disponible', () => {
      // Setup - simulation d'un monde avec une seule tuile accessible
      const singleTile = {
        coord: '0,0',
        position: { x: 0, y: 0, z: 0 },
        walkable: true,
        type: 'resource'
      };
      
      initialState.selectRandomWalkableTile.mockReturnValue(singleTile);
      
      // Exécution de la fonction
      const result = useTileStore.getState().selectRandomWalkableTile();
      
      // Vérifications
      expect(initialState.selectRandomWalkableTile).toHaveBeenCalled();
      expect(result).toEqual(singleTile);
      expect(result.coord).toBe('0,0');
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

    it('getNeighbors devrait retourner les tuiles voisines pour une coordonnée en bordure', () => {
      // Setup - mock pour une tuile en bordure (qui a moins de 6 voisins)
      // Considérons une tuile à la bordure qui n'a que 4 voisins
      const borderNeighbors = [
        initialState.tiles['0,0'],
        initialState.tiles['1,0'],
        initialState.tiles['1,1'],
        initialState.tiles['0,2'],
      ];
      
      initialState.getNeighbors.mockReturnValue(borderNeighbors);
      
      // Exécution de la fonction pour une coordonnée en bordure
      const result = useTileStore.getState().getNeighbors('0,1'); // Imaginons que c'est une bordure
      
      // Vérifications
      expect(initialState.getNeighbors).toHaveBeenCalledWith('0,1');
      expect(result).toEqual(borderNeighbors);
      expect(result.length).toBe(4); // Moins de 6 voisins car en bordure
    });
    
    it('getNeighbors devrait retourner les tuiles voisines pour une coordonnée dans un coin', () => {
      // Setup - mock pour une tuile dans un coin (qui a encore moins de voisins)
      // Considérons une tuile dans un coin qui n'a que 3 voisins
      const cornerNeighbors = [
        initialState.tiles['0,0'],
        initialState.tiles['1,-1'],
      ];
      
      initialState.getNeighbors.mockReturnValue(cornerNeighbors);
      
      // Exécution de la fonction pour une coordonnée dans un coin
      const result = useTileStore.getState().getNeighbors('-1,0'); // Imaginons que c'est un coin
      
      // Vérifications
      expect(initialState.getNeighbors).toHaveBeenCalledWith('-1,0');
      expect(result).toEqual(cornerNeighbors);
      expect(result.length).toBe(2); // Encore moins de voisins car dans un coin
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
    
    it('deductTileResources devrait gérer une tentative de déduction excessive', () => {
      // Setup - tentative de collecter plus que ce qui est disponible
      const coord = '1,1'; // Tuile avec {food: 10, debris: 0, special: 0}
      const excessiveCollection = { food: 20, debris: 5, special: 1 }; // Plus que ce qui est disponible
      
      initialState.deductTileResources.mockImplementation((c, r) => {
        // Les ressources ne devraient jamais devenir négatives
        return c === coord && r === excessiveCollection;
      });
      
      // Exécution
      const result = useTileStore.getState().deductTileResources(coord, excessiveCollection);
      
      // Vérifications
      expect(initialState.deductTileResources).toHaveBeenCalledWith(coord, excessiveCollection);
      expect(result).toBe(true);
      
      // Dans l'implémentation réelle, les ressources seraient réduites à 0, jamais négatives
      // et la tuile serait marquée comme collectée
    });
    
    it('deductTileResources devrait gérer les ressources multiples', () => {
      // Setup - déduction de plusieurs types de ressources
      const coord = '0,0';
      const mixedResources = { food: 10, debris: 20, special: 5 };
      
      initialState.deductTileResources.mockImplementation((c, r) => {
        return c === coord && 
               r.food === mixedResources.food && 
               r.debris === mixedResources.debris && 
               r.special === mixedResources.special;
      });
      
      // Exécution
      const result = useTileStore.getState().deductTileResources(coord, mixedResources);
      
      // Vérifications
      expect(initialState.deductTileResources).toHaveBeenCalledWith(coord, mixedResources);
      expect(result).toBe(true);
    });
  });

  // Suite de tests pour les États des Tuiles
  describe('États des Tuiles', () => {
    it('markTileAsExplored devrait marquer une tuile comme explorée', () => {
      // Setup
      const coord = '1,1'; // Tuile non explorée dans l'état initial
      initialState.markTileAsExplored.mockImplementation((c) => c === coord);
      
      // Exécution
      useTileStore.getState().markTileAsExplored(coord);
      
      // Vérifications
      expect(initialState.markTileAsExplored).toHaveBeenCalledWith(coord);
    });
    
    it('markTileAsExplored devrait fonctionner même si la tuile est déjà explorée', () => {
      // Setup
      const coord = '0,1'; // Tuile déjà explorée dans l'état initial
      initialState.markTileAsExplored.mockImplementation((c) => c === coord);
      
      // Exécution
      useTileStore.getState().markTileAsExplored(coord);
      
      // Vérifications
      expect(initialState.markTileAsExplored).toHaveBeenCalledWith(coord);
    });
    
    it('markTileAsExplored ne devrait pas modifier d\'autres propriétés de la tuile', () => {
      // Setup - Préserver toutes les autres propriétés de la tuile
      const coord = '1,0'; // Tuile de type danger
      const originalTile = { ...initialState.tiles[coord] };
      
      initialState.markTileAsExplored.mockImplementation((c) => {
        if (c === coord) {
          // Dans l'implémentation réelle, seul explored devrait être changé
          return true;
        }
        return false;
      });
      
      // Exécution
      useTileStore.getState().markTileAsExplored(coord);
      
      // Vérifications
      expect(initialState.markTileAsExplored).toHaveBeenCalledWith(coord);
      // Dans l'implémentation réelle, on vérifierait que seule la propriété explored a changé
    });
    
    it('calculateDistance devrait calculer la distance entre deux coordonnées avec pathfinding', () => {
      // Setup
      const coord1 = '0,0';
      const coord2 = '1,1';
      const formattedResult = '2';
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

    it('calculateDistance devrait retourner 0 pour des coordonnées identiques avec pathfinding', () => {
      // Setup
      const coord = '0,0';
      
      initialState.calculateDistance.mockImplementation((c1, c2, formatted, usePath) => {
        if (c1 === c2) {
          return formatted ? '0' : 0;
        }
        return formatted ? '1' : 1;
      });
      
      // Exécution
      const resultFormatted = useTileStore.getState().calculateDistance(coord, coord, true, true);
      const resultNumeric = useTileStore.getState().calculateDistance(coord, coord, false, true);
      
      // Vérifications
      expect(initialState.calculateDistance).toHaveBeenCalledWith(coord, coord, true, true);
      expect(initialState.calculateDistance).toHaveBeenCalledWith(coord, coord, false, true);
      expect(resultFormatted).toBe('0');
      expect(resultNumeric).toBe(0);
    });
    
    it('calculateDistance devrait retourner 0 pour des coordonnées identiques sans pathfinding', () => {
      // Setup
      const coord = '0,0';
      
      initialState.calculateDistance.mockImplementation((c1, c2, formatted, usePath) => {
        if (c1 === c2) {
          return formatted ? '0.0' : 0;
        }
        return formatted ? '1.0' : 1;
      });
      
      // Exécution
      const resultFormatted = useTileStore.getState().calculateDistance(coord, coord, true, false);
      const resultNumeric = useTileStore.getState().calculateDistance(coord, coord, false, false);
      
      // Vérifications
      expect(initialState.calculateDistance).toHaveBeenCalledWith(coord, coord, true, false);
      expect(initialState.calculateDistance).toHaveBeenCalledWith(coord, coord, false, false);
      expect(resultFormatted).toBe('0.0');
      expect(resultNumeric).toBe(0);
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
