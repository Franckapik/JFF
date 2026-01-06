/**
 * ============================================================================
 * TILE DANGER SLICE - Gestion des Dangers Dynamiques dans le TileStore
 * ============================================================================
 * 
 * Slice Zustand pour gérer les dangers dynamiques qui se déplacent sur la grille.
 * Utilise l'architecture slice existante du TileStore.
 * 
 * @author Dynamic Danger System
 * @version 1.0.0
 */

import type { GridCoordinate } from '../../../types/coordinates.d.ts';
import type { Tile } from '../../../types/tile.d.ts';

/**
 * Interface pour un danger dynamique
 */
export interface DynamicDanger {
  id: string;
  currentCoord: GridCoordinate;
  lastMove: number;
  isActive: boolean;
  originalTileColor?: string;
  damage: number; // Dégâts causés en cas de collision
}

/**
 * Interface pour l'état des dangers dynamiques
 */
interface TileDangerState {
  dynamicDangers: Map<string, DynamicDanger>;
  dangerCount: number;
  lastDangerSpawn: number;
}

/**
 * Interface pour les actions des dangers dynamiques
 */
interface TileDangerActions {
  spawnDynamicDanger: (coord: GridCoordinate, dangerId?: string) => boolean;
  despawnDynamicDanger: (dangerId: string) => boolean;
  moveDynamicDanger: (dangerId: string, newCoord: GridCoordinate) => boolean;
  getDynamicDanger: (dangerId: string) => DynamicDanger | undefined;
  getCurrentDynamicDangers: () => DynamicDanger[];
  checkDangerCollision: (coord: GridCoordinate) => DynamicDanger | null;
  getAllDangerCoords: () => GridCoordinate[];
}

/**
 * Slice pour la gestion des dangers dynamiques
 */
export const createTileDangerSlice = (set: any, get: any): TileDangerState & TileDangerActions => ({
  // État initial
  dynamicDangers: new Map<string, DynamicDanger>(),
  dangerCount: 0,
  lastDangerSpawn: 0,

  /**
   * Crée un nouveau danger dynamique sur une coordonnée donnée
   */
  spawnDynamicDanger: (coord: GridCoordinate, dangerId?: string): boolean => {
    const state = get();
    const tile = state.getTile(coord);
    
    if (!tile || !tile.walkable || tile.type === 'danger') {
      console.warn(`🔥 [DANGER] Cannot spawn danger at ${coord} - tile not available`);
      return false;
    }

    const id = dangerId || `dynamic-danger-${Date.now()}`;
    const now = Date.now();

    // Créer l'objet danger
    const danger: DynamicDanger = {
      id,
      currentCoord: coord,
      lastMove: now,
      isActive: true,
      originalTileColor: tile.color,
      damage: 10, // 10% de dégâts
    };

    // Modifier la tuile pour la rendre dangereuse
    state.updateTile(coord, {
      type: 'danger',
      walkable: true,      // ✅ Ship can pass (takes damage)
      explorable: true,    // ✅ Drone can explore (gets destroyed)
      collectable: false,  // ❌ No resources to collect
      color: '#ff0000',    // Rouge vif pour danger dynamique
      isDynamicDanger: true,
      dangerId: id,
    });

    set((state: any) => ({
      dynamicDangers: new Map(state.dynamicDangers.set(id, danger)),
      dangerCount: state.dangerCount + 1,
      lastDangerSpawn: now,
    }));

    console.log(`🔥 [DANGER] Spawned dynamic danger ${id} at ${coord}`);
    return true;
  },

  /**
   * Supprime un danger dynamique et restaure la tuile
   */
  despawnDynamicDanger: (dangerId: string): boolean => {
    const state = get();
    const danger = state.dynamicDangers.get(dangerId);
    
    if (!danger) {
      console.warn(`🔥 [DANGER] Cannot despawn danger ${dangerId} - not found`);
      return false;
    }

    // Restaurer la tuile originale
    state.updateTile(danger.currentCoord, {
      type: 'resource',
      walkable: true,
      color: danger.originalTileColor || '#42de8b',
      isDynamicDanger: false,
      dangerId: undefined,
    });

    set((state: any) => {
      const newDangers = new Map(state.dynamicDangers);
      newDangers.delete(dangerId);
      return {
        dynamicDangers: newDangers,
        dangerCount: state.dangerCount - 1,
      };
    });

    console.log(`🔥 [DANGER] Despawned dynamic danger ${dangerId}`);
    return true;
  },

  /**
   * Déplace un danger dynamique vers une nouvelle coordonnée
   */
  moveDynamicDanger: (dangerId: string, newCoord: GridCoordinate): boolean => {
    const state = get();
    const danger = state.dynamicDangers.get(dangerId);
    
    if (!danger || !danger.isActive) {
      console.warn(`🔥 [DANGER] Cannot move danger ${dangerId} - not found or inactive`);
      return false;
    }

    const targetTile = state.getTile(newCoord);
    if (!targetTile || !targetTile.walkable || targetTile.type === 'danger') {
      console.warn(`🔥 [DANGER] Cannot move danger ${dangerId} to ${newCoord} - invalid target`);
      return false;
    }

    // Restaurer l'ancienne position
    state.updateTile(danger.currentCoord, {
      type: 'resource',
      walkable: true,
      color: danger.originalTileColor || '#42de8b',
      isDynamicDanger: false,
      dangerId: undefined,
    });

    // Créer le danger à la nouvelle position
    const newDanger: DynamicDanger = {
      ...danger,
      currentCoord: newCoord,
      lastMove: Date.now(),
      originalTileColor: targetTile.color,
    };

    state.updateTile(newCoord, {
      type: 'danger',
      walkable: true,      // ✅ Ship can pass (takes damage)
      explorable: true,    // ✅ Drone can explore (gets destroyed)
      collectable: false,  // ❌ No resources to collect
      color: '#ff0000',
      isDynamicDanger: true,
      dangerId,
    });

    set((state: any) => ({
      dynamicDangers: new Map(state.dynamicDangers.set(dangerId, newDanger)),
    }));

    console.log(`🔥 [DANGER] Moved danger ${dangerId} from ${danger.currentCoord} to ${newCoord}`);
    return true;
  },

  /**
   * Récupère un danger spécifique par son ID
   */
  getDynamicDanger: (dangerId: string): DynamicDanger | undefined => {
    return get().dynamicDangers.get(dangerId);
  },

  /**
   * Récupère tous les dangers dynamiques actifs
   */
  getCurrentDynamicDangers: (): DynamicDanger[] => {
    const dangers = get().dynamicDangers;
    return Array.from(dangers.values()).filter((danger): danger is DynamicDanger => 
      (danger as DynamicDanger).isActive
    );
  },

  /**
   * Vérifie s'il y a un danger dynamique sur une coordonnée donnée
   */
  checkDangerCollision: (coord: GridCoordinate): DynamicDanger | null => {
    const state = get();
    const dangers = state.dynamicDangers;
    
    for (const danger of dangers.values()) {
      if (danger.isActive && danger.currentCoord === coord) {
        return danger;
      }
    }
    
    return null;
  },

  /**
   * Récupère toutes les coordonnées des dangers actifs (statiques et dynamiques)
   */
  getAllDangerCoords: (): GridCoordinate[] => {
    const state = get();
    const staticDangers = state.getTilesByType('danger');
    const dynamicDangers = state.getCurrentDynamicDangers();
    
    const allCoords: GridCoordinate[] = [
      ...staticDangers.map((tile: Tile) => tile.position.coord),
      ...dynamicDangers.map(danger => danger.currentCoord),
    ];
    
    return allCoords;
  },
});

export type TileDangerSlice = TileDangerState & TileDangerActions;