/**
 * =========================================================================
 * TILE MARK SLICE (TypeScript)
 * =========================================================================
 * 
 * Ce slice gère le marquage et le suivi de l'état d'exploration des tuiles :
 * - Marquage des tuiles comme explorées
 * - Marquage des tuiles comme collectées
 * - Suivi du statut d'exploration pour la logique de jeu
 * - Gestion des états de visite et de découverte
 * 
 * États de marquage gérés :
 * - explored : indique si une tuile a été visitée/explorée
 * - resourcePercentage : pourcentage de ressources restantes (0-100%)
 * - Extensible pour d'autres types de marquage (visited, scanned, etc.)
 * 
 * Utilisé par :
 * - Logique d'exploration automatique des bots
 * - Système de brouillard de guerre
 * - Calculs de territoire et de contrôle
 */

import type {
    GridCoordinate
} from '../../../types/index.ts';
import type { TileMarkSliceActions, TileStoreType } from '../../../types/stores.d.ts';

import { isTileCompletelyCollected } from './tileResourceSlice.ts';

// =========================================================================
// TYPES LOCAUX
// =========================================================================

/** Actions du slice de marquage */

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createTileMarkSlice = (_set: unknown, get: () => TileStoreType): TileMarkSliceActions => {
  return {

    // =====================================================================
    // ACTIONS PUBLIQUES - MARQUAGE D'EXPLORATION
    // =====================================================================

    /**
     * Marque une tuile comme explorée
     * 
     * Cette fonction :
     * 1. Vérifie que la tuile existe dans l'état global
     * 2. Met à jour la propriété 'explored' à true
     * 3. Ajoute les métadonnées d'exploration (timestamp, explorateur)
     * 4. Préserve toutes les autres propriétés de la tuile
     * 
     * Utilisé principalement par :
     * - Les systèmes de mouvement des véhicules
     * - La logique d'exploration automatique des bots
     * - Les mécaniques de découverte de territoire
     * 
     * @param coord - Coordonnée de la tuile à marquer comme explorée (format "x,y")
     * @param explorer - ID de l'entité qui explore (optionnel)
     */
    markTileAsExplored: (coord: GridCoordinate, explorer?: string): void => {
      const currentTile = get().tiles[coord];
      
      if (!currentTile) {
        return;
      }
      
      get().updateTile(coord, {
        explored: true,
        exploredAt: Date.now(),
        exploredBy: explorer,
      });
    },

    /**
     * Marque une tuile comme ayant eu ses ressources collectées
     * 
     * Cette fonction :
     * 1. Vérifie que la tuile existe et n'est pas déjà collectée
     * 2. Marque la tuile comme collectée
     * 3. Met le pourcentage de ressources à 0%
     * 4. Vide toutes les ressources de la tuile
     * 5. Ajoute les métadonnées de collecte
     * 
     * @param coord - Coordonnée de la tuile à marquer
     * @param collector - ID de l'entité qui collecte (optionnel)
     * @returns true si la tuile a été marquée, false si déjà collectée
     */
    markTileAsCollected: (coord: GridCoordinate, collector?: string): boolean => {
      const tile = get().tiles[coord];
      if (!tile) return false;
      
      // Si la tuile est déjà complètement collectée, ne rien faire
      if (isTileCompletelyCollected(tile)) return false;
      
      get().updateTile(coord, {
        collected: true,
        collectedAt: Date.now(),
        collectedBy: collector,
        resourcePercentage: 0, // Mettre à 0% car la tuile est complètement collectée
        hasResources: false,
        resources: { food: 0, debris: 0, special: 0, total: 0 }
      });
      
      return true;
    },
  } as TileMarkSliceActions;
};

export default createTileMarkSlice;
