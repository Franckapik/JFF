/**
 * ============================================================================
 * TESTS D'INTÉGRATION - Scénarios de Mouvement Complets
 * ============================================================================
 * 
 * Tests d'intégration pour valider les scénarios complets de mouvement
 * dans différents contextes (Player, Bot, situations d'urgence).
 * 
 * @author Migration FSM Tests
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { movementActions, movementSelectors, movementGuards } from '../../../src/shared/actions/core/movement.js';
import {
  createPlayerContext,
  createBotContext,
  testTiles,
  testEvents,
  mockDateNow,
  assertImmutability,
  MOCK_TIMESTAMP
} from './setup.js';

// ============================================================================
// TESTS D'INTÉGRATION - SCÉNARIOS COMPLETS
// ============================================================================

describe('Movement Integration - Complete Scenarios', () => {
  let dateMock;

  beforeEach(() => {
    dateMock = mockDateNow();
  });

  afterEach(() => {
    dateMock.restore();
  });

  // ==========================================================================
  // SCÉNARIOS PLAYER
  // ==========================================================================

  describe('Player Movement Scenarios', () => {
    let playerContext;

    beforeEach(() => {
      playerContext = createPlayerContext();
    });

    it('devrait gérer un déplacement player complet', () => {
      // Phase 1: Initiation du mouvement
      let context = movementActions.moveToTile(playerContext, testEvents.movement.validMove);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(true);
      expect(movementSelectors.getDestination(context.vehicle)).toEqual(testTiles.valid);
      expect(movementSelectors.getProgress(context.vehicle)).toBe(0);

      // Phase 2: Progression 25%
      dateMock.advance(1000);
      context = movementActions.updateProgress(context, testEvents.movement.progress25);
      
      expect(movementSelectors.getProgress(context.vehicle)).toBe(25);
      expect(movementSelectors.isMoving(context.vehicle)).toBe(true);

      // Phase 3: Progression 50%
      dateMock.advance(1000);
      context = movementActions.updateProgress(context, testEvents.movement.progress50);
      
      expect(movementSelectors.getProgress(context.vehicle)).toBe(50);

      // Phase 4: Mise à jour position intermédiaire
      context = movementActions.updatePosition(context, { newCoord: '10,10' });
      
      expect(context.vehicle.coord).toBe('10,10');
      expect(context.vehicle.lastUpdate).toBe(MOCK_TIMESTAMP + 2000);

      // Phase 5: Finalisation du mouvement
      dateMock.advance(1000);
      context = movementActions.completeMovement(context);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(false);
      expect(movementSelectors.getProgress(context.vehicle)).toBe(100);
      expect(context.vehicle.coord).toBe(testTiles.valid.coord);
      expect(context.vehicle.lastMovementTime).toBe(MOCK_TIMESTAMP + 3000);

      // Vérification de l'immutabilité à chaque étape
      expect(playerContext.vehicle.isMoving).toBe(false);
    });

    it('devrait gérer l\'annulation d\'un mouvement player', () => {
      // Initiation du mouvement
      let context = movementActions.moveToTile(playerContext, testEvents.movement.validMove);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(true);

      // Progression partielle
      context = movementActions.updateProgress(context, testEvents.movement.progress25);
      
      expect(movementSelectors.getProgress(context.vehicle)).toBe(25);

      // Annulation
      context = movementActions.stopMovement(context);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(false);
      expect(movementSelectors.getProgress(context.vehicle)).toBe(0);
      expect(movementSelectors.getDestination(context.vehicle)).toEqual({
        position: null,
        coord: null
      });
    });

    it('devrait rejeter les mouvements simultanés', () => {
      // Premier mouvement
      let context = movementActions.moveToTile(playerContext, testEvents.movement.validMove);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(true);

      // Tentative de second mouvement
      const secondMoveEvent = { targetTile: { position: [20, 20, 0], coord: '20,20' } };
      expect(movementGuards.canMoveTo(context, secondMoveEvent)).toBe(false);

      // Le mouvement ne devrait pas changer
      const unchangedContext = movementActions.moveToTile(context, secondMoveEvent);
      expect(unchangedContext).toHaveProperty('error');
      expect(movementSelectors.getDestination(context.vehicle)).toEqual(testTiles.valid);
    });
  });

  // ==========================================================================
  // SCÉNARIOS BOT
  // ==========================================================================

  describe('Bot Movement Scenarios', () => {
    let botContext;

    beforeEach(() => {
      botContext = createBotContext({
        knownResources: [
          { coord: '15,15', type: 'food' },
          { coord: '20,20', type: 'debris' }
        ]
      });
    });

    it('devrait gérer un déplacement bot vers une ressource', () => {
      // Vérification du carburant avant mouvement
      const targetResource = { position: [15, 15, 0], coord: '15,15' };
      const moveEvent = { targetTile: targetResource };
      
      expect(movementGuards.hasEnoughFuel(botContext, moveEvent)).toBe(true);

      // Initiation du mouvement
      let context = movementActions.moveToTile(botContext, moveEvent);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(true);
      expect(movementSelectors.getDestination(context.vehicle)).toEqual(targetResource);

      // Simulation de progression automatique
      const progressUpdates = [25, 50, 75, 100];
      
      progressUpdates.forEach((progress, index) => {
        dateMock.advance(1000);
        
        if (progress < 100) {
          context = movementActions.updateProgress(context, { progress });
          expect(movementSelectors.getProgress(context.vehicle)).toBe(progress);
        } else {
          context = movementActions.completeMovement(context);
          expect(movementSelectors.isMoving(context.vehicle)).toBe(false);
          expect(context.vehicle.coord).toBe(targetResource.coord);
        }
      });
    });

    it('devrait gérer le retour à la base', () => {
      // Bot loin de sa base
      const farBotContext = createBotContext({
        vehicle: {
          ...createBotContext().vehicle,
          coord: '50,50',
          fuel: 30 // Carburant faible
        }
      });

      // Mouvement de retour vers la base
      const returnToBaseEvent = {
        targetTile: {
          position: [10, 10, 0],
          coord: farBotContext.vehicle.startCoord
        }
      };

      let context = movementActions.moveToTile(farBotContext, returnToBaseEvent);
      
      // Le mouvement devrait être bloqué par manque de carburant
      expect(movementSelectors.isMoving(context.vehicle)).toBe(false);
      expect(context.error).toContain('insufficient fuel');
      expect(context.lastAction).toBe('moveToTile_failed');
      
      // Bot avec assez de carburant pour le retour
      const wellFueledBotContext = createBotContext({
        vehicle: {
          ...createBotContext().vehicle,
          coord: '15,15', // Plus proche de la base
          fuel: 80 // Carburant suffisant
        }
      });
      
      const shortReturnEvent = {
        targetTile: {
          position: [10, 10, 0],
          coord: wellFueledBotContext.vehicle.startCoord
        }
      };
      
      context = movementActions.moveToTile(wellFueledBotContext, shortReturnEvent);
      expect(movementSelectors.isMoving(context.vehicle)).toBe(true);
      
      // Finalisation du retour
      context = movementActions.completeMovement(context);
      expect(context.vehicle.coord).toBe(wellFueledBotContext.vehicle.startCoord);
    });

    it('devrait calculer les distances correctement pour l\'IA', () => {
      const botPosition = '10,10';
      const resources = [
        { coord: '12,12', distance: 4 }, // 2+2
        { coord: '15,10', distance: 5 }, // 5+0
        { coord: '5,5', distance: 10 }   // 5+5
      ];

      resources.forEach(({ coord, distance }) => {
        const actualDistance = movementSelectors.getDistanceToTarget({
          coord: botPosition,
          targetTile: { coord }
        });
        
        expect(actualDistance).toBe(distance);
      });
    });
  });

  // ==========================================================================
  // SCÉNARIOS D'URGENCE
  // ==========================================================================

  describe('Emergency Movement Scenarios', () => {
    it('devrait gérer une situation de carburant critique', () => {
      const lowFuelContext = createPlayerContext({
        vehicle: {
          ...createPlayerContext().vehicle,
          fuel: 10,
          coord: '50,50'
        }
      });

      // Tentative de mouvement longue distance
      const longDistanceEvent = {
        targetTile: { position: [100, 100, 0], coord: '100,100' }
      };

      // Vérification que le mouvement est refusé
      expect(movementGuards.hasEnoughFuel(lowFuelContext, longDistanceEvent)).toBe(false);

      // Le mouvement devrait échouer gracieusement
      const result = movementActions.moveToTile(lowFuelContext, longDistanceEvent);
      expect(result).toHaveProperty('error');
    });

    it('devrait gérer l\'arrêt d\'urgence pendant un mouvement', () => {
      let context = createPlayerContext();
      
      // Initiation d'un mouvement long
      context = movementActions.moveToTile(context, {
        targetTile: { position: [100, 100, 0], coord: '100,100' }
      });
      
      // Progression partielle
      context = movementActions.updateProgress(context, { progress: 30 });
      
      // Situation d'urgence - arrêt immédiat
      context = movementActions.stopMovement(context);
      
      expect(movementSelectors.isMoving(context.vehicle)).toBe(false);
      expect(context.vehicle.coord).toBe('5,5'); // Position d'origine préservée
    });

    it('devrait gérer les erreurs de validation sans crash', () => {
      const context = createPlayerContext();
      const invalidEvents = [
        { targetTile: null },
        { targetTile: { position: null, coord: null } },
        { targetTile: { position: [10, 10], coord: 'invalid-format' } },
        { targetTile: { coord: '10,10' } }, // Missing position
        {}
      ];

      invalidEvents.forEach((event, index) => {
        const result = movementActions.moveToTile(context, event);
        
        // L'action doit retourner un contexte avec erreur, pas lever d'exception
        expect(result).toHaveProperty('error');
        expect(result.lastAction).toBe('moveToTile_failed');
        
        // Le véhicule ne doit pas bouger
        expect(result.vehicle.isMoving).toBe(false);
        expect(result.vehicle.coord).toBe(context.vehicle.coord);
      });
    });
  });

  // ==========================================================================
  // SCÉNARIOS DE PERFORMANCE
  // ==========================================================================

  describe('Performance Scenarios', () => {
    it('devrait gérer de nombreuses mises à jour de progression', () => {
      let context = createPlayerContext();
      
      // Initiation du mouvement
      context = movementActions.moveToTile(context, testEvents.movement.validMove);
      
      const startTime = Date.now();
      
      // 100 mises à jour de progression
      for (let i = 1; i <= 100; i++) {
        context = movementActions.updateProgress(context, { progress: i });
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Les mises à jour doivent être rapides
      expect(duration).toBeLessThan(100);
      expect(movementSelectors.getProgress(context.vehicle)).toBe(100);
    });

    it('devrait gérer des changements de position fréquents', () => {
      let context = createPlayerContext();
      
      const startTime = Date.now();
      
      // 50 changements de position
      for (let i = 0; i < 50; i++) {
        context = movementActions.updatePosition(context, {
          newCoord: `${i},${i}`
        });
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(50);
      expect(context.vehicle.coord).toBe('49,49');
    });
  });

  // ==========================================================================
  // SCÉNARIOS DE COHÉRENCE
  // ==========================================================================

  describe('State Consistency Scenarios', () => {
    it('devrait maintenir la cohérence après des opérations complexes', () => {
      let context = createPlayerContext();
      
      // Série d'opérations complexes
      const operations = [
        () => movementActions.moveToTile(context, testEvents.movement.validMove),
        () => movementActions.updateProgress(context, { progress: 25 }),
        () => movementActions.updatePosition(context, { newCoord: '7,7' }),
        () => movementActions.updateProgress(context, { progress: 50 }),
        () => movementActions.stopMovement(context),
        () => movementActions.moveToTile(context, { targetTile: { position: [20, 20, 0], coord: '20,20' } }),
        () => movementActions.completeMovement(context)
      ];

      operations.forEach((operation, index) => {
        const previousContext = JSON.parse(JSON.stringify(context));
        context = operation();
        
        // Vérifier l'immutabilité
        expect(JSON.stringify(previousContext)).not.toBe(JSON.stringify(context));
        
        // Vérifier la cohérence de base
        expect(context).toHaveProperty('vehicle');
        expect(context.vehicle).toHaveProperty('id');
        expect(context.vehicle).toHaveProperty('coord');
        expect(typeof context.vehicle.progress).toBe('number');
        expect(context.vehicle.progress).toBeGreaterThanOrEqual(0);
        expect(context.vehicle.progress).toBeLessThanOrEqual(100);
      });
    });

    it('devrait préserver les propriétés non liées au mouvement', () => {
      const enrichedContext = createPlayerContext({
        customProperty: 'preserved',
        player: { score: 1000, level: 5 },
        vehicle: {
          ...createPlayerContext().vehicle,
          customVehicleProperty: 'also preserved'
        }
      });

      // Série de mouvements
      let context = enrichedContext;
      context = movementActions.moveToTile(context, testEvents.movement.validMove);
      context = movementActions.updateProgress(context, { progress: 100 });
      context = movementActions.completeMovement(context);

      // Les propriétés custom doivent être préservées
      expect(context.customProperty).toBe('preserved');
      expect(context.player).toEqual({ score: 1000, level: 5 });
      expect(context.vehicle.customVehicleProperty).toBe('also preserved');
    });
  });
});
