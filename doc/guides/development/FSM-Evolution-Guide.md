# Guide d'Évolution de la Machine à États Finis (FSM) du Bot

Ce document guide les développeurs dans l'évolution et l'amélioration de la Machine à États Finis (FSM) du Bot selon l'architecture IDLE-centralisée actuelle.

## Principes Fondamentaux

### 1. Architecture IDLE-Centralisée

Notre FSM est construite autour d'une architecture centralisée avec l'état IDLE comme point central. Tout changement ou ajout doit respecter ce principe:

- Toutes les actions se terminent en retournant à l'état IDLE
- L'état IDLE est responsable de l'évaluation des conditions et de la décision du prochain état
- Les états actifs se concentrent uniquement sur l'exécution de comportements spécifiques

### 2. Séparation des Responsabilités

Les différents composants ont des responsabilités clairement définies:

- **États**: Définissent le contexte comportemental général, sans logique de décision
- **Actions**: Implémentent des comportements spécifiques sans décider du prochain état
- **Conditions**: Évaluent les conditions pour les transitions d'état, uniquement dans IDLE

### 3. Hiérarchie de Priorités

Les décisions respectent une hiérarchie stricte de priorités:

1. **SAFETY** (P4): Sécurité du bot (carburant bas, évitement des dangers)
2. **CAPACITY** (P3): Gestion de la capacité de stockage
3. **EFFICIENCY** (P2): Efficacité de la collecte de ressources
4. **DISCOVERY** (P1): Exploration et découverte

## Comment Étendre la FSM

### Ajouter un Nouvel État

1. **Définir la constante d'état** dans `botConstants.js`:

```javascript
export const BOT_STATES = {
  // États existants...
  NEW_STATE: 'new_state'
};

export const STATE_TRANSITIONS = {
  // Transitions existantes...
  [BOT_STATES.NEW_STATE]: {
    possibleNextStates: [BOT_STATES.IDLE, BOT_STATES.ANOTHER_STATE],
    description: "Description des transitions possibles"
  }
};
```

2. **Configurer l'état** dans `botStates.js`:

```javascript
[BOT_STATES.NEW_STATE]: {
  description: "Description de l'état",
  
  // Option 1: Action par défaut statique
  defaultAction: { type: 'defaultActionType', priority: PRIORITY.MEDIUM },
  
  // Option 2 (recommandée): Action par défaut contextuelle
  getDefaultAction: (playerStore, tileStore, addAction) => {
    // Logique de détermination de l'action appropriée
    return { type: 'contextualAction', priority: PRIORITY.MEDIUM };
  },
  
  onEnterState: (playerStore) => {
    fsmLogger.state("Entering NEW_STATE state");
    // Initialisation spécifique à l'état
  },
  
  onExitState: (playerStore, changeState) => {
    // Protection contre les appels récursifs
    if (BotStateConfig[BOT_STATES.NEW_STATE]._isExiting) return;
    
    BotStateConfig[BOT_STATES.NEW_STATE]._isExiting = true;
    fsmLogger.state("Exiting NEW_STATE state - Returning to IDLE for evaluation");
    
    // CRUCIAL: Retour à IDLE
    if (changeState) {
      changeState(BOT_STATES.IDLE);
    }
    
    // Protection contre la récursion
    setTimeout(() => {
      BotStateConfig[BOT_STATES.NEW_STATE]._isExiting = false;
    }, 50);
  },
  
  _isExiting: false  // Indicateur pour éviter les appels récursifs
}
```

3. **Ajouter les conditions de transition** dans `evaluateConditionsFromIdleAction.js`:

```javascript
// Ajouter à la fonction evaluateStateTransition, au niveau de priorité approprié
if (condition) {
  fsmLogger.condition(`Transition from IDLE to new_state (raison)`);
  changeState(BOT_STATES.NEW_STATE);
  return true;
}
```

### Ajouter une Nouvelle Action

1. **Créer le module d'action** dans `actions/individual/myNewAction.js`:

```javascript
export const myNewAction = (playerStore, tileStore, addAction, changeState) => {
  // Récupération du contexte
  const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
  
  // Initialisation
  if (!myNewAction.started) {
    fsmLogger.action("Starting my new action");
    myNewAction.started = true;
    myNewAction.startTime = Date.now();
    // Initialisation spécifique
    return undefined;
  }
  
  // Logique principale
  
  // Condition de complétion
  if (/* condition de terminaison */) {
    fsmLogger.action("Action completed successfully");
    // IMPORTANT: Retour à IDLE
    changeState(BOT_STATES.IDLE);
    myNewAction.reset();
    return true;
  }
  
  return undefined; // Action en cours
};

// Propriétés statiques
myNewAction.started = false;
myNewAction.startTime = null;

// Méthode de réinitialisation
myNewAction.reset = function() {
  this.started = false;
  this.startTime = null;
};
```

2. **Enregistrer l'action** dans `botActions.js`:

```javascript
import { myNewAction } from './individual/myNewAction';

export const BotActions = {
  // Actions existantes...
  myNewAction,
  
  // Ajouter à la map
  actionMap: {
    // Map existante...
    'myNewAction': 'myNewAction'
  }
};
```

### Ajouter une Nouvelle Condition

1. **Créer la fonction de condition** dans `botConditions.js`:

```javascript
shouldEnterNewState: (botVehicle, botMemory, tileStore) => {
  // Logique d'évaluation de la condition
  const conditionMet = /* votre logique */;
  
  if (conditionMet) {
    fsmLogger.condition("Condition met for entering new_state");
  }
  
  return conditionMet;
}
```

2. **Intégrer dans la logique d'évaluation** dans `evaluateConditionsFromIdleAction.js`:

```javascript
// À la priorité appropriée
if (BotConditions.shouldEnterNewState(botVehicle, botMemory, tileStore)) {
  fsmLogger.condition(`Transition from IDLE to new_state (raison)`);
  changeState(BOT_STATES.NEW_STATE);
  return true;
}
```

## Guide Pas à Pas pour Ajouter un Comportement Complet

Voici les étapes pour ajouter un comportement complet, de la planification à l'implémentation:

### 1. Planification

1. **Définir le comportement**: Quel comportement spécifique voulez-vous ajouter?
2. **Déterminer le niveau de priorité**: Est-ce lié à la sécurité, la capacité, l'efficacité ou la découverte?
3. **Identifier les conditions de déclenchement**: Quand ce comportement doit-il être activé?

### 2. Implémentation

1. **Créer ou étendre les états**:
   - Ajouter un nouvel état si nécessaire
   - Ou étendre un état existant avec de nouvelles actions

2. **Implémenter les actions**:
   - Créer des actions modulaires qui suivent le pattern standard
   - Respecter les principes de séparation des responsabilités

3. **Définir les conditions d'évaluation**:
   - Implémenter les conditions dans l'évaluation centralisée
   - Respecter la hiérarchie de priorités

4. **Ajouter la journalisation**:
   - Utiliser `fsmLogger` pour faciliter le débogage
   - Documenter les transitions et comportements clés

### 3. Test

Pour tester votre nouveau comportement:
1. Forcez l'état initial approprié pour le test
2. Vérifiez les logs de console pour suivre les transitions
3. Utilisez le composant BotDebugger pour surveiller l'état des actions et des transitions
4. Confirmez que les actions appropriées sont exécutées dans l'ordre prévu

## Exemple Complet: Ajout d'un Comportement d'Évitement de Danger

Voici un exemple complet d'ajout d'un comportement d'évitement de danger:

### 1. Constantes (botConstants.js)
```javascript
export const BOT_STATES = {
  // États existants...
  DANGER_AVOIDANCE: 'danger_avoidance'
};

export const STATE_TRANSITIONS = {
  // Transitions existantes...
  [BOT_STATES.DANGER_AVOIDANCE]: {
    possibleNextStates: [BOT_STATES.EXPLORING, BOT_STATES.RETURNING],
    description: "Bot évitant un danger, peut ensuite reprendre son activité précédente"
  }
};
```

### 2. Actions (nouvelle action dans individual/avoidDangerAction.js)
```javascript
export const avoidDangerAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
  const botMemory = playerStore?.players?.player2?.memory;
  
  // Si première exécution, initialiser
  if (!avoidDangerAction.started) {
    fsmLogger.action("Starting danger avoidance");
    avoidDangerAction.started = true;
    avoidDangerAction.startTime = Date.now();
    
    // Déterminer une tuile sûre à proximité
    const currentCoord = botVehicle.coord;
    const nearbyCoords = tileStore.getNearbyCoords(currentCoord, 2);
    const safeTile = nearbyCoords.find(coord => {
      const tile = tileStore.getTileAtCoord(coord);
      return tile.walkable && !botMemory.knownDangers.some(d => d.coord === coord);
    });
    
    if (!safeTile) {
      fsmLogger.error("No safe tile found nearby");
      avoidDangerAction.reset();
      changeState(BOT_STATES.IDLE);
      return false;
    }
    
    // Enregistrer la cible
    avoidDangerAction.targetCoord = safeTile;
    
    // Déplacer le bot vers la tuile sûre
    playerStore.moveToTile('player2', 'ship', safeTile);
    fsmLogger.action(`Moving to safe tile at ${safeTile}`);
    
    return undefined;
  }
  
  // Vérifier si le bot est arrivé à destination
  if (botVehicle.coord === avoidDangerAction.targetCoord) {
    fsmLogger.action("Successfully avoided danger");
    
    // Mettre à jour la mémoire avec le danger évité
    playerStore.updatePlayerMemory('player2', {
      lastAvoidance: {
        time: Date.now(),
        location: botVehicle.coord
      }
    });
    
    // Retourner à IDLE pour réévaluation
    changeState(BOT_STATES.IDLE);
    avoidDangerAction.reset();
    return true;
  }
  
  // Timeout si l'évitement prend trop de temps
  const elapsedTime = Date.now() - avoidDangerAction.startTime;
  if (elapsedTime > 5000) { // 5 secondes max
    fsmLogger.error("Danger avoidance timed out");
    changeState(BOT_STATES.IDLE);
    avoidDangerAction.reset();
    return false;
  }
  
  return undefined;
};

// Propriétés statiques
avoidDangerAction.started = false;
avoidDangerAction.startTime = null;
avoidDangerAction.targetCoord = null;

// Méthode de réinitialisation
avoidDangerAction.reset = function() {
  this.started = false;
  this.startTime = null;
  this.targetCoord = null;
};
```

### 3. États (botStates.js)
```javascript
[BOT_STATES.DANGER_AVOIDANCE]: {
  description: "Bot évitant activement un danger",
  defaultAction: { type: 'avoidDanger', priority: PRIORITY.URGENT },
  
  onEnterState: (playerStore) => {
    fsmLogger.state("Entering DANGER_AVOIDANCE state");
  },
  
  onExitState: (playerStore, changeState) => {
    if (BotStateConfig[BOT_STATES.DANGER_AVOIDANCE]._isExiting) return;
    
    BotStateConfig[BOT_STATES.DANGER_AVOIDANCE]._isExiting = true;
    fsmLogger.state("Exiting DANGER_AVOIDANCE state - Returning to IDLE");
    
    if (changeState) {
      changeState(BOT_STATES.IDLE);
    }
    
    setTimeout(() => {
      BotStateConfig[BOT_STATES.DANGER_AVOIDANCE]._isExiting = false;
    }, 50);
  },
  
  _isExiting: false
}
```

### 4. Conditions (intégrer dans evaluateConditionsFromIdleAction.js)
```javascript
// Au plus haut niveau de priorité (SAFETY)
const isDangerNearby = (botVehicle, tileStore, botMemory) => {
  const currentCoord = botVehicle.coord;
  const currentTile = tileStore.getTileAtCoord(currentCoord);
  
  // Vérifier si la tuile actuelle est dangereuse
  if (currentTile.type === 'danger') {
    return true;
  }
  
  // Vérifier les dangers connus à proximité immédiate
  const adjacentCoords = tileStore.getAdjacentCoords(currentCoord);
  return adjacentCoords.some(coord => {
    const knownDanger = botMemory.knownDangers.find(d => d.coord === coord);
    return knownDanger && knownDanger.dangerLevel > 3; // danger élevé
  });
};

// Au début de la fonction d'évaluation, avec priorité maximale
if (isDangerNearby(botVehicle, tileStore, botMemory)) {
  fsmLogger.condition("Transition from IDLE to danger_avoidance (safety_critical)");
  changeState(BOT_STATES.DANGER_AVOIDANCE);
  return true;
}
```

## Conseils pour un Code Maintenable

1. **Documentation**: Documentez clairement chaque état, action, et condition avec des commentaires descriptifs.
2. **Logs**: Utilisez les logs de manière consistante avec les différentes fonctions de `fsmLogger`.
3. **Cohérence**: Suivez les mêmes patterns pour toutes les nouvelles fonctionnalités.
4. **Tests**: Testez chaque nouveau comportement indépendamment avant de l'intégrer au système complet.
5. **Simplicité**: Gardez chaque fonction simple et centrée sur une seule responsabilité.
6. **Protection contre la récursion**: Utilisez toujours des mécanismes comme `_isExiting` pour éviter les appels récursifs infinis.
7. **Nettoyage des états**: Implémentez toujours la méthode `reset()` pour les actions et nettoyez les variables dans `onExitState`.

En suivant ce guide, vous pourrez facilement étendre les comportements de votre bot tout en maintenant un code organisé et facile à comprendre.