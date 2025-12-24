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

## Phase 4: Actions pures
- [ ] Découpler actions.assign.ts des stores (tous domaines)
- [ ] Utiliser context.gridInfo au lieu de useTileStore.getState()

## Phase 5: Tests terminaux
- [ ] Créer scripts/diagnose-fsm-blocked.js
- [ ] Valider cycle: initializing → evaluating → exploring → collecting → evaluating

## Phase 6: Cleanup final
- [ ] Supprimer fichiers obsolètes listés
- [ ] Vérifier build + lint
- [ ] Commit final

---

## Fichiers supprimés

| Fichier | Raison | Phase |
|---------|--------|-------|
| (à remplir) | | |

## Commits

| Phase | Hash | Message |
|-------|------|---------|
| 1 | - | feat(fsm): replace impure guards with pure versions |
| 2 | - | feat(fsm): inject gridInfo into FSM context |
| 3 | - | refactor(init): simplify initialization, remove init handlers |
| 4 | - | refactor(actions): decouple assign actions from stores |
| 5 | - | test(fsm): add terminal diagnostic script |
| 6 | - | chore: cleanup obsolete files |
