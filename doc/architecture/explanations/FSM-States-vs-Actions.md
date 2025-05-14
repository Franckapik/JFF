# États vs Actions dans notre FSM

Ce document explique la distinction fondamentale entre les **états** et les **actions** dans notre implémentation de Machine à États Finis (FSM) pour le Bot.

## Définitions

### États (States)

Un **état** représente une _situation_ ou un _mode_ dans lequel se trouve le Bot. Les états définissent le contexte général de comportement et sont mutuellement exclusifs (le Bot ne peut être que dans un seul état à la fois).

**Exemples d'états :**
- `IDLE`: État central d'attente et d'évaluation des conditions
- `EXPLORING`: En exploration du terrain (drone ou déplacement aléatoire)
- `COLLECTING`: En collecte de ressources (déplacement vers ressources et collecte)
- `RETURNING`: En retour vers la base (retour et ravitaillement)

### Actions (Actions)

Une **action** représente une _tâche spécifique_ que le Bot exécute. Les actions sont concrètes, peuvent prendre du temps et peuvent échouer ou réussir. Une action s'exécute généralement dans le contexte d'un état, et leur exécution est gérée par une file prioritaire.

**Exemples d'actions :**
- `exploreWithDroneAction`: Explorer une zone avec le drone
- `moveToRandomTileAction`: Se déplacer vers une tuile aléatoire
- `moveToResourceAction`: Se déplacer vers une ressource connue
- `collectResourceAction`: Collecter des ressources à la position actuelle
- `returnToBaseAction`: Retourner à la base
- `refuelAtBaseAction`: Faire le plein de carburant et transférer les ressources au score
- `evaluateConditionsFromIdleAction`: Évaluer les conditions depuis l'état IDLE

## Relation entre États et Actions

### 1. États comme Contextes, Actions comme Comportements

- Un **état** définit _quels types d'actions_ sont appropriés par défaut
- Une **action** définit _comment exécuter_ un comportement spécifique
- L'**état IDLE** est spécial car il détermine le prochain état via `evaluateConditionsFromIdleAction`

### 2. Hiérarchie Conceptuelle et Actions Adaptatives

Notre système utilise deux approches pour déterminer les actions à exécuter :

#### Action par défaut statique :
```
État (IDLE)
  └── Action par défaut fixe (evaluateConditionsFromIdleAction)
```

#### Actions adaptatives dynamiques :
```
État (COLLECTING)
  └── Fonction getDefaultAction()
        ├── Si sur la tuile cible → collectResourceAction (HIGH)
        └── Sinon → moveToResourceAction (MEDIUM)
```

### 3. Cycle de Vie Complet

1. Le Bot est initialisé dans l'état **IDLE**
2. L'action `evaluateIdle` évalue les conditions et détermine le prochain état
3. Transition vers un **état actif** (EXPLORING, COLLECTING, RETURNING)
4. L'état actif détermine quelle **action** exécuter par défaut
5. L'**action** s'exécute jusqu'à son terme (succès ou échec)
6. Quand l'action est terminée, le Bot retourne explicitement à l'état **IDLE**
7. Le cycle recommence (évaluation → transition → exécution → retour)

## Différences Fondamentales

| **États** | **Actions** |
|-----------|-------------|
| Nombre limité et prédéfini | Extensibles et modulaires |
| Représentent une situation | Représentent un comportement concret |
| Définissent un contexte | Implémentent une logique spécifique |
| Persistent jusqu'à une transition | Ont une durée d'exécution définie |
| Mutuellement exclusifs | Sont gérées par une file prioritaire |
| Configurés dans botStates.js | Implémentées dans des modules individuels |

## Implémentation dans le Code

### États (dans `botStates.js`)

```javascript
export const BotStateConfig = {
  [BOT_STATES.EXPLORING]: {
    description: "Bot en exploration",
    defaultAction: { type: 'exploreDrone', priority: PRIORITY.MEDIUM },
    onEnterState: () => {
      fsmLogger.state("Entering EXPLORING state");
    },
    onExitState: (playerStore, changeState) => {
      // Protection contre les appels récursifs
      if (BotStateConfig[BOT_STATES.EXPLORING]._isExiting) return;
      
      BotStateConfig[BOT_STATES.EXPLORING]._isExiting = true;
      fsmLogger.state("Exiting EXPLORING state - Returning to IDLE for evaluation");
      
      // Retour à IDLE pour centralisation des décisions
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }
      
      // Réinitialiser l'indicateur après un court délai
      setTimeout(() => {
        BotStateConfig[BOT_STATES.EXPLORING]._isExiting = false;
      }, 50);
    },
    // Indicateur pour éviter les appels multiples
    _isExiting: false
  }
}
```

### Actions adaptatives (dans `botStates.js`)

```javascript
[BOT_STATES.COLLECTING]: {
  // ...
  getDefaultAction: (playerStore, tileStore, addAction) => {
    const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
    const botMemory = playerStore?.players?.player2?.memory;

    if (botVehicle && botMemory?.currentTargetResource) {
      if (botVehicle.coord === botMemory.currentTargetResource.coord) {
        return { type: 'collectResource', priority: PRIORITY.HIGH };
      } else {
        return { type: 'moveToResource', priority: PRIORITY.MEDIUM };
      }
    }
    
    return { type: 'moveToResource', priority: PRIORITY.MEDIUM };
  }
}
```

### Actions (exemple moderne de `collectResourceAction.js`)

```javascript
export const collectResourceAction = (playerStore, tileStore, addAction, changeState) => {
  // Si propriétés statiques non initialisées, les initialiser
  if (!collectResourceAction.started) {
    // Logique d'initialisation...
    fsmLogger.action(`Starting resource collection at ${botVehicle.coord}: ${JSON.stringify(resources)}`);
    collectResourceAction.started = true;
    collectResourceAction.startTime = Date.now();
    collectResourceAction.collectionTime = 2000; // 2 secondes pour collecter
    
    return undefined; // Action démarrée mais pas terminée
  }
  
  // Vérifier si la collecte est terminée
  const elapsedTime = Date.now() - collectResourceAction.startTime;
  if (elapsedTime >= collectResourceAction.collectionTime) {
    // Collecte terminée avec succès
    fsmLogger.action(`Resources collected successfully: ${JSON.stringify(botVehicle.resources)}`);
    
    // Notifier que la collecte est terminée et retourner à IDLE
    fsmLogger.action('Collection completed. Returning to IDLE for next action decision.');
    changeState(BOT_STATES.IDLE);
    
    // Réinitialiser les variables d'état pour la prochaine utilisation
    collectResourceAction.reset();
    
    return true; // Action terminée avec succès
  }
  
  return undefined; // Action toujours en cours
};

// Propriétés statiques pour suivre l'état interne de l'action
collectResourceAction.started = false;
collectResourceAction.startTime = null;
collectResourceAction.collectionTime = 2000;

// Méthode pour réinitialiser les variables statiques
collectResourceAction.reset = function() {
  this.started = false;
  this.startTime = null;
};
```

## Avantages de cette Séparation avec IDLE Centralisé

1. **Modularité**: Nouvelles actions facilement ajoutables sans modifier la structure des états
2. **Clarté conceptuelle**: Distinction claire entre "où je suis" (état) et "ce que je fais" (action)
3. **Centralisation de la décision**: Toute la logique de transition est dans l'état IDLE via `evaluateIdle`
4. **Réutilisabilité**: Les actions peuvent être réutilisées dans différents contextes ou états
5. **Débogage facilité**: Le cycle de vie uniforme permet de tracer facilement les comportements
6. **Actions adaptatives**: La fonction `getDefaultAction` permet de choisir dynamiquement l'action la plus appropriée

## Conclusion

Dans notre architecture FSM centralisée, les états et les actions jouent des rôles complémentaires mais distincts. Les états définissent le contexte général de comportement, tandis que les actions mettent en œuvre les comportements spécifiques. L'état IDLE joue un rôle central en tant que "chef d'orchestre" qui évalue les conditions et détermine les transitions.

Cette séparation claire, combinée avec la centralisation des décisions dans l'état IDLE, facilite l'évolution du système et améliore sa maintenabilité. Elle permet également d'ajouter facilement de nouveaux comportements sans perturber l'architecture globale.