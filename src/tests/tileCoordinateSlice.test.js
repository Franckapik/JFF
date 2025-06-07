/**
 * =========================================================================
 * TESTS POUR TILE COORDINATE SLICE
 * =========================================================================
 * 
 * Tests unitaires pour vérifier les fonctions de conversion de coordonnées
 * et les utilitaires du tileCoordinateSlice.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import createTileCoordinateSlice from '../stores/useTileStore/slices/tileCoordinateSlice.js';

// Simuler le slice pour les tests
const createMockTileCoordinateSlice = () => {
  let slice = {};
  
  // Créer le slice avec get/set mock
  const mockGet = () => slice;
  const mockSet = () => {};
  
  // Créer le slice
  slice = createTileCoordinateSlice(mockSet, mockGet);
  
  return slice;
};

describe('TileCoordinateSlice - Tests de conversion de coordonnées', () => {
  let slice;

  beforeAll(() => {
    slice = createMockTileCoordinateSlice();
  });

  // =========================================================================
  // TESTS POUR hexToGridCoord
  // =========================================================================
  
  describe('hexToGridCoord', () => {
    it('devrait convertir des coordonnées hex valides en coordonnées grille', () => {
      expect(slice.hexToGridCoord('A0')).toBe('0,0');
      expect(slice.hexToGridCoord('B5')).toBe('1,5');
      expect(slice.hexToGridCoord('C10')).toBe('2,10');
      expect(slice.hexToGridCoord('Z25')).toBe('25,25');
    });

    it('devrait gérer les lettres minuscules', () => {
      expect(slice.hexToGridCoord('a0')).toBe('0,0');
      expect(slice.hexToGridCoord('b5')).toBe('1,5');
      expect(slice.hexToGridCoord('z25')).toBe('25,25');
    });

    it('devrait retourner as-is si déjà en format grille', () => {
      expect(slice.hexToGridCoord('1,5')).toBe('1,5');
      expect(slice.hexToGridCoord('0,0')).toBe('0,0');
      expect(slice.hexToGridCoord('-1,-5')).toBe('-1,-5');
    });

    it('devrait gérer les cas edge', () => {
      expect(slice.hexToGridCoord(null)).toBe(null);
      expect(slice.hexToGridCoord(undefined)).toBe(undefined);
      expect(slice.hexToGridCoord('')).toBe('');
      expect(slice.hexToGridCoord('invalid')).toBe('invalid');
    });
  });

  // =========================================================================
  // TESTS POUR gridToHexCoord - FOCUS SUR LE PROBLÈME SUSPECTÉ
  // =========================================================================
  
  describe('gridToHexCoord', () => {
    it('devrait convertir des coordonnées grille valides en coordonnées hex', () => {
      console.log('Test: 0,0 ->', slice.gridToHexCoord('0,0'));
      expect(slice.gridToHexCoord('0,0')).toBe('A0');
      
      console.log('Test: 1,5 ->', slice.gridToHexCoord('1,5'));
      expect(slice.gridToHexCoord('1,5')).toBe('B5');
      
      console.log('Test: 2,10 ->', slice.gridToHexCoord('2,10'));
      expect(slice.gridToHexCoord('2,10')).toBe('C10');
      
      console.log('Test: 25,25 ->', slice.gridToHexCoord('25,25'));
      expect(slice.gridToHexCoord('25,25')).toBe('Z25');
    });

    it('devrait retourner as-is si déjà en format hex', () => {
      expect(slice.gridToHexCoord('A0')).toBe('A0');
      expect(slice.gridToHexCoord('B5')).toBe('B5');
      expect(slice.gridToHexCoord('z25')).toBe('z25');
    });

    it('devrait gérer les coordonnées négatives', () => {
      console.log('Test: -1,5 ->', slice.gridToHexCoord('-1,5'));
      expect(slice.gridToHexCoord('-1,5')).toBe('-1,5'); // Devrait retourner as-is
      
      console.log('Test: 1,-5 ->', slice.gridToHexCoord('1,-5'));
      expect(slice.gridToHexCoord('1,-5')).toBe('B-5'); // Z négatif devrait être autorisé
    });

    it('devrait gérer les coordonnées hors limites', () => {
      console.log('Test: 26,0 ->', slice.gridToHexCoord('26,0'));
      expect(slice.gridToHexCoord('26,0')).toBe('26,0'); // Hors limites, retour as-is
      
      console.log('Test: 100,0 ->', slice.gridToHexCoord('100,0'));
      expect(slice.gridToHexCoord('100,0')).toBe('100,0'); // Hors limites, retour as-is
    });

    it('devrait gérer les cas edge', () => {
      expect(slice.gridToHexCoord(null)).toBe(null);
      expect(slice.gridToHexCoord(undefined)).toBe(undefined);
      expect(slice.gridToHexCoord('')).toBe('');
      expect(slice.gridToHexCoord('invalid')).toBe('invalid');
    });

    it('devrait tester des cas spécifiques qui pourraient poser problème', () => {
      // Test des limites exactes
      console.log('Test limite: 0,0 ->', slice.gridToHexCoord('0,0'));
      console.log('Test limite: 25,0 ->', slice.gridToHexCoord('25,0'));
      
      // Test avec des nombres à plusieurs chiffres
      console.log('Test multi-chiffres: 5,123 ->', slice.gridToHexCoord('5,123'));
      expect(slice.gridToHexCoord('5,123')).toBe('F123');
      
      // Test avec zéro
      console.log('Test avec zéro: 10,0 ->', slice.gridToHexCoord('10,0'));
      expect(slice.gridToHexCoord('10,0')).toBe('K0');
    });

    it('devrait gérer les coordonnées 3D (x,y,z) en ignorant y', () => {
      // Test avec coordonnées 3D - devrait ignorer la composante y
      console.log('Test 3D: 0,5,0 ->', slice.gridToHexCoord('0,5,0'));
      expect(slice.gridToHexCoord('0,5,0')).toBe('A0');
      
      console.log('Test 3D: 1,10,5 ->', slice.gridToHexCoord('1,10,5'));
      expect(slice.gridToHexCoord('1,10,5')).toBe('B5');
      
      console.log('Test 3D: 5,100,123 ->', slice.gridToHexCoord('5,100,123'));
      expect(slice.gridToHexCoord('5,100,123')).toBe('F123');
      
      // Test avec des coordonnées négatives en 3D
      console.log('Test 3D négatif: 2,-5,-10 ->', slice.gridToHexCoord('2,-5,-10'));
      expect(slice.gridToHexCoord('2,-5,-10')).toBe('C-10');
      
      // Test hors limites en 3D
      console.log('Test 3D hors limites: 30,0,5 ->', slice.gridToHexCoord('30,0,5'));
      expect(slice.gridToHexCoord('30,0,5')).toBe('30,0,5'); // Retour as-is
    });
  });

  // =========================================================================
  // TESTS DE VALIDATION
  // =========================================================================
  
  describe('Fonctions de validation', () => {
    describe('isValidGridCoord', () => {
      it('devrait valider les coordonnées grille correctes', () => {
        expect(slice.isValidGridCoord('0,0')).toBe(true);
        expect(slice.isValidGridCoord('1,5')).toBe(true);
        expect(slice.isValidGridCoord('-1,-5')).toBe(true);
        expect(slice.isValidGridCoord('123,456')).toBe(true);
      });

      it('devrait rejeter les coordonnées invalides', () => {
        expect(slice.isValidGridCoord(null)).toBe(false);
        expect(slice.isValidGridCoord(undefined)).toBe(false);
        expect(slice.isValidGridCoord('')).toBe(false);
        expect(slice.isValidGridCoord('invalid')).toBe(false);
        expect(slice.isValidGridCoord('1')).toBe(false);
        expect(slice.isValidGridCoord('1,2,3')).toBe(false);
      });
    });

    describe('isValidWorldPosition', () => {
      it('devrait valider les positions mondiales correctes', () => {
        expect(slice.isValidWorldPosition({ x: 0, y: 0, z: 0 })).toBe(true);
        expect(slice.isValidWorldPosition({ x: 1.5, y: 2.5, z: 3.5 })).toBe(true);
        expect(slice.isValidWorldPosition({ x: -1, y: -2, z: -3 })).toBe(true);
      });

      it('devrait rejeter les positions invalides', () => {
        expect(slice.isValidWorldPosition(null)).toBe(false);
        expect(slice.isValidWorldPosition(undefined)).toBe(false);
        expect(slice.isValidWorldPosition({})).toBe(false);
        expect(slice.isValidWorldPosition({ x: 1, y: 2 })).toBe(false); // Manque z
        expect(slice.isValidWorldPosition({ x: 'invalid', y: 0, z: 0 })).toBe(false);
        expect(slice.isValidWorldPosition([])).toBe(false);
      });
    });
  });

  // =========================================================================
  // TESTS DE ROUNDTRIP (aller-retour)
  // =========================================================================
  
  describe('Tests de roundtrip (aller-retour)', () => {
    it('devrait faire des conversions aller-retour correctes hex->grid->hex', () => {
      const testCases = ['A0', 'B5', 'C10', 'Z25'];
      
      testCases.forEach(hexCoord => {
        const gridCoord = slice.hexToGridCoord(hexCoord);
        const backToHex = slice.gridToHexCoord(gridCoord);
        console.log(`Roundtrip: ${hexCoord} -> ${gridCoord} -> ${backToHex}`);
        expect(backToHex).toBe(hexCoord);
      });
    });

    it('devrait faire des conversions aller-retour correctes grid->hex->grid', () => {
      const testCases = ['0,0', '1,5', '2,10', '25,25'];
      
      testCases.forEach(gridCoord => {
        const hexCoord = slice.gridToHexCoord(gridCoord);
        const backToGrid = slice.hexToGridCoord(hexCoord);
        console.log(`Roundtrip: ${gridCoord} -> ${hexCoord} -> ${backToGrid}`);
        expect(backToGrid).toBe(gridCoord);
      });
    });
  });

  // =========================================================================
  // TESTS DE CAS RÉELS (basés sur votre problème de prospecting)
  // =========================================================================
  
  describe('Tests de cas réels - Prospecting scenario', () => {
    it('devrait gérer les coordonnées typiques du jeu', () => {
      // Simuler des coordonnées typiques qui pourraient venir de worldToGrid
      const realWorldCoords = [
        '5,7',   // Position typique
        '0,0',   // Origine
        '12,15', // Position plus éloignée
        '3,8'    // Autre position typique
      ];

      realWorldCoords.forEach(coord => {
        console.log(`Test coordonnée réelle: ${coord}`);
        const hexCoord = slice.gridToHexCoord(coord);
        console.log(`  -> hex: ${hexCoord}`);
        
        // Vérifier que la conversion produit quelque chose de sensé
        if (coord.match(/^\d+,\d+$/)) {
          const [x, z] = coord.split(',').map(Number);
          if (x >= 0 && x <= 25) {
            // Devrait produire une vraie coordonnée hex
            expect(hexCoord).toMatch(/^[A-Z]-?\d+$/);
          } else {
            // Hors limites, devrait retourner as-is
            expect(hexCoord).toBe(coord);
          }
        }
      });
    });

    it('devrait diagnostiquer le problème avec undefined/null', () => {
      // Cas qui pourraient venir de worldToGrid quand ça foire
      console.log('Test avec undefined:', slice.gridToHexCoord(undefined));
      console.log('Test avec null:', slice.gridToHexCoord(null));
      console.log('Test avec string vide:', slice.gridToHexCoord(''));
      
      expect(slice.gridToHexCoord(undefined)).toBe(undefined);
      expect(slice.gridToHexCoord(null)).toBe(null);
      expect(slice.gridToHexCoord('')).toBe('');
    });
  });
});
