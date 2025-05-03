# Guide d'Évolution de la Machine à États Finis (FSM) du Bot

Ce guide vous aidera à étendre les comportements de votre bot en utilisant la structure modulaire mise en place. Vous apprendrez où et comment ajouter de nouveaux états, conditions, actions et transitions.

## Structure Générale de la FSM

Notre FSM est organisée en plusieurs modules distincts:

```
src/
  ai/
    constants/
      botConstants.js      # Définition des états et priorités
    fsm/
      actions/
        botActions.js      # Implémentation des actions exécutables
      conditions/
        botConditions.js   # Vérification des conditions de transition
      states/
        botStates.js       # Configuration des comportements par état
```

## 1. Ajouter un Nouvel État

Pour ajouter un nouvel état (par exemple "RESOURCE_COLLECTING"):

### Étape 1: Définir la constante d'état

Dans `src/ai/constants/botConstants.js`:

```javascript
// Les états possibles du bot
export const BOT_STATES = {
  // États existants...
  IDLE: 'idle',
  EXPLORING: 'exploring',
  RETURNING: 'returning',
  // Nouvel état
  RESOURCE_COLLECTING: 'resource_collecting'
};
```

Mettez également à jour `STATE_TRANSITIONS` pour documenter les transitions possibles:

```javascript
export const STATE_TRANSITIONS = {
  // Transitions existantes...
  [BOT_STATES.EXPLORING]: {
    possibleNextStates: [BOT_STATES.RETURNING, BOT_STATES.IDLE, BOT_STATES.RESOURCE_COLLECTING],
    description: "Bot en exploration, peut collecter des ressources, retourner à la base ou s'arrêter",
  },
  // Nouvel état
  [BOT_STATES.RESOURCE_COLLECTING]: {
    possibleNextStates: [BOT_STATES.EXPLORING, BOT_STATES.RETURNING],
    description: "Bot collectant des ressources, peut reprendre l'exploration ou retourner à la base",
  },
};
```

### Étape 2: Configurer le comportement de l'état

Dans `src/ai/fsm/states/botStates.js`:

```javascript
export const BotStateConfig = {
  // États existants...
  
  [BOT_STATES.RESOURCE_COLLECTING]: {
    description: "Bot en train de collecter des ressources",
    defaultAction: { type: 'collectResource', priority: PRIORITY.MEDIUM },
    onEnterState: () => {
      console.log("[BotState] Entering RESOURCE_COLLECTING state");
    },
    onExitState: () => {
      console.log("[BotState] Exiting RESOURCE_COLLECTING state");
    }
  }
};
```

## 2. Ajouter une Nouvelle Action

Pour ajouter une nouvelle action (par exemple "collectResource"):

### Étape 1: Implémenter la fonction d'action

Dans `src/ai/fsm/actions/botActions.js`:

```javascript
export const BotActions = {
  // Actions existantes...
  
  // Collecte des ressources sur la tuile actuelle
  collectResource: (playerStore, tileStore, addAction) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle) return false;
    
    // Vérifier si la tuile actuelle a des ressources
    const currentTile = tileStore.tiles[botVehicle.coord];
    
    if (!currentTile || !currentTile.hasResource) {
      console.log(`[BotActions] No resources on current tile`);
      // Pas de ressource, retourner à l'exploration
      addAction('move', PRIORITY.LOW);
      return true;
    }
    
    console.log(`[BotActions] Collecting resources from tile ${currentTile.coord}`);
    playerStore.collectResource('player2', 'ship', currentTile);
    
    // Vérifier si l'inventaire est plein pour décider de l'action suivante
    if (botVehicle.inventory >= botVehicle.maxInventory) {
      addAction('returnToBase', PRIORITY.HIGH);
    }
    
    return true;
  },
  
  // Mettre à jour la map des types d'actions aux fonctions
  actionMap: {
    // Types existants...
    'move': 'moveToRandomTile',
    'returnToBase': 'returnToBase',
    'refuel': 'refuelAtBase',
    // Nouveau type
    'collectResource': 'collectResource'
  }
};
```

## 3. Ajouter une Nouvelle Condition

Pour ajouter une nouvelle condition (par exemple "isResourceNearby"):

Dans `src/ai/fsm/conditions/botConditions.js`:

```javascript
export const BotConditions = {
  // Conditions existantes...
  
  // Vérifie si une ressource est disponible sur la tuile actuelle
  isResourceAvailable: (botState, botVehicle, tileStore) => {
    if (botState !== BOT_STATES.EXPLORING) return { result: false };
    
    const currentTile = tileStore.tiles[botVehicle.coord];
    const hasResource = currentTile && currentTile.hasResource;
    
    return {
      result: hasResource,
      state: hasResource ? BOT_STATES.RESOURCE_COLLECTING : null,
      action: hasResource ? { type: 'collectResource', priority: PRIORITY.MEDIUM } : null
    };
  },
  
  // Fonction principale qui vérifie toutes les conditions
  checkAllConditions: (botState, botVehicle, tileStore) => {
    if (!botVehicle) return { result: false };
    
    // Ordre de priorité des conditions à vérifier
    const conditions = [
      BotConditions.isLowFuel,
      BotConditions.isAtBase,
      BotConditions.isFullyRefueled,
      // Ajouter la nouvelle condition
      BotConditions.isResourceAvailable
    ];
    
    // Parcourir les conditions par ordre de priorité
    for (const condition of conditions) {
      const result = condition(botState, botVehicle, tileStore);
      if (result.result) {
        return result;
      }
    }
    
    return { result: false };
  }
};
```

## 4. Mettre à Jour le Store Principal

Si votre nouvelle fonctionnalité nécessite des modifications du store principal:

Dans `src/stores/useSimpleBotStore.js`:

```javascript
// Mettre à jour la fonction checkConditions pour passer les dépendances nécessaires
checkConditions: () => {
  const currentState = get().botState;
  const playerStore = usePlayerStore.getState();
  const tileStore = useTileStore.getState();
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  
  if (!botVehicle) return;
  
  // Passer le tileStore aux conditions
  const conditionResult = BotConditions.checkAllConditions(currentState, botVehicle, tileStore);
  
  // Si une condition est remplie, change l'état et/ou ajoute une action
  if (conditionResult.result) {
    // Reste de la fonction inchangé...
  }
}
```

## Guide Pas à Pas pour Ajouter un Comportement Complet

Voici les étapes pour ajouter un comportement complet, de la planification à l'implémentation:

### 1. Planification

Définissez clairement:
- Le nouvel **état** requis (s'il y en a un)
- Les **conditions** qui déclencheront ou termineront ce comportement
- Les **actions** que le bot doit effectuer dans ce comportement

### 2. Implémentation

#### Ordre recommandé:

1. **Constantes**: Ajoutez d'abord l'état dans `botConstants.js`
2. **Actions**: Implémentez les fonctions d'action dans `botActions.js`
3. **États**: Configurez le comportement de l'état dans `botStates.js`
4. **Conditions**: Ajoutez les conditions de transition dans `botConditions.js`

### 3. Test

Pour tester votre nouveau comportement:
1. Forcez l'état initial approprié pour le test
2. Vérifiez les logs de console pour suivre les transitions
3. Confirmez que les actions appropriées sont exécutées

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

### 2. Actions (botActions.js)
```javascript
export const BotActions = {
  // Actions existantes...
  
  avoidDanger: (playerStore, tileStore, addAction, changeState) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    if (!botVehicle) return false;
    
    // Trouver une tuile sûre
    const safeTile = tileStore.findSafeTile(botVehicle.coord);
    
    if (safeTile) {
      console.log(`[BotActions] Avoiding danger, moving to safe tile: ${safeTile.coord}`);
      playerStore.moveToTile('player2', 'ship', safeTile);
      
      // Après avoir évité le danger, retourner à l'état précédent
      setTimeout(() => {
        // Stocker l'état précédent dans une variable à l'entrée de DANGER_AVOIDANCE
        changeState(botVehicle.previousState || BOT_STATES.EXPLORING);
      }, 1000);
      return true;
    }
    
    return false;
  },
  
  actionMap: {
    // Types existants...
    'avoidDanger': 'avoidDanger'
  }
};
```

### 3. États (botStates.js)
```javascript
export const BotStateConfig = {
  // États existants...
  
  [BOT_STATES.DANGER_AVOIDANCE]: {
    description: "Bot évitant un danger imminent",
    defaultAction: { type: 'avoidDanger', priority: PRIORITY.URGENT },
    onEnterState: (playerStore) => {
      console.log("[BotState] Entering DANGER_AVOIDANCE state");
      // Sauvegarder l'état précédent pour y revenir après
      const botVehicle = playerStore.players?.player2?.vehicles?.ship;
      if (botVehicle) {
        botVehicle.previousState = botVehicle.currentState;
      }
    },
    onExitState: () => {
      console.log("[BotState] Exiting DANGER_AVOIDANCE state");
    }
  }
};
```

### 4. Conditions (botConditions.js)
```javascript
export const BotConditions = {
  // Conditions existantes...
  
  isDangerDetected: (botState, botVehicle, tileStore) => {
    // Vérifier les dangers à proximité
    const currentTile = tileStore.tiles[botVehicle.coord];
    const dangerNearby = currentTile && currentTile.isDangerous;
    
    return {
      result: dangerNearby,
      state: dangerNearby ? BOT_STATES.DANGER_AVOIDANCE : null,
      action: dangerNearby ? { type: 'avoidDanger', priority: PRIORITY.URGENT } : null
    };
  },
  
  checkAllConditions: (botState, botVehicle, tileStore) => {
    // Conditions existantes...
    const conditions = [
      // Le danger doit être vérifié en premier (priorité maximale)
      BotConditions.isDangerDetected,
      // Autres conditions...
    ];
    
    // Reste du code inchangé...
  }
};
```

## Conseils pour un Code Maintenable

1. **Documentation**: Documentez clairement chaque état, action, et condition.
2. **Logs**: Utilisez les logs de manière consistante avec des préfixes clairs.
3. **Cohérence**: Suivez les mêmes patterns pour toutes les nouvelles fonctionnalités.
4. **Tests**: Testez chaque nouveau comportement indépendamment avant de l'intégrer.
5. **Simplicité**: Gardez chaque fonction simple et centrée sur une seule responsabilité.

En suivant ce guide, vous pourrez facilement étendre les comportements de votre bot tout en maintenant un code organisé et facile à comprendre.