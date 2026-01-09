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
- [ ] Composants lisent context.gameConfig en parallèle des stores
- [ ] **COMMIT 1**

## Phase 2: Radius critique → FSM context
- [ ] Ajouter `explorationRadius` dans FSMContext.config (déjà présent ✓)
- [ ] Remplacer appel `useGameStore.getState().getExplorationRadius()` par context
- [ ] Événement `RADIUS_UPDATE` pour sync depuis UI
- [ ] Action `assignRadiusUpdate` 
- [ ] Worker envoie radius via INIT message
- [ ] **COMMIT 2**

## Phase 3: TileStore utilities → pure functions
- [ ] Créer `src/core/spatial/pure/pathfinding.ts` (findPath, calculatePathDistance)
- [ ] Créer `src/core/spatial/pure/tileQueries.ts` (getWalkableTiles, tileInRadius)
- [ ] Worker importe directement ces modules purs
- [ ] FSM actions/guards utilisent context.gridInfo.tiles + fonctions pures
- [ ] **COMMIT 3**

## Phase 4: XFSMStore → Worker pattern unifié
- [ ] Composants s'abonnent via useSharedWorkerStore
- [ ] Hook `useFSMContext(botId)` retourne context depuis worker
- [ ] Supprimer dépendance XFSMStore dans composants critiques
- [ ] **COMMIT 4**

## Phase 5: Bascule finale
- [ ] Désactiver stores Zustand (flag LEGACY_STORES=false)
- [ ] Vérifier tous les composants utilisent context FSM
- [ ] Tests manuels validation complète
- [ ] **COMMIT 5**

## Phase 6: Cleanup
- [ ] Supprimer fichiers stores Zustand
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
- [ ] Phase 1 in progress
