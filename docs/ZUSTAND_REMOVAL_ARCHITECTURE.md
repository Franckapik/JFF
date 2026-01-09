# Architecture: Suppression complète de Zustand

## Objectif
Remplacer tous les stores Zustand par une architecture basée sur:
1. **FSM Context** - État centralisé dans XState
2. **React Context** - État UI local partagé
3. **Module singleton** - Données globales statiques

---

## Analyse des Stores à Migrer

### 1. useBotSelectionStore
**Responsabilité**: Sélection du bot affiché (UI)
**Données**: `selectedView: 'bot-0' | 'bot-1' | 'both'`
**Solution**: React Context + URL sync

### 2. useGameStore
**Responsabilité**: Configuration globale du jeu
**Données**: clock, playerCount, seed, uiConfig, initFlags, radius
**Solution**: Déjà migré vers `FSMContext.gameConfig` (Phase 1-2)
→ Reste: orchestration init dans App.tsx → Module singleton

### 3. useTileStore
**Responsabilité**: Données de la carte (tiles, pathfinding, resources)
**Données**: tiles, spacing, radius, dangers
**Solution**: 
- Tiles déjà dans `FSMContext.gridInfo.tiles`
- Fonctions pures dans `src/core/spatial/pure/`
- Module singleton pour l'état global

### 4. useXFSMStore
**Responsabilité**: Création/gestion acteurs XState
**Solution**: Module singleton + React Context

### 5. useSharedWorkerStore
**Responsabilité**: Connexion au SharedWorker
**Solution**: Module singleton (déjà quasi-stateless)

---

## Nouvelle Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React App                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │  GameProvider   │    │   UIProvider    │                     │
│  │  (React Context)│    │  (React Context)│                     │
│  │                 │    │                 │                     │
│  │  - botActors    │    │  - selectedView │                     │
│  │  - activeBots   │    │  - isClockOn    │                     │
│  │  - send()       │    │  - theme        │                     │
│  └────────┬────────┘    └────────┬────────┘                     │
│           │                      │                               │
│           v                      v                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Components                                ││
│  │  useFSMContext() ──> GameContext ──> FSM actors             ││
│  │  useUIContext()  ──> UIContext ──> UI state                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                     Module Singletons                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ gameEngine  │  │ tileManager │  │ workerBridge│              │
│  │             │  │             │  │             │              │
│  │ - actors    │  │ - tiles     │  │ - port      │              │
│  │ - config    │  │ - pathfind()│  │ - connect() │              │
│  │ - init()    │  │ - generate()│  │ - send()    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Plan d'Implémentation

### Phase 7A: React Context pour UI
1. Créer `src/contexts/UIContext.tsx`
   - selectedView (remplace useBotSelectionStore)
   - isClockRunning
   - URL sync

### Phase 7B: Module singleton pour Game Engine
1. Créer `src/engine/gameEngine.ts`
   - Création/gestion des acteurs XState
   - Configuration globale
   - Remplace useXFSMStore + useGameStore

### Phase 7C: Module singleton pour Tile Manager
1. Créer `src/engine/tileManager.ts`
   - Stockage tiles (mutable singleton)
   - Fonctions pures de pathfinding
   - Remplace useTileStore

### Phase 7D: React Context pour Game
1. Créer `src/contexts/GameContext.tsx`
   - Expose gameEngine vers React
   - useFSMContext() simplifié

### Phase 7E: Migration des composants
1. Remplacer tous les imports Zustand
2. Valider fonctionnement

### Phase 7F: Suppression Zustand
1. `npm uninstall zustand`
2. Supprimer `/src/stores/`

---

## Fichiers à Créer

```
src/
├── contexts/
│   ├── UIContext.tsx        # UI state (view selection, clock)
│   ├── GameContext.tsx      # FSM actors access
│   └── index.ts
├── engine/
│   ├── gameEngine.ts        # Singleton: XState actors
│   ├── tileManager.ts       # Singleton: Tile data
│   ├── workerBridge.ts      # Singleton: SharedWorker connection
│   └── index.ts
```

---

## Mapping Stores → Nouvelle Architecture

| Store | Données | Nouvelle Location |
|-------|---------|-------------------|
| useBotSelectionStore.selectedView | UI state | UIContext |
| useGameStore.clock | UI state | UIContext |
| useGameStore.playerCount | Config | gameEngine.config |
| useGameStore.seed | Config | gameEngine.config |
| useGameStore.uiConfig | UI state | UIContext |
| useGameStore.initFlags | Engine state | gameEngine.state |
| useGameStore.radius | FSM context | FSMContext.config |
| useTileStore.tiles | Grid data | tileManager.tiles |
| useTileStore.pathfind | Pure function | tileManager.findPath() |
| useXFSMStore.actors | Engine state | gameEngine.actors |
| useXFSMStore.botStates | Derived | GameContext |
| useSharedWorkerStore.* | Connection | workerBridge |
