# 🎯 Refactoring: Standardisation sur GridCoordinate

**Date de début:** 4 janvier 2026  
**Objectif:** Simplifier l'architecture de coordonnées en utilisant GridCoordinate dans toute la logique métier, WorldPosition uniquement pour le rendu R3F

## 📋 Vue d'ensemble

### Problème actuel
- Architecture hybride avec 4 formats de coordonnées (GridCoordinate, WorldPosition, WorldGridPosition, ColRow)
- Conversions répétées entre formats dans FSM, guards, actions
- WorldGridPosition stocke données redondantes (x,y,z + coord)
- ~50 points de conversion/seconde impactant performance

### Solution proposée
1. **Business Logic (FSM, stores, pathfinding):** GridCoordinate uniquement
2. **Rendering (R3F, animations):** WorldPosition (conversion à la frontière)
3. **UI/Debugging:** ColRow pour lisibilité humaine (non utilisé en interne)

### Effort estimé
- 10-15 heures de refactoring
- Risque: faible (changements additifs, types stricts)

---

## 🚀 Progression

### ✅ Étape 0: Setup et analyse
- [x] Création todolist
- [x] Création fichier de progression
- [x] Analyse types existants

### ✅ Étape 1: Core Spatial - Nouvelles fonctions
- [x] Ajout calculateDistanceGrid()
- [x] Ajout hasReachedTargetGrid()
- [x] Ajout calculateManhattanDistanceGrid()
- [x] Export depuis index.ts
- [x] Tests TypeScript (pas d'erreurs nouvelles)
- [x] **Commit:** feat(spatial): Add GridCoordinate distance functions

### ✅ Étape 2: Types FSM
- [x] Modification vehicle.d.ts (VehicleState)
- [x] Modification drone.d.ts (DroneState)
- [x] Validation types
- [x] **Commit:** refactor(fsm): Use GridCoordinate in vehicle/drone state and actions

### ✅ Étape 3: Actions FSM - Global et Initializing
- [x] Domain global (updateShipPosition, updateDronePosition)
- [x] Domain initializing (processShipInitRequest, processDroneInitRequest)
- [x] Guards initializing

### ✅ Étape 4: Actions FSM - Exploration, Collection, Maintenance
- [x] Domain exploration
- [x] **Commit:** refactor(fsm/exploration): Use GridCoordinate in all exploration actions
- [x] Domain collection  
- [x] **Commit:** refactor(fsm/collection): Use GridCoordinate in all collection actions
- [x] Domain maintenance
- [x] **Commit:** refactor(fsm/maintenance): Use GridCoordinate in maintenance domain
- [x] Toutes les actions FSM utilisent maintenant GridCoordinate

### 🔄 Étape 5: Tests, mocks et components  
- [ ] Fixer simulatedTrackerCore.ts
- [ ] Fixer test/mockData.ts
- [ ] Fixer FSMVisualization.tsx (conversion boundary)
- [ ] Fixer erreurs fsmLogger (init method)

### 🔄 Étape 4: Guards
- [ ] Evaluation guards
- [ ] Collection guards
- [ ] Maintenance guards

### 🔄 Étape 5: Animation Hooks
- [ ] useShipAnimation
- [ ] useDroneAnimation
- [ ] Conversion boundary

### 🔄 Étape 6: UI Enhancement
- [ ] FSMVisualization
- [ ] fsmLogger
- [ ] Tooltips

### 🔄 Étape 7: Validation
- [ ] TypeScript compilation
- [ ] Tests runtime
- [ ] Documentation

---

## 📝 Commits

### Commit 1: Core spatial - Add GridCoordinate distance functions
- Fichiers: `src/core/spatial/distance.ts`
- Changements: Ajout calculateDistanceGrid, hasReachedTargetGrid

### Commit 2: Types - Standardize FSM context on GridCoordinate
- Fichiers: `src/types/xstate.v5.types.ts`
- Changements: Remplacement WorldGridPosition par GridCoordinate

### Commit 3: Actions - Refactor global domain
- Fichiers: `src/ai/fsm/machineX/domains/global/actions.assign.ts`
- Changements: Simplification assignShipPositionContext

### Commit 4: Actions - Refactor exploration domain
- Fichiers: `src/ai/fsm/machineX/domains/exploration/actions.assign.ts`
- Changements: Simplification assignDroneDeployingContext

### Commit 5: Actions - Refactor collection/maintenance domains
- Fichiers: `domains/collection/actions.assign.ts`, `domains/maintenance/actions.assign.ts`
- Changements: Standardisation GridCoordinate

### Commit 6: Guards - Use GridCoordinate distance functions
- Fichiers: `domains/*/guards.pure.ts`
- Changements: Remplacement calculateDistance par calculateDistanceGrid

### Commit 7: Animations - Add conversion boundary
- Fichiers: `src/animations/useShipAnimation.ts`, `src/animations/useDroneAnimation.ts`
- Changements: Conversion GridCoordinate → WorldPosition en début de hook

### Commit 8: UI - Enhance ColRow usage for debugging
- Fichiers: `src/components/FSMVisualization.tsx`, `src/logger/fsmLogger.ts`
- Changements: Ajout gridToColRow dans affichages debug

### Commit 9: Fix TypeScript errors
- Fichiers: Divers selon erreurs tsc
- Changements: Corrections types

### Commit 10: Documentation
- Fichiers: `docs/COLROW_ARCHITECTURE.md`
- Changements: Mise à jour architecture

---

## 🐛 Problèmes rencontrés

_Aucun pour le moment_

---

## 📊 Métriques

- **Conversions éliminées:** TBD
- **Fichiers modifiés:** 0/~15
- **Erreurs TypeScript:** 0
- **Tests réussis:** TBD

---

## 🎯 Prochaines étapes

1. Analyser les types existants dans xstate.v5.types.ts
2. Créer les variantes GridCoordinate dans distance.ts
3. Commencer refactoring des types FSM
