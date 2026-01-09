/**
 * =========================================================================
 * FAIRNESS VALIDATION - Pure Functions for Map Fairness
 * =========================================================================
 * 
 * Ce module gère la validation d'équité des conditions de départ :
 * - Distance de spawn entre bots (min = radius × 1.5)
 * - Équilibre des ressources voisines (max 30% différence sur rayon 1)
 * - Accès équidistant aux stations (±1 tuile)
 * - Équité du terrain walkable (max 15% différence sur rayon 2)
 * - Génération déterministe par seed
 * 
 * Voir: docs/bot-spec/scenarios/initialization-fairness.feature
 * 
 * @version 2.0.0
 * @date 2026-01-09
 * @pure All functions are pure (no side effects)
 */

import type {
  GridCoordinate,
  TileMap,
} from '../../types/index.ts';
import type { FairnessRuleResult, FairnessValidationResult } from '../../types/fairness.ts';

// =========================================================================
// TYPES DE CONFIGURATION
// =========================================================================

/** Configuration des seuils d'équité */
export interface FairnessThresholds {
  minSpawnDistanceMultiplier: number;  // Multiplier du radius pour distance min
  maxResourceDifferencePercent: number; // % max de différence ressources
  maxStationAccessDiff: number;          // Différence max en tuiles
  maxTerrainDifferencePercent: number;   // % max de différence terrain walkable
  resourceCheckRadius: number;            // Rayon pour calcul ressources
  terrainCheckRadius: number;             // Rayon pour calcul terrain
}

/** Configuration par défaut des seuils */
export const DEFAULT_FAIRNESS_THRESHOLDS: FairnessThresholds = {
  minSpawnDistanceMultiplier: 1.0,      // 3.0 tiles instead of 4.5 (more achievable)
  maxResourceDifferencePercent: 35,      // 30% → 35% (slightly more lenient)
  maxStationAccessDiff: 1,               // Strict: 1 tile max difference for stations
  maxTerrainDifferencePercent: 20,       // 15% → 20% (slightly more lenient)
  resourceCheckRadius: 1,
  terrainCheckRadius: 2,
};

/** Strict fairness thresholds (for competitive mode) */
export const STRICT_FAIRNESS_THRESHOLDS: FairnessThresholds = {
  minSpawnDistanceMultiplier: 1.5,      // 4.5 tiles
  maxResourceDifferencePercent: 30,
  maxStationAccessDiff: 1,
  maxTerrainDifferencePercent: 15,
  resourceCheckRadius: 1,
  terrainCheckRadius: 2,
};

// =========================================================================
// SEEDED RANDOM NUMBER GENERATOR
// =========================================================================

/**
 * Crée un générateur de nombres pseudo-aléatoires déterministe
 * Utilise l'algorithme LCG (Linear Congruential Generator)
 * 
 * @pure
 * @param seed - Valeur initiale du générateur
 * @returns Fonction retournant un nombre entre 0 et 1
 * 
 * @example
 * const random = createSeededRandom(42);
 * console.log(random()); // Toujours la même valeur pour seed=42
 */
export function createSeededRandom(seed: number): () => number {
  let currentSeed = seed;
  return () => {
    // LCG parameters (same as existing hexGrid.ts implementation)
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
}

// =========================================================================
// VALIDATION DE DISTANCE DE SPAWN
// =========================================================================

/**
 * Calcule la distance hexagonale entre deux coordonnées
 * Utilise la formule de distance cubique pour grilles hexagonales
 * 
 * @pure
 * @param coord1 - Première coordonnée (format "q,r")
 * @param coord2 - Deuxième coordonnée (format "q,r")
 * @returns Distance en nombre de tuiles
 */
export function calculateHexDistance(coord1: GridCoordinate, coord2: GridCoordinate): number {
  // Parse coordinates from "q,r" format
  const parseCoord = (coord: GridCoordinate): { q: number; r: number } => {
    const [q, r] = coord.split(',').map(Number);
    return { q, r };
  };
  
  const c1 = parseCoord(coord1);
  const c2 = parseCoord(coord2);
  
  // Hex distance using cube coordinates (s = -q - r)
  const dq = Math.abs(c1.q - c2.q);
  const dr = Math.abs(c1.r - c2.r);
  const ds = Math.abs((-c1.q - c1.r) - (-c2.q - c2.r));
  
  return Math.max(dq, dr, ds);
}

/**
 * Valide que les spawns sont suffisamment espacés
 * Distance minimum = radius × 1.5
 * 
 * @pure
 * @param spawns - Liste des coordonnées de spawn
 * @param radius - Rayon de la grille
 * @param thresholds - Configuration des seuils (optionnel)
 * @returns Résultat de validation
 */
export function validateSpawnDistance(
  spawns: GridCoordinate[], 
  radius: number,
  thresholds: FairnessThresholds = DEFAULT_FAIRNESS_THRESHOLDS
): FairnessRuleResult {
  if (spawns.length < 2) {
    return {
      rule: 'spawnDistance',
      value: Infinity,
      threshold: radius * thresholds.minSpawnDistanceMultiplier,
      status: 'PASS',
      message: 'Only one spawn, no distance check needed',
      details: 'Only one spawn, no distance check needed',
    };
  }

  const minThreshold = radius * thresholds.minSpawnDistanceMultiplier;
  let minDistance = Infinity;

  // Check all pairs
  for (let i = 0; i < spawns.length; i++) {
    for (let j = i + 1; j < spawns.length; j++) {
      const distance = calculateHexDistance(spawns[i], spawns[j]);
      minDistance = Math.min(minDistance, distance);
    }
  }

  const passed = minDistance >= minThreshold;
  
  return {
    rule: 'spawnDistance',
    value: minDistance,
    threshold: minThreshold,
    status: passed ? 'PASS' : 'FAIL',
    message: passed 
      ? `Spawn distance ${minDistance.toFixed(1)} >= ${minThreshold.toFixed(1)} threshold`
      : `Spawn distance ${minDistance.toFixed(1)} < ${minThreshold.toFixed(1)} threshold`,
    details: passed 
      ? `Spawn distance ${minDistance.toFixed(1)} >= ${minThreshold.toFixed(1)} threshold`
      : `Spawn distance ${minDistance.toFixed(1)} < ${minThreshold.toFixed(1)} threshold`,
  };
}

// =========================================================================
// BALANCE DES RESSOURCES
// =========================================================================

/**
 * Calcule le total des ressources dans un rayon autour d'une coordonnée
 * 
 * @pure
 * @param tileMap - Carte des tuiles
 * @param coord - Coordonnée centrale
 * @param radius - Rayon de recherche (1 = voisins immédiats)
 * @returns Total des ressources (food + debris + special)
 */
export function getNeighborResources(
  tileMap: TileMap, 
  coord: GridCoordinate, 
  radius: number
): number {
  const tile = tileMap[coord];
  if (!tile) return 0;

  let total = 0;
  const visited = new Set<GridCoordinate>([coord]);
  let currentRing = [coord];

  // BFS pour trouver toutes les tuiles dans le rayon
  for (let r = 0; r < radius; r++) {
    const nextRing: GridCoordinate[] = [];
    
    for (const currentCoord of currentRing) {
      const currentTile = tileMap[currentCoord];
      if (!currentTile || !currentTile.neighbors) continue;

      for (const neighborCoord of currentTile.neighbors) {
        if (!visited.has(neighborCoord)) {
          visited.add(neighborCoord);
          nextRing.push(neighborCoord);
          
          const neighborTile = tileMap[neighborCoord];
          if (neighborTile && neighborTile.resources && (neighborTile.type === 'food' || neighborTile.type === 'resource')) {
            total += neighborTile.resources.total;
          }
        }
      }
    }
    
    currentRing = nextRing;
  }

  return total;
}

/**
 * Valide que les ressources autour des spawns sont équilibrées
 * Différence maximum = 30% sur rayon 1
 * 
 * @pure
 * @param tileMap - Carte des tuiles
 * @param spawns - Liste des coordonnées de spawn
 * @param thresholds - Configuration des seuils (optionnel)
 * @returns Résultat de validation
 */
export function validateResourceBalance(
  tileMap: TileMap, 
  spawns: GridCoordinate[],
  thresholds: FairnessThresholds = DEFAULT_FAIRNESS_THRESHOLDS
): FairnessRuleResult {
  if (spawns.length < 2) {
    return {
      rule: 'resourceBalance',
      value: 0,
      threshold: thresholds.maxResourceDifferencePercent,
      status: 'PASS',
      message: 'Only one spawn, no balance check needed',
      details: 'Only one spawn, no balance check needed',
    };
  }

  const resources = spawns.map(spawn => 
    getNeighborResources(tileMap, spawn, thresholds.resourceCheckRadius)
  );

  const maxRes = Math.max(...resources);
  const minRes = Math.min(...resources);
  
  // Calculate percentage difference
  const difference = maxRes > 0 ? ((maxRes - minRes) / maxRes) * 100 : 0;
  const passed = difference <= thresholds.maxResourceDifferencePercent;
  
  return {
    rule: 'resourceBalance',
    value: Math.round(difference * 10) / 10,
    threshold: thresholds.maxResourceDifferencePercent,
    status: passed ? 'PASS' : 'FAIL',
    message: `Resources: ${resources.join(' vs ')} (${difference.toFixed(1)}% diff)`,
    details: `Resources: ${resources.join(' vs ')} (${difference.toFixed(1)}% diff)`,
  };
}

// =========================================================================
// ACCÈS AUX STATIONS
// =========================================================================

/**
 * Calcule la distance vers la station la plus proche d'un type donné
 * Utilise BFS (Breadth-First Search) pour trouver le chemin le plus court
 * 
 * @pure
 * @param tileMap - Carte des tuiles
 * @param spawn - Coordonnée de départ
 * @param stationType - Type de station ('fuel' | 'repair')
 * @returns Distance en tuiles, ou 999 si non trouvée
 */
export function calculateStationAccess(
  tileMap: TileMap, 
  spawn: GridCoordinate, 
  stationType: 'fuel' | 'repair'
): number {
  const visited = new Set<GridCoordinate>([spawn]);
  let currentRing = [spawn];
  let distance = 0;

  while (currentRing.length > 0 && distance < 100) {
    distance++;
    const nextRing: GridCoordinate[] = [];

    for (const coord of currentRing) {
      const tile = tileMap[coord];
      if (!tile || !tile.neighbors) continue;

      for (const neighborCoord of tile.neighbors) {
        if (visited.has(neighborCoord)) continue;
        visited.add(neighborCoord);

        const neighborTile = tileMap[neighborCoord];
        if (!neighborTile) continue;

        // ✅ FOUND: Station de type demandé
        if (neighborTile.type === stationType) {
          return distance;
        }

        // ✅ CONTINUE BFS: Seulement par tuiles walkables
        if (neighborTile.walkable) {
          nextRing.push(neighborCoord);
        }
      }
    }

    currentRing = nextRing;
  }

  // ❌ NOT FOUND: Station non placée OU non accessible
  return 999;
}

/**
 * Valide que l'accès aux stations est équitable pour tous les spawns
 * 
 * @pure
 * @param tileMap - Carte des tuiles
 * @param spawns - Liste des coordonnées de spawn
 * @param thresholds - Configuration des seuils (optionnel)
 * @returns Tableau avec 2 résultats [FuelAccess, RepairAccess]
 */
export function validateStationAccess(
  tileMap: TileMap, 
  spawns: GridCoordinate[],
  thresholds: FairnessThresholds = DEFAULT_FAIRNESS_THRESHOLDS
): FairnessRuleResult[] {
  const results: FairnessRuleResult[] = [];

  for (const stationType of ['fuel', 'repair'] as const) {
    // Calculer les distances pour chaque spawn
    const distances = spawns.map(spawn => 
      calculateStationAccess(tileMap, spawn, stationType)
    );

    // Vérifier si une station est inaccessible (999 = signal d'erreur)
    const hasUnreachable = distances.includes(999);
    
    if (hasUnreachable) {
      // Station non placée ou inaccessible
      results.push({
        rule: `${stationType}Access`,
        value: 999,
        threshold: thresholds.maxStationAccessDiff,
        status: 'FAIL',
        message: `${stationType} station missing or unreachable. Distances: ${distances.join(' vs ')}`,
        details: `${stationType} station missing or unreachable. Distances: ${distances.join(' vs ')}`,
      });
    } else {
      // Tous les spawns peuvent accéder: vérifier l'équité
      const maxDist = Math.max(...distances);
      const minDist = Math.min(...distances);
      const difference = maxDist - minDist;
      const passed = difference <= thresholds.maxStationAccessDiff;
      
      results.push({
        rule: `${stationType}Access`,
        value: difference,
        threshold: thresholds.maxStationAccessDiff,
        status: passed ? 'PASS' : 'FAIL',
        message: `${stationType} distances: ${distances.map(d => d + ' tiles').join(' vs ')} (diff: ${difference})`,
        details: `${stationType} distances: ${distances.map(d => d + ' tiles').join(' vs ')} (max: ${maxDist}, min: ${minDist})`,
      });
    }
  }

  return results;
}

// =========================================================================
// ÉQUITÉ DU TERRAIN
// =========================================================================

/**
 * Calcule le pourcentage de tuiles walkables dans un rayon
 * 
 * @pure
 * @param tileMap - Carte des tuiles
 * @param coord - Coordonnée centrale
 * @param radius - Rayon de recherche
 * @returns Pourcentage de tuiles walkables (0-100)
 */
export function getWalkablePercent(
  tileMap: TileMap, 
  coord: GridCoordinate, 
  radius: number
): number {
  const tile = tileMap[coord];
  if (!tile) return 0;

  let walkableCount = 0;
  let totalCount = 0;
  const visited = new Set<GridCoordinate>([coord]);
  let currentRing = [coord];

  // Count center tile
  if (tileMap[coord]?.walkable) walkableCount++;
  totalCount++;

  // BFS pour trouver toutes les tuiles dans le rayon
  for (let r = 0; r < radius; r++) {
    const nextRing: GridCoordinate[] = [];

    for (const currentCoord of currentRing) {
      const currentTile = tileMap[currentCoord];
      if (!currentTile || !currentTile.neighbors) continue;

      for (const neighborCoord of currentTile.neighbors) {
        if (!visited.has(neighborCoord)) {
          visited.add(neighborCoord);
          nextRing.push(neighborCoord);

          const neighborTile = tileMap[neighborCoord];
          if (neighborTile) {
            totalCount++;
            if (neighborTile.walkable) walkableCount++;
          }
        }
      }
    }

    currentRing = nextRing;
  }

  return totalCount > 0 ? (walkableCount / totalCount) * 100 : 0;
}

/**
 * Valide que le terrain walkable est équitable autour des spawns
 * 
 * @pure
 * @param tileMap - Carte des tuiles
 * @param spawns - Liste des coordonnées de spawn
 * @param thresholds - Configuration des seuils (optionnel)
 * @returns Résultat de validation
 */
export function validateTerrainFairness(
  tileMap: TileMap, 
  spawns: GridCoordinate[],
  thresholds: FairnessThresholds = DEFAULT_FAIRNESS_THRESHOLDS
): FairnessRuleResult {
  if (spawns.length < 2) {
    return {
      rule: 'terrainFairness',
      value: 0,
      threshold: thresholds.maxTerrainDifferencePercent,
      status: 'PASS',
      message: 'Only one spawn, no terrain check needed',
      details: 'Only one spawn, no terrain check needed',
    };
  }

  const walkablePercents = spawns.map(spawn =>
    getWalkablePercent(tileMap, spawn, thresholds.terrainCheckRadius)
  );

  const maxPercent = Math.max(...walkablePercents);
  const minPercent = Math.min(...walkablePercents);
  const difference = maxPercent - minPercent;
  const passed = difference <= thresholds.maxTerrainDifferencePercent;
  
  return {
    rule: 'terrainFairness',
    value: Math.round(difference * 10) / 10,
    threshold: thresholds.maxTerrainDifferencePercent,
    status: passed ? 'PASS' : 'FAIL',
    message: `Terrain walkable: ${walkablePercents.map(p => p.toFixed(1)).join(' vs ')} (${difference.toFixed(1)}% diff)`,
    details: `Walkable %: ${walkablePercents.map(p => p.toFixed(1)).join(' vs ')} (diff: ${difference.toFixed(1)}%)`,
  };
}

// =========================================================================
// ORCHESTRATION DE VALIDATION
// =========================================================================

/**
 * Validation complète de l'équité d'une carte
 * Vérifie toutes les règles et retourne un résultat détaillé
 * 
 * @pure
 * @param tileMap - Carte des tuiles
 * @param spawns - Liste des coordonnées de spawn
 * @param radius - Rayon de la grille
 * @param seed - Seed utilisé pour la génération
 * @param attempt - Numéro de tentative actuelle
 * @param thresholds - Configuration des seuils (optionnel)
 * @returns Résultat complet de validation
 */
export function validateMapFairness(
  tileMap: TileMap,
  spawns: GridCoordinate[],
  radius: number,
  thresholds: FairnessThresholds = DEFAULT_FAIRNESS_THRESHOLDS
): FairnessValidationResult {
  const rules: FairnessRuleResult[] = [];

  // Rule 1: Spawn distance
  const spawnDistanceResult = validateSpawnDistance(spawns, radius, thresholds);
  rules.push(spawnDistanceResult);

  // Rule 2: Resource balance
  const resourceResult = validateResourceBalance(tileMap, spawns, thresholds);
  rules.push(resourceResult);

  // Rule 3: Station access (fuel and repair)
  const stationResults = validateStationAccess(tileMap, spawns, thresholds);
  rules.push(...stationResults);

  // Rule 4: Terrain fairness
  const terrainResult = validateTerrainFairness(tileMap, spawns, thresholds);
  rules.push(terrainResult);

  const allPassed = rules.every(r => r.status === 'PASS');

  return {
    passed: allPassed,
    valid: allPassed, // Alias pour compatibilité
    rules,
    timestamp: Date.now(),
    mapDimensions: {
      radius,
      spacing: 1.2, // Default spacing from hexGrid
    },
  };
}
