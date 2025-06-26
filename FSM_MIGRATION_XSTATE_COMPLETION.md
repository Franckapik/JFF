# Finalisation de la migration XState v5 + Zustand

Ce document complète le fichier `FSM_MIGRATION_PLAN_XSTATE_FINAL.md` avec les étapes finales de la migration.

## Étapes de finalisation

### 1. Suppression du FSMProvider (Complété)

Le `FSMProvider` basé sur React Context était maintenu pour assurer une transition en douceur, mais est désormais redondant avec notre store Zustand centralisé.

Actions réalisées :
- Suppression des références au `FSMProvider` dans `App.jsx`
- Toute la gestion des états FSM passe désormais uniquement par le store Zustand

### 2. Migration des composants restants

Pour tout composant qui utilise encore `useFSMContext` ou `useBotMachineShared`, suivre cette procédure :

```jsx
// AVANT
import { useFSMContext, useBotMachineShared } from "../ai/fsm/contexts/FSMContext";

const MonComposant = () => {
  const { current, send } = useBotMachineShared();
  // OU
  const fsm = useFSMContext();
  
  // ...
}

// APRÈS
import { useFSM } from "../hooks/useFSM";

const MonComposant = () => {
  const { fsmState, send } = useFSM();
  
  // ...
}
```

### 3. Détecter les utilisations restantes

Exécuter cette commande pour identifier les composants qui utilisent encore l'ancien système :

```bash
grep -r "useFSMContext\|useBotMachineShared" ./src
```

### 4. Suppression finale du FSMContext

Une fois que tous les composants sont migrés, supprimer complètement les fichiers suivants :
- `/src/ai/fsm/contexts/FSMContext.jsx`
- `/src/ai/fsm/contexts/FSMSyncContext.jsx`

### 5. Vérification de la migration

✅ Le store Zustand centralisé est correctement configuré avec XState v5
✅ `withContext` est correctement remplacé par `createActor(machine, { input: context })`
✅ Tous les composants partagent désormais le même état FSM
✅ Plus aucun usage du React Context pour la FSM

## Architecture finale

```
src/
  hooks/
    useFSM.js         # Hook unifié pour accéder à l'état FSM
  stores/
    useCentralFSMStore.js          # Store Zustand pour la FSM
    zustandXStateMiddleware.js     # Middleware d'intégration XState-Zustand
  ai/
    fsm/
      machine/
        fsmBotMachine.xstate.js    # Machine XState v5
        context/
          initialContext.js        # Contexte initial avec createEntityContext
```

## Avantages de l'architecture finale

1. **Centralisation complète** : Un seul store pour tous les états FSM
2. **Performances améliorées** : Moins de re-rendus grâce à Zustand
3. **Typage plus fort** : XState v5 apporte un meilleur typage TypeScript
4. **API simplifiée** : Un seul hook `useFSM` pour tous les besoins
5. **Gestion multi-bots** : Support des bots multiples avec un état partagé

## Exemples d'utilisation

```jsx
// Accès à un bot spécifique
const { fsmState, send, context } = useFSM('bot-1');

// Vérification d'un état
if (fsmState.matches('exploration.scanning')) {
  // ...
}

// Envoi d'un événement
send({ type: 'MOVE_FORWARD' });

// Accès au contexte
const { vehicle, resources } = context;

// Gestion des bots
const { allBots, addBot, removeBot } = useFSM();
```
