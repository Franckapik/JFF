import { describe, it, expect, vi, beforeEach } from 'vitest';
import { moveToResourceAction } from '../ai/fsm/actions/individual/moveToResourceAction';
import usePlayerStore from '../stores/playerStore';
import { useTileStore } from '../stores/useTileStore';
import { BOT_STATES } from '../ai/constants/botConstants';

// Mock des dépendances externes
vi.mock('../utils/fsmLogger', () => ({
  default: {
    action: vi.fn(),
    error: vi.fn(),
    condition: vi.fn()
  }
}));

vi.mock('../utils/utils', () => ({
  findPath: vi.fn(() => [{ x: 0, y: 0 }, { x: 1, y: 1 }])
}));

// Mock de BotConditions - IMPORTANT : doit être au niveau supérieur du fichier
vi.mock('../ai/fsm/conditions/botConditions', () => ({
  BotConditions: {
    isShipMoving: vi.fn().mockReturnValue({ result: false })
  }
}));

// Mock des stores Zustand
vi.mock('../stores/playerStore', () => ({
  default: vi.fn(),
  getState: vi.fn()
}));

vi.mock('../stores/useTileStore', () => ({
  useTileStore: {
    getState: vi.fn()
  }
}));

describe('moveToResourceAction', () => {
  // Configuration des données de test
  const mockPlayerStore = {
    players: {
      player2: {
        vehicles: {
          ship: {
            coord: '0,0',
            fuel: 80,
            resources: { food: 0, debris: 0 },
            isMoving: false
          }
        },
        memory: {
          knownResources: [
            {
              coord: '1,1',
              resources: { food: 10, debris: 5 }
            },
            {
              coord: '2,2',
              resources: { food: 5, debris: 2 }
            }
          ]
        }
      }
    },
    updatePlayerMemory: vi.fn(),
    moveToTile: vi.fn()
  };
  
  const mockTileStore = {
    tiles: {
      '0,0': { position: { x: 0, y: 0 }, resources: { food: 0, debris: 0 } },
      '1,1': { position: { x: 100, y: 100 }, resources: { food: 10, debris: 5 } },
      '2,2': { position: { x: 200, y: 200 }, resources: { food: 5, debris: 2 } }
    },
    calculateDistance: vi.fn((coord1, coord2) => {
      if (coord1 === '0,0' && coord2 === '1,1') return 1;
      if (coord1 === '0,0' && coord2 === '2,2') return 2;
      return 0;
    })
  };
  
  const addAction = vi.fn();
  const changeState = vi.fn();

  beforeEach(() => {
    // Réinitialiser tous les mocks
    vi.clearAllMocks();
    
    // Configuration des mocks de stores
    usePlayerStore.getState = vi.fn().mockReturnValue(mockPlayerStore);
    useTileStore.getState = vi.fn().mockReturnValue(mockTileStore);
    
    // Réinitialiser l'état de l'action
    if (typeof moveToResourceAction.reset === 'function') {
      moveToResourceAction.reset();
    }
  });

  it('devrait initialiser le déplacement vers la meilleure ressource', () => {
    // Appeler l'action avec les stores mockés
    const result = moveToResourceAction(
      mockPlayerStore, 
      mockTileStore,
      addAction,
      changeState
    );
    
    // Vérifier que moveToTile a été appelé avec la tuile ayant le meilleur rapport ressources/distance
    expect(mockPlayerStore.moveToTile).toHaveBeenCalledWith(
      'player2',
      'ship',
      expect.objectContaining({
        position: { x: 100, y: 100 },
        resources: { food: 10, debris: 5 }
      })
    );
    
    // Vérifier que la mémoire a été mise à jour avec la cible
    expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith(
      'player2',
      expect.objectContaining({
        currentTargetResource: expect.objectContaining({
          coord: '1,1'
        })
      })
    );
    
    // L'action devrait être en cours (non terminée)
    expect(result).toBeUndefined();
    
    // L'action devrait être marquée comme démarrée
    expect(moveToResourceAction.started).toBe(true);
  });

  it('devrait terminer l\'action quand le bot est déjà sur la ressource cible', () => {
    // Modifier la position du bot pour qu'il soit déjà sur la ressource
    const modifiedStore = {
      ...mockPlayerStore,
      players: {
        ...mockPlayerStore.players,
        player2: {
          ...mockPlayerStore.players.player2,
          vehicles: {
            ship: {
              ...mockPlayerStore.players.player2.vehicles.ship,
              coord: '1,1'
            }
          }
        }
      }
    };
    
    // Utiliser le store modifié
    usePlayerStore.getState = vi.fn().mockReturnValue(modifiedStore);
    
    // Appeler l'action
    const result = moveToResourceAction(modifiedStore, mockTileStore, addAction, changeState);
    
    // Vérifier que l'action est terminée immédiatement
    expect(result).toBe(true);
    
    // La mémoire devrait être mise à jour avec la ressource actuelle
    expect(modifiedStore.updatePlayerMemory).toHaveBeenCalledWith(
      'player2',
      expect.objectContaining({
        currentTargetResource: expect.objectContaining({
          coord: '1,1'
        })
      })
    );
    
    // moveToTile ne devrait pas être appelé car le bot est déjà à destination
    expect(modifiedStore.moveToTile).not.toHaveBeenCalled();
  });

  it('devrait gérer l\'absence de ressources connues', () => {
    // Créer un store sans ressources
    const emptyResourcesStore = {
      ...mockPlayerStore,
      players: {
        ...mockPlayerStore.players,
        player2: {
          ...mockPlayerStore.players.player2,
          memory: {
            knownResources: []
          }
        }
      }
    };
    
    // Utiliser le store modifié
    usePlayerStore.getState = vi.fn().mockReturnValue(emptyResourcesStore);
    
    // Appeler l'action
    const result = moveToResourceAction(emptyResourcesStore, mockTileStore, addAction, changeState);
    
    // Vérifier que l'action est terminée
    expect(result).toBe(true);
    
    // Vérifier que changeState a été appelé pour revenir à IDLE
    expect(changeState).toHaveBeenCalledWith(BOT_STATES.IDLE);
  });
  
  it('devrait compléter l\'action quand le véhicule arrive à destination', () => {
    // D'abord démarrer l'action
    moveToResourceAction(mockPlayerStore, mockTileStore, addAction, changeState);
    
    // Simuler que le bot a atteint sa destination
    const arrivedStore = {
      ...mockPlayerStore,
      players: {
        ...mockPlayerStore.players,
        player2: {
          ...mockPlayerStore.players.player2,
          vehicles: {
            ship: {
              ...mockPlayerStore.players.player2.vehicles.ship,
              coord: '1,1',
              isMoving: false
            }
          }
        }
      }
    };
    
    // Simuler que l'action a déjà démarré
    moveToResourceAction.started = true;
    moveToResourceAction.targetCoord = '1,1';
    moveToResourceAction.startTime = Date.now() - 5000; // 5 secondes se sont écoulées
    
    // Appeler à nouveau l'action avec le bot arrivé à destination
    const result = moveToResourceAction(arrivedStore, mockTileStore, addAction, changeState);
    
    // Vérifier que l'action est maintenant terminée
    expect(result).toBe(true);
    
    // Vérifier que l'état a été réinitialisé
    expect(moveToResourceAction.started).toBe(false);
  });
});