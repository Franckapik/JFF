/**
 * =========================================================================
 * TEST DE VALIDATION TYPESCRIPT - TILE STORE
 * =========================================================================
 * 
 * Fichier de test pour valider la conversion TypeScript du tile store.
 * Teste les types, l'import et l'utilisation de base du store.
 */

import type { GridCoordinate, WorldPosition } from '../../../types/index.js';
import { useTileStore } from '../index.js';

// Test d'utilisation du store
export const testTileStore = () => {
  console.log('🧪 Test de validation du Tile Store TypeScript');
  
  // Test d'accès aux fonctions du store
  const store = useTileStore.getState();
  
  // Vérification des slices principaux
  const hasBaseSlice = typeof store.getTile === 'function';
  const hasResourceSlice = typeof store.collectResources === 'function';
  const hasPathSlice = typeof store.findPath === 'function';
  const hasMarkSlice = typeof store.markTileAsExplored === 'function';
  const hasFilterSlice = typeof store.getWalkableTiles === 'function';
  const hasCoordinateSlice = typeof store.gridToWorld === 'function';
  const hasGenerationSlice = typeof store.initializeGameGrid === 'function';
  
  console.log('✅ Validation des slices:', {
    base: hasBaseSlice,
    resource: hasResourceSlice,
    path: hasPathSlice,
    mark: hasMarkSlice,
    filter: hasFilterSlice,
    coordinate: hasCoordinateSlice,
    generation: hasGenerationSlice
  });
  
  // Test de types
  const testCoord: GridCoordinate = "0,0";
  const testPosition: WorldPosition = { x: 0, y: 0.5, z: 0 };
  
  console.log('✅ Types validés:', { testCoord, testPosition });
  
  return {
    success: hasBaseSlice && hasResourceSlice && hasPathSlice && 
             hasMarkSlice && hasFilterSlice && hasCoordinateSlice && 
             hasGenerationSlice,
    slices: {
      base: hasBaseSlice,
      resource: hasResourceSlice,
      path: hasPathSlice,
      mark: hasMarkSlice,
      filter: hasFilterSlice,
      coordinate: hasCoordinateSlice,
      generation: hasGenerationSlice
    }
  };
};
