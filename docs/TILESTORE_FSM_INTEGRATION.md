# Intégration TileStore dans le contexte FSM XState

## � MIGRATION COMPLÈTE - Phase 5

**Statut : ✅ TERMINÉE**  
**Date : 9 janvier 2026**

### Résumé des modifications

Le worker FSM est désormais **autonome vis-à-vis du TileStore**. Toutes les opérations de lecture et mutation des tiles passent par le contexte FSM (`context.gridInfo.tiles` et `context.memory.knownTiles`).

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| `src/ai/fsm/machineX/domains/tiles/index.ts` | Export du domaine tiles |
| `src/ai/fsm/machineX/domains/tiles/helpers.pure.ts` | Helpers purs pour manipulation des tiles |
| `src/ai/fsm/machineX/domains/tiles/actions.assign.ts` | Actions XState assign pour mutations |

### Fichiers modifiés

| Fichier | Modifications |
|---------|---------------|
| `src/ai/fsm/machineX/domains/collection/actions.assign.ts` | Suppression de `useTileStore.getState()`, utilisation des helpers purs |
| `src/workers/fsm-shared-worker.ts` | Utilisation de `context.gridInfo.tiles` au lieu de `tilesStore` |
| `src/ai/fsm/machineX/domains/index.ts` | Export du nouveau domaine tiles |

### Architecture finale

```
context.gridInfo.tiles  ← Source de vérité unique pour les tiles dans le FSM
         ↑
         │ Mutations via actions assign
         │
┌────────┴────────┐
│   tiles domain  │
│  helpers.pure   │ ← Fonctions pures de calcul
│ actions.assign  │ ← Actions XState pour mutations
└─────────────────┘
         │
         │ Utilisé par
         ↓
┌─────────────────────────────────────┐
│       collection/actions.assign     │
│ - assignShipLoadResourcesContext    │
│ - assignShipReturningContext        │
│ - assignShipReachedBaseContext      │
└─────────────────────────────────────┘
         │
         │ Contexte partagé via
         ↓
┌─────────────────────────────────────┐
│         fsm-shared-worker.ts        │
│ - handleSnapshot utilise context    │
│ - Plus de dépendance à tilesStore   │
└─────────────────────────────────────┘
```

---

## �📋 Analyse du problème

Le `useTileStore` actuel utilise Zustand et combine 9 slices différents pour gérer :
- Génération de grille hexagonale
- CRUD des tuiles (create, read, update, delete)
- Pathfinding et calculs de distance
- Marquage d'exploration et collecte
- Gestion des ressources
- Validation de l'équité (fairness)
- Gestion des dangers dynamiques
- Transformations de coordonnées
- Filtrage et recherche

**Question** : Est-il possible d'intégrer toute cette logique directement dans le contexte FSM XState sans Zustand, sans wrappers, ni stores purs ?

**Réponse courte** : **OUI, c'est totalement possible et même recommandé pour un worker autonome.**

---

## ✅ Pourquoi c'est possible

XState v5 fournit tous les outils nécessaires :

### 1. **Contexte FSM** : Stockage de l'état
```typescript
context: {
  tiles: TileMap,  // Record<GridCoordinate, Tile>
  gridInfo: {
    radius: number,
    spacing: number,
    hoveredTile: GridCoordinate | null
  },
  // ... autres propriétés du bot
}
```

### 2. **Actions `assign`** : Modification de l'état
```typescript
actions: {
  assignGeneratedTiles: assign(({ context, event }) => {
    const tiles = generateHexGrid(event.radius, event.spacing);
    return { 
      tiles,
      gridInfo: { 
        ...context.gridInfo,
        radius: event.radius, 
        spacing: event.spacing 
      }
    };
  }),
  
  assignTileExplored: assign(({ context, event }) => {
    const updatedTiles = { ...context.tiles };
    const tile = updatedTiles[event.coord];
    if (tile) {
      updatedTiles[event.coord] = { 
        ...tile, 
        explored: true, 
        exploredAt: Date.now(),
        exploredBy: context.entityId
      };
    }
    return { tiles: updatedTiles };
  }),
  
  assignTileCollected: assign(({ context, event }) => {
    const updatedTiles = { ...context.tiles };
    const tile = updatedTiles[event.coord];
    if (tile && tile.hasResources) {
      updatedTiles[event.coord] = { 
        ...tile, 
        collected: true,
        collectedAt: Date.now(),
        collectedBy: context.entityId,
        resources: { food: 0, debris: 0, special: 0, total: 0 }
      };
    }
    return { tiles: updatedTiles };
  })
}
```

### 3. **Actions customs** : Effets de bord
```typescript
actions: {
  logTileGeneration: ({ context }) => {
    console.log(`Generated ${Object.keys(context.tiles).length} tiles`);
  },
  
  validateTileFairness: ({ context, self }) => {
    const fairnessResult = validateFairness(context.tiles, context.entityId);
    if (!fairnessResult.isValid) {
      self.send({ type: 'FAIRNESS_VIOLATION', violations: fairnessResult.violations });
    }
  }
}
```

### 4. **Guards** : Validations
```typescript
guards: {
  hasTileAtCoord: ({ context, event }) => {
    return !!context.tiles[event.coord];
  },
  
  tileHasResources: ({ context, event }) => {
    const tile = context.tiles[event.coord];
    return !!tile?.hasResources && tile.resources.total > 0;
  },
  
  tileNotCollected: ({ context, event }) => {
    return !context.tiles[event.coord]?.collected;
  }
}
```

### 5. **Events** : Déclencheurs
```typescript
events: {
  GENERATE_TILES: { radius: number, spacing: number },
  TILE_EXPLORED: { coord: GridCoordinate, botId: string },
  TILE_COLLECTED: { coord: GridCoordinate, botId: string },
  UPDATE_TILE: { coord: GridCoordinate, updates: Partial<Tile> }
}
```

---

## 🎯 Architecture proposée

### Structure du contexte FSM

```typescript
interface FSMContext {
  // Identité du bot
  entityId: string;
  entityType: 'bot' | 'player';
  
  // TILES : Source unique de vérité
  tiles: TileMap;  // Record<GridCoordinate, Tile>
  
  // Informations de grille
  gridInfo: {
    radius: number;
    spacing: number;
    hoveredTile: GridCoordinate | null;
    generatedAt: number;
  };
  
  // Mémoire du bot (tuiles connues par ce bot)
  memory: {
    knownTiles: Tile[];
    exploredCoords: Set<GridCoordinate>;
    collectedCoords: Set<GridCoordinate>;
  };
  
  // ... autres propriétés (vehicle, droneFleet, etc.)
}
```

### Actions principales

```typescript
// 1. GÉNÉRATION
assignGeneratedTiles: assign(({ event }) => {
  const tiles = generateHexGrid(event.radius, event.spacing);
  return { 
    tiles,
    gridInfo: { 
      radius: event.radius, 
      spacing: event.spacing,
      generatedAt: Date.now()
    }
  };
});

// 2. EXPLORATION
assignTileExplored: assign(({ context, event }) => {
  const tiles = { ...context.tiles };
  const tile = tiles[event.coord];
  if (tile) {
    tiles[event.coord] = { 
      ...tile, 
      explored: true, 
      exploredAt: Date.now(),
      exploredBy: event.botId
    };
  }
  return { tiles };
});

// 3. COLLECTE
assignTileCollected: assign(({ context, event }) => {
  const tiles = { ...context.tiles };
  const tile = tiles[event.coord];
  if (tile?.hasResources) {
    const collected = tile.resources;
    tiles[event.coord] = { 
      ...tile, 
      collected: true,
      collectedAt: Date.now(),
      collectedBy: event.botId,
      resources: { food: 0, debris: 0, special: 0, total: 0 }
    };
    return { tiles };
  }
  return {};
});

// 4. PATHFINDING (intégré dans actions)
calculatePathAction: ({ context, event, self }) => {
  const path = findPath(
    context.tiles, 
    event.start, 
    event.end,
    { maxDistance: 50 }
  );
  self.send({ type: 'PATH_CALCULATED', path });
};

// 5. MISE À JOUR GÉNÉRIQUE
assignTileUpdate: assign(({ context, event }) => {
  const tiles = { ...context.tiles };
  if (tiles[event.coord]) {
    tiles[event.coord] = { ...tiles[event.coord], ...event.updates };
  }
  return { tiles };
});
```

### Fonctions pures (hors FSM)

Les fonctions de calcul restent pures et séparées dans `src/core/spatial/`:

```typescript
// src/core/spatial/hexGrid.ts - Complete tile generation pipeline
export function initializeGameGrid(config: { radius: number; spacing: number; seed: number }): GridTileMap {
  // Base hexagonal grid generation
}

export function placeGameStations(tiles: GridTileMap, config: { radius: number; seed: number }): GridTileMap {
  // Place fuel and repair stations
}

export function placeDangerTiles(tiles: GridTileMap, seed: number): GridTileMap {
  // Place danger tiles (10% of grid)
}

export function placeObstacleTiles(tiles: GridTileMap, seed: number): GridTileMap {
  // Place obstacle tiles (20% of grid)
}

export function placeEmptyTiles(tiles: GridTileMap, ratio: number, seed: number): GridTileMap {
  // Place empty tiles (default 15%)
}

export function placeStartingTiles(tiles: GridTileMap, botCount: number, seed: number): GridTileMap {
  // Place starting positions for bots
}

export function assignStartingTilesToBots(tiles: GridTileMap, botIds: string[]): GridTileMap {
  // Assign specific starting tiles to each bot
}

// src/core/spatial/pure/pathfinding.ts
export function findPath(
  tiles: TileMap, 
  start: GridCoordinate, 
  end: GridCoordinate,
  options?: PathfindingOptions
): GridCoordinate[] {
  // Algorithme A* ou Dijkstra
}

// src/core/spatial/pure/distance.ts
export function calculateDistance(
  coord1: GridCoordinate,
  coord2: GridCoordinate
): number {
  // Distance hexagonale
}
```

Ces fonctions sont **importées et utilisées dans SharedView pour l'initialisation** :

```typescript
import { 
  initializeGameGrid, 
  placeGameStations, 
  placeDangerTiles, 
  placeEmptyTiles,
  placeObstacleTiles,
  placeStartingTiles,
  assignStartingTilesToBots
} from '../core/spatial/hexGrid';

// Vue1 initializes the game with complete tile orchestration
const seed = Date.now();
const botCount = 2;
const botIds = ['bot-0', 'bot-1'];

// Step 1: Initialize base grid
let tiles = initializeGameGrid({ radius, spacing, seed });

// Step 2: Place empty tiles (15%)
tiles = placeEmptyTiles(tiles, 0.15, seed);

// Step 3: Place obstacles (20%)
tiles = placeObstacleTiles(tiles, seed);

// Step 4: Place danger tiles (10%)
tiles = placeDangerTiles(tiles, seed);

// Step 5: Place starting tiles (1 per bot)
tiles = placeStartingTiles(tiles, botCount, seed);

// Step 6: Place stations (fuel + repair)
tiles = placeGameStations(tiles, { radius, seed });

// Step 7: Assign starting tiles to bots
tiles = assignStartingTilesToBots(tiles, botIds);

// Send to worker
initGame(tiles);
```

---

## 🔄 Intégration dans le worker

### Avantages majeurs

1. **Autonomie totale** : Le worker a toutes les tiles dans son contexte FSM
2. **Sérialisable** : `TileMap` est un objet pur (JSON-compatible)
3. **Pas de dépendance externe** : Pas besoin de Zustand, React, ni de communication avec le main thread
4. **Synchronisation simple** : On peut envoyer tout le contexte FSM via `postMessage`

### Architecture worker

```typescript
// src/workers/fsm-shared-worker.ts
import { createActor } from 'xstate';
import { machineXV5 } from '../ai/fsm/machineX/machine.xstate.v5';

// Initialisation
const actor = createActor(machineXV5, {
  input: {
    entityId: 'bot-0',
    // Génération des tiles DANS le worker
    tiles: generateHexGrid(3, -0.2),
    gridInfo: { radius: 3, spacing: -0.2 }
  }
});

actor.start();

// Réception de messages
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'EXPLORE_TILE':
      actor.send({ type: 'TILE_EXPLORED', coord: payload.coord, botId: 'bot-0' });
      break;
      
    case 'COLLECT_TILE':
      actor.send({ type: 'TILE_COLLECTED', coord: payload.coord, botId: 'bot-0' });
      break;
      
    case 'REQUEST_STATE':
      const snapshot = actor.getSnapshot();
      self.postMessage({
        type: 'STATE_UPDATE',
        context: snapshot.context,
        value: snapshot.value
      });
      break;
  }
});

// Synchronisation automatique
actor.subscribe((snapshot) => {
  self.postMessage({
    type: 'STATE_UPDATE',
    context: snapshot.context,
    value: snapshot.value
  });
});
```

### Synchronisation main thread ↔ worker

**Option 1 : Worker maître des tiles**
- Le worker génère et gère les tiles
- Le main thread reçoit des snapshots et affiche

```typescript
// Main thread
worker.postMessage({ type: 'GENERATE_TILES', radius: 3, spacing: -0.2 });

worker.onmessage = (event) => {
  if (event.data.type === 'STATE_UPDATE') {
    const { tiles } = event.data.context;
    // Mettre à jour l'UI avec les nouvelles tiles
    setLocalTiles(tiles);
  }
};
```

**Option 2 : Synchronisation bidirectionnelle**
- Main thread et worker ont chacun leur copie
- Synchronisation via événements

```typescript
// Main thread explore une tile
const tile = getTile('2,3');
worker.postMessage({ 
  type: 'TILE_EXPLORED', 
  coord: '2,3', 
  botId: 'bot-0' 
});

// Worker met à jour et renvoie
// Main thread reçoit la mise à jour et sync son état local
```

---

## 🎨 Comparaison avec l'architecture actuelle

### Actuel (avec Zustand)

```typescript
// Composant
const tiles = useTileStore((s) => s.tiles);
const markTileAsExplored = useTileStore((s) => s.markTileAsExplored);

// Action FSM
export const onDroneScanningEntry = () => {
  const tileStore = useTileStore.getState();
  const tile = tileStore.getTile(targetCoord);
  tileStore.markTileAsExplored(targetCoord, botId);
};
```

**Problèmes** :
- Dépendance à Zustand (incompatible worker)
- État split entre FSM et TileStore
- Pas de traçabilité des changements de tiles

### Proposé (tout dans FSM)

```typescript
// Composant
const tiles = useSelector(actor, (s) => s.context.tiles);

// Action FSM
export const onDroneScanningEntry = assign(({ context, event }) => {
  const tiles = { ...context.tiles };
  const tile = tiles[event.targetCoord];
  if (tile) {
    tiles[event.targetCoord] = { 
      ...tile, 
      explored: true,
      exploredAt: Date.now(),
      exploredBy: context.entityId
    };
  }
  return { tiles };
});
```

**Avantages** :
- Tout dans le contexte FSM (single source of truth)
- Compatible worker (100% sérialisable)
- Traçabilité complète (XState Inspector)
- Pas de dépendance externe

---

## ⚖️ Est-ce judicieux ?

### ✅ Cas où c'est RECOMMANDÉ

1. **Worker autonome** : Si vous voulez un worker qui gère tout seul la logique de jeu
2. **Single player** : Pas besoin de serveur, tout est local
3. **Hot seat multiplayer** : Plusieurs joueurs sur le même appareil
4. **Offline first** : Le jeu doit fonctionner sans connexion
5. **Debugging** : XState Inspector permet de voir tous les changements de tiles

### ⚠️ Cas où c'est MOINS ADAPTÉ

1. **Multiplayer online avec serveur autoritaire** : 
   - Les tiles devraient être gérées côté serveur
   - Le client ne fait que afficher et envoyer des actions
   
2. **Très grosse grille** (>10000 tiles) :
   - Le contexte FSM devient énorme
   - Risque de performance lors de la sérialisation
   - Solution : pagination/chunking

3. **UI complexe nécessitant des filtres temps réel** :
   - Si l'UI a besoin de filtrer/trier constamment les tiles
   - Un store UI-side peut être plus performant

### 🎯 Recommandation pour votre projet

**Votre contexte** : Jeu avec worker, FSM autonome, multi-bots locaux

**Verdict** : **C'EST L'APPROCHE IDÉALE** ✅

**Raisons** :
1. Vous avez déjà un worker FSM (`fsm-shared-worker.ts`)
2. Vous voulez une simulation autonome
3. Vous avez déjà un contexte FSM riche
4. Vous n'avez pas de serveur autoritaire (pour l'instant)
5. La traçabilité XState est un gros plus

---

## 📋 Plan de migration

### Phase 1 : Préparation (1-2h)
1. Extraire toutes les fonctions pures de `useTileStore` vers `src/core/spatial/pure/`
   - `generateHexGrid()` → `hexGrid.ts`
   - `findPath()` → `pathfinding.ts`
   - `calculateDistance()` → `distance.ts`
   - etc.

2. Définir les types d'événements pour les tiles :
   ```typescript
   // src/types/events.d.ts
   GENERATE_TILES: { radius: number; spacing: number };
   TILE_EXPLORED: { coord: GridCoordinate; botId: string };
   TILE_COLLECTED: { coord: GridCoordinate; botId: string };
   UPDATE_TILE: { coord: GridCoordinate; updates: Partial<Tile> };
   ```

### Phase 2 : Intégration FSM (2-3h)
1. Ajouter `tiles` et `gridInfo` au contexte initial :
   ```typescript
   // src/ai/fsm/machineX/context/initialContext.ts
   export const initialContext: FSMContext = {
     tiles: {},
     gridInfo: { radius: 0, spacing: 0, hoveredTile: null, generatedAt: 0 },
     // ...
   };
   ```

2. Créer les actions `assign` :
   ```typescript
   // src/ai/fsm/machineX/domains/tiles/actions.assign.ts
   export const assignGeneratedTiles = assign(/*...*/);
   export const assignTileExplored = assign(/*...*/);
   export const assignTileCollected = assign(/*...*/);
   ```

3. Créer les guards :
   ```typescript
   // src/ai/fsm/machineX/domains/tiles/guards.ts
   export const hasTileAtCoord = ({ context, event }) => /*...*/;
   export const tileHasResources = ({ context, event }) => /*...*/;
   ```

### Phase 3 : Migration des usages (3-4h)
1. Remplacer `useTileStore.getState()` dans les actions FSM par `context.tiles`
2. Remplacer les appels directs au store par des événements FSM :
   ```typescript
   // Avant
   tileStore.markTileAsExplored(coord, botId);
   
   // Après
   self.send({ type: 'TILE_EXPLORED', coord, botId });
   ```

3. Mettre à jour les composants pour lire depuis le contexte FSM :
   ```typescript
   // Avant
   const tiles = useTileStore((s) => s.tiles);
   
   // Après
   const tiles = useSelector(actor, (s) => s.context.tiles);
   ```

### Phase 4 : Worker (1-2h)
1. Mettre à jour `fsm-shared-worker.ts` pour gérer les tiles
2. Ajouter les handlers pour `GENERATE_TILES`, `TILE_EXPLORED`, etc.
3. Tester la synchronisation main thread ↔ worker

### Phase 5 : Cleanup (1h)
1. Supprimer `useTileStore` et tous ses slices
2. Supprimer Zustand des dépendances
3. Tester, documenter

**Total estimé : 8-12 heures**

---

## 🔍 Exemple complet minimal

```typescript
// src/ai/fsm/machineX/domains/tiles/actions.assign.ts
import { assign } from 'xstate';
import { generateHexGrid } from '../../../../../core/spatial/pure/hexGrid';
import type { FSMContext, MachineEvents } from '../../../../../types/xstate.v5.types';

export const assignGeneratedTiles = assign<FSMContext, MachineEvents>(
  ({ event }) => {
    if (event.type !== 'GENERATE_TILES') return {};
    
    const tiles = generateHexGrid(event.radius, event.spacing);
    
    return {
      tiles,
      gridInfo: {
        radius: event.radius,
        spacing: event.spacing,
        hoveredTile: null,
        generatedAt: Date.now()
      }
    };
  }
);

export const assignTileExplored = assign<FSMContext, MachineEvents>(
  ({ context, event }) => {
    if (event.type !== 'TILE_EXPLORED') return {};
    
    const tiles = { ...context.tiles };
    const tile = tiles[event.coord];
    
    if (!tile) return {};
    
    tiles[event.coord] = {
      ...tile,
      explored: true,
      exploredAt: Date.now(),
      exploredBy: event.botId
    };
    
    return { tiles };
  }
);
```

```typescript
// Machine setup
import { setup } from 'xstate';

const machineXV5 = setup({
  types: {} as {
    context: FSMContext;
    events: MachineEvents;
  },
  actions: {
    assignGeneratedTiles,
    assignTileExplored,
    assignTileCollected,
  },
  guards: {
    hasTileAtCoord: ({ context, event }) => {
      return event.type === 'TILE_EXPLORED' && !!context.tiles[event.coord];
    }
  }
}).createMachine({
  id: 'bot-fsm',
  initial: 'initializing',
  context: initialContext,
  states: {
    initializing: {
      entry: 'assignGeneratedTiles',
      on: {
        TILES_READY: 'idle'
      }
    },
    exploring: {
      on: {
        TILE_EXPLORED: {
          actions: 'assignTileExplored'
        }
      }
    }
  }
});
```

---

## 📊 Conclusion

### Réponse aux questions initiales

**Est-ce possible ?**  
✅ **OUI**, totalement. XState v5 a tous les outils nécessaires.

**Comment ?**  
- Mettre `tiles: TileMap` dans le contexte FSM
- Créer des actions `assign` pour toutes les modifications
- Utiliser des événements pour déclencher les changements
- Garder les fonctions pures séparées (pathfinding, generation, etc.)

**Est-ce judicieux vis-à-vis du worker ?**  
✅ **OUI**, c'est même LA solution optimale :
- Le worker devient totalement autonome
- Pas de dépendance à Zustand ou React
- Tout est sérialisable et synchronisable
- Traçabilité complète avec XState Inspector

### Prochaines étapes recommandées

1. **Immédiat** : Commencer par extraire les fonctions pures vers `src/core/spatial/pure/`
2. **Court terme** : Migrer la génération de tiles dans le contexte FSM initial
3. **Moyen terme** : Migrer progressivement toutes les opérations tiles vers des actions FSM
4. **Long terme** : Supprimer complètement `useTileStore` et Zustand

Cette approche rend votre architecture :
- ✅ Plus cohérente (single source of truth)
- ✅ Plus maintenable (tout dans FSM)
- ✅ Plus performante (pas de double état)
- ✅ Plus traçable (XState Inspector)
- ✅ Compatible worker (100%)
- ✅ Prête pour le multiplayer (si serveur ajouté plus tard)
