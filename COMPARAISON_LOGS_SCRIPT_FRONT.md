# 📊 Comparaison Logs: Script Test vs Front-End React

**Date:** 1 janvier 2026 17:06  
**Durée du test:** 15 secondes  
**Status:** ⚠️ Logs TRACKER-CORE non visibles dans Console Ninja

---

## 🔍 Analyse Console Ninja (Front-End)

### Logs Disponibles (Front)
Console Ninja montre principalement des logs du FSMLogger et d'initialisation :

```
17:06:33.421 - [Evaluating] → Testing NEED_COLLECTING (exploration may be complete)
17:06:33.353 - 🤖 [useSimulatedTracker] Starting...
17:06:33.255 - [Evaluating] Conditions: {
  "fuel": 100,
  "damage": 0,
  "needsMaintenance": false,
  "hasCollectibleTiles": false,
  "isShipNotFull": true,
  "isDroneAvailable": false,
  "explorationQueueLength": 0,
  "droneState": "uninitialized"
}
```

### ❌ Problème Identifié

**Les logs `[TRACKER-CORE]` ne sont PAS visibles dans Console Ninja.**

Raisons possibles :
1. Les `console.log` avec `eslint-disable` dans `simulatedTrackerCore.ts` ne sont peut-être pas actifs
2. Le `verbose` flag n'est peut-être pas passé correctement au tracker React
3. Les logs sont peut-être filtrés par Console Ninja

---

## ✅ Logs Script Test (Node.js)

Le script de test fonctionne correctement et affiche les logs `[TRACKER-CORE]` :

```bash
$ npm run test:fsm-autonomous -- --duration=15000 --verbose

🔍 [TRACKER-CORE] drone_deploying to 2,0
🔍 [TRACKER-CORE] drone_scanning (800ms)
🔍 [TRACKER-CORE] drone_returning to base
🔍 [TRACKER-CORE] drone_deploying to 1,1
🔍 [TRACKER-CORE] drone_scanning (800ms)
🔍 [TRACKER-CORE] drone_returning to base
🔍 [TRACKER-CORE] drone_deploying to 1,1
🔍 [TRACKER-CORE] drone_scanning (800ms)
...
```

**Séquence observée (15s):**
- exploring:drone_deploying → drone_scanning → drone_returning
- Cycles répétés 3x
- Les durées et distances sont calculées dynamiquement

---

## 🔧 Actions Correctives Nécessaires

### 1. Vérifier que le verbose flag est activé dans le front

Le hook `useSimulatedTracker` doit recevoir `verbose: true` depuis la configuration.

**Fichier:** [src/ai/fsm/machineX/hooks/trackers/useSimulatedTracker.ts](src/ai/fsm/machineX/hooks/trackers/useSimulatedTracker.ts)

```typescript
// Dans useEffect:
const options = {
  verbose: config.enableVerboseTracking, // ← Doit être true
};
```

**Fichier:** [src/config.ts](src/config.ts)

```typescript
export default {
  enableVerboseTracking: true, // ← Vérifié: déjà à true
}
```

### 2. Vérifier que les console.log sont bien appelés

Dans [simulatedTrackerCore.ts](src/ai/fsm/machineX/shared/simulatedTrackerCore.ts), tous les logs ont `eslint-disable-next-line no-console` mais **ne sont pas conditionnés par `if (verbose)`**.

**Problème identifié:** Certains logs n'ont pas le check `if (verbose)` avant le `console.log`.

### 3. Console Ninja peut-être en train de filtrer les logs

Console Ninja affiche seulement 3 logs (Evaluating, useSimulatedTracker Starting, Conditions). Il ne montre pas les logs du tracker core.

---

## 📋 Plan de Correction

### Étape 1: Vérifier que verbose est passé correctement

```typescript
// Dans useSimulatedTracker.ts
const scheduledEvents = getScheduledEvents(
  snapshot.value,
  snapshot.context,
  options.verbose // ← Doit être true
);
```

### Étape 2: Ajouter un log de debug initial

Dans `useSimulatedTracker.ts`, ajouter après le démarrage :

```typescript
if (verbose) {
  console.log('[useSimulatedTracker] Verbose mode active, core logs should appear');
}
```

### Étape 3: Tester manuellement dans le browser console

Ouvrir DevTools → Console → Filtrer par `TRACKER-CORE` pour voir si les logs apparaissent directement dans le browser (pas seulement Console Ninja).

---

## 🎯 Validation Attendue

Une fois corrigé, nous devrions voir dans Console Ninja :

```
[useSimulatedTracker] Starting...
[useSimulatedTracker] Verbose mode active
🔍 [TRACKER-CORE] drone_deploying to 2,0 (2.00u, 1333ms)
🔍 [TRACKER-CORE] drone_scanning (800ms)
🔍 [TRACKER-CORE] drone_returning to base (2.00u, 1333ms)
🚢 [TRACKER-CORE] ship_moving_to_tile 2,0 (2.00u, 1333ms)
🚢 [TRACKER-CORE] ship_collecting (1200ms)
...
```

**Et la séquence devrait être IDENTIQUE au script de test.**

---

## 📝 Conclusion Actuelle

❌ **Comparaison impossible pour le moment** car les logs `[TRACKER-CORE]` ne sont pas visibles dans le front-end.

✅ **Le script de test fonctionne correctement** avec tous les logs affichés.

🔧 **Action requise:** Déboguer pourquoi les logs du tracker core ne s'affichent pas dans l'application React alors que `enableVerboseTracking = true`.

---

**Prochaine étape:** Corriger le passage du flag `verbose` et vérifier que les logs apparaissent dans la console du browser.
