# Plan de Refactorisation du BotStore - Élimination de la Duplication des Files d'Actions

## 🎯 Objectif Principal

Éliminer la duplication critique entre la file d'actions globale (`actionQueue`) et les files d'actions par bot (`botStates[].actionQueue`) qui cause :
- **40+ actions `evaluateIdle` dupliquées** exécutées en boucle infinie (~1000ms)
- **États incohérents** : `botState: "idle"` (global) vs `botStates[0].botState: "exploring"` (per-bot)
- **Actions bloquées** : `exploreDrone` en `in_progress` permanent sans résolution

## 🔍 Analyse du Problème

### Architecture Actuelle Problématique
```
BotStore
├── actionQueue: []           ← GLOBAL (PROBLÈME)
├── botState: "idle"          ← GLOBAL (PROBLÈME)
└── botStates: {              ← PER-BOT (SOLUTION)
    0: {
      botState: "exploring",
      actionQueue: [...]
    }
}
```

### Source des Problèmes
1. **queueSlice.js** : Gère une file globale `actionQueue`
2. **stateTransitionSlice.js** : Gère un état global `botState` 
3. **botManagementSlice.js** : Gère des états per-bot `botStates[]`
4. **Incohérence** : Les slices se synchronisent mal entre eux

## 📋 Plan de Refactorisation Minimal

### Phase 1 : Élimination de la File Globale

#### 1.1 Modifier `queueSlice.js`
**OBJECTIF** : Supprimer `actionQueue` globale et rediriger vers `botStates[].actionQueue`

**CHANGES** :
- ❌ Supprimer : `actionQueue: []` 
- ✅ Modifier `addAction()` : utiliser `botStates[currentBotIndex].actionQueue`
- ✅ Modifier `updateActionStatus()` : utiliser `botStates[currentBotIndex].actionQueue`
- ✅ Ajouter getter `getActionQueue()` : retourne `botStates[currentBotIndex].actionQueue`

#### 1.2 Modifier `stateTransitionSlice.js`
**OBJECTIF** : Supprimer `botState` global et rediriger vers `botStates[].botState`

**CHANGES** :
- ❌ Supprimer : `botState: BOT_STATES.IDLE`
- ✅ Modifier `changeState()` : utiliser `botStates[currentBotIndex].botState`
- ✅ Ajouter getter `getBotState()` : retourne `botStates[currentBotIndex].botState`

#### 1.3 Modifier `executionSlice.js`
**OBJECTIF** : Utiliser les getters pour accéder aux files per-bot

**CHANGES** :
- ✅ Remplacer `get().actionQueue` par `get().getActionQueue()`
- ✅ Remplacer `get().botState` par `get().getBotState()`

### Phase 2 : Fix de la Boucle `evaluateIdle`

#### 2.1 Problème Identifié
```javascript
// botConditions.js ligne 649
if (atBase.result && botVehicle.fuel >= 100) {
  return {
    result: true,
    state: BOT_STATES.EXPLORING,
    action: { type: 'exploreDrone', priority: PRIORITY.MEDIUM },
    reason: "default_exploration"
  };
}
```

#### 2.2 Solution
**OBJECTIF** : Éviter l'ajout répétitif d'`evaluateIdle` 

**CHANGES** :
- ✅ Ajouter condition de garde dans `evaluateConditionsFromIdleAction.js`
- ✅ Vérifier si une action `evaluateIdle` est déjà en cours
- ✅ Throttle l'évaluation à maximum 1 fois par seconde

### Phase 3 : Synchronisation des États

#### 3.1 Modifier `botManagementSlice.js`
**OBJECTIF** : S'assurer que `switchActiveBot()` synchronise correctement

**CHANGES** :
- ✅ Supprimer la sauvegarde/restauration de `actionQueue` globale
- ✅ Supprimer la sauvegarde/restauration de `botState` global
- ✅ Utiliser uniquement `botStates[botIndex]` comme source de vérité

#### 3.2 Ajouter Méthodes de Validation
**OBJECTIF** : Détecter les incohérences résiduelles

**CHANGES** :
- ✅ Ajouter `validateBotState()` : vérifie la cohérence
- ✅ Ajouter `debugBotState()` : logs pour le débogage

## 🔧 Implémentation Détaillée

### Étape 1 : Refactoring de `queueSlice.js`

```javascript
// AVANT (PROBLÉMATIQUE)
export const createQueueSlice = (set, get) => ({
  actionQueue: [], // ← SUPPRIMER
  
  addAction: (actionType, priority = PRIORITY.MEDIUM, params = {}) => {
    // ... logique utilisant state.actionQueue
  }
});

// APRÈS (SOLUTION)
export const createQueueSlice = (set, get) => ({
  // Getter pour accéder à la file du bot actif
  getActionQueue: () => {
    const { currentBotIndex, botStates } = get();
    return botStates[currentBotIndex]?.actionQueue || [];
  },
  
  addAction: (actionType, priority = PRIORITY.MEDIUM, params = {}) => {
    const { currentBotIndex } = get();
    // ... logique utilisant botStates[currentBotIndex].actionQueue
  }
});
```

### Étape 2 : Refactoring de `stateTransitionSlice.js`

```javascript
// AVANT (PROBLÉMATIQUE)
export const createStateTransitionSlice = (set, get) => ({
  botState: BOT_STATES.IDLE, // ← SUPPRIMER
  
  changeState: (newState) => {
    const currentState = get().botState; // ← PROBLÈME
    // ...
  }
});

// APRÈS (SOLUTION)
export const createStateTransitionSlice = (set, get) => ({
  // Getter pour accéder à l'état du bot actif
  getBotState: () => {
    const { currentBotIndex, botStates } = get();
    return botStates[currentBotIndex]?.botState || BOT_STATES.IDLE;
  },
  
  changeState: (newState) => {
    const currentState = get().getBotState(); // ← SOLUTION
    const { currentBotIndex, botStates } = get();
    // ... mise à jour de botStates[currentBotIndex].botState
  }
});
```

### Étape 3 : Fix de la Boucle `evaluateIdle`

```javascript
// evaluateConditionsFromIdleAction.js
export const evaluateConditionsFromIdleAction = (playerStore, tileStore, addAction, changeState) => {
  // NOUVEAU : Vérifier si evaluateIdle est déjà en cours
  const actionQueue = useBotStore.getState().getActionQueue();
  const hasEvaluateIdle = actionQueue.some(action => 
    action.type === 'evaluateIdle' && 
    (action.status === 'pending' || action.status === 'in_progress')
  );
  
  if (hasEvaluateIdle) {
    fsmLogger.action('evaluateIdle already in queue, skipping duplicate');
    return true;
  }
  
  // ... reste de la logique existante
};
```

## 🧪 Tests de Validation

### Test 1 : Unicité des Files d'Actions
```javascript
// Vérifier qu'il n'y a plus de duplication
expect(botStore.actionQueue).toBeUndefined(); // File globale supprimée
expect(botStore.getActionQueue()).toBeDefined(); // Getter fonctionne
expect(botStore.botStates[0].actionQueue).toBeDefined(); // File per-bot existe
```

### Test 2 : Cohérence des États
```javascript
// Vérifier la cohérence entre les états
const globalState = botStore.getBotState();
const perBotState = botStore.botStates[botStore.currentBotIndex].botState;
expect(globalState).toBe(perBotState);
```

### Test 3 : Arrêt de la Boucle `evaluateIdle`
```javascript
// Vérifier qu'il n'y a qu'un seul evaluateIdle max
const evaluateIdleActions = botStore.getActionQueue()
  .filter(action => action.type === 'evaluateIdle');
expect(evaluateIdleActions.length).toBeLessThanOrEqual(1);
```

## 📝 Checklist d'Implémentation

### Phase 1 - Élimination de la File Globale
- [ ] 1.1 Modifier `queueSlice.js` - supprimer `actionQueue` globale
- [ ] 1.2 Ajouter `getActionQueue()` getter dans `queueSlice.js`
- [ ] 1.3 Modifier `addAction()` pour utiliser `botStates[]`
- [ ] 1.4 Modifier `updateActionStatus()` pour utiliser `botStates[]`
- [ ] 1.5 Modifier `stateTransitionSlice.js` - supprimer `botState` global
- [ ] 1.6 Ajouter `getBotState()` getter dans `stateTransitionSlice.js`
- [ ] 1.7 Modifier `changeState()` pour utiliser `botStates[]`
- [ ] 1.8 Mettre à jour `executionSlice.js` pour utiliser les getters

### Phase 2 - Fix Boucle evaluateIdle
- [ ] 2.1 Ajouter garde contre duplication dans `evaluateConditionsFromIdleAction.js`
- [ ] 2.2 Implémenter throttling pour `evaluateIdle`
- [ ] 2.3 Tester l'arrêt de la boucle infinie

### Phase 3 - Synchronisation
- [ ] 3.1 Nettoyer `switchActiveBot()` dans `botManagementSlice.js`
- [ ] 3.2 Ajouter méthodes de validation
- [ ] 3.3 Tests de régression complets

### Phase 4 - Validation
- [ ] 4.1 Exécuter tous les tests existants
- [ ] 4.2 Vérifier le log.md pour absence de duplication
- [ ] 4.3 Test manuel du comportement FSM
- [ ] 4.4 Performance check (pas de boucles infinies)

## ⚠️ Précautions

1. **Préserver la logique FSM existante** : Ne pas modifier les conditions ou les actions
2. **Compatibilité MultiBotManager** : S'assurer que `processAllBots()` fonctionne
3. **Tests existants** : Tous les tests doivent passer après refactoring
4. **Performance** : Pas de régressions de performance
5. **Backward compatibility** : Les composants utilisant le store ne doivent pas casser

## 🎯 Résultat Attendu

Après implémentation :
- ✅ **Une seule file d'actions par bot** dans `botStates[].actionQueue`
- ✅ **Un seul état par bot** dans `botStates[].botState` 
- ✅ **Arrêt de la boucle `evaluateIdle`** infinie
- ✅ **Cohérence parfaite** entre états et actions
- ✅ **Performance améliorée** : pas de cycles CPU inutiles
- ✅ **Logs propres** : pas de duplication d'actions dans log.md

Cette refactorisation minimal élimine la source principale des problèmes tout en préservant la logique FSM existante et la compatibilité avec le reste du système.
