// src/__tests__/coordinateSystem.detailed.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  isValidGridCoord,
  isValidWorldPosition,
  hexToGridCoord,
  gridToHexCoord,
  gridToWorld,
  worldToGrid,
  toVector3,
  fromVector3,
  hasReachedTarget
} from '../utils/coordinateSystem';

describe('Système de Coordonnées', () => {
  describe('Validation', () => {
    describe('isValidGridCoord', () => {
      it('doit valider les coordonnées de grille correctes', () => {
        expect(isValidGridCoord('0,0')).toBe(true);
        expect(isValidGridCoord('1,2')).toBe(true);
        expect(isValidGridCoord('-1,-2')).toBe(true);
        expect(isValidGridCoord('100,200')).toBe(true);
      });

      it('doit rejeter les coordonnées de grille incorrectes', () => {
        expect(isValidGridCoord('a,2')).toBe(false);
        expect(isValidGridCoord('1,b')).toBe(false);
        expect(isValidGridCoord('1.5,2')).toBe(false);
        expect(isValidGridCoord('1,2,3')).toBe(false);
        expect(isValidGridCoord('')).toBe(false);
      });

      it('doit gérer les valeurs null et undefined', () => {
        expect(isValidGridCoord(null)).toBe(false);
        expect(isValidGridCoord(undefined)).toBe(false);
      });

      it('doit gérer les valeurs non-string', () => {
        expect(isValidGridCoord(123)).toBe(false);
        expect(isValidGridCoord({ x: 1, z: 2 })).toBe(false);
        expect(isValidGridCoord(['1', '2'])).toBe(false);
      });
    });

    describe('isValidWorldPosition', () => {
      it('doit valider les positions mondiales correctes', () => {
        expect(isValidWorldPosition({ x: 0, y: 0, z: 0 })).toBe(true);
        expect(isValidWorldPosition({ x: 1.5, y: 0, z: 2.7 })).toBe(true);
        expect(isValidWorldPosition({ x: -10, y: 5, z: -20 })).toBe(true);
      });

      it('doit rejeter les positions mondiales incorrectes', () => {
        expect(isValidWorldPosition({ x: '1', y: 0, z: 2 })).toBe(false);
        expect(isValidWorldPosition({ x: 1, y: 'a', z: 2 })).toBe(false);
        expect(isValidWorldPosition({ x: 1, z: 2 })).toBe(false); // y manquant
        expect(isValidWorldPosition({ x: 1, y: 0 })).toBe(false); // z manquant
        expect(isValidWorldPosition({})).toBe(false);
      });

      it('doit gérer les valeurs null et undefined', () => {
        expect(isValidWorldPosition(null)).toBe(false);
        expect(isValidWorldPosition(undefined)).toBe(false);
      });

      it('doit gérer les valeurs non-objets', () => {
        expect(isValidWorldPosition('1,2,3')).toBe(false);
        expect(isValidWorldPosition(123)).toBe(false);
        expect(isValidWorldPosition([1, 2, 3])).toBe(false);
      });
    });
  });

  describe('Conversion de Coordonnées', () => {
    describe('hexToGridCoord', () => {
      it('doit convertir correctement les coordonnées hex vers grid', () => {
        expect(hexToGridCoord('A0')).toBe('0,0');
        expect(hexToGridCoord('B5')).toBe('1,5');
        expect(hexToGridCoord('Z9')).toBe('25,9');
      });

      it('doit gérer les cas limites et spéciaux', () => {
        expect(hexToGridCoord('a0')).toBe('0,0'); // minuscule
        expect(hexToGridCoord('1,5')).toBe('1,5'); // déjà en format grid
        expect(hexToGridCoord('')).toBe(''); // chaîne vide
      });

      it('doit gérer les valeurs null et undefined', () => {
        expect(hexToGridCoord(null)).toBeNull();
        expect(hexToGridCoord(undefined)).toBeUndefined();
      });
    });

    describe('gridToHexCoord', () => {
      it('doit convertir correctement les coordonnées grid vers hex', () => {
        expect(gridToHexCoord('0,0')).toBe('A0');
        expect(gridToHexCoord('1,5')).toBe('B5');
        expect(gridToHexCoord('25,9')).toBe('Z9');
      });

      it('doit gérer les cas limites et spéciaux', () => {
        expect(gridToHexCoord('B5')).toBe('B5'); // déjà en format hex
        expect(gridToHexCoord('')).toBe(''); // chaîne vide
      });

      it('doit gérer les valeurs null et undefined', () => {
        expect(gridToHexCoord(null)).toBeNull();
        expect(gridToHexCoord(undefined)).toBeUndefined();
      });
    });

    describe('gridToWorld', () => {
      it('doit convertir correctement les coordonnées grid vers world', () => {
        expect(gridToWorld('0,0')).toEqual({ x: 0, y: 0, z: 0 });
        expect(gridToWorld('1,2')).toEqual({ x: 1, y: 0, z: 2 });
        expect(gridToWorld('-1,-1')).toEqual({ x: -1, y: 0, z: -1 });
      });

      it('doit gérer la valeur y correctement', () => {
        // Par défaut y est 0 pour les tuiles au sol
        expect(gridToWorld('1,2').y).toBe(0);
      });

      it('doit gérer les cas limites et spéciaux', () => {
        expect(gridToWorld('')).toBeNull();
        expect(gridToWorld('invalid')).toBeNull();
      });

      it('doit gérer les valeurs null et undefined', () => {
        expect(gridToWorld(null)).toBeNull();
        expect(gridToWorld(undefined)).toBeNull();
      });
    });

    describe('worldToGrid', () => {
      it('doit convertir correctement les positions world vers grid', () => {
        expect(worldToGrid({ x: 0, y: 0, z: 0 })).toBe('0,0');
        expect(worldToGrid({ x: 1, y: 0, z: 2 })).toBe('1,2');
        expect(worldToGrid({ x: -1, y: 0, z: -1 })).toBe('-1,-1');
      });

      it('doit gérer l\'arrondi et les nombres décimaux', () => {
        expect(worldToGrid({ x: 0.6, y: 0, z: 0.3 })).toBe('1,0'); // arrondi
        expect(worldToGrid({ x: -0.6, y: 0, z: -0.3 })).toBe('-1,0'); // arrondi négatif
      });

      it('doit gérer les cas limites et spéciaux', () => {
        expect(worldToGrid({})).toBe('0,0'); // objet vide
        expect(worldToGrid(null)).toBeNull();
        expect(worldToGrid(undefined)).toBeNull();
      });
    });
  });

  describe('Gestion des Vecteurs', () => {
    describe('toVector3', () => {
      it('doit convertir correctement un objet position en Vector3', () => {
        const pos = { x: 1, y: 2, z: 3 };
        const vector = toVector3(pos);
        
        expect(vector).toBeInstanceOf(THREE.Vector3);
        expect(vector.x).toBe(1);
        expect(vector.y).toBe(2);
        expect(vector.z).toBe(3);
      });

      it('doit gérer les cas limites et spéciaux', () => {
        expect(toVector3(null)).toBeNull();
        expect(toVector3(undefined)).toBeNull();
        expect(toVector3({})).toBeInstanceOf(THREE.Vector3);
        expect(toVector3({ x: 1 })).toBeInstanceOf(THREE.Vector3);
        expect(toVector3({ x: 1 }).y).toBe(0); // devrait avoir une valeur par défaut
      });
    });

    describe('fromVector3', () => {
      it('doit convertir correctement un Vector3 en objet position', () => {
        const vector = new THREE.Vector3(1, 2, 3);
        const pos = fromVector3(vector);
        
        expect(pos).toEqual({ x: 1, y: 2, z: 3 });
      });

      it('doit gérer les cas limites et spéciaux', () => {
        expect(fromVector3(null)).toBeNull();
        expect(fromVector3(undefined)).toBeNull();
        
        // Un objet qui n'est pas un Vector3 mais qui a x, y, z
        const mockObj = { x: 1, y: 2, z: 3 };
        expect(fromVector3(mockObj)).toEqual({ x: 1, y: 2, z: 3 });
      });
    });
  });

  describe('Navigation', () => {
    describe('hasReachedTarget', () => {
      it('doit détecter correctement quand la cible est atteinte', () => {
        expect(hasReachedTarget({ x: 1, y: 0, z: 2 }, '1,2')).toBe(true);
        expect(hasReachedTarget({ x: 0.9, y: 0, z: 2.1 }, '1,2', 0.2)).toBe(true); // avec seuil
        expect(hasReachedTarget({ x: 0.7, y: 0, z: 1.7 }, '1,2', 0.5)).toBe(true); // avec seuil plus large
      });

      it('doit détecter correctement quand la cible n\'est pas atteinte', () => {
        expect(hasReachedTarget({ x: 0, y: 0, z: 0 }, '1,2')).toBe(false);
        expect(hasReachedTarget({ x: 0.7, y: 0, z: 1.7 }, '1,2', 0.2)).toBe(false); // avec seuil serré
      });

      it('doit gérer les seuils par défaut', () => {
        // Le seuil par défaut est généralement 0.1 - 0.5 unités
        expect(hasReachedTarget({ x: 0.95, y: 0, z: 1.95 }, '1,2')).toBe(true);
        expect(hasReachedTarget({ x: 0.8, y: 0, z: 1.8 }, '1,2')).toBe(false);
      });

      it('doit gérer les cas limites et spéciaux', () => {
        expect(hasReachedTarget(null, '1,2')).toBe(false);
        expect(hasReachedTarget({ x: 1, y: 0, z: 2 }, null)).toBe(false);
        expect(hasReachedTarget({ x: 1, y: 0, z: 2 }, 'invalid')).toBe(false);
      });
    });
  });
});
