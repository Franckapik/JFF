/**
 * =========================================================================
 * TILE RESOURCE SLICE (TypeScript)
 * =========================================================================
 * 
 * Ce slice gère la logique des ressources des tuiles dans le jeu :
 * - Collecte et déduction des ressources
 * - Marquage des tuiles comme collectées
 * - Calcul des pourcentages de ressources restantes
 * - Analyse des ressources à proximité d'une position
 * - Reset et réinitialisation des ressources
 * - Utilitaires pour déterminer l'état de collecte des tuiles
 * 
 * Types de ressources gérées :
 * - food : nourriture pour les équipages
 * - debris : matériaux de construction et réparation
 * - special : ressources rares et précieuses
 * 
 * État géré :
 * - resourcePercentage : pourcentage de ressources restantes (0-100%)
 * - originalResources : copie des ressources initiales pour référence
 * 
 * Source de vérité unique : resourcePercentage (0-100%)
 * - 0% = tuile complètement collectée (plus de ressources)
 * - 1-99% = tuile partiellement collectée (ressources restantes)
 * - 100% = tuile non collectée (ressources intactes)
 * - undefined/null = tuile non explorée ou sans ressources
 */

import type {
    GridCoordinate,
    Tile
} from '../../../types/index.ts';
import type { ResourceStats } from '../../../types/resources.js';

import fsmLogger from '../../../logger/fsmLogger.ts';

// =========================================================================
// UTILITAIRES DE COLLECTE DES TUILES
// =========================================================================

/**
 * Détermine si une tuile est complètement collectée
 * Une tuile est considérée comme complètement collectée si son pourcentage de ressources est exactement 0%
 * 
 * @param tile - Objet tuile
 * @returns true si la tuile est complètement collectée
 */
export const isTileCompletelyCollected = (tile: Tile | any): boolean => {
  if (!tile || tile.resourcePercentage === undefined || tile.resourcePercentage === null) {
    return false;
  }
  return tile.resourcePercentage === 0;
};

/**
 * Détermine si une tuile a des ressources partiellement collectées
 * Une tuile est partiellement collectée si son pourcentage est entre 1% et 99%
 * 
 * @param tile - Objet tuile
 * @returns true si la tuile est partiellement collectée
 */
export const isTilePartiallyCollected = (tile: Tile | any): boolean => {
  if (!tile || tile.resourcePercentage === undefined || tile.resourcePercentage === null) {
    return false;
  }
  return tile.resourcePercentage > 0 && tile.resourcePercentage < 100;
};

/**
 * Détermine si une tuile n'a jamais été collectée
 * Une tuile n'est pas collectée si son pourcentage est exactement 100%
 * 
 * @param tile - Objet tuile
 * @returns true si la tuile n'a jamais été collectée
 */
export const isTileUncollected = (tile: Tile | any): boolean => {
  if (!tile || tile.resourcePercentage === undefined || tile.resourcePercentage === null) {
    return true; // Les tuiles sans pourcentage défini sont considérées comme non collectées
  }
  return tile.resourcePercentage === 100;
};

// =========================================================================
// TYPES LOCAUX
// =========================================================================

/** Ressource trouvée avec métadonnées de position */
interface ResourceWithLocation {
  coord: GridCoordinate;
  position: { x: number; y: number; z: number };
  resources: ResourceStats;
  distance: number;
}

/** Source pour les recherches de ressources */
type ResourceSearchSource = GridCoordinate | { coord: GridCoordinate };

/** Actions du slice des ressources */
interface TileResourceSliceActions {
  collectResources: (coord: GridCoordinate, collector: string) => ResourceStats;
  deductResources: (coord: GridCoordinate, amount: Partial<ResourceStats>) => boolean;
  hasResources: (coord: GridCoordinate, minimum?: Partial<ResourceStats>) => boolean;
  markTileAsCollected: (coord: GridCoordinate, collector: string) => void;
  resetTileResources: (coord: GridCoordinate) => void;
  resetAllTileResources: () => void;
  analyzeResourcesNearPosition: (source: ResourceSearchSource, radius?: number) => ResourceWithLocation[];
}

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createTileResourceSlice = (set: any, get: any): TileResourceSliceActions => {
  return {
    
    /**
     * Collecte toutes les ressources disponibles d'une tuile
     * 
     * Cette fonction :
     * 1. Vérifie l'existence et l'état de la tuile
     * 2. Récupère toutes les ressources disponibles
     * 3. Met à jour la tuile avec un état "collecté"
     * 4. Retourne les ressources collectées
     * 
     * @param coord - Coordonnée de la tuile à collecter
     * @param collector - ID de l'entité qui collecte
     * @returns Ressources collectées
     */
    collectResources: (coord: GridCoordinate, collector: string): ResourceStats => {
      const tile = get().tiles[coord];
      
      if (!tile || !tile.resources) {
        return { food: 0, debris: 0, special: 0, total: 0 };
      }
      
      // Calculer les ressources à collecter en fonction du pourcentage restant
      const resourcePercentage = tile.resourcePercentage ?? 100;
      const actualResources = {
        food: Math.floor((tile.resources.food * resourcePercentage) / 100),
        debris: Math.floor((tile.resources.debris * resourcePercentage) / 100),
        special: Math.floor((tile.resources.special * resourcePercentage) / 100),
        total: 0
      };
      actualResources.total = actualResources.food + actualResources.debris + actualResources.special;
      
      // Marquer la tuile comme collectée
      get().updateTile(coord, {
        collected: true,
        collectedAt: Date.now(),
        collectedBy: collector,
        resourcePercentage: 0,
        hasResources: false
      });
      
      fsmLogger.info(`[TileResourceSlice] Ressources collectées de ${coord} par ${collector}:`, actualResources);
      
      return actualResources;
    },

    /**
     * Déduit une quantité spécifique de ressources d'une tuile
     * 
     * @param coord - Coordonnée de la tuile
     * @param amount - Quantités à déduire par type de ressource
     * @returns true si la déduction a réussi, false sinon
     */
    deductResources: (coord: GridCoordinate, amount: Partial<ResourceStats>): boolean => {
      const tile = get().tiles[coord];
      
      if (!tile || !tile.resources) {
        return false;
      }
      
      const currentResources = { ...tile.resources };
      const deductionAmount = {
        food: amount.food ?? 0,
        debris: amount.debris ?? 0,
        special: amount.special ?? 0
      };
      
      // Vérifier que nous avons suffisamment de ressources
      if (currentResources.food < deductionAmount.food ||
          currentResources.debris < deductionAmount.debris ||
          currentResources.special < deductionAmount.special) {
        return false;
      }
      
      // Effectuer la déduction
      const newResources = {
        food: currentResources.food - deductionAmount.food,
        debris: currentResources.debris - deductionAmount.debris,
        special: currentResources.special - deductionAmount.special,
        total: 0
      };
      newResources.total = newResources.food + newResources.debris + newResources.special;
      
      // Calculer le nouveau pourcentage
      const originalTotal = tile.originalResources?.total ?? tile.resources.total;
      const newPercentage = originalTotal > 0 ? Math.floor((newResources.total / originalTotal) * 100) : 0;
      
      get().updateTile(coord, {
        resources: newResources,
        resourcePercentage: newPercentage,
        hasResources: newResources.total > 0
      });
      
      return true;
    },

    /**
     * Vérifie si une tuile contient suffisamment de ressources
     * 
     * @param coord - Coordonnée de la tuile
     * @param minimum - Quantités minimales requises (optionnel)
     * @returns true si la tuile a suffisamment de ressources
     */
    hasResources: (coord: GridCoordinate, minimum: Partial<ResourceStats> = {}): boolean => {
      const tile = get().tiles[coord];
      
      if (!tile || !tile.resources || !tile.hasResources) {
        return false;
      }
      
      const required = {
        food: minimum.food ?? 0,
        debris: minimum.debris ?? 0,
        special: minimum.special ?? 0
      };
      
      return tile.resources.food >= required.food &&
             tile.resources.debris >= required.debris &&
             tile.resources.special >= required.special;
    },

    /**
     * Marque une tuile comme collectée sans collecter les ressources
     * Utilisé pour synchroniser l'état des tuiles
     * 
     * @param coord - Coordonnée de la tuile
     * @param collector - ID de l'entité qui a collecté
     */
    markTileAsCollected: (coord: GridCoordinate, collector: string): void => {
      get().updateTile(coord, {
        collected: true,
        collectedAt: Date.now(),
        collectedBy: collector,
        resourcePercentage: 0,
        hasResources: false
      });
    },

    /**
     * Remet les ressources d'une tuile à leur état initial
     * 
     * @param coord - Coordonnée de la tuile à réinitialiser
     */
    resetTileResources: (coord: GridCoordinate): void => {
      const tile = get().tiles[coord];
      
      if (!tile || !tile.originalResources) {
        return;
      }
      
      get().updateTile(coord, {
        resources: { ...tile.originalResources },
        resourcePercentage: 100,
        collected: false,
        collectedAt: undefined,
        collectedBy: undefined,
        hasResources: tile.originalResources.total > 0
      });
    },

    /**
     * Remet toutes les ressources du jeu à leur état initial
     */
    resetAllTileResources: (): void => {
      const tiles = get().tiles;
      
      Object.keys(tiles).forEach(coord => {
        get().resetTileResources(coord);
      });
    },

    /**
     * Analyse les ressources disponibles dans un rayon autour d'une position
     * 
     * Cette fonction parcourt toutes les tuiles dans un rayon donné,
     * identifie celles qui contiennent des ressources non collectées,
     * et retourne une liste triée par distance croissante.
     * 
     * @param source - Coordonnée (format "x,y") ou objet avec propriété coord
     * @param radius - Rayon de recherche autour de la position (défaut: 3)
     * @returns Liste des ressources trouvées avec métadonnées, triées par distance
     */
    analyzeResourcesNearPosition: (source: ResourceSearchSource, radius: number = 3): ResourceWithLocation[] => {
      // Conversion flexible de la source en coordonnées
      let coord: GridCoordinate;
      if (typeof source === 'string') {
        coord = source;
      } else if (source && source.coord) {
        coord = source.coord;
      } else {
        return [];
      }
      
      if (!coord) return [];
      
      const tiles = get().tiles;
      const [vX, vY] = coord.split(',').map(Number); // Convertit les coordonnées en nombres
      const resources: ResourceWithLocation[] = [];
      
      // Parcourt les tuiles dans un rayon donné
      for (let x = vX - radius; x <= vX + radius; x++) {
        for (let y = vY - radius; y <= vY + radius; y++) {
          const tileCoord = `${x},${y}`;
          const tile = tiles[tileCoord];
          
          // Vérifie si la tuile contient des ressources non collectées
          if (tile && !isTileCompletelyCollected(tile) && tile.resources && 
              (tile.resources.food > 0 || tile.resources.debris > 0 || tile.resources.special > 0)) {
            resources.push({
              coord: tileCoord,
              position: tile.position,
              resources: tile.resources,
              // Calcule la distance euclidienne pour le tri
              distance: Math.sqrt(Math.pow(x - vX, 2) + Math.pow(y - vY, 2)),
            });
          }
        }
      }
      
      // Retourne les ressources triées par proximité
      return resources.sort((a, b) => a.distance - b.distance);
    },
  } as TileResourceSliceActions;
};

export default createTileResourceSlice;
