/**
 * =========================================================================
 * TILE FAIRNESS SLICE - Validation d'équité pour multi-bot (TypeScript)
 * =========================================================================
 * 
 * Ce slice gère la validation d'équité des conditions de départ :
 * - Distance de spawn entre bots (min = radius × 1.5)
 * - Équilibre des ressources voisines (max 30% différence sur rayon 1)
 * - Accès équidistant aux stations (±1 tuile)
 * - Équité du terrain walkable (max 15% différence sur rayon 2)
 * - Génération déterministe par seed
 * 
 * Voir: docs/bot-spec/scenarios/initialization-fairness.feature
 * 
 * @version 1.0.0
 * @date 2026-01-08
 */

import type {
  GridCoordinate,
  Tile,
  TileMap,
} from '../../../types/index.ts';
import type { TileStoreType } from '../../../types/stores.d.ts';

import fsmLogger from "../../../logger/fsmLogger.ts";

// =========================================================================
// TYPES DE VALIDATION D'ÉQUITÉ
// =========================================================================

/** Résultat de validation d'une règle d'équité */
export interface FairnessRuleResult {
  rule: string;
  value: number;
  threshold: number;
  status: 'PASS' | 'FAIL';
  details?: string;
}

/** Résultat global de validation d'équité */
export interface FairnessValidationResult {
  valid: boolean;
  seed: number;
  attempt: number;
  metrics: {
    spawnDistance: number;
    resourceDifference: number;
    fuelAccessDiff: number;
    repairAccessDiff: number;
    terrainDifference: number;
  };
  rules: FairnessRuleResult[];
  issues: string[];
}

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
  minSpawnDistanceMultiplier: 1.5,
  maxResourceDifferencePercent: 30,
  maxStationAccessDiff: 1,
  maxTerrainDifferencePercent: 15,
  resourceCheckRadius: 1,
  terrainCheckRadius: 2,
};

/** Actions du slice de fairness */
export interface TileFairnessSliceActions {
  // Seeded Random Number Generator
  createSeededRandom: (seed: number) => () => number;
  
  // Validation des spawns
  calculateHexDistance: (coord1: GridCoordinate, coord2: GridCoordinate) => number;
  validateSpawnDistance: (spawns: GridCoordinate[], radius: number) => FairnessRuleResult;
  
  // Balance des ressources
  getNeighborResources: (tileMap: TileMap, coord: GridCoordinate, radius: number) => number;
  validateResourceBalance: (tileMap: TileMap, spawns: GridCoordinate[]) => FairnessRuleResult;
  
  // Accès aux stations
  calculateStationAccess: (tileMap: TileMap, spawn: GridCoordinate, stationType: 'fuel' | 'repair') => number;
  validateStationAccess: (tileMap: TileMap, spawns: GridCoordinate[]) => FairnessRuleResult[];
  
  // Équité du terrain
  getWalkablePercent: (tileMap: TileMap, coord: GridCoordinate, radius: number) => number;
  validateTerrainFairness: (tileMap: TileMap, spawns: GridCoordinate[]) => FairnessRuleResult;
  
  // Orchestration
  validateMapFairness: (
    tileMap: TileMap, 
    spawns: GridCoordinate[], 
    radius: number, 
    seed: number, 
    attempt: number
  ) => FairnessValidationResult;
  
  // Placement avec validation
  placeStartingTilesWithFairness: (
    tileMap: TileMap, 
    botCount: number, 
    radius: number, 
    seed: number
  ) => { tileMap: TileMap; spawns: GridCoordinate[]; validation: FairnessValidationResult };
}

// =========================================================================
// SLICE FACTORY - TILE FAIRNESS UTILITIES
// =========================================================================

const createTileFairnessSlice = (_set: unknown, get: () => TileStoreType): TileFairnessSliceActions => ({

  // =========================================================================
  // SEEDED RANDOM NUMBER GENERATOR
  // =========================================================================
  
  /**
   * Crée un générateur de nombres pseudo-aléatoires déterministe
   * Utilise l'algorithme LCG (Linear Congruential Generator)
   * 
   * @param seed - Valeur initiale du générateur
   * @returns Fonction retournant un nombre entre 0 et 1
   * 
   * @example
   * const random = createSeededRandom(42);
   * console.log(random()); // Toujours la même valeur pour seed=42
   */
  createSeededRandom: (seed: number): (() => number) => {
    let currentSeed = seed;
    return () => {
      // LCG parameters (same as existing hexGrid.ts implementation)
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  },

  // =========================================================================
  // VALIDATION DE DISTANCE DE SPAWN
  // =========================================================================

  /**
   * Calcule la distance hexagonale entre deux coordonnées
   * Utilise la formule de distance cubique pour grilles hexagonales
   * 
   * @param coord1 - Première coordonnée (format "q,r")
   * @param coord2 - Deuxième coordonnée (format "q,r")
   * @returns Distance en nombre de tuiles
   */
  calculateHexDistance: (coord1: GridCoordinate, coord2: GridCoordinate): number => {
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
  },

  /**
   * Valide que les spawns sont suffisamment espacés
   * Distance minimum = radius × 1.5
   * 
   * @param spawns - Liste des coordonnées de spawn
   * @param radius - Rayon de la grille
   * @returns Résultat de validation
   */
  validateSpawnDistance: (spawns: GridCoordinate[], radius: number): FairnessRuleResult => {
    if (spawns.length < 2) {
      return {
        rule: 'spawnDistance',
        value: Infinity,
        threshold: radius * DEFAULT_FAIRNESS_THRESHOLDS.minSpawnDistanceMultiplier,
        status: 'PASS',
        details: 'Only one spawn, no distance check needed',
      };
    }

    const minThreshold = radius * DEFAULT_FAIRNESS_THRESHOLDS.minSpawnDistanceMultiplier;
    let minDistance = Infinity;

    // Check all pairs
    for (let i = 0; i < spawns.length; i++) {
      for (let j = i + 1; j < spawns.length; j++) {
        const distance = get().calculateHexDistance(spawns[i], spawns[j]);
        minDistance = Math.min(minDistance, distance);
      }
    }

    const passed = minDistance >= minThreshold;
    
    return {
      rule: 'spawnDistance',
      value: minDistance,
      threshold: minThreshold,
      status: passed ? 'PASS' : 'FAIL',
      details: passed 
        ? `Spawn distance ${minDistance.toFixed(1)} >= ${minThreshold.toFixed(1)} threshold`
        : `Spawn distance ${minDistance.toFixed(1)} < ${minThreshold.toFixed(1)} threshold`,
    };
  },

  // =========================================================================
  // BALANCE DES RESSOURCES
  // =========================================================================

  /**
   * Calcule le total des ressources dans un rayon autour d'une coordonnée
   * 
   * @param tileMap - Carte des tuiles
   * @param coord - Coordonnée centrale
   * @param radius - Rayon de recherche (1 = voisins immédiats)
   * @returns Total des ressources (food + debris + special)
   */
  getNeighborResources: (tileMap: TileMap, coord: GridCoordinate, radius: number): number => {
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
            if (neighborTile && neighborTile.resources && neighborTile.type === 'resource') {
              total += neighborTile.resources.total;
            }
          }
        }
      }
      
      currentRing = nextRing;
    }

    return total;
  },

  /**
   * Valide que les ressources autour des spawns sont équilibrées
   * Différence maximum = 30% sur rayon 1
   * 
   * @param tileMap - Carte des tuiles
   * @param spawns - Liste des coordonnées de spawn
   * @returns Résultat de validation
   */
  validateResourceBalance: (tileMap: TileMap, spawns: GridCoordinate[]): FairnessRuleResult => {
    if (spawns.length < 2) {
      return {
        rule: 'resourceBalance',
        value: 0,
        threshold: DEFAULT_FAIRNESS_THRESHOLDS.maxResourceDifferencePercent,
        status: 'PASS',
        details: 'Only one spawn, no balance check needed',
      };
    }

    const resources = spawns.map(spawn => 
      get().getNeighborResources(tileMap, spawn, DEFAULT_FAIRNESS_THRESHOLDS.resourceCheckRadius)
    );

    const maxRes = Math.max(...resources);
    const minRes = Math.min(...resources);
    
    // Calculate percentage difference
    const difference = maxRes > 0 ? ((maxRes - minRes) / maxRes) * 100 : 0;
    const passed = difference <= DEFAULT_FAIRNESS_THRESHOLDS.maxResourceDifferencePercent;

    return {
      rule: 'resourceBalance',
      value: Math.round(difference * 10) / 10,
      threshold: DEFAULT_FAIRNESS_THRESHOLDS.maxResourceDifferencePercent,
      status: passed ? 'PASS' : 'FAIL',
      details: `Resources: ${resources.join(' vs ')} (${difference.toFixed(1)}% diff)`,
    };
  },

  // =========================================================================
  // ACCÈS AUX STATIONS
  // =========================================================================

  /**
   * Calcule la distance vers la station la plus proche d'un type donné
   * Utilise BFS pour trouver le chemin le plus court
   * 
   * @param tileMap - Carte des tuiles
   * @param spawn - Coordonnée de départ
   * @param stationType - Type de station ('fuel' ou 'repair')
   * @returns Distance en tuiles, ou Infinity si non trouvée
   */
  calculateStationAccess: (tileMap: TileMap, spawn: GridCoordinate, stationType: 'fuel' | 'repair'): number => {
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

          // Found station of requested type
          if (neighborTile.type === stationType) {
            return distance;
          }

          // Continue BFS only through walkable tiles
          if (neighborTile.walkable) {
            nextRing.push(neighborCoord);
          }
        }
      }

      currentRing = nextRing;
    }

    return Infinity;
  },

  /**
   * Valide que l'accès aux stations est équitable pour tous les spawns
   * Différence maximum = 1 tuile
   * 
   * @param tileMap - Carte des tuiles
   * @param spawns - Liste des coordonnées de spawn
   * @returns Tableau de résultats (fuel et repair)
   */
  validateStationAccess: (tileMap: TileMap, spawns: GridCoordinate[]): FairnessRuleResult[] => {
    const results: FairnessRuleResult[] = [];

    for (const stationType of ['fuel', 'repair'] as const) {
      const distances = spawns.map(spawn => 
        get().calculateStationAccess(tileMap, spawn, stationType)
      );

      const maxDist = Math.max(...distances.filter(d => d !== Infinity));
      const minDist = Math.min(...distances);
      const difference = maxDist - minDist;
      const passed = difference <= DEFAULT_FAIRNESS_THRESHOLDS.maxStationAccessDiff;

      results.push({
        rule: `${stationType}Access`,
        value: difference,
        threshold: DEFAULT_FAIRNESS_THRESHOLDS.maxStationAccessDiff,
        status: passed ? 'PASS' : 'FAIL',
        details: `${stationType} distances: ${distances.join(' vs ')} (diff: ${difference})`,
      });
    }

    return results;
  },

  // =========================================================================
  // ÉQUITÉ DU TERRAIN
  // =========================================================================

  /**
   * Calcule le pourcentage de tuiles walkables dans un rayon
   * 
   * @param tileMap - Carte des tuiles
   * @param coord - Coordonnée centrale
   * @param radius - Rayon de recherche
   * @returns Pourcentage de tuiles walkables (0-100)
   */
  getWalkablePercent: (tileMap: TileMap, coord: GridCoordinate, radius: number): number => {
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
  },

  /**
   * Valide que le terrain walkable est équitable autour des spawns
   * Différence maximum = 15% sur rayon 2
   * 
   * @param tileMap - Carte des tuiles
   * @param spawns - Liste des coordonnées de spawn
   * @returns Résultat de validation
   */
  validateTerrainFairness: (tileMap: TileMap, spawns: GridCoordinate[]): FairnessRuleResult => {
    if (spawns.length < 2) {
      return {
        rule: 'terrainFairness',
        value: 0,
        threshold: DEFAULT_FAIRNESS_THRESHOLDS.maxTerrainDifferencePercent,
        status: 'PASS',
        details: 'Only one spawn, no terrain check needed',
      };
    }

    const walkablePercents = spawns.map(spawn =>
      get().getWalkablePercent(tileMap, spawn, DEFAULT_FAIRNESS_THRESHOLDS.terrainCheckRadius)
    );

    const maxPercent = Math.max(...walkablePercents);
    const minPercent = Math.min(...walkablePercents);
    const difference = maxPercent - minPercent;
    const passed = difference <= DEFAULT_FAIRNESS_THRESHOLDS.maxTerrainDifferencePercent;

    return {
      rule: 'terrainFairness',
      value: Math.round(difference * 10) / 10,
      threshold: DEFAULT_FAIRNESS_THRESHOLDS.maxTerrainDifferencePercent,
      status: passed ? 'PASS' : 'FAIL',
      details: `Walkable %: ${walkablePercents.map(p => p.toFixed(1)).join(' vs ')} (diff: ${difference.toFixed(1)}%)`,
    };
  },

  // =========================================================================
  // ORCHESTRATION DE VALIDATION
  // =========================================================================

  /**
   * Validation complète de l'équité d'une carte
   * Vérifie toutes les règles et retourne un résultat détaillé
   * 
   * @param tileMap - Carte des tuiles
   * @param spawns - Liste des coordonnées de spawn
   * @param radius - Rayon de la grille
   * @param seed - Seed utilisé pour la génération
   * @param attempt - Numéro de tentative actuelle
   * @returns Résultat complet de validation
   */
  validateMapFairness: (
    tileMap: TileMap,
    spawns: GridCoordinate[],
    radius: number,
    seed: number,
    attempt: number
  ): FairnessValidationResult => {
    const rules: FairnessRuleResult[] = [];
    const issues: string[] = [];

    // Rule 1: Spawn distance
    const spawnDistanceResult = get().validateSpawnDistance(spawns, radius);
    rules.push(spawnDistanceResult);
    if (spawnDistanceResult.status === 'FAIL') {
      issues.push(`Spawn distance too close: ${spawnDistanceResult.value.toFixed(1)} < ${spawnDistanceResult.threshold.toFixed(1)}`);
    }

    // Rule 2: Resource balance
    const resourceResult = get().validateResourceBalance(tileMap, spawns);
    rules.push(resourceResult);
    if (resourceResult.status === 'FAIL') {
      issues.push(`Resource imbalance: ${resourceResult.value}% > ${resourceResult.threshold}%`);
    }

    // Rule 3: Station access (fuel and repair)
    const stationResults = get().validateStationAccess(tileMap, spawns);
    rules.push(...stationResults);
    for (const result of stationResults) {
      if (result.status === 'FAIL') {
        issues.push(`${result.rule} imbalance: ${result.value} tiles > ${result.threshold} threshold`);
      }
    }

    // Rule 4: Terrain fairness
    const terrainResult = get().validateTerrainFairness(tileMap, spawns);
    rules.push(terrainResult);
    if (terrainResult.status === 'FAIL') {
      issues.push(`Terrain imbalance: ${terrainResult.value}% > ${terrainResult.threshold}%`);
    }

    // Extract metrics
    const fuelResult = stationResults.find(r => r.rule === 'fuelAccess');
    const repairResult = stationResults.find(r => r.rule === 'repairAccess');

    const result: FairnessValidationResult = {
      valid: issues.length === 0,
      seed,
      attempt,
      metrics: {
        spawnDistance: spawnDistanceResult.value,
        resourceDifference: resourceResult.value,
        fuelAccessDiff: fuelResult?.value ?? 0,
        repairAccessDiff: repairResult?.value ?? 0,
        terrainDifference: terrainResult.value,
      },
      rules,
      issues,
    };

    // Log detailed validation result with all metrics
    const status = result.valid ? '✅ VALID' : '❌ INVALID';
    fsmLogger.game(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FAIRNESS VALIDATION - Attempt ${attempt} (Seed: ${seed})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ${status}

📏 SPAWN DISTANCE
  • Metric: ${spawnDistanceResult.value.toFixed(1)} tiles
  • Threshold: ≥ ${spawnDistanceResult.threshold.toFixed(1)} tiles
  • Result: ${spawnDistanceResult.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}
  • Details: ${spawnDistanceResult.details}

💰 RESOURCE BALANCE (Radius 1)
  • Metric: ${resourceResult.value.toFixed(1)}% difference
  • Threshold: ≤ ${resourceResult.threshold}%
  • Result: ${resourceResult.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}
  • Details: ${resourceResult.details}

⛽ FUEL STATION ACCESS
  • Metric: ${fuelResult?.value ?? 0} tiles difference
  • Threshold: ≤ ${fuelResult?.threshold ?? 0} tiles
  • Result: ${fuelResult?.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}
  • Details: ${fuelResult?.details ?? 'N/A'}

🔧 REPAIR STATION ACCESS
  • Metric: ${repairResult?.value ?? 0} tiles difference
  • Threshold: ≤ ${repairResult?.threshold ?? 0} tiles
  • Result: ${repairResult?.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}
  • Details: ${repairResult?.details ?? 'N/A'}

🌍 TERRAIN FAIRNESS (Radius 2, Walkable %)
  • Metric: ${terrainResult.value.toFixed(1)}% difference
  • Threshold: ≤ ${terrainResult.threshold}%
  • Result: ${terrainResult.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}
  • Details: ${terrainResult.details}

${issues.length > 0 ? `⚠️ ISSUES FOUND:
  ${issues.map(issue => `• ${issue}`).join('\n  ')}` : '✨ All fairness rules satisfied!'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

    return result;
  },

  // =========================================================================
  // PLACEMENT AVEC VALIDATION
  // =========================================================================

  /**
   * Place les tuiles de départ avec validation d'équité
   * Boucle de régénération si les critères ne sont pas satisfaits
   * 
   * @param tileMap - Carte des tuiles initiale
   * @param botCount - Nombre de bots
   * @param radius - Rayon de la grille
   * @param seed - Seed initial
   * @returns Carte mise à jour, spawns, et résultat de validation
   */
  placeStartingTilesWithFairness: (
    tileMap: TileMap,
    botCount: number,
    radius: number,
    seed: number
  ): { tileMap: TileMap; spawns: GridCoordinate[]; validation: FairnessValidationResult } => {
    const MAX_ATTEMPTS = 10;
    let currentSeed = seed;
    let bestResult: { tileMap: TileMap; spawns: GridCoordinate[]; validation: FairnessValidationResult } | null = null;

    fsmLogger.game(`
╔════════════════════════════════════════════════════════════════╗
║            STARTING FAIRNESS-AWARE MAP GENERATION              ║
║  Seed: ${seed} | Max Attempts: ${MAX_ATTEMPTS} | Bot Count: ${botCount}      ║
╚════════════════════════════════════════════════════════════════╝
`);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const random = get().createSeededRandom(currentSeed);

      // Get resource tiles for spawn candidates
      const resourceTiles = (Object.values(tileMap) as Tile[]).filter(
        (tile): tile is Tile => tile !== null && tile.type === 'resource'
      );

      // Shuffle tiles using seeded random
      const shuffledTiles = resourceTiles
        .map(tile => ({ tile, sort: random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ tile }) => tile);

      // Select spawn tiles
      const selectedTiles = shuffledTiles.slice(0, botCount);
      const spawns = selectedTiles.map(t => t.position.coord);

      fsmLogger.game(`[Fairness] Attempt ${attempt}/${MAX_ATTEMPTS}: Testing seed=${currentSeed}, spawns=[${spawns.join(', ')}]`);

      // Create new tile map with starting tiles
      const newTileMap = { ...tileMap };
      for (const tile of selectedTiles) {
        newTileMap[tile.position.coord] = {
          ...tile,
          type: 'depart',
          explorable: false,
          collectable: false,
          resources: {
            food: 100,
            debris: 100,
            special: 50,
            total: 250,
          },
          hasResources: true,
          color: '#4CAF50',
        };
      }

      // Validate
      const validation = get().validateMapFairness(newTileMap, spawns, radius, currentSeed, attempt);

      // Store best result (even if invalid, for fallback)
      if (!bestResult || validation.issues.length < bestResult.validation.issues.length) {
        bestResult = { tileMap: newTileMap, spawns, validation };
      }

      if (validation.valid) {
        fsmLogger.game(`
✅ SUCCESS: Map validated after ${attempt} attempt(s)!
Seed: ${currentSeed}
Spawns: [${spawns.join(', ')}]
Metrics Summary:
  • Spawn Distance: ${validation.metrics.spawnDistance.toFixed(1)} tiles
  • Resource Difference: ${validation.metrics.resourceDifference.toFixed(1)}%
  • Fuel Access Difference: ${validation.metrics.fuelAccessDiff} tiles
  • Repair Access Difference: ${validation.metrics.repairAccessDiff} tiles
  • Terrain Difference: ${validation.metrics.terrainDifference.toFixed(1)}%
`);
        return { tileMap: newTileMap, spawns, validation };
      }

      // Try next seed
      currentSeed++;
    }

    // Return best result after max attempts
    fsmLogger.game(`
⚠️ MAX ATTEMPTS REACHED
Best result found with ${bestResult!.validation.issues.length} issue(s)
Using seed: ${bestResult!.validation.seed}
Spawns: [${bestResult!.spawns.join(', ')}]
Issues: ${bestResult!.validation.issues.join(', ')}
`);
    return bestResult!;
  },

});

export default createTileFairnessSlice;
