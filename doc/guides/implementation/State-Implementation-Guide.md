# Guide d'implémentation des états

Ce document explique comment implémenter correctement un nouvel état dans la FSM du Bot selon l'architecture IDLE-centralisée.

## Structure d'un état

Chaque état est défini dans `src/ai/fsm/states/botStates.js` et doit suivre la structure suivante :

```javascript
export const BotStateConfig = {
  // États existants...
  
  [BOT_STATES.MY_NEW_STATE]: {
    description: "Description de ce que fait le bot dans cet état",
    
    // Option 1: Action par défaut statique
    defaultAction: { 
      type: 'actionType', 
      priority: PRIORITY.MEDIUM 
    },
    
    // OU Option 2: Action par défaut dynamique (recommandée)
    getDefaultAction: (playerStore, tileStore, addAction) => {
      // Logique pour déterminer l'action appropriée selon le contexte
      const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
      
      // Exemple de logique conditionnelle
      if (/* condition spécifique */) {
        return { 
          type: 'specialAction', 
          priority: PRIORITY.HIGH 
        };
      }
      
      // Action par défaut
      return { 
        type: 'defaultAction', 
        priority: PRIORITY.MEDIUM 
      };
    },
    
    // Fonction appelée lorsqu'on entre dans cet état
    onEnterState: (playerStore, addAction) => {
      fsmLogger.state("Entering MY_NEW_STATE state");
      
      // Logique d'initialisation spécifique à l'état
      // Le paramètre addAction permet d'ajouter directement une action à la file
      if (addAction) {
        addAction('initialAction', PRIORITY.HIGH);
      }
    },
    
    // Fonction appelée lorsqu'on sort de cet état (TRÈS IMPORTANT)
    onExitState: (playerStore, changeState) => {
      // Protection contre les appels récursifs
      if (BotStateConfig[BOT_STATES.MY_NEW_STATE]._isExiting) return;
      
      // Marquer que nous sommes en train de sortir
      BotStateConfig[BOT_STATES.MY_NEW_STATE]._isExiting = true;
      
      fsmLogger.state("Exiting MY_NEW_STATE state - Returning to IDLE for evaluation");
      
      // Nettoyage spécifique à l'état si nécessaire
      if (playerStore) {
        // Exemple: réinitialiser des variables dans la mémoire du bot
        playerStore.updatePlayerMemory('player2', {
          specificStateVariable: null
        });
      }
      
      // CRUCIAL: Retourner à l'état IDLE pour centralisation des décisions
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }
      
      // Réinitialiser l'indicateur d'état de sortie après un court délai
      setTimeout(() => {
        BotStateConfig[BOT_STATES.MY_NEW_STATE]._isExiting = false;
      }, 50);
    },
    
    // Indicateur pour éviter les appels récursifs de onExitState
    _isExiting: false
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

Dans `src/ai/fsm/states/botStates.js`, ajouter la configuration de l'état comme indiqué dans la structure ci-dessus.

### 3. Intégrer dans le système d'évaluation centralisé

Dans `src/ai/fsm/actions/individual/evaluateConditionsFromIdleAction.js` ou dans le module correspondant qui gère les transitions depuis IDLE, assurez-vous d'ajouter les conditions qui peuvent mener à votre nouvel état :

```javascript
// Dans la fonction d'évaluation centralisée
const evaluateStateTransition = () => {
  // Vérifications de priorité SAFETY (P4)
  if (/* conditions de sécurité */) {
    // ...
  }
  
  // Vérifications de priorité CAPACITY (P3)
  if (/* conditions de capacité */) {
    // ...
  }
  
  // Ajout de votre condition pour le nouvel état avec sa priorité appropriée
  if (/* condition spécifique à votre nouvel état */) {
    fsmLogger.condition(`Transition from IDLE to my_new_state (raison)`);
    changeState(BOT_STATES.MY_NEW_STATE);
    return true;
  }
  
  // Autres conditions existantes...
}
```

### 4. Créer les actions associées

Créez les modules d'actions nécessaires pour votre état dans `src/ai/fsm/actions/individual/`. Chaque action doit suivre ce pattern :

```javascript
// myNewStateAction.js
export const myNewStateAction = (playerStore, tileStore, addAction, changeState) => {
  // Si première exécution, initialiser
  if (!myNewStateAction.started) {
    fsmLogger.action("Starting my new state action");
    myNewStateAction.started = true;
    myNewStateAction.startTime = Date.now();
    
    // Logique initiale...
    return undefined; // Action démarrée mais pas terminée
  }
  
  // Logique principale
  // ...
  
  // Condition de fin
  if (/* condition de terminaison */) {
    fsmLogger.action("My new state action completed");
    
    // IMPORTANT: Toujours retourner à IDLE à la fin
    changeState(BOT_STATES.IDLE);
    
    // Réinitialiser l'état de l'action
    myNewStateAction.reset();
    
    return true; // Action terminée avec succès
  }
  
  return undefined; // Action toujours en cours
};

// Propriétés statiques
myNewStateAction.started = false;
myNewStateAction.startTime = null;

// Méthode de réinitialisation
myNewStateAction.reset = function() {
  this.started = false;
  this.startTime = null;
};
```

### 5. Enregistrer l'action dans le registre d'actions

Dans `src/ai/fsm/actions/botActions.js`, ajoutez votre action au registre :

```javascript
import { myNewStateAction } from './individual/myNewStateAction';

export const BotActions = {
  // Actions existantes...
  
  // Ajout de votre nouvelle action
  myNewStateAction,
  
  // Assurez-vous de l'ajouter à l'actionMap
  actionMap: {
    // Map existante...
    'myNewStateAction': 'myNewStateAction'
  }
};
```

## Architecture IDLE-Centralisée

Notre architecture FSM est centralisée autour de l'état IDLE. Voici les principes essentiels à respecter :

### 1. Centralisation des décisions

- L'état IDLE est le point central où toutes les décisions sont prises
- L'action `evaluateIdle` examine les conditions actuelles et détermine le prochain état
- Les états actifs ne contiennent jamais de logique de décision sur le prochain état

### 2. Flux de retour uniforme

- Toutes les actions **doivent** se terminer en retournant à l'état IDLE
- Les méthodes `onExitState` de tous les états doivent implémenter une transition vers IDLE
- Utiliser l'indicateur `_isExiting` pour éviter les appels récursifs lors de la sortie d'état

### 3. Protection contre les fuites de mémoire

- Chaque action doit implémenter sa méthode `reset()`
- Les propriétés statiques des actions doivent être nettoyées à la fin de leur exécution
- Les états doivent nettoyer leurs variables spécifiques dans `onExitState`

### 4. Journalisation cohérente

Pour faciliter le débogage, utilisez toujours les fonctions de journalisation appropriées :

```javascript
fsmLogger.state("Message lié à un changement d'état");
fsmLogger.action("Message lié à une action");
fsmLogger.condition("Message lié à une condition");
fsmLogger.info("Information générale");
```

## Exemple avancé : Action adaptative avec getDefaultAction

Pour les états nécessitant une sélection d'action contextuelle, utilisez le pattern suivant :

```javascript
[BOT_STATES.COLLECTING]: {
  description: "Bot en collecte de ressources",
  
  // Action par défaut adaptative
  getDefaultAction: (playerStore, tileStore, addAction) => {
    const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
    const botMemory = playerStore?.players?.player2?.memory;

    // Si sur la même tuile que la ressource cible, collecter
    if (botVehicle && botMemory?.currentTargetResource &&
        botVehicle.coord === botMemory.currentTargetResource.coord) {
      
      fsmLogger.action(`Using adaptive action: collectResource (priority: ${PRIORITY.HIGH})`);
      return { 
        type: 'collectResource', 
        priority: PRIORITY.HIGH 
      };
    } 
    // Sinon, se déplacer vers la ressource
    else {
      fsmLogger.action(`Using adaptive action: moveToResource (priority: ${PRIORITY.MEDIUM})`);
      return { 
        type: 'moveToResource', 
        priority: PRIORITY.MEDIUM 
      };
    }
  },
  
  // Autres propriétés de l'état...
}
```

## Considérations importantes

1. **Prévention des boucles infinies** : Utilisez toujours un indicateur comme `_isExiting` pour éviter les appels récursifs.
2. **Réinitialisation des états** : Toujours nettoyer les variables d'état dans `reset()` et `onExitState`.
3. **Retour à IDLE** : Chaque action doit se terminer par un `changeState(BOT_STATES.IDLE)`.
4. **Priorisation appropriée** : Suivez les conventions de priorité (SAFETY > CAPACITY > EFFICIENCY > DISCOVERY).
5. **Gestion du temps** : Utilisez `Date.now()` pour suivre la durée des actions et éviter les blocages.