# Guide d'implémentation des états

Ce document explique comment implémenter correctement un nouvel état dans la FSM du Bot.

## Structure d'un état

Chaque état est défini dans `src/ai/fsm/states/botStates.js` et doit suivre la structure suivante :

```javascript
export const BotStateConfig = {
  // États existants...
  
  [BOT_STATES.MY_NEW_STATE]: {
    description: "Description de ce que fait le bot dans cet état",
    
    // Action par défaut - Statique
    defaultAction: { 
      type: 'actionType', 
      priority: PRIORITY.MEDIUM 
    },
    
    // OU Action par défaut - Dynamique
    getDefaultAction: (playerStore, tileStore, addAction) => {
      // Logique pour déterminer l'action appropriée
      return { 
        type: 'determinedActionType', 
        priority: PRIORITY.HIGH 
      };
    },
    
    // Fonction appelée lorsqu'on entre dans cet état
    onEnterState: (playerStore) => {
      console.log("[BotState] Entering MY_NEW_STATE state");
      // Logique d'initialisation spécifique à l'état
    },
    
    // Fonction appelée lorsqu'on sort de cet état
    onExitState: (playerStore) => {
      console.log("[BotState] Exiting MY_NEW_STATE state");
      // Nettoyage spécifique à l'état
    }
  }
};
```

## Ajouter un nouvel état

### 1. Définir la constante d'état

Dans `src/ai/constants/botConstants.js` :

```javascript
export const BOT_STATES = {
  // États existants...
  MY_NEW_STATE: 'my_new_state'
};

// Si applicable, documenter aussi les transitions possibles
export const STATE_TRANSITIONS = {
  // Transitions existantes...
  [BOT_STATES.MY_NEW_STATE]: {
    possibleNextStates: [BOT_STATES.EXPLORING, BOT_STATES.IDLE],
    description: "Description des transitions possibles"
  }
};
```

### 2. Configurer le comportement de l'état

Dans `src/ai/fsm/states/botStates.js`, ajouter la configuration de l'état comme indiqué dans la structure.

### 3. Ajouter les conditions de transition

Dans `src/ai/fsm/conditions/botConditions.js`, ajouter les conditions qui peuvent mener à cet état :

```javascript
export const BotConditions = {
  // Conditions existantes...
  
  shouldEnterMyNewState: (botState, botVehicle, tileStore) => {
    // Logique pour déterminer si on doit entrer dans cet état
    const condition = /* votre logique */;
    
    return {
      result: condition,
      state: condition ? BOT_STATES.MY_NEW_STATE : null,
      action: condition ? { type: 'appropriateAction', priority: PRIORITY.MEDIUM } : null
    };
  },
  
  checkAllConditions: (botState, botVehicle, tileStore) => {
    // Ajouter votre condition à la liste, avec la priorité appropriée
    const conditions = [
      // Conditions existantes...
      BotConditions.shouldEnterMyNewState
    ];
    
    // Reste du code inchangé
  }
};
```

## Architecture IDLE-Centralisée

Dans notre architecture actuelle centrée sur IDLE, tous les états devraient retourner à IDLE pour la prise de décision :

1. L'état effectue son travail via des actions
2. Quand le travail est terminé, l'action change l'état vers IDLE
3. L'état IDLE évalue les conditions et décide du prochain état

Cette approche centralise la logique décisionnelle et simplifie le flux de contrôle.

## Exemples

Consultez les états existants dans `src/ai/fsm/states/botStates.js` pour des exemples concrets d'implémentation.