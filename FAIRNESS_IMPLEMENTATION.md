# 🎯 FAIRNESS IMPLEMENTATION PROGRESS

## Objectif
Garantir des conditions de départ équitables pour tous les bots dans une partie multi-joueurs.

## Date de début
2026-01-08

---

## 📋 Règles d'équité implémentées

| Règle | Seuil | Status |
|-------|-------|--------|
| **Distance de spawn** | min = radius × 1.5 (4.5 tuiles pour radius=3) | ✅ Implémenté |
| **Densité de ressources** | max 30% différence sur rayon 1 | ✅ Implémenté |
| **Accès aux stations** | ±1 tuile vers fuel/repair le plus proche | ✅ Implémenté |
| **Équité du terrain** | max 15% différence walkable sur rayon 2 | ✅ Implémenté |
| **Seeding déterministe** | Même seed = même carte | ✅ Implémenté |

---

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers

1. **[docs/bot-spec/scenarios/initialization-fairness.feature](docs/bot-spec/scenarios/initialization-fairness.feature)**
   - Scénarios Gherkin définissant les règles d'équité
   - 5 règles principales avec exemples

2. **[src/stores/useTileStore/slices/tileFairnessSlice.ts](src/stores/useTileStore/slices/tileFairnessSlice.ts)**
   - `createSeededRandom()` - Générateur pseudo-aléatoire déterministe (LCG)
   - `calculateHexDistance()` - Distance hexagonale entre 2 coordonnées
   - `validateSpawnDistance()` - Validation distance min entre spawns
   - `getNeighborResources()` - Somme ressources dans rayon N
   - `validateResourceBalance()` - Validation équilibre ressources ±30%
   - `calculateStationAccess()` - Distance BFS vers station la plus proche
   - `validateStationAccess()` - Validation accès fuel/repair ±1 tuile
   - `getWalkablePercent()` - % tuiles walkables dans rayon N
   - `validateTerrainFairness()` - Validation terrain ±15%
   - `validateMapFairness()` - Orchestrateur de validation
   - `placeStartingTilesWithFairness()` - Placement avec boucle de régénération

3. **[src/stores/useGameStore/slices/seedSlice.ts](src/stores/useGameStore/slices/seedSlice.ts)**
   - `mapSeed` - État du seed actuel
   - `generateSeed()` - Génère un nouveau seed basé sur timestamp
   - `setSeed()` - Définit un seed spécifique
   - `getSeed()` - Récupère le seed actuel
   - `resetSeed()` - Réinitialise le seed

### Fichiers modifiés

1. **[src/stores/useTileStore/slices/tileGenerationSlice.ts](src/stores/useTileStore/slices/tileGenerationSlice.ts)**
   - `initializeGameGrid(radius, spacing, seed?)` - Support seed
   - `placeGameStations(tileMap, radius, seed?, spawns?)` - Évite zone spawn
   - `placeEmptyTiles(tileMap, ratio, seed?, spawns?)` - Évite zone spawn
   - `placeObstacleTiles(tileMap, seed?, spawns?)` - Évite zone spawn
   - `placeDangerTiles(tileMap, seed?, spawns?)` - Évite zone spawn
   - `placeStartingTiles(tileMap, botCount, seed?)` - Support seed
   - `assignStartingTiles(botIds, seed?)` - Pipeline complet avec fairness

2. **[src/stores/useTileStore/index.ts](src/stores/useTileStore/index.ts)**
   - Ajout du slice `tileFairnessSlice`

3. **[src/stores/useGameStore/index.ts](src/stores/useGameStore/index.ts)**
   - Ajout du slice `seedSlice`

4. **[src/types/stores.d.ts](src/types/stores.d.ts)**
   - Ajout `TileFairnessSliceActions` interface
   - Ajout `SeedSliceActions` interface
   - Mise à jour des signatures avec paramètres seed/spawns

5. **[src/App.tsx](src/App.tsx)**
   - Génère seed via `gameStore.generateSeed()`
   - Passe seed à `initializeGameGrid()` et `assignStartingTiles()`
   - Logs améliorés avec métriques de fairness

---

## 🔄 Nouvelle chronologie de génération

```
1. Générer seed (Date.now() ou paramètre)
2. Créer grille de base (toutes tuiles = resource)
3. Placer starting tiles avec validation fairness
   - Boucle max 10 tentatives
   - Validation: distance, ressources, terrain
   - Incrément seed si échec
4. Placer empty tiles (15%) - évite rayon 1 des spawns
5. Placer obstacle tiles (20%) - évite rayon 1 des spawns  
6. Placer danger tiles (10%) - évite rayon 1 des spawns
7. Placer stations (fuel/repair) - évite rayon 2 des spawns
8. Assigner tuiles aux bots
```

---

## 📊 Algorithmes clés

### Seeded Random (LCG)
```typescript
const createSeededRandom = (seed: number) => {
  let currentSeed = seed;
  return () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
};
```

### Distance hexagonale
```typescript
// Utilise coordonnées cubiques (s = -q - r)
const dq = Math.abs(c1.q - c2.q);
const dr = Math.abs(c1.r - c2.r);
const ds = Math.abs((-c1.q - c1.r) - (-c2.q - c2.r));
return Math.max(dq, dr, ds);
```

### Validation ressources
```typescript
const difference = maxRes > 0 ? ((maxRes - minRes) / maxRes) * 100 : 0;
return difference <= 30; // PASS si ≤30%
```

---

## ✅ Tests de validation

Pour valider l'implémentation:

1. **Lancer le jeu** et observer les logs console:
   ```
   🎲 [App] Map seed generated: 1736345678901
   🎯 [Fairness] Attempt 1 (seed=...): ✅ VALID
   🎯 [Fairness] Metrics: distance=5.0, resources=12.3%, terrain=8.5%
   ```

2. **Reproduire une carte** en définissant le même seed:
   ```typescript
   gameStore.setSeed(1736345678901);
   // La carte générée sera identique
   ```

3. **Vérifier les métriques** dans le résultat de validation:
   ```typescript
   const validation = tileStore.validateMapFairness(tiles, spawns, radius, seed, 1);
   console.log(validation.metrics);
   // { spawnDistance: 5.2, resourceDifference: 18, ... }
   ```

---

## 🔮 Améliorations futures

1. **UI pour afficher le seed** - Permettre copier/coller pour replay
2. **Slider de tolérance** - Ajuster les seuils dynamiquement
3. **Mode tournoi** - Seeds pré-validés avec fairness garantie
4. **Historique des seeds** - Sauvegarder les parties jouées
5. **Statistiques agrégées** - Analyser la distribution des métriques

---

## 📝 Notes de commit

```
feat(fairness): implement multi-bot initialization fairness system

- Add tileFairnessSlice with validation functions
- Add seedSlice for deterministic generation
- Update tileGenerationSlice with seed support
- Modify placement order: spawns first, then other tiles
- Integrate fairness validation in App.tsx initialization

Règles implémentées:
- Distance spawn minimum = radius × 1.5
- Ressources équilibrées ±30% sur rayon 1
- Accès stations ±1 tuile
- Terrain walkable ±15% sur rayon 2

Docs: docs/bot-spec/scenarios/initialization-fairness.feature
```
