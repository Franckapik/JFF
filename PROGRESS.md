# 🚀 Intégration Tracker Simulé : Test ↔ Front

**Objectif** : Partager le code core entre le test autonome et le front React/R3F via ts-node

## ✅ Étapes

- [ ] 1. Setup : ts-node + PROGRESS.md
- [ ] 2. Core : `simulatedTrackerCore.ts` (logique pure partagée)
- [ ] 3. Mock : `mockData.ts` (données partagées)
- [ ] 4. Test : Adapter `test-fsm-autonomous` en TypeScript
- [ ] 5. React : Hook `useSimulatedTracker`
- [ ] 6. App : Intégrer tracker + config `testMode`
- [ ] 7. UI : Enrichir `FSMVisualization` (comparaison)
- [ ] 8. Validation : Convergence test vs front

## 📂 Fichiers créés

- `src/ai/fsm/machineX/shared/simulatedTrackerCore.ts`
- `src/ai/fsm/machineX/test/mockData.ts`
- `src/ai/fsm/machineX/hooks/trackers/useSimulatedTracker.ts`
- `scripts/test-fsm-autonomous.ts` (renommé)

## 🔧 Modifications

- `package.json` (ts-node scripts)
- `src/App.tsx` (intégration tracker)
- `src/config.ts` (flag testMode)
- `src/components/FSMVisualization.tsx` (métriques)

## 🎯 Validation

**Critères** :
- ✅ Même séquence d'états (test vs front)
- ✅ Timings similaires (±15%)
- ✅ Pas d'états bloqués
- ✅ Contexte cohérent (fuel, damage, capacity)

---

**Progression** : En cours...
