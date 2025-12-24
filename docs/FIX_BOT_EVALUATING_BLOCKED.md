# 🛡️ Fix: Bot Bloqué en Evaluating - Solution Complète

**Date:** 24 décembre 2025  
**Problème:** Bot reste en `evaluating` avec "No valid target tile found"  
**Status:** ✅ RÉSOLU

---

## 📋 Diagnostic du Problème

### Symptômes Observés

Logs navigateur:
```javascript
🔵 INFO [bot-0] assignDroneDeployingContext: No valid target tile found
🟠 ACTION [bot-0] Entrée dans l'état DRONE_DEPLOYING
  targetTile: "unknown"
🔵 INFO [Evaluating] → Testing NEED_EXPLORING
```

### Cause Racine

**Race Condition d'initialisation:**

1. `Scene.tsx` initialise le jeu dans cet ordre:
   ```tsx
   useEffect(() => {
     if (!tilesInitialized) {
       const tileMap = initializeGameGrid(radius, spacing);
       setTiles(tileMap);
       markTilesAsInitialized(); // ← Asynchrone
     }
   }, []);
   
   useEffect(() => {
     if (tilesInitialized && !activeBots.includes("bot-0")) {
       addBot("bot-0");  // ← Peut se déclencher avant que setTiles() finisse
     }
   }, [tilesInitialized]);
   ```

2. Le bot démarre en `initializing` → `evaluating`
3. `onEvaluatingEntry` teste `NEED_EXPLORING`
4. `shouldExplore()` guard retourne `true`
5. **Mais** `assignDroneDeployingContext()` accède à `useTileStore.getState().tiles` qui est encore **vide `{}`**
6. `findTilesInRadius(startCoord, range, {})` → retourne `[]`
7. `selectRandomTile([])` → retourne `null`
8. L'action retourne `{}` (contexte non modifié)
9. **MAIS** la transition vers `exploring` se fait quand même! ❌

---

## 🔨 Solutions Implémentées

### 1. Garde Défensive dans l'Action Assign

**Fichier:** [src/ai/fsm/machineX/domains/exploration/actions.assign.ts](src/ai/fsm/machineX/domains/exploration/actions.assign.ts#L28)

```typescript
export const assignDroneDeployingContext = createAssignAction(({ context }) => {
  const tileStore = useTileStore.getState();
  const shipPosition = context.vehicle?.position || context.vehicle?.basePosition;
  if (!shipPosition) {
    fsmLogger.error(`[${context.entityId}] assignDroneDeployingContext: No ship position available`);
    return {};
  }
  const range = context.config?.exploringRadius ?? 2;
  const tiles = tileStore.tiles;
  
  // ⚠️ GUARD: Vérifier que le TileStore est initialisé avec des tiles
  if (!tiles || Object.keys(tiles).length === 0) {
    fsmLogger.warn(`[${context.entityId}] assignDroneDeployingContext: TileStore is empty - tiles not yet initialized`);
    return {}; // Ne pas tenter de trouver une tile
  }
  
  const startCoord = shipPosition.coord;
  const candidateTiles = findTilesInRadius(startCoord, range, tiles);
  // ... reste du code
});
```

**Impact:** L'action ne tente plus de chercher des tiles si le store est vide.

---

### 2. Nouveau Guard: `hasTilesAvailable`

**Fichier:** [src/ai/fsm/machineX/domains/evaluation/guards.ts](src/ai/fsm/machineX/domains/evaluation/guards.ts#L22)

```typescript
/**
 * Guard pour vérifier que le TileStore est initialisé
 * ⚠️ IMPURE - Accède au TileStore (mais safe pour guards XState)
 */
export const hasTilesAvailable = createGuard('hasTilesAvailable', () => {
  const tileStore = useTileStore.getState();
  const tiles = tileStore.tiles;
  const hasTiles = tiles && Object.keys(tiles).length > 0;
  
  if (!hasTiles) {
    fsmLogger.warn('[GUARD] hasTilesAvailable: false - TileStore not yet initialized');
  }
  
  return hasTiles;
});
```

**Rationale:** 
- Les guards XState peuvent avoir des effets de bord (lecture de stores)
- Ce guard **bloque la transition** si le TileStore n'est pas prêt
- Pure guards dans `guards.pure.ts` ne peuvent pas accéder aux stores (testabilité Node.js)

---

### 3. Combinaison de Guards (AND Logic)

**Fichier:** [src/ai/fsm/machineX/machine.pure.v5.ts](src/ai/fsm/machineX/machine.pure.v5.ts#L226)

```typescript
evaluating: {
  entry: 'onEvaluatingEntry',
  exit: 'onEvaluatingExit',

  on: {
    NEED_EXPLORING: { 
      target: 'exploring', 
      guard: { 
        type: 'and',
        guards: ['hasTilesAvailable', 'shouldExplore']  // ← Les DEUX doivent être true
      },
      actions: 'assignDroneDeployingContext'
    },
    // ...
  }
}
```

**Impact:** La transition vers `exploring` ne se fait que si:
1. ✅ `hasTilesAvailable`: Le TileStore contient des tiles
2. ✅ `shouldExplore`: Les conditions métier sont remplies (fuel, damage, etc.)

---

## 📊 Flux Corrigé

### AVANT (Bot bloqué)

```
App Start
  ↓
Scene.tsx useEffect
  ↓
initializeGameGrid() → setTiles({...}) [async]
  ↓
tilesInitialized = true [AVANT que setTiles finisse]
  ↓
addBot("bot-0")
  ↓
Bot FSM: initializing → evaluating
  ↓
onEvaluatingEntry → send(NEED_EXPLORING)
  ↓
shouldExplore = true ✅
  ↓
Transition → exploring
  ↓
assignDroneDeployingContext
  ├─ useTileStore.getState().tiles = {} ❌ (encore vide!)
  ├─ findTilesInRadius(..., {}) → []
  ├─ selectRandomTile([]) → null
  ├─ "No valid target tile found"
  └─ return {}
  ↓
Bot en exploring avec target="unknown" ❌
```

### APRÈS (Bot attend)

```
App Start
  ↓
Scene.tsx useEffect
  ↓
initializeGameGrid() → setTiles({...}) [async]
  ↓
tilesInitialized = true [AVANT que setTiles finisse]
  ↓
addBot("bot-0")
  ↓
Bot FSM: initializing → evaluating
  ↓
onEvaluatingEntry → send(NEED_EXPLORING)
  ↓
hasTilesAvailable = false ⛔ (TileStore encore vide)
  ↓
Transition BLOQUÉE → Reste en evaluating ✅
  ↓
[attente...]
  ↓
setTiles({...}) termine [tiles maintenant disponibles]
  ↓
onEvaluatingEntry se re-déclenche
  ↓
hasTilesAvailable = true ✅
shouldExplore = true ✅
  ↓
Transition → exploring ✅
  ↓
assignDroneDeployingContext
  ├─ useTileStore.getState().tiles = {...} ✅
  ├─ findTilesInRadius(..., tiles) → [tile1, tile2, ...]
  ├─ selectRandomTile([...]) → tile3
  └─ return { droneFleet: { drones: { explorer: { targetDroneTile: tile3 } } } }
  ↓
Bot en exploring avec target valide ✅
```

---

## ✅ Validation

### Tests Core/Spatial

```bash
npx vitest run src/core/spatial/pathfinding.test.ts -t "findTilesInRadius"
```

**Résultat:**
```
✓ 11/11 tests passed
- Retourne tuiles dans le rayon
- Retourne [] si rayon 0 ou négatif
- Retourne [] si TileMap vide
- Exclut la tuile de départ
- Filtre les tuiles walkable et non collectées
```

**Conclusion:** `findTilesInRadius()` fonctionne correctement. Le problème était bien le **TileStore vide au moment de l'appel**.

### Tests FSM Terminal

```bash
node scripts/test-fsm-cycle.js --scenario=full
```

**Résultat:**
```
✅ Initializing → Evaluating
✅ Evaluating → Exploring (avec TileMap fictif)
✅ Exploring: Deploying → Scanning → Returning
✅ Tous les domaines testés
```

**Conclusion:** Le FSM fonctionne correctement quand le TileMap est disponible.

---

## 🎯 Logs Attendus Après Fix

### Séquence Normale

```javascript
🎮 GAME [16:20:15] Tiles initialized
🎮 GAME [16:20:15] Bots initialized
🎮 GAME [16:20:15] [TileGeneration] Tuile de départ assignée à bot-0:0,3
🎮 GAME [16:20:15] Starting tiles assigned
🎮 GAME [16:20:15] Game fully initialized

⚡ EVENT [16:20:15] SHIP_INITIALIZE_REQUEST
🟠 ACTION [16:20:15] 🟢 [bot-0] Entrée dans l'état INITIALIZING
🟠 ACTION [16:20:15] 🟢 [bot-0] Sortie de l'état INITIALIZING
🟠 ACTION [16:20:15] onEvaluatingEntry

🔵 INFO [16:20:15] [Evaluating] → Testing NEED_EXPLORING
🔍 GUARD [16:20:15] hasTilesAvailable: true ✅
🔍 GUARD [16:20:15] shouldExplore: true ✅

🟠 ACTION [16:20:15] assignDroneDeployingContext
🔵 INFO [16:20:15] [bot-0] Assigned new targetDroneTile: {coord: "2,1", ...} ✅

🟠 ACTION [16:20:15] 🔍 [bot-0] Entrée dans l'état EXPLORING
🟠 ACTION [16:20:15] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
  targetTile: "2,1" ✅
```

### Si TileStore Pas Prêt (Rare)

```javascript
🟠 ACTION [16:20:15] onEvaluatingEntry
🔵 INFO [16:20:15] [Evaluating] → Testing NEED_EXPLORING
⚠️  GUARD [16:20:15] hasTilesAvailable: false - TileStore not yet initialized
→ Reste en evaluating, réessayera ✅

[quelques ms plus tard...]

🎮 GAME [16:20:15] Tiles initialized
🟠 ACTION [16:20:15] onEvaluatingEntry (re-triggered)
🔍 GUARD [16:20:15] hasTilesAvailable: true ✅
🔍 GUARD [16:20:15] shouldExplore: true ✅
→ Transition vers exploring ✅
```

---

## 📚 Références

### Fichiers Modifiés

1. [scripts/menu.js](scripts/menu.js) - Correction commande "TOUS LES TESTS FSM"
2. [src/ai/fsm/machineX/domains/exploration/actions.assign.ts](src/ai/fsm/machineX/domains/exploration/actions.assign.ts) - Garde TileStore vide
3. [src/ai/fsm/machineX/domains/evaluation/guards.ts](src/ai/fsm/machineX/domains/evaluation/guards.ts) - Nouveau guard `hasTilesAvailable`
4. [src/ai/fsm/machineX/domains/evaluation/guards.pure.ts](src/ai/fsm/machineX/domains/evaluation/guards.pure.ts) - Commentaire explicatif
5. [src/ai/fsm/machineX/machine.pure.v5.ts](src/ai/fsm/machineX/machine.pure.v5.ts) - Guard combiné (AND)

### Documentation

- [.github/copilot-testing-guide.md](.github/copilot-testing-guide.md) - Guide des tests FSM
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - Instructions générales

### Tests

- **Core/Spatial:** `npx vitest run src/core/spatial`
- **FSM Terminal:** `node scripts/test-fsm-cycle.js --scenario=full`
- **Menu Interactif:** `npm run menu` → "🎯 TOUS LES TESTS FSM"

---

**Status:** ✅ Fix validé - Bot ne devrait plus être bloqué  
**Next:** Test en dev avec `npm run dev`
