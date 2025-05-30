/**
 * ============================================================================
 * TESTS UTILITAIRES - Helpers et Fonctions Partagées
 * ============================================================================
 * 
 * Tests pour les fonctions utilitaires du système de mouvement.
 * Ces tests vérifient les calculs, validations et transformations
 * utilisées par les actions principales.
 * 
 * @author Migration FSM Tests
 * @version 1.0.0
 */

import { describe, it, expect } from 'vitest';
import movementCore from '../../../src/shared/actions/core/movement.js';

const { utils } = movementCore;
const { validateTargetTile, calculateDistance, clamp } = utils;

// ============================================================================
// TESTS DES UTILITAIRES
// ============================================================================

describe('Movement Utils', () => {
  
  // ==========================================================================
  // TESTS DE validateTargetTile
  // ==========================================================================
  
  describe('validateTargetTile', () => {
    it('devrait valider et normaliser une tuile correcte', () => {
      const validTile = {
        position: [10, 15, 0],
        coord: '10,15',
        extraProperty: 'should be filtered'
      };

      const result = validateTargetTile(validTile);
      
      expect(result).toEqual({
        position: [10, 15, 0],
        coord: '10,15'
      });
      
      // Les propriétés supplémentaires doivent être filtrées
      expect(result).not.toHaveProperty('extraProperty');
    });

    it('devrait rejeter une tuile null ou undefined', () => {
      expect(() => validateTargetTile(null)).toThrow('Target tile is required');
      expect(() => validateTargetTile(undefined)).toThrow('Target tile is required');
    });

    it('devrait rejeter une tuile sans position', () => {
      const tileWithoutPosition = { coord: '10,10' };
      expect(() => validateTargetTile(tileWithoutPosition))
        .toThrow('Invalid target tile: missing position or coord');
    });

    it('devrait rejeter une tuile sans coord', () => {
      const tileWithoutCoord = { position: [10, 10, 0] };
      expect(() => validateTargetTile(tileWithoutCoord))
        .toThrow('Invalid target tile: missing position or coord');
    });

    it('devrait rejeter un format de coordonnée invalide', () => {
      const invalidCoordFormats = [
        { position: [10, 10, 0], coord: 'invalid' },
        { position: [10, 10, 0], coord: '10' },
        { position: [10, 10, 0], coord: '10-10' },
        { position: [10, 10, 0], coord: '' },
        { position: [10, 10, 0], coord: 123 },
        { position: [10, 10, 0], coord: {} }
      ];

      invalidCoordFormats.forEach((tile) => {
        expect(() => validateTargetTile(tile))
          .toThrow('Invalid coordinate format: expected "x,y" string');
      });
    });

    it('devrait accepter différents formats de coordonnées valides', () => {
      const validFormats = [
        { position: [0, 0, 0], coord: '0,0' },
        { position: [-5, 10, 0], coord: '-5,10' },
        { position: [100, 200, 0], coord: '100,200' },
        { position: [1.5, 2.5, 0], coord: '1.5,2.5' }
      ];

      validFormats.forEach((tile) => {
        expect(() => validateTargetTile(tile)).not.toThrow();
        const result = validateTargetTile(tile);
        expect(result.coord).toBe(tile.coord);
        expect(result.position).toEqual(tile.position);
      });
    });
  });

  // ==========================================================================
  // TESTS DE calculateDistance
  // ==========================================================================

  describe('calculateDistance', () => {
    it('devrait calculer la distance Manhattan correctement', () => {
      const testCases = [
        { coord1: '0,0', coord2: '3,4', expected: 7 },
        { coord1: '5,5', coord2: '5,5', expected: 0 },
        { coord1: '0,0', coord2: '10,0', expected: 10 },
        { coord1: '0,0', coord2: '0,10', expected: 10 },
        { coord1: '-5,-5', coord2: '5,5', expected: 20 },
        { coord1: '10,5', coord2: '3,8', expected: 10 }
      ];

      testCases.forEach(({ coord1, coord2, expected }) => {
        const distance = calculateDistance(coord1, coord2);
        expect(distance).toBe(expected);
      });
    });

    it('devrait être symétrique', () => {
      const coord1 = '3,7';
      const coord2 = '10,2';
      
      const distance1 = calculateDistance(coord1, coord2);
      const distance2 = calculateDistance(coord2, coord1);
      
      expect(distance1).toBe(distance2);
    });

    it('devrait retourner 0 pour des coordonnées invalides', () => {
      const invalidCases = [
        { coord1: null, coord2: '5,5' },
        { coord1: '5,5', coord2: null },
        { coord1: null, coord2: null },
        { coord1: undefined, coord2: '5,5' },
        { coord1: '5,5', coord2: undefined },
        { coord1: '', coord2: '5,5' },
        { coord1: '5,5', coord2: '' }
      ];

      invalidCases.forEach(({ coord1, coord2 }) => {
        const distance = calculateDistance(coord1, coord2);
        expect(distance).toBe(0);
      });
    });

    it('devrait gérer les coordonnées décimales', () => {
      const distance = calculateDistance('1.5,2.5', '4.5,6.5');
      expect(distance).toBe(7); // |4.5-1.5| + |6.5-2.5| = 3 + 4 = 7
    });

    it('devrait gérer les coordonnées négatives', () => {
      const distance = calculateDistance('-5,-3', '2,4');
      expect(distance).toBe(14); // |2-(-5)| + |4-(-3)| = 7 + 7 = 14
    });
  });

  // ==========================================================================
  // TESTS DE clamp
  // ==========================================================================

  describe('clamp', () => {
    it('devrait contraindre une valeur dans la plage', () => {
      const testCases = [
        { value: 5, min: 0, max: 10, expected: 5 },
        { value: -5, min: 0, max: 10, expected: 0 },
        { value: 15, min: 0, max: 10, expected: 10 },
        { value: 0, min: 0, max: 10, expected: 0 },
        { value: 10, min: 0, max: 10, expected: 10 },
        { value: 50, min: 25, max: 75, expected: 50 },
        { value: 20, min: 25, max: 75, expected: 25 },
        { value: 80, min: 25, max: 75, expected: 75 }
      ];

      testCases.forEach(({ value, min, max, expected }) => {
        const result = clamp(value, min, max);
        expect(result).toBe(expected);
      });
    });

    it('devrait gérer les valeurs décimales', () => {
      expect(clamp(2.5, 0, 5)).toBe(2.5);
      expect(clamp(-1.5, 0, 5)).toBe(0);
      expect(clamp(6.5, 0, 5)).toBe(5);
    });

    it('devrait gérer les valeurs négatives', () => {
      expect(clamp(-10, -5, 5)).toBe(-5);
      expect(clamp(0, -5, 5)).toBe(0);
      expect(clamp(10, -5, 5)).toBe(5);
    });

    it('devrait gérer le cas où min = max', () => {
      expect(clamp(5, 10, 10)).toBe(10);
      expect(clamp(15, 10, 10)).toBe(10);
      expect(clamp(5, 10, 10)).toBe(10);
    });
  });
});

// ============================================================================
// TESTS DE PERFORMANCE ET EDGE CASES
// ============================================================================

describe('Movement Performance & Edge Cases', () => {
  
  describe('Performance des fonctions utilitaires', () => {
    it('calculateDistance devrait être performant sur de grandes quantités', () => {
      const startTime = Date.now();
      
      // Calculer 10000 distances
      for (let i = 0; i < 10000; i++) {
        calculateDistance(`${i},${i}`, `${i + 1},${i + 1}`);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Doit s'exécuter en moins d'une seconde
      expect(duration).toBeLessThan(1000);
    });

    it('validateTargetTile devrait être performant', () => {
      const tile = { position: [10, 10, 0], coord: '10,10' };
      const startTime = Date.now();
      
      // Valider 1000 tuiles
      for (let i = 0; i < 1000; i++) {
        validateTargetTile(tile);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Doit s'exécuter en moins de 500ms
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Edge cases et limites', () => {
    it('devrait gérer des coordonnées extrêmes', () => {
      const extremeCases = [
        { coord1: '0,0', coord2: '999999,999999' },
        { coord1: '-999999,-999999', coord2: '999999,999999' },
        { coord1: '0.000001,0.000001', coord2: '0.000002,0.000002' }
      ];

      extremeCases.forEach(({ coord1, coord2 }) => {
        expect(() => calculateDistance(coord1, coord2)).not.toThrow();
        const distance = calculateDistance(coord1, coord2);
        expect(typeof distance).toBe('number');
        expect(distance).toBeGreaterThanOrEqual(0);
      });
    });

    it('devrait gérer les positions avec des valeurs extrêmes', () => {
      const extremeTiles = [
        { position: [Number.MAX_SAFE_INTEGER, 0, 0], coord: `${Number.MAX_SAFE_INTEGER},0` },
        { position: [Number.MIN_SAFE_INTEGER, 0, 0], coord: `${Number.MIN_SAFE_INTEGER},0` },
        { position: [0, 0, 0], coord: '0,0' }
      ];

      extremeTiles.forEach((tile) => {
        expect(() => validateTargetTile(tile)).not.toThrow();
        const result = validateTargetTile(tile);
        expect(result.position).toEqual(tile.position);
        expect(result.coord).toBe(tile.coord);
      });
    });

    it('clamp devrait gérer les valeurs extrêmes', () => {
      const extremeCases = [
        { value: Number.MAX_VALUE, min: 0, max: 100, expected: 100 },
        { value: -Number.MAX_VALUE, min: 0, max: 100, expected: 0 },
        { value: Number.POSITIVE_INFINITY, min: 0, max: 100, expected: 100 },
        { value: Number.NEGATIVE_INFINITY, min: 0, max: 100, expected: 0 }
      ];

      extremeCases.forEach(({ value, min, max, expected }) => {
        const result = clamp(value, min, max);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Immutabilité et sécurité', () => {
    it('validateTargetTile ne devrait pas modifier l\'objet original', () => {
      const originalTile = {
        position: [10, 10, 0],
        coord: '10,10',
        extraProperty: 'original'
      };
      
      const originalCopy = JSON.parse(JSON.stringify(originalTile));
      
      validateTargetTile(originalTile);
      
      expect(originalTile).toEqual(originalCopy);
    });

    it('les fonctions utilitaires devraient être pures', () => {
      const coord1 = '5,5';
      const coord2 = '10,10';
      
      // Appels multiples doivent donner le même résultat
      const distance1 = calculateDistance(coord1, coord2);
      const distance2 = calculateDistance(coord1, coord2);
      const distance3 = calculateDistance(coord1, coord2);
      
      expect(distance1).toBe(distance2);
      expect(distance2).toBe(distance3);
      
      // Clamp avec les mêmes paramètres
      const clamp1 = clamp(75, 0, 100);
      const clamp2 = clamp(75, 0, 100);
      
      expect(clamp1).toBe(clamp2);
    });
  });
});
