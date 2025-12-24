# FSM Core/Spatial Refactoring Progress

**Objectif:** Rendre le FSM pur (sans dépendances stores), connecter core/spatial proprement, R3F = affichage uniquement.

## Phase 1: Guards purs ✅ Terminé
- [x] Remplacer imports guards impurs → guards.pure.ts dans machine.pure.v5.ts
- [x] Ajouter `hasMoreCollectibleTiles` pure dans collection/guards.pure.ts
- [x] Ajouter `hasTilesAvailable` et `canStartExploring` pures dans evaluation/guards.pure.ts
- [x] Build vérifié OK

## Phase 2: Contexte FSM enrichi ✅ Terminé
- [x] Ajouter `gridInfo` au type FSMContext
- [x] Créer event TILES_UPDATED avec tiles, spacing, radius
- [x] Créer action updateGridInfo dans domains/global
- [x] Injecter tiles dans contexte au démarrage (useXFSMStore.startBot)
- [x] Build vérifié OK

## Phase 3: Initialisation simplifiée ✅ Terminé
- [x] Fournir positions initiales vehicle/drone directement dans startBot
- [x] Lire la depart tile depuis TileStore et envoyer SHIP/DRONE_INITIALIZE_REQUEST
- [x] initializationHandlers conservés comme fallback (non supprimés)
- [x] Build vérifié OK

## Phase 4: Actions pures ✅ Terminé
- [x] Découpler actions.assign.ts des stores (tous domaines)
- [x] Utiliser context.gridInfo au lieu de useTileStore.getState()
- [x] Garder useTileStore uniquement pour mutations (collectResources/deductResources)
- [x] Migrer evaluation/actions.effects.ts vers findTilesInRadius pure
- [x] Build vérifié OK

## Phase 5: Tests terminaux ✅ Terminé
- [x] machine.terminal.v5.ts mis à jour avec guards.pure.ts
- [x] Ajout updateGridInfo et TILES_UPDATED handler
- [x] Tests passent: initializing → evaluating → exploring → collecting → maintaining → evaluating
- [x] Success rate: 100%

## Phase 6: Cleanup final ✅ Terminé
- [x] Supprimer fichiers guards.ts impurs (6 fichiers)
- [x] Mettre à jour index.ts des domaines pour exporter guards.pure
- [x] Build vérifié OK (764 modules)
- [x] Tests terminaux passent

---

## Fichiers supprimés

| Fichier | Raison | Phase |
|---------|--------|-------|
| domains/collection/guards.ts | Remplacé par guards.pure.ts | 6 |
| domains/evaluation/guards.ts | Remplacé par guards.pure.ts | 6 |
| domains/exploration/guards.ts | Placeholder (pas de guards nécessaires) | 6 |
| domains/global/guards.ts | Placeholder (pas de guards nécessaires) | 6 |
| domains/initializing/guards.ts | Remplacé par guards.pure.ts | 6 |
| domains/maintenance/guards.ts | Remplacé par guards.pure.ts | 6 |

## Commits

| Phase | Hash | Message |
|-------|------|---------|
| 1 | bc9d93b | feat(fsm): replace impure guards with pure versions |
| 2 | fd86ff0 | feat(fsm): inject gridInfo into FSM context |
| 3 | 55a3106 | refactor(init): inject initial positions from startBot |
| 4 | 7b48fee | refactor(actions): decouple actions from store dependencies |
| 5 | cba8daa | feat(terminal): update terminal machine to use pure guards |
| 6 | - | chore: cleanup obsolete impure guards files |
