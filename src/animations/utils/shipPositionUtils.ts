/**
 * ============================================================================
 * SHIP POSITION UTILITIES - Utilitaires pour calculs de position du vaisseau
 * ============================================================================
 * 
 * Fonctions spécialisées pour l'animation du vaisseau :
 * - Calcul de chemin BFS entre tuiles
 * - Gestion des vitesses selon l'état
 * - Conditions d'activation de l'animation
 * - Détection de fin de chemin
 * 
 * Utilise les stores tilePathSlice et tileCoordinateSlice pour les calculs.
 */

import type { WorldPosition } from '../../types/coordinates.d.ts';
import type { GridCoordinate } from '../../types/index.d.ts';
import type { ShipVisualState } from '../../types/r3f.d.ts';
import type { TileStoreType } from '../../types/stores.d.ts';

// Import du store de tiles pour les calculs BFS
import { useTileStore } from '../../stores/useTileStore/index.ts';

// Import des constantes
import { TILE_DETECTION_THRESHOLD } from '../../ai/fsm/machineX/config/constants.ts';

// Import du logger
import fsmLogger from '../../logger/fsmLogger.ts';

/**
 * Calcule le chemin BFS entre la position de base et la tuile cible
 * Utilise l'algorithme BFS du tilePathSlice pour garantir un chemin valide
 * @param startPosition - Position de base du vaisseau
 * @param targetCoord - Coordonnée de la tuile cible
 * @returns Array de positions monde représentant le chemin
 */
export const calculateShipPath = (
  startPosition: WorldPosition,
  targetCoord: GridCoordinate | any
): WorldPosition[] => {
  // Extraire la coordonnée si c'est un objet
  const coord = typeof targetCoord === 'string' ? targetCoord : targetCoord.coord;
  
  try {
    // Récupérer l'état du store avec le bon typage
    const tileStore = useTileStore.getState() as TileStoreType;
    
    if (!tileStore.tiles || Object.keys(tileStore.tiles).length === 0) {
      fsmLogger.error('🚢 calculateShipPath: No tiles available in store');
      return [startPosition];
    }

    // Convertir la position de départ en coordonnée de grille
    const startGridCoord = tileStore.worldToGrid(startPosition);
    
    if (!startGridCoord) {
      fsmLogger.error('🚢 calculateShipPath: Could not convert start position to grid', { startPosition });
      return [startPosition];
    }

    // Calculer le chemin BFS
    const gridPath = tileStore.findPath(startGridCoord, coord);
    
    // Debug: vérifier les tuiles de départ et d'arrivée
    const startTile = tileStore.tiles[startGridCoord];
    const targetTile = tileStore.tiles[coord];
    
    fsmLogger.info('🚢 calculateShipPath: Tile verification', {
      startGridCoord,
      targetCoord: coord,
      startTileExists: !!startTile,
      targetTileExists: !!targetTile,
      startTileWalkable: startTile?.walkable,
      targetTileWalkable: targetTile?.walkable,
      startTileNeighbors: startTile?.neighbors?.length || 0,
      targetTileNeighbors: targetTile?.neighbors?.length || 0,
      gridPathLength: gridPath?.length || 0
    });
    
    if (!gridPath || gridPath.length === 0) {
      fsmLogger.info('🚢 calculateShipPath: No valid path found, creating direct path', { startGridCoord, targetCoord: coord });
      
      // Créer un chemin direct si aucun chemin BFS n'est trouvé
      const targetTilePos = tileStore.gridToWorld(coord);
      
      fsmLogger.info('🚢 calculateShipPath: Direct path creation', {
        coord,
        targetTilePos,
        startPosition,
        conversionCheck: {
          gridCoord: coord,
          calculatedWorldPos: targetTilePos,
          expectedFormula: `x: ${coord.split(',')[0]} * 1.1 = ${Number(coord.split(',')[0]) * 1.1}, z: ${coord.split(',')[1]} * 1.1 = ${Number(coord.split(',')[1]) * 1.1}`
        }
      });
      
      return [
        startPosition,
        {
          x: targetTilePos.x,
          y: targetTilePos.y + 0.5,
          z: targetTilePos.z
        }
      ];
    }

    // Convertir le chemin en positions monde
    const worldPath = gridPath.map(coord => {
      const tile = tileStore.tiles[coord];
      if (!tile) {
        fsmLogger.info('🚢 calculateShipPath: Tile not found for coord', { coord });
        return startPosition;
      }
      
      // Convertir la position de la tuile en WorldPosition
      const worldPos = tileStore.gridToWorld(tile.coord);
      
      // Ajouter une légère élévation pour que le vaisseau ne soit pas au niveau du sol
      return {
        x: worldPos.x,
        y: worldPos.y + 0.5,
        z: worldPos.z
      };
    });

    fsmLogger.mouvement('🚢 calculateShipPath: Path calculated successfully', {
      startGridCoord,
      targetCoord: coord,
      pathLength: worldPath.length,
      worldPath: worldPath.slice(0, 3), // Log seulement les 3 premières positions
      startPosition,
      firstWaypointTransform: {
        original: startPosition,
        calculated: worldPath[0]
      },
      lastWaypointTransform: worldPath.length > 1 ? {
        targetCoord: coord,
        calculated: worldPath[worldPath.length - 1]
      } : null
    });

    return worldPath;
    
  } catch (error) {
    fsmLogger.error('🚢 calculateShipPath: Error calculating path', { error, startPosition, targetCoord: coord });
    return [startPosition];
  }
};

/**
 * Calcule la vitesse du vaisseau selon son état
 * @param shipState - État actuel du vaisseau
 * @returns Facteur de vitesse pour l'interpolation
 */
export const getShipSpeed = (shipState: string): number => {
  switch (shipState) {
    case 'collecting_ship_moving_to_tile': return 1.0;  // Vitesse normale vers la cible
    case 'collecting_ship_returning': return 1.2;       // Légèrement plus rapide au retour
    case 'moving_to_tile': return 1.0;                  // État visuel générique
    case 'returning': return 1.2;                       // État visuel générique
    default: return 0.8;                                // Vitesse par défaut plus lente
  }
};

/**
 * Détermine si le vaisseau doit être animé selon les conditions
 * @param shipState - État actuel du vaisseau
 * @param isMoving - Indique si le vaisseau est en mouvement
 * @param isActive - Indique si l'animation est active
 * @returns True si l'animation doit être activée
 */
export const shouldAnimateShip = (
  shipState: string,
  isMoving: boolean,
  isActive: boolean
): boolean => {
  if (!isActive) {
    return false;
  }
  
  // États nécessitant une animation de mouvement
  const movementStates = [
    'collecting_ship_moving_to_tile',
    'collecting_ship_returning',
    'moving_to_tile',
    'returning'
  ];
  
  // États nécessitant une animation continue (même sans mouvement)
  const continuousAnimationStates = [
    'collecting_ship_collecting',
    'collecting'
  ];
  
  // Animation requise si :
  // 1. État de mouvement + flag isMoving
  // 2. État d'animation continue
  const needsMovementAnimation = movementStates.includes(shipState) && isMoving;
  const needsContinuousAnimation = continuousAnimationStates.includes(shipState);
  
  return needsMovementAnimation || needsContinuousAnimation;
};

/**
 * Vérifie si le chemin est terminé
 * @param currentPosition - Position actuelle du vaisseau
 * @param path - Chemin complet du vaisseau
 * @param pathIndex - Index actuel dans le chemin
 * @returns True si le chemin est terminé
 */
export const isPathCompleted = (
  currentPosition: WorldPosition,
  path: WorldPosition[],
  pathIndex: number
): boolean => {
  // Chemin vide ou index dépassé
  if (!path || path.length === 0 || pathIndex >= path.length - 1) {
    return true;
  }
  
  // Vérifier la distance à la destination finale
  const finalTarget = path[path.length - 1];
  const distance = calculateDistance(currentPosition, finalTarget);
  
  const completed = distance < TILE_DETECTION_THRESHOLD;
  
  if (completed) {
    fsmLogger.mouvement('🚢 isPathCompleted: Ship reached final destination', {
      currentPosition,
      finalTarget,
      distance,
      threshold: TILE_DETECTION_THRESHOLD,
      pathIndex,
      pathLength: path.length
    });
  }
  
  return completed;
};

/**
 * Calcule la distance euclidienne entre deux positions
 * @param pos1 - Première position
 * @param pos2 - Seconde position
 * @returns Distance euclidienne
 */
export const calculateDistance = (
  pos1: WorldPosition,
  pos2: WorldPosition
): number => {
  return Math.sqrt(
    Math.pow(pos2.x - pos1.x, 2) +
    Math.pow(pos2.y - pos1.y, 2) +
    Math.pow(pos2.z - pos1.z, 2)
  );
};

/**
 * Vérifie si le vaisseau a atteint la prochaine tuile dans le chemin
 * @param currentPosition - Position actuelle du vaisseau
 * @param targetPosition - Position de la tuile cible
 * @returns True si la tuile est atteinte
 */
export const hasReachedNextTile = (
  currentPosition: WorldPosition,
  targetPosition: WorldPosition
): boolean => {
  const distance = calculateDistance(currentPosition, targetPosition);
  return distance < TILE_DETECTION_THRESHOLD;
};

/**
 * Obtient la prochaine position cible dans le chemin
 * @param path - Chemin complet
 * @param pathIndex - Index actuel
 * @returns Position cible ou null si fin de chemin
 */
export const getNextTargetPosition = (
  path: WorldPosition[],
  pathIndex: number
): WorldPosition | null => {
  if (!path || pathIndex >= path.length - 1) {
    return null;
  }
  
  return path[pathIndex + 1];
};

/**
 * Mappe l'état FSM vers un état visuel simplifié
 * @param fsmState - État de la machine FSM
 * @returns État visuel pour l'animation
 */
export const mapFSMStateToVisualState = (fsmState: string): ShipVisualState => {
  switch (fsmState) {
    case 'collecting_ship_moving_to_tile':
      return 'moving_to_tile';
    case 'collecting_ship_collecting':
      return 'collecting';
    case 'collecting_ship_returning':
      return 'returning';
    case 'evaluating':
    case 'maintaining':
    default:
      return 'docked';
  }
};
