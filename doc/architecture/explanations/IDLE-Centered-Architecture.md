# Architecture FSM Centrée sur l'État IDLE

## Concept clé

Notre FSM implémente une architecture centrée sur l'état IDLE, où toutes les décisions sont prises dans cet état central :

1. Toute action complétée retourne à l'état IDLE
2. L'état IDLE évalue les conditions et détermine l'état approprié via `evaluateIdle`
3. Les états actifs (EXPLORING, COLLECTING, RETURNING) exécutent uniquement des comportements spécifiques
4. Les transitions d'état vident toujours la file d'actions pour permettre des comportements cohérents

## Avantages de cette architecture

### 1. Centralisation de la logique décisionnelle

Toute la logique de décision est centralisée dans l'état IDLE via l'action `evaluateConditionsFromIdleAction`, simplifiant le raisonnement sur le comportement du bot. Cela facilite les modifications car les règles de décision sont localisées à un seul endroit.

### 2. Réduction des transitions complexes

Dans une FSM traditionnelle, les transitions entre états forment un graphe complexe. Notre architecture réduit cette complexité en imposant que toutes les transitions passent par IDLE, facilitant la compréhension et la maintenance du code.

### 3. Clarté du flux de contrôle

Le flux de contrôle devient plus prévisible :
1. Exécuter une action dans un état actif
2. Revenir à IDLE une fois l'action terminée
3. Évaluer les conditions via `evaluateIdle`
4. Effectuer une transition vers un nouvel état basé sur les conditions actuelles

### 4. Actions adaptatives

Notre implémentation permet de déterminer dynamiquement l'action appropriée en fonction de l'état actuel du bot grâce à la fonction `getDefaultAction`, augmentant la flexibilité et la réactivité du système.

## Implémentation

### État IDLE centralisé

```javascript
[BOT_STATES.IDLE]: {
  description: "État central d'évaluation des conditions",
  defaultAction: { type: 'evaluateIdle', priority: PRIORITY.HIGH },
  onEnterState: (playerStore) => {
    fsmLogger.state("Entering IDLE state - Evaluating conditions");
    
    // Récupérer l'état actuel du bot si playerStore est fourni
    if (playerStore) {
      const botVehicle = playerStore.players?.player2?.vehicles?.ship;
      fsmLogger.info(`Bot status: Fuel=${botVehicle?.fuel}, At base=${botVehicle?.coord === botVehicle?.startCoord}`);
    }
  },
  onExitState: (playerStore, changeState, targetState) => {
    fsmLogger.state(`Exiting IDLE state, transitioning to ${targetState}`);
    
    // Des actions spécifiques pourraient être ajoutées ici selon l'état de destination
    const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
    if (botVehicle) {
      // Enregistrer l'état de transition pour référence ou débogage
      fsmLogger.info(`Transition details: Fuel=${botVehicle.fuel}, Resources=${JSON.stringify(botVehicle.resources)}`);
    }
  }
}
```

### Actions retournant à IDLE

Toutes les actions doivent se terminer en retournant à IDLE pour réévaluation. Exemple moderne avec journalisation :

```javascript
// Exemple dans collectResourceAction.js
if (elapsedTime >= collectResourceAction.collectionTime) {
  // Ressources collectées avec succès
  fsmLogger.action(`Resources collected successfully: ${JSON.stringify(botVehicle.resources)}`);
  
  // Notifier que la collecte est terminée et retourner à IDLE pour la prochaine décision
  fsmLogger.action('Collection completed. Returning to IDLE for next action decision.');
  changeState(BOT_STATES.IDLE);
  
  // Réinitialiser les variables d'état
  collectResourceAction.reset();
  
  return true; // Action terminée avec succès
}
```

### États qui retournent à IDLE

Les états maintiennent également une logique pour retourner à IDLE lorsqu'ils ont terminé leurs actions :

```javascript
// Dans la configuration d'un état actif (ex: COLLECTING)
onExitState: (playerStore, changeState) => {
  // Ajout d'une variable statique pour éviter les appels multiples
  if (BotStateConfig[BOT_STATES.COLLECTING]._isExiting) return;
  
  // Marquer que nous sommes en train de sortir pour éviter la récursion
  BotStateConfig[BOT_STATES.COLLECTING]._isExiting = true;
  
  fsmLogger.state("Exiting COLLECTING state - Returning to IDLE for evaluation");
  
  // Nettoyer les données de ciblage de ressources
  if (playerStore) {
    playerStore.updatePlayerMemory('player2', {
      currentTargetResource: null
    });
  }
  
  // Toujours retourner à l'état IDLE après la fin des actions de collecte
  if (changeState) {
    changeState(BOT_STATES.IDLE);
  }
  
  // Réinitialiser l'indicateur après un court délai
  setTimeout(() => {
    BotStateConfig[BOT_STATES.COLLECTING]._isExiting = false;
  }, 50);
}
```

### Actions adaptatives selon l'état

Notre implémentation permet de déterminer dynamiquement quelle action exécuter via `getDefaultAction` :

```javascript
// Dans botStates.js pour l'état COLLECTING
getDefaultAction: (playerStore, tileStore, addAction) => {
  // Vérifier si le bot est sur la tuile cible pour savoir quelle action ajouter
  const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
  const botMemory = playerStore?.players?.player2?.memory;

  // Si la mémoire contient une cible de ressource actuelle
  if (botVehicle && botMemory?.currentTargetResource) {
    // Si le bot est déjà sur la tuile cible, ajouter directement collectResource
    if (botVehicle.coord === botMemory.currentTargetResource.coord) {
      return { 
        type: 'collectResource', 
        priority: PRIORITY.HIGH 
      };
    }
    // Sinon, ajouter moveToResource pour se déplacer vers la ressource
    else {
      return { 
        type: 'moveToResource', 
        priority: PRIORITY.MEDIUM 
      };
    }
  }
  
  // Action par défaut si aucune condition spécifique n'est remplie
  return { 
    type: 'moveToResource', 
    priority: PRIORITY.MEDIUM 
  };
}
```

## Traitement des Actions et File d'Attente

Le cœur du système est le `processBot` qui gère la file d'actions prioritaires :

```javascript
processBot: () => {
  if (!get().isRunning) return;
  
  // 1. Vérifier les conditions de sortie d'état
  const exitConditionMet = get().checkStateExitConditions();
  if (exitConditionMet) return; // Si une transition a eu lieu, attendre le prochain cycle
  
  // 2. Si la file est vide, ajouter l'action par défaut selon l'état
  if (get().actionQueue.length === 0) {
    const currentState = get().botState;
    const stateConfig = BotStateConfig[currentState];
    
    if (stateConfig) {
      let defaultAction;
      
      // Déterminer l'action par défaut dynamiquement si possible
      if (typeof stateConfig.getDefaultAction === 'function') {
        defaultAction = stateConfig.getDefaultAction(playerStore, tileStore, get().addAction);
      }
      // Sinon, utiliser l'action par défaut statique
      else if (stateConfig.defaultAction) {
        defaultAction = stateConfig.defaultAction;
      }
      
      // Ajouter l'action à la file
      if (defaultAction) {
        get().addAction(defaultAction.type, defaultAction.priority);
      }
    }
  }
  
  // 3. Exécuter l'action en tête de file
  get().executeNextAction();
}
```

## Diagramme de flux

```
+------------------+
|                  |
|       IDLE       |<-------------------+
|                  |                    |
+--------+---------+                    |
         |                              |
         | evaluateIdle                 |
         | (évalue les conditions)      |
         v                              |
+--------+---------+                    |
|                  |      Action        |
|    État actif    +--------------------+
|                  |     terminée
+-----------------+
 EXPLORING/COLLECTING/RETURNING
```

## Conclusion

Cette architecture centrée sur IDLE offre une approche disciplinée et maintenable pour notre FSM. Elle centralise la logique décisionnelle et clarifie le flux de contrôle, simplifiant ainsi le raisonnement sur le comportement du bot et facilitant l'ajout de nouveaux comportements.

Les améliorations récentes comme les actions adaptatives via `getDefaultAction` et la protection contre les appels récursifs dans les gestionnaires `onExitState` rendent le système plus robuste et flexible, tout en maintenant sa prévisibilité et sa facilité de maintenance.