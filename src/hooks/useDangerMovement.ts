/**
 * ============================================================================
 * DANGER MOVEMENT HOOK - Simple Moving Dangers via Tile Property Changes
 * ============================================================================
 * 
 * Hook simple qui gère le mouvement aléatoire d'un danger dynamique sur la grille.
 * Utilise l'infrastructure existante du TileStore pour modifier les propriétés 
 * des tuiles au fil du temps.
 * 
 * @author Simple Danger System Implementation
 * @version 1.0.0
 */

import { useEffect, useRef } from 'react';

import { useTileStore } from '../stores/useTileStore';
import type { GridCoordinate } from '../types/coordinates.d.ts';

/**
 * Configuration du système de dangers mouvants
 */
const DANGER_CONFIG = {
  MOVE_INTERVAL: 3000, // 3 secondes entre chaque mouvement
  DANGER_COLOR: '#ff0000', // Rouge pour les dangers dynamiques
  STATIC_DANGER_COLOR: '#ef4444', // Rouge plus clair pour les dangers statiques
} as const;

/**
 * Interface pour traquer un danger dynamique
 */
interface DynamicDanger {
  id: string;
  currentCoord: GridCoordinate;
  lastMove: number;
  isActive: boolean;
}

/**
 * Hook pour gérer le mouvement des dangers dynamiques
 * Utilise l'approche simple de modification des propriétés de tuiles
 */
export function useDangerMovement() {
  const dynamicDangersRef = useRef<Map<string, DynamicDanger>>(new Map());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  /**
   * Trouve une tuile voisine walkable aléatoire
   */
  const getRandomNeighbor = (currentCoord: GridCoordinate): GridCoordinate | null => {
    const { getTile } = useTileStore.getState();
    const currentTile = getTile(currentCoord);
    if (!currentTile?.neighbors) return null;

    // Filtrer les voisins walkable (pas de dangers ni d'obstacles)
    const walkableNeighbors = currentTile.neighbors.filter(coord => {
      const neighborTile = getTile(coord);
      return neighborTile && 
             neighborTile.walkable && 
             neighborTile.type !== 'danger' &&
             neighborTile.type !== 'obstacle';
    });

    if (walkableNeighbors.length === 0) return null;
    
    // Sélectionner un voisin aléatoire
    const randomIndex = Math.floor(Math.random() * walkableNeighbors.length);
    return walkableNeighbors[randomIndex];
  };

  /**
   * Déplace un danger dynamique vers une nouvelle position
   */
  const moveDanger = (dangerId: string) => {
    const danger = dynamicDangersRef.current.get(dangerId);
    if (!danger || !danger.isActive) return;

    const newCoord = getRandomNeighbor(danger.currentCoord);
    if (!newCoord) return; // Aucun mouvement possible

    const { getTile, updateTile } = useTileStore.getState();

    // Restaurer l'ancienne tuile à son état normal
    const oldTile = getTile(danger.currentCoord);
    if (oldTile && oldTile.type === 'danger') {
      updateTile(danger.currentCoord, {
        type: 'resource',
        walkable: true,
        color: oldTile.originalColor || generateRandomTileColor(),
        isDynamicDanger: false,
        dangerId: undefined,
        originalColor: undefined,
      });
    }

    // Créer le danger sur la nouvelle position
    const newTile = getTile(newCoord);
    if (newTile) {
      // Sauvegarder la couleur originale si ce n'est pas déjà fait
      const originalColor = newTile.originalColor || newTile.color;
      
      updateTile(newCoord, {
        type: 'danger',
        walkable: false,
        color: DANGER_CONFIG.DANGER_COLOR,
        isDynamicDanger: true,
        dangerId,
        originalColor,
      });

      // Mettre à jour la position du danger
      danger.currentCoord = newCoord;
      danger.lastMove = Date.now();
      
      console.log(`🔥 [DANGER] Dynamic danger ${dangerId} moved to ${newCoord}`);
    }
  };

  /**
   * Déplace tous les dangers actifs
   */
  const moveAllDangers = () => {
    dynamicDangersRef.current.forEach((danger, dangerId) => {
      if (danger.isActive) {
        moveDanger(dangerId);
      }
    });
  };

  /**
   * Initialise un danger dynamique sur une position aléatoire
   */
  const initializeDynamicDanger = () => {
    // Vérifier s'il y a déjà un danger dynamique actif
    const hasActiveDanger = Array.from(dynamicDangersRef.current.values())
      .some(danger => danger.isActive);
    
    if (hasActiveDanger) return;

    const { getWalkableTiles, updateTile } = useTileStore.getState();
    const walkableTiles = getWalkableTiles();
    const availableTiles = walkableTiles.filter(tile => 
      tile.type !== 'danger' && 
      tile.type !== 'depart' && 
      tile.type !== 'obstacle'
    );

    if (availableTiles.length === 0) {
      console.warn('🔥 [DANGER] No available tiles for dynamic danger spawn');
      return;
    }

    // Sélectionner une position aléatoire
    const randomTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
    const dangerId = 'dynamic-danger-1';

    // Sauvegarder la couleur originale et créer le danger
    updateTile(randomTile.position.coord, {
      type: 'danger',
      walkable: false,
      color: DANGER_CONFIG.DANGER_COLOR,
      isDynamicDanger: true,
      dangerId,
      originalColor: randomTile.color,
    });

    // Enregistrer le danger dans notre tracker
    dynamicDangersRef.current.set(dangerId, {
      id: dangerId,
      currentCoord: randomTile.position.coord,
      lastMove: Date.now(),
      isActive: true,
    });

    console.log(`🔥 [DANGER] Dynamic danger spawned at ${randomTile.position.coord}`);
  };

  /**
   * Démarre le système de mouvement des dangers
   */
  const startDangerMovement = () => {
    if (intervalRef.current) return; // Déjà démarré

    // Attendre que les tuiles soient disponibles avant d'initialiser
    const checkTilesAndStart = () => {
      const { tiles } = useTileStore.getState();
      const tileCount = Object.keys(tiles).length;
      if (tileCount > 0) {
        // Les tuiles sont prêtes, initialiser le premier danger
        setTimeout(initializeDynamicDanger, 500);
        
        // Démarrer l'intervalle de mouvement
        intervalRef.current = setInterval(() => {
          moveAllDangers();
        }, DANGER_CONFIG.MOVE_INTERVAL);

        console.log(`🔥 [DANGER] Dynamic danger movement system started (${tileCount} tiles available)`);
      } else {
        // Réessayer dans 100ms
        setTimeout(checkTilesAndStart, 100);
      }
    };

    checkTilesAndStart();
  };

  /**
   * Arrête le système de mouvement
   */
  const stopDangerMovement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Désactiver tous les dangers
    dynamicDangersRef.current.forEach(danger => {
      danger.isActive = false;
    });

    console.log('🔥 [DANGER] Dynamic danger movement system stopped');
  };

  // Effect principal
  useEffect(() => {
    startDangerMovement();

    return () => {
      stopDangerMovement();
    };
  }, []);

  // Exposer les fonctions pour debug/contrôle externe
  return {
    moveDanger,
    initializeDynamicDanger,
    activeDangers: dynamicDangersRef.current,
    startDangerMovement,
    stopDangerMovement,
  };
}

/**
 * Génère une couleur aléatoire pour les tuiles restaurées
 */
function generateRandomTileColor(): string {
  const colors = [
    '#42de8b', // Vert (resource)
    '#b3dfad', // Vert clair
    '#8bc34a', // Vert lime
    '#4caf50', // Vert nature
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default useDangerMovement;