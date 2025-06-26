# Plan de migration complet XState v5 + Store Zustand

> Ce plan de migration est optimisé pour être exécuté par l'IA, avec des instructions précises pour transformer la FSM actuelle vers XState v5 avec un store Zustand centralisé.

## Diagnostic de l'état actuel

**Problème identifié :** Les HUDs (`CentralFSMHud` et `BotInstanceXStateTest`) montrent des états différents car:
1. Les composants utilisent des instances de machines indépendantes
2. Il n'y a pas de store centralisé pour les états FSM
3. La migration est incomplète et mélange architectures robot3 et XState

## 1. Création du middleware Zustand-XState

Créer `/src/stores/zustandXStateMiddleware.js`:

```javascript
import { createActor } from 'xstate';

/**
 * Middleware intégrant XState dans Zustand
 * @param {StateMachine} machine - Machine XState à utiliser
 * @param {string} stateKey - Clé pour stocker la machine dans l'état Zustand
 */
export const zustandXStateMiddleware = (machine, stateKey = 'fsm') => (config) => (set, get, api) => {
  // Créer l'acteur initial
  const actor = createActor(machine);
  
  // Fonction pour mettre à jour le store quand la machine change d'état
  const updateStore = () => {
    const snapshot = actor.getSnapshot();
    set({
      [stateKey]: snapshot
    });
  };
  
  // Abonnement aux changements d'état
  actor.subscribe(updateStore);
  
  // Démarrer la machine
  actor.start();
  
  // Récupérer le store de base
  const store = config(set, get, api);
  
  // Retourner le store enrichi avec la machine et l'acteur
  return {
    ...store,
    [stateKey]: actor.getSnapshot(),
    actor,
    send: (event) => {
      actor.send(event);
    },
    dispose: () => {
      actor.stop();
    },
  };
};
```

## 2. Création du store FSM centralisé

Créer `/src/stores/useCentralFSMStore.js`:

```javascript
import { create } from 'zustand';
import { zustandXStateMiddleware } from './zustandXStateMiddleware';
import fsmBotMachine from '../ai/fsm/machine/fsmBotMachine.xstate';

// Store Zustand centralisé avec middleware XState
export const useCentralFSMStore = create(
  zustandXStateMiddleware(fsmBotMachine, 'fsm')((set, get) => ({
    // Ajoutez ici d'autres slices ou actions globales si besoin
  }))
);
```

## 3. Création du hook unifié d'accès à la FSM

Créer `/src/hooks/useFSM.js`:

```javascript
import { useCentralFSMStore } from '../stores/useCentralFSMStore';

/**
 * Hook pour accéder facilement à l'état et aux actions de la machine FSM centrale
 */
export function useFSM() {
  const fsmState = useCentralFSMStore((state) => state.fsm);
  const send = useCentralFSMStore((state) => state.send);
  return { fsmState, send };
}
```

## 4. Extension du système pour gérer plusieurs bots

Modifier `/src/stores/useCentralFSMStore.js`:

```javascript
import { create } from 'zustand';
import { createActor } from 'xstate';
import fsmBotMachine from '../ai/fsm/machine/fsmBotMachine.xstate';
import { initialBotContext } from '../ai/fsm/machine/context/initialContext';

// Store Zustand centralisé pour plusieurs bots
export const useCentralFSMStore = create((set, get) => {
  // Map pour stocker les acteurs par botId
  const actors = new Map();
  
  // Fonction pour créer un acteur avec un contexte spécifique à un bot
  const createBotActor = (botId) => {
    // Créer contexte spécifique pour ce bot (avec ID, position, etc.)
    const botContext = { 
      ...initialBotContext,
      bot: { id: botId, type: 'auto' }
    };
    
    // Créer une machine avec le contexte spécifique
    const botMachine = fsmBotMachine.withContext(botContext);
    
    // Créer l'acteur
    const actor = createActor(botMachine);
    
    // Configurer l'abonnement aux changements
    actor.subscribe((snapshot) => {
      set((state) => ({
        botStates: {
          ...state.botStates,
          [botId]: snapshot
        }
      }));
    });
    
    // Démarrer l'acteur
    actor.start();
    
    // Stocker l'acteur dans la map
    actors.set(botId, actor);
    
    return actor;
  };
  
  // Créer l'acteur par défaut
  const defaultActor = createBotActor('main');
  
  return {
    // État initial des bots
    botStates: { 
      main: defaultActor.getSnapshot()
    },
    
    // État FSM principal (pour compatibilité)
    fsm: defaultActor.getSnapshot(),
    
    // Fonctions pour manipuler les bots
    send: (event, botId = 'main') => {
      const actor = actors.get(botId) || actors.get('main');
      actor.send(event);
    },
    
    // Ajouter un bot
    addBot: (botId) => {
      if (!actors.has(botId)) {
        createBotActor(botId);
      }
    },
    
    // Supprimer un bot
    removeBot: (botId) => {
      if (botId === 'main') return; // Empêcher la suppression du bot principal
      
      const actor = actors.get(botId);
      if (actor) {
        actor.stop();
        actors.delete(botId);
        
        set((state) => {
          const { [botId]: _, ...rest } = state.botStates;
          return { botStates: rest };
        });
      }
    },
    
    // Récupérer tous les bots
    getBots: () => Object.keys(get().botStates),
    
    // Récupérer l'état d'un bot spécifique
    getBotState: (botId = 'main') => get().botStates[botId] || get().botStates.main
  };
});
```

## 5. Amélioration du hook useFSM pour supporter les bots

Modifier `/src/hooks/useFSM.js`:

```javascript
import { useCentralFSMStore } from '../stores/useCentralFSMStore';

/**
 * Hook pour accéder facilement à l'état et aux actions de la machine FSM
 * @param {string} botId - Identifiant du bot (défaut: 'main')
 */
export function useFSM(botId = 'main') {
  const fsmState = useCentralFSMStore((state) => state.getBotState(botId));
  const send = useCentralFSMStore((state) => (event) => state.send(event, botId));
  const allBots = useCentralFSMStore((state) => state.getBots());
  const addBot = useCentralFSMStore((state) => state.addBot);
  const removeBot = useCentralFSMStore((state) => state.removeBot);
  
  return { 
    fsmState, 
    send,
    allBots,
    addBot,
    removeBot,
    isIn: (stateValue) => fsmState.matches(stateValue),
    context: fsmState.context
  };
}
```

## 6. HUD centralisé: Refactor pour utiliser le hook unifié

Modifier `/src/components/HUD/CentralFSMHud.jsx` pour utiliser le hook:

```jsx
import React from 'react';
import { useFSM } from '../../hooks/useFSM';

// [Format function reste identique]

export default function CentralFSMHud() {
  // Utiliser le hook unifié
  const { fsmState, send, allBots, addBot } = useFSM();
  
  const [selectedBot, setSelectedBot] = useState('main');
  
  // Le reste reste identique mais utilise fsmState au lieu de state
  // ...
}
```

## 7. Fusionner BotInstanceXStateTest dans le système unifié

Modifier `/src/components/FSM/BotInstanceXStateTest.jsx`:

```jsx
import React from 'react';
import { useFSM } from '../../hooks/useFSM';

export default function BotInstanceXStateTest({ botId = 'main' }) {
  // Utiliser le hook unifié avec le botId passé en prop
  const { fsmState, send } = useFSM(botId);
  
  // Le reste utilise fsmState au lieu de state
  // ...
}
```

## 8. Migrer le provider FSM principal

Modifier `/src/ai/fsm/contexts/FSMContext.jsx`:

```jsx
import React, { createContext, useContext } from 'react';
import { useCentralFSMStore } from '../../../stores/useCentralFSMStore';

// Créer le contexte
const FSMContext = createContext(null);

// Provider qui expose l'état centralisé
export function FSMProvider({ children }) {
  // Utiliser le store centralisé
  const fsmStore = useCentralFSMStore();
  
  return (
    <FSMContext.Provider value={fsmStore}>
      {children}
    </FSMContext.Provider>
  );
}

// Hook pour accéder au contexte
export function useFSMContext() {
  const context = useContext(FSMContext);
  if (!context) {
    throw new Error('useFSMContext must be used within a FSMProvider');
  }
  return context;
}
```

## 9. Nettoyer `App.jsx` pour éliminer les doublons

Modifier `/src/App.jsx` pour éviter les instances dupliquées:

```jsx
// ...imports

const App = () => {
  // ...existing code
  
  return (
    <FSMProvider>
      {/* Supprimer FSMSyncProvider car plus nécessaire */}
      <div className="app-container">
        {/* ...existing code */}
        
        {/* ============= SYSTÈME FSM UNIFIÉ ============= */}
        {/* Utiliser un seul HUD */}
        <CentralFSMHud />
        
        {/* Renommer ou supprimer progressivement */}
        {/* <BotInstanceXStateTest /> */}
        
      </div>
    </FSMProvider>
  );
};
```

## 10. Réutilisation des fichiers existants dans machine/

| Fichier | Réutilisation |
|---------|--------------|
| `/guards/*.js` | Importés directement dans les `guards` de la config machine |
| `/actions/core/*.js` | Importés dans les `actions` de la config machine |
| `/events/*.js` | Source pour les créateurs d'événements typés | 
| `/context/initialContext.js` | Base pour le contexte initial des bots |
| `/reducers/context.js` | Utilisés dans les actions de transformation |

## Séquence de migration (pour l'IA)

1. Créer le middleware Zustand-XState
2. Créer le store centralisé basique
3. Créer le hook unifié d'accès
4. Étendre pour gérer plusieurs bots
5. Améliorer le hook useFSM
6. Refactorer CentralFSMHud
7. Fusionner BotInstanceXStateTest
8. Migrer le provider FSM
9. Nettoyer App.jsx
10. Tests et validation

## Actions à accomplir 

- [x] Suppression des événements obsolètes
- [x] Correction des HUDs pour ne montrer que les événements valides
- [x] Création du middleware Zustand-XState
- [x] Création du store centralisé
- [x] Adaptation des composants UI modernes (CentralFSMHud, BotInstanceXStateTest)
- [x] Compatibilité temporaire pour les anciens composants (FusedBotManagerHUD)
- [x] Correction de l'erreur `withContext is not a function` en utilisant `createActor` avec `input`
- [x] Correction des erreurs `botStates undefined` dans le store
- [x] Optimisation du hook useFSM pour éviter les boucles infinies
- [ ] Test et validation de l'état partagé

## Validation 

1. Les deux HUDs doivent montrer le même état (vérifier visuellement)
2. Les événements envoyés par un HUD doivent affecter l'affichage de l'autre
3. L'état doit persister entre les rechargements de page
