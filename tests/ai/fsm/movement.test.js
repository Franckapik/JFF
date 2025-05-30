/**
 * ============================================================================
 * TESTS UNITAIRES - Actions de Mouvement Core
 * ============================================================================
 * 
 * Tests complets pour les actions de mouvement pures partagées.
 * Vérifie la pureté des fonctions, la gestion d'erreurs, et la cohérence
 * des transformations d'état.
 * 
 * @author Migration FSM Tests
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  movementActions,
  movementSelectors,
  movementGuards,
  movementEvents
} from '../../../src/shared/actions/core/movement.js';

// ============================================================================
// MOCKS ET FIXTURES
// ============================================================================

// Mock pour Date.now() pour tests déterministes
const mockDate = 1609459200000; // 2021-01-01 00:00:00 UTC
vi.spyOn(Date, 'now').mockReturnValue(mockDate);

// Contexte de base pour les tests
const createBaseContext = () => ({
  playerId: 'player1',
  botId: 'bot1',
  vehicle: {
    id: 'vehicle1',
    coord: '5,5',
    position: [5, 5, 0],
    fuel: 80,
    isMoving: false,
    progress: 0,
    targetTile: {
      position: null,
      coord: null
    },
    movementStartTime: null,
    lastUpdate: null
  }
});

// Tuile cible valide pour les tests
const validTargetTile = {
  position: [10, 10, 0],
  coord: '10,10'
};

// Tuiles invalides pour tests d'erreur
const invalidTiles = {
  null: null,
  undefined: undefined,
  missingPosition: { coord: '10,10' },
  missingCoord: { position: [10, 10, 0] },
  invalidCoordFormat: { position: [10, 10, 0], coord: 'invalid' },
  emptyCoord: { position: [10, 10, 0], coord: '' }
};

// ============================================================================
// TESTS DES ACTIONS PRINCIPALES
// ============================================================================

describe('Movement Actions Core', () => {
  let baseContext;

  beforeEach(() => {
    baseContext = createBaseContext();
    vi.clearAllMocks();
  });

  // ==========================================================================
  // TESTS DE moveToTile
  // ==========================================================================

  describe('moveToTile', () => {
    it('devrait initier un mouvement avec une tuile valide', () => {
      const event = { targetTile: validTargetTile };
      const result = movementActions.moveToTile(baseContext, event);

      expect(result).toEqual({
        ...baseContext,
        vehicle: {
          ...baseContext.vehicle,
          targetTile: {
            position: validTargetTile.position,
            coord: validTargetTile.coord
          },
          isMoving: true,
          movementStartTime: mockDate,
          progress: 0
        }
      });
    });

    it('ne devrait pas muter le contexte original', () => {
      const originalContext = JSON.parse(JSON.stringify(baseContext));
      const event = { targetTile: validTargetTile };
      
      movementActions.moveToTile(baseContext, event);
      
      expect(baseContext).toEqual(originalContext);
    });

    it('devrait gérer les tuiles invalides sans lever d\'exception', () => {
      Object.entries(invalidTiles).forEach(([name, tile]) => {
        const event = { targetTile: tile };
        const result = movementActions.moveToTile(baseContext, event);

        expect(result).toHaveProperty('error');
        expect(result.lastAction).toBe('moveToTile_failed');
        expect(result.vehicle).toEqual(baseContext.vehicle);
      });
    });

    it('devrait préserver les autres propriétés du contexte', () => {
      const contextWithExtra = {
        ...baseContext,
        extraProperty: 'preserved',
        player: { id: 'player1', score: 100 }
      };
      
      const event = { targetTile: validTargetTile };
      const result = movementActions.moveToTile(contextWithExtra, event);

      expect(result.extraProperty).toBe('preserved');
      expect(result.player).toEqual({ id: 'player1', score: 100 });
    });

    it('devrait normaliser les données de la tuile', () => {
      const tileWithExtraData = {
        position: [10, 10, 0],
        coord: '10,10',
        extraProperty: 'should be filtered'
      };
      
      const event = { targetTile: tileWithExtraData };
      const result = movementActions.moveToTile(baseContext, event);

      expect(result.vehicle.targetTile).toEqual({
        position: [10, 10, 0],
        coord: '10,10'
      });
      expect(result.vehicle.targetTile).not.toHaveProperty('extraProperty');
    });
  });

  // ==========================================================================
  // TESTS DE stopMovement
  // ==========================================================================

  describe('stopMovement', () => {
    it('devrait arrêter un mouvement en cours', () => {
      const movingContext = {
        ...baseContext,
        vehicle: {
          ...baseContext.vehicle,
          isMoving: true,
          targetTile: validTargetTile,
          progress: 50,
          movementStartTime: mockDate
        }
      };

      const result = movementActions.stopMovement(movingContext);

      expect(result.vehicle).toEqual({
        ...movingContext.vehicle,
        isMoving: false,
        targetTile: {
          position: null,
          coord: null
        },
        progress: 0,
        movementStartTime: null
      });
    });

    it('devrait fonctionner même si le véhicule n\'est pas en mouvement', () => {
      const result = movementActions.stopMovement(baseContext);

      expect(result.vehicle.isMoving).toBe(false);
      expect(result.vehicle.targetTile).toEqual({
        position: null,
        coord: null
      });
    });

    it('ne devrait pas muter le contexte original', () => {
      const originalContext = JSON.parse(JSON.stringify(baseContext));
      
      movementActions.stopMovement(baseContext);
      
      expect(baseContext).toEqual(originalContext);
    });
  });

  // ==========================================================================
  // TESTS DE updateProgress
  // ==========================================================================

  describe('updateProgress', () => {
    it('devrait mettre à jour la progression avec une valeur valide', () => {
      const event = { progress: 75 };
      const result = movementActions.updateProgress(baseContext, event);

      expect(result.vehicle.progress).toBe(75);
      expect(result.vehicle).toEqual({
        ...baseContext.vehicle,
        progress: 75
      });
    });

    it('devrait contraindre la progression entre 0 et 100', () => {
      const testCases = [
        { input: -10, expected: 0 },
        { input: 0, expected: 0 },
        { input: 50, expected: 50 },
        { input: 100, expected: 100 },
        { input: 150, expected: 100 }
      ];

      testCases.forEach(({ input, expected }) => {
        const event = { progress: input };
        const result = movementActions.updateProgress(baseContext, event);
        
        expect(result.vehicle.progress).toBe(expected);
      });
    });

    it('devrait utiliser 0 si progress n\'est pas fourni', () => {
      const event = {};
      const result = movementActions.updateProgress(baseContext, event);

      expect(result.vehicle.progress).toBe(0);
    });

    it('devrait gérer les valeurs non-numériques', () => {
      const testCases = [
        { progress: 'invalid' },
        { progress: null },
        { progress: undefined },
        { progress: {} },
        { progress: [] }
      ];

      testCases.forEach((event) => {
        const result = movementActions.updateProgress(baseContext, event);
        expect(result.vehicle.progress).toBe(0);
      });
    });
  });

  // ==========================================================================
  // TESTS DE updatePosition
  // ==========================================================================

  describe('updatePosition', () => {
    it('devrait mettre à jour la position avec une coordonnée valide', () => {
      const event = { newCoord: '7,8' };
      const result = movementActions.updatePosition(baseContext, event);

      expect(result.vehicle.coord).toBe('7,8');
      expect(result.vehicle.lastUpdate).toBe(mockDate);
    });

    it('ne devrait rien faire si newCoord n\'est pas fourni', () => {
      const event = {};
      const result = movementActions.updatePosition(baseContext, event);

      expect(result).toBe(baseContext);
    });

    it('devrait gérer les coordonnées nulles ou undefined', () => {
      const testCases = [
        { newCoord: null },
        { newCoord: undefined },
        { newCoord: '' }
      ];

      testCases.forEach((event) => {
        const result = movementActions.updatePosition(baseContext, event);
        expect(result).toBe(baseContext);
      });
    });
  });

  // ==========================================================================
  // TESTS DE completeMovement
  // ==========================================================================

  describe('completeMovement', () => {
    it('devrait finaliser un mouvement avec une cible', () => {
      const movingContext = {
        ...baseContext,
        vehicle: {
          ...baseContext.vehicle,
          isMoving: true,
          targetTile: validTargetTile,
          progress: 90,
          movementStartTime: mockDate - 5000
        }
      };

      const result = movementActions.completeMovement(movingContext);

      expect(result.vehicle).toEqual({
        ...movingContext.vehicle,
        isMoving: false,
        progress: 100,
        coord: validTargetTile.coord,
        targetTile: {
          position: null,
          coord: null
        },
        movementStartTime: null,
        lastMovementTime: mockDate
      });
    });

    it('devrait préserver la position actuelle si pas de cible', () => {
      const contextWithoutTarget = {
        ...baseContext,
        vehicle: {
          ...baseContext.vehicle,
          isMoving: true,
          targetTile: { position: null, coord: null }
        }
      };

      const result = movementActions.completeMovement(contextWithoutTarget);

      expect(result.vehicle.coord).toBe(baseContext.vehicle.coord);
      expect(result.vehicle.isMoving).toBe(false);
      expect(result.vehicle.progress).toBe(100);
    });
  });
});

// ============================================================================
// TESTS DES SELECTORS
// ============================================================================

describe('Movement Selectors', () => {
  let baseVehicle;

  beforeEach(() => {
    baseVehicle = createBaseContext().vehicle;
  });

  describe('isMoving', () => {
    it('devrait retourner true pour un véhicule en mouvement', () => {
      const movingVehicle = { ...baseVehicle, isMoving: true };
      expect(movementSelectors.isMoving(movingVehicle)).toBe(true);
    });

    it('devrait retourner false pour un véhicule arrêté', () => {
      expect(movementSelectors.isMoving(baseVehicle)).toBe(false);
    });

    it('devrait gérer les véhicules null/undefined', () => {
      expect(movementSelectors.isMoving(null)).toBe(false);
      expect(movementSelectors.isMoving(undefined)).toBe(false);
      expect(movementSelectors.isMoving({})).toBe(false);
    });
  });

  describe('getDestination', () => {
    it('devrait retourner la destination actuelle', () => {
      const vehicleWithDestination = {
        ...baseVehicle,
        targetTile: validTargetTile
      };

      const destination = movementSelectors.getDestination(vehicleWithDestination);
      expect(destination).toEqual(validTargetTile);
    });

    it('devrait retourner null si pas de destination', () => {
      expect(movementSelectors.getDestination(baseVehicle)).toEqual({
        position: null,
        coord: null
      });
    });
  });

  describe('getProgress', () => {
    it('devrait retourner la progression actuelle', () => {
      const vehicleWithProgress = { ...baseVehicle, progress: 65 };
      expect(movementSelectors.getProgress(vehicleWithProgress)).toBe(65);
    });

    it('devrait retourner 0 si pas de progression', () => {
      expect(movementSelectors.getProgress(baseVehicle)).toBe(0);
      expect(movementSelectors.getProgress({})).toBe(0);
      expect(movementSelectors.getProgress(null)).toBe(0);
    });
  });

  describe('getMovementDuration', () => {
    it('devrait calculer la durée du mouvement', () => {
      const vehicleWithStart = {
        ...baseVehicle,
        movementStartTime: mockDate - 10000
      };

      const duration = movementSelectors.getMovementDuration(vehicleWithStart);
      expect(duration).toBe(10000);
    });

    it('devrait retourner 0 si pas de mouvement en cours', () => {
      expect(movementSelectors.getMovementDuration(baseVehicle)).toBe(0);
      expect(movementSelectors.getMovementDuration(null)).toBe(0);
    });
  });

  describe('canStartMovement', () => {
    it('devrait permettre le mouvement si le véhicule est arrêté', () => {
      expect(movementSelectors.canStartMovement(baseVehicle)).toBe(true);
    });

    it('devrait interdire le mouvement si déjà en cours', () => {
      const movingVehicle = { ...baseVehicle, isMoving: true };
      expect(movementSelectors.canStartMovement(movingVehicle)).toBe(false);
    });
  });

  describe('getDistanceToTarget', () => {
    it('devrait calculer la distance Manhattan vers la cible', () => {
      const vehicleWithTarget = {
        ...baseVehicle,
        coord: '0,0',
        targetTile: { coord: '3,4' }
      };

      const distance = movementSelectors.getDistanceToTarget(vehicleWithTarget);
      expect(distance).toBe(7); // |3-0| + |4-0| = 7
    });

    it('devrait retourner 0 si pas de coordonnées', () => {
      const testCases = [
        { coord: null, targetTile: { coord: '5,5' } },
        { coord: '5,5', targetTile: { coord: null } },
        { coord: '5,5', targetTile: null },
        null
      ];

      testCases.forEach((vehicle) => {
        expect(movementSelectors.getDistanceToTarget(vehicle)).toBe(0);
      });
    });
  });
});

// ============================================================================
// TESTS DES GUARDS
// ============================================================================

describe('Movement Guards', () => {
  let baseContext;

  beforeEach(() => {
    baseContext = createBaseContext();
  });

  describe('canMoveTo', () => {
    it('devrait permettre le mouvement vers une tuile valide', () => {
      const event = { targetTile: validTargetTile };
      expect(movementGuards.canMoveTo(baseContext, event)).toBe(true);
    });

    it('devrait interdire le mouvement si déjà en cours', () => {
      const movingContext = {
        ...baseContext,
        vehicle: { ...baseContext.vehicle, isMoving: true }
      };
      
      const event = { targetTile: validTargetTile };
      expect(movementGuards.canMoveTo(movingContext, event)).toBe(false);
    });

    it('devrait interdire le mouvement vers une tuile invalide', () => {
      Object.entries(invalidTiles).forEach(([name, tile]) => {
        const event = { targetTile: tile };
        expect(movementGuards.canMoveTo(baseContext, event)).toBe(false);
      });
    });

    it('devrait gérer l\'absence de véhicule', () => {
      const contextWithoutVehicle = { ...baseContext, vehicle: null };
      const event = { targetTile: validTargetTile };
      
      expect(movementGuards.canMoveTo(contextWithoutVehicle, event)).toBe(false);
    });
  });

  describe('hasEnoughFuel', () => {
    it('devrait permettre le mouvement si assez de carburant', () => {
      const event = { targetTile: { coord: '7,7' } }; // Distance 4, fuel requis 8
      expect(movementGuards.hasEnoughFuel(baseContext, event)).toBe(true);
    });

    it('devrait interdire le mouvement si pas assez de carburant', () => {
      const lowFuelContext = {
        ...baseContext,
        vehicle: { ...baseContext.vehicle, fuel: 5 }
      };
      
      const event = { targetTile: { coord: '15,15' } }; // Distance 20, fuel requis 40
      expect(movementGuards.hasEnoughFuel(lowFuelContext, event)).toBe(false);
    });

    it('devrait gérer les données manquantes', () => {
      const testCases = [
        { vehicle: null, event: { targetTile: { coord: '5,5' } } },
        { vehicle: { fuel: 50 }, event: { targetTile: null } },
        { vehicle: { fuel: 50, coord: null }, event: { targetTile: { coord: '5,5' } } }
      ];

      testCases.forEach(({ vehicle, event }) => {
        const context = { ...baseContext, vehicle };
        expect(movementGuards.hasEnoughFuel(context, event)).toBe(false);
      });
    });
  });

  describe('isMovementComplete', () => {
    it('devrait détecter un mouvement terminé par progression', () => {
      const completeContext = {
        ...baseContext,
        vehicle: { ...baseContext.vehicle, progress: 100 }
      };
      
      expect(movementGuards.isMovementComplete(completeContext)).toBe(true);
    });

    it('devrait détecter un mouvement terminé par position', () => {
      const completeContext = {
        ...baseContext,
        vehicle: {
          ...baseContext.vehicle,
          coord: '10,10',
          targetTile: { coord: '10,10' }
        }
      };
      
      expect(movementGuards.isMovementComplete(completeContext)).toBe(true);
    });

    it('devrait détecter un mouvement non terminé', () => {
      const incompleteContext = {
        ...baseContext,
        vehicle: {
          ...baseContext.vehicle,
          progress: 50,
          coord: '5,5',
          targetTile: { coord: '10,10' }
        }
      };
      
      expect(movementGuards.isMovementComplete(incompleteContext)).toBe(false);
    });
  });
});

// ============================================================================
// TESTS DES EVENTS
// ============================================================================

describe('Movement Events', () => {
  describe('Event generators', () => {
    it('devrait créer un événement moveToTile correct', () => {
      const event = movementEvents.moveToTile(validTargetTile);
      
      expect(event).toEqual({
        type: 'MOVE_TO_TILE',
        targetTile: validTargetTile
      });
    });

    it('devrait créer un événement stopMovement correct', () => {
      const event = movementEvents.stopMovement();
      
      expect(event).toEqual({
        type: 'STOP_MOVEMENT'
      });
    });

    it('devrait créer un événement updateProgress correct', () => {
      const event = movementEvents.updateProgress(75);
      
      expect(event).toEqual({
        type: 'UPDATE_MOVEMENT_PROGRESS',
        progress: 75
      });
    });

    it('devrait créer un événement completeMovement correct', () => {
      const event = movementEvents.completeMovement();
      
      expect(event).toEqual({
        type: 'COMPLETE_MOVEMENT'
      });
    });
  });
});

// ============================================================================
// TESTS D'INTÉGRATION ET SCÉNARIOS
// ============================================================================

describe('Movement Integration Scenarios', () => {
  let context;

  beforeEach(() => {
    context = createBaseContext();
  });

  describe('Scénario complet de mouvement', () => {
    it('devrait gérer un cycle de mouvement complet', () => {
      // 1. Initier le mouvement
      const moveEvent = { targetTile: validTargetTile };
      context = movementActions.moveToTile(context, moveEvent);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(true);
      expect(movementSelectors.getDestination(context.vehicle)).toEqual(validTargetTile);
      
      // 2. Mettre à jour la progression
      const progressEvent = { progress: 50 };
      context = movementActions.updateProgress(context, progressEvent);
      
      expect(movementSelectors.getProgress(context.vehicle)).toBe(50);
      
      // 3. Finaliser le mouvement
      context = movementActions.completeMovement(context);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(false);
      expect(context.vehicle.coord).toBe(validTargetTile.coord);
      expect(movementSelectors.getProgress(context.vehicle)).toBe(100);
    });

    it('devrait gérer l\'arrêt d\'urgence', () => {
      // Initier le mouvement
      const moveEvent = { targetTile: validTargetTile };
      context = movementActions.moveToTile(context, moveEvent);
      
      // Progression partielle
      context = movementActions.updateProgress(context, { progress: 30 });
      
      // Arrêt d'urgence
      context = movementActions.stopMovement(context);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(false);
      expect(movementSelectors.getProgress(context.vehicle)).toBe(0);
      expect(movementSelectors.getDestination(context.vehicle)).toEqual({
        position: null,
        coord: null
      });
    });
  });

  describe('Gestion des erreurs et cas limites', () => {
    it('devrait rester cohérent après des erreurs', () => {
      const originalContext = JSON.parse(JSON.stringify(context));
      
      // Tentative de mouvement avec tuile invalide
      const invalidEvent = { targetTile: null };
      context = movementActions.moveToTile(context, invalidEvent);
      
      // Le véhicule ne doit pas bouger
      expect(context.vehicle.isMoving).toBe(false);
      expect(context.vehicle.coord).toBe(originalContext.vehicle.coord);
      
      // Mais le contexte doit contenir l'information d'erreur
      expect(context.error).toBeDefined();
      expect(context.lastAction).toBe('moveToTile_failed');
    });

    it('devrait gérer les appels multiples cohérents', () => {
      // Multiples mises à jour de progression
      context = movementActions.updateProgress(context, { progress: 25 });
      context = movementActions.updateProgress(context, { progress: 50 });
      context = movementActions.updateProgress(context, { progress: 75 });
      
      expect(movementSelectors.getProgress(context.vehicle)).toBe(75);
      
      // L'état doit rester cohérent
      expect(context.vehicle.id).toBe('vehicle1');
      expect(context.playerId).toBe('player1');
    });
  });
});
