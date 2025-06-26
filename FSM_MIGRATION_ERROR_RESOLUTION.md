# Résolution des erreurs XState v5 + Zustand

Ce document décrit les problèmes rencontrés lors de la migration vers XState v5 + Zustand et les solutions appliquées.

## Problèmes rencontrés et solutions

### 1. Erreur: `Cannot read properties of undefined (reading 'botStates')`

**Problème**: 
Dans `useCentralFSMStore.js`, lors de la mise à jour de l'état, `state.botStates` était undefined lors du premier appel.

**Solution**:
Ajout d'une protection avec l'opérateur de coalescence pour initialiser un objet vide:
```javascript
set((state) => ({
  botStates: {
    ...(state.botStates || {}),
    [botId]: snapshot
  }
}));
```

### 2. Erreur: `useFSMSync must be used within an FSMSyncProvider`

**Problème**:
Le composant `FusedBotManagerHUD` utilise encore `useCentralizedEventHistorySync` qui dépend de `useFSMSync`.

**Solution**:
1. Restauration temporaire du `FSMSyncProvider` dans `App.jsx`
2. Création d'une version de compatibilité qui utilise le store centralisé
3. Mise à jour de `FSMSyncContext.jsx` pour qu'il se connecte au store centralisé

### 3. Avertissement: `The result of getSnapshot should be cached to avoid an infinite loop`

**Problème**:
Dans `useFSM.js`, les sélecteurs passés à `useCentralFSMStore` n'étaient pas mémorisés.

**Solution**:
Utilisation de `useCallback` et `useMemo` pour mémoriser les sélecteurs et éviter les re-rendus infinis:
```javascript
const getBotStateSelector = useCallback((state) => state.getBotState(botId), [botId]);
const fsmState = useCentralFSMStore(getBotStateSelector);
```

### 4. Problème avec `withContext` qui n'existe pas dans XState v5

**Problème**:
La méthode `.withContext()` n'existe plus dans XState v5.

**Solution**:
Utilisation de `createActor` avec l'option `input` pour injecter le contexte initial:
```javascript
const actor = createActor(fsmBotMachine, {
  input: botContext
});
```

## Plan de compatibilité pour les anciens composants

Pour maintenir la compatibilité avec les composants existants qui utilisent l'ancien système FSM:

1. **FSMSyncProvider**: Adapté pour utiliser le store centralisé tout en préservant l'API originale
2. **useBotMachineCompat.js**: Nouveau hook de compatibilité qui utilise le store centralisé
3. **Redirection des imports**: Les imports de `useBotMachine` pointent maintenant vers la version compatible

## Prochaines étapes

1. Finaliser la migration de `FusedBotManagerHUD` pour utiliser directement `useFSM`
2. Supprimer progressivement les outils de compatibilité une fois que tous les composants sont migrés
3. Nettoyer le code redondant (FSMContext, FSMSyncContext, etc.)
4. Effectuer des tests complets pour valider la stabilité de la nouvelle architecture
