# RELOCATING State Migration Progress

## Objectif
Déplacer l'état `relocating` (actuellement au niveau root) comme sous-état de `maintaining` avec une architecture event-driven complète.

## Architecture Cible
```
evaluating → NEED_RELOCATING → maintaining.relocating → SHIP_REACHES_TILE → (maintenance checks ou evaluating)
```

## Changements

### Phase 1: Événements ✅
- [x] Ajouter `NEED_RELOCATING` dans `events.d.ts`

### Phase 2: Machine FSM ✅
- [x] Ajouter transition `NEED_RELOCATING` dans `evaluating.on` (haute priorité)
- [x] Supprimer l'état root `relocating`
- [x] Supprimer la transition `NEED_SHIP_RELOCATION`
- [x] Ajouter sous-état `relocating` dans `maintaining.states`
- [x] Supprimer les transitions `always` de `maintaining` (event-driven)

### Phase 3: Actions ✅
- [x] Modifier `onEvaluatingEntry` pour envoyer `NEED_RELOCATING` en priorité
- [x] Ajouter `onShipRelocatingEntry` / `onShipRelocatingExit`
- [x] Exporter nouvelles actions

### Phase 4: Tracker ✅
- [x] Mettre à jour tracker pour `maintaining.relocating`
- [x] Supprimer case 'relocating' top-level

### Phase 5: UI ✅
- [x] Ajouter `relocating` dans FSMVisualization (getStateInfo)
- [x] Ajouter `relocating` dans stateVisitCounts
- [x] Ajouter `relocating` dans renderSubstates pour maintaining

## Tests
- [ ] npm run dev:all
- [ ] Vérifier logs du terminal
