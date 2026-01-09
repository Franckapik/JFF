# Migration Zustand → FSM Context

## Objectif
Rendre le worker autonome en migrant les données des stores Zustand vers le contexte FSM.
Les vues afficheront uniquement les données du contexte FSM. Suppression finale des stores Zustand.

## Stratégie
- 6 commits majeurs (un par phase)
- Fonctions pures dans `src/core/spatial/pure/`
- Deux systèmes en parallèle, bascule finale

---

## Phase 1: Stores simples (UI/Config) → FSM context
- [x] Ajouter `ui` et `gameConfig` dans FSMContext type
- [x] Créer actions FSM: `updateGameConfig`, `toggleClock`, `selectView`
- [x] Créer événements: `GAME_CONFIG_UPDATE`, `CLOCK_TOGGLE`, `VIEW_SELECT`
- [x] Worker stocke gameConfig et envoie aux bots
- [x] Composants lisent context.gameConfig en parallèle des stores
- [x] **COMMIT 1** ✅ (8d87657)

## Phase 2: Radius critique → FSM context
- [x] Ajouter `explorationRadius` dans FSMContext.config (déjà présent ✓)
- [x] Remplacer appel `useGameStore.getState().getExplorationRadius()` par context
- [x] Événement `RADIUS_SYNC` pour sync entre bots
- [x] Action `syncRadius` dans global domain
- [x] Worker détecte changement radius et broadcast aux autres bots
- [x] Supprimer imports useGameStore des fichiers FSM
- [x] **COMMIT 2** ✅ (6b69056)

## Phase 3: TileStore utilities → pure functions
- [x] Vérifier `src/core/spatial/pure/` existant (pathfinding, distance)
- [x] Supprimer useTileStore de `exploration/actions.assign.ts` (markTileAsExplored)
- [x] Supprimer useTileStore de `evaluation/actions.effects.ts` (freshTiles)
- [x] Supprimer useTileStore de `evaluation/guards.pure.ts` (hasUnexploredTilesInRadius)
- [x] FSM actions/guards utilisent SEULEMENT context.gridInfo.tiles + context.memory.knownTiles
- [ ] **COMMIT 3** (en cours)

> Note: `collection/actions.assign.ts` garde useTileStore pour mutations UI (syncro vers stores)
> Ces mutations seront supprimées en Phase 5 (bascule finale)

## Phase 4: XFSMStore → Worker pattern unifié
- [x] Créer hook `useFSMContext(botId)` retournant context/state/send
- [x] Créer hook `useBotState()` abstraction compatible XFSMStore/SharedWorkerStore
- [x] Créer hook `useBotStates()` drop-in replacement pour `useXFSMStore.botStates`
- [x] Mode 'auto': utilise Worker si connecté, fallback vers XFSMStore
- [x] Migrer composants UI vers useBotStates:
  - ScoreDisplay.tsx
  - DroneStatsDisplay.tsx
  - CollectedTilesList.tsx
  - ShipStatus.tsx
  - FSMVisualization.tsx
  - RouteDisplay.tsx (refactoré sans subscription)
- [x] **COMMIT 4** ✅ (6730496)

## Phase 5: Bascule finale
- [x] Créer hook `useActiveBots()` pour liste bots actifs
- [x] Migrer FSMVisualization.tsx vers useActiveBots (plus de useXFSMStore)
- [x] Migrer TileMatrix.tsx vers useBotStates (refactoré avec helper function)
- [ ] Tous composants UI utilisent hooks unifiés
- [ ] App.tsx garde useXFSMStore pour l'initialisation (mode legacy)
- [ ] **COMMIT 5** (en cours)

## Phase 6: Cleanup
- [ ] Supprimer fichiers stores Zustand inutilisés
- [ ] Supprimer imports orphelins
- [ ] Vérification TS errors
- [ ] **COMMIT 6 (FINAL)**

---

## Stores Analysis Summary

| Store | Complexité | Statut |
|-------|-----------|--------|
| useBotSelectionStore | UI only | Phase 1 |
| usePlayerStore | Minimal usage | Phase 1 |
| useGameStore.clock | Simple bool | Phase 1 |
| useGameStore.playerCount | Config | Phase 1 |
| useGameStore.seed | Config | Phase 1 |
| useGameStore.uiConfig | UI only | Phase 1 |
| useGameStore.initFlags | Coordination | Phase 1 |
| useGameStore.radius | **CRITICAL** | Phase 2 |
| useTileStore | **CRITICAL** | Phase 3 |
| useXFSMStore | Architecture | Phase 4 |
| useSharedWorkerStore | Keep | Final target |

---

## Current Progress
- [x] Analysis complete
- [x] Phase 1 complete (COMMIT 1: 8d87657)
- [x] Phase 2 complete (COMMIT 2: 6b69056)
- [x] Phase 3 complete (COMMIT 3: 19cb00f) - useTileStore removed from FSM guards/actions
- [x] Phase 4 complete (COMMIT 4: 6730496) - New hooks created, 6 composants migrés
- [x] Phase 5 in progress:
  - useActiveBots hook created
  - FSMVisualization.tsx fully migrated
  - TileMatrix.tsx fully migrated (no more getActor subscription)
  - All UI components now use unified hooks
