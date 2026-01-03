# 🔍 Diagnostic: Logs TRACKER-CORE invisibles dans Front-End

## État Actuel

**Console Ninja ne montre PAS les logs `[TRACKER-CORE]`** alors que :
- ✅ `config.enableVerboseTracking = true` (confirmé dans [src/config.ts](src/config.ts))
- ✅ Le hook `useSimulatedTracker` reçoit `verbose: true` (confirmé dans [src/App.tsx](src/App.tsx))
- ✅ Le hook passe `verbose` à `getScheduledEvents()` (confirmé ligne 113 du hook)
- ✅ Le script Node.js affiche correctement les logs

## Logs Visibles dans Console Ninja

Seuls ces logs apparaissent :
```
🤖 [useSimulatedTracker] Starting...
🔵 INFO [Evaluating] Conditions
🔵 INFO [Evaluating] → Testing NEED_COLLECTING
```

**Les logs du core (`[TRACKER-CORE]`) sont absents.**

## Hypothèses

### Hypothèse 1: Les console.log avec eslint-disable ne fonctionnent pas ❌

Les logs dans `simulatedTrackerCore.ts` ont tous :
```typescript
if (verbose) {
  // eslint-disable-next-line no-console
  console.log(`\n🔍 [TRACKER-CORE] drone_deploying...`);
}
```

**Mais ESLint ne devrait pas bloquer l'exécution**, seulement le linting.

### Hypothèse 2: Console Ninja filtre ces logs ⚠️

Console Ninja pourrait avoir un filtre actif qui cache certains logs. Les logs visibles proviennent tous de `fsmLogger.ts`, pas de `console.log` directs.

### Hypothèse 3: Les événements ne sont pas déclenchés 🎯 **PROBABLE**

Si le tracker ne reçoit pas de changements d'état, il ne planifie aucun événement, donc aucun log.

**Vérification:** Le log `🤖 [useSimulatedTracker] Starting...` apparaît, ce qui prouve que le hook s'exécute.

**Mais il n'y a aucun log d'envoi d'événement** (`🤖 [TRACKER] Sending: ...`), ce qui suggère que le tracker ne planifie rien.

## Test de Validation

Pour confirmer que les logs fonctionnent, ajoutons un log de debug supplémentaire :

### Modification 1: Ajouter un log au début de getScheduledEvents

```typescript
// Dans simulatedTrackerCore.ts, fonction getScheduledEvents
export function getScheduledEvents(
  snapshotValue: string | object,
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('\n🔍 [TRACKER-CORE] getScheduledEvents called', {
      state: JSON.stringify(snapshotValue),
      verbose
    });
  }
  
  const { mainState, subState } = detectCurrentState(snapshotValue);
  // ...
}
```

Cela permettra de confirmer :
1. Si `getScheduledEvents` est appelé
2. Si `verbose` est bien `true`
3. Si les logs passent par Console Ninja

### Modification 2: Ajouter un log dans scheduleEvent

```typescript
// Dans useSimulatedTracker.ts
const scheduleEvent = (event: MachineEvents, delay: number, reason?: string): void => {
  const eventType = event.type;
  
  // eslint-disable-next-line no-console
  console.log(`📌 [TRACKER] Scheduling ${eventType} in ${delay}ms (verbose=${verbose})`);
  
  // Éviter les doublons
  if (pendingEvents.has(eventType)) {
    return;
  }
  // ...
}
```

### Modification 3: Vérifier dans browser DevTools

**Au lieu de se fier uniquement à Console Ninja**, ouvrir :
1. Chrome DevTools (F12)
2. Onglet Console
3. Filtrer par `TRACKER-CORE`

Si les logs apparaissent dans DevTools mais pas dans Console Ninja, c'est un problème de filtrage de l'extension.

## Script de Test Rapide

Pour vérifier si le problème vient du front ou de Console Ninja :

```bash
# Terminal 1: Lancer le front
npm run dev

# Terminal 2: Observer les logs en temps réel (si possible)
# Ou ouvrir Chrome DevTools → Console → Filtrer TRACKER-CORE
```

Ensuite, observer si des événements sont envoyés (on devrait voir le cycle exploring démarrer).

## Conclusion Provisoire

Le problème est probablement l'un des suivants :
1. **Console Ninja filtre les logs** → Solution: Vérifier dans DevTools
2. **Le tracker ne reçoit pas de changements d'état** → Solution: Vérifier que la FSM démarre correctement
3. **Les timers ne se déclenchent pas** → Solution: Ajouter des logs dans `scheduleEvent`

**Action immédiate recommandée:** Ajouter les logs de debug proposés ci-dessus pour identifier exactement où le flux s'arrête.
