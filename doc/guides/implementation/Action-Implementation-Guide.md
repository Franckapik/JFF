# Guide d'implémentation des actions

Ce document explique comment implémenter correctement une nouvelle action dans la FSM du Bot, en suivant l'architecture IDLE-centralisée.

## Structure d'une action

Chaque action est implémentée dans un fichier séparé dans le dossier `src/ai/fsm/actions/individual/` et doit respecter la structure suivante :

```javascript
export const myNewAction = (playerStore, tileStore, addAction, changeState) => {
  // 1. Récupération du contexte
  const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
  const botMemory = playerStore?.players?.player2?.memory;
  
  // 2. Vérifications préliminaires
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found');
    return false; // échec de l'action
  }
  
  // 3. Logique d'initialisation (premier appel)
  if (!myNewAction.started) {
    fsmLogger.action(`Starting: ${myNewAction.name}`);
    myNewAction.started = true;
    myNewAction.startTime = Date.now();
    
    // Logique d'initialisation spécifique
    // ...
    
    return undefined; // Action en cours, reste bloquante
  }
  
  // 4. Logique de progression et vérification périodique
  const elapsedTime = Date.now() - myNewAction.startTime;
  
  // Vérification optionnelle du timeout
  if (elapsedTime > myNewAction.timeout) {
    fsmLogger.action(`Action timed out after ${elapsedTime}ms`);
    myNewAction.reset();
    changeState(BOT_STATES.IDLE);
    return false; // échec de l'action
  }
  
  // 5. Logique principale de l'action
  // ...
  
  // 6. Logique de complétion
  if (/* condition de complétion */) {
    fsmLogger.action(`Action completed successfully after ${elapsedTime}ms`);
    
    // IMPORTANT: Retour à l'état IDLE pour centraliser les décisions
    changeState(BOT_STATES.IDLE);
    
    // Réinitialiser les variables d'état
    myNewAction.reset();
    
    // Ajouter optionnellement une action complémentaire
    // addAction('someFollowupAction', PRIORITY.MEDIUM);
    
    return true; // Action terminée avec succès
  }
  
  return undefined; // Action toujours en cours
};

// Propriétés statiques pour suivre l'état de l'action
myNewAction.started = false;
myNewAction.startTime = null;
myNewAction.timeout = 10000; // 10 secondes de timeout par défaut
// Autres propriétés selon les besoins

// Méthode pour réinitialiser les variables statiques (OBLIGATOIRE)
myNewAction.reset = function() {
  this.started = false;
  this.startTime = null;
  // Réinitialiser les autres propriétés spécifiques
};
```

## Types d'actions et patterns

### 1. Actions à progression continue

Ces actions s'exécutent sur plusieurs ticks et suivent une progression (ex: déplacement, collecte) :

```javascript
export const continuousProgressAction = (playerStore, tileStore, addAction, changeState) => {
  // Initialisation
  if (!continuousProgressAction.started) {
    continuousProgressAction.started = true;
    continuousProgressAction.startTime = Date.now();
    continuousProgressAction.progress = 0;
    
    fsmLogger.action('Starting continuous action with progress tracking');
    return undefined;
  }
  
  // Mise à jour de la progression
  continuousProgressAction.progress += 5; // +5% par tick
  
  // Journalisation périodique
  if (continuousProgressAction.progress % 25 === 0) {
    fsmLogger.action(`Progress: ${continuousProgressAction.progress}%`);
  }
  
  // Vérification de complétion
  if (continuousProgressAction.progress >= 100) {
    fsmLogger.action('Continuous action completed at 100%');
    changeState(BOT_STATES.IDLE);
    continuousProgressAction.reset();
    return true;
  }
  
  return undefined;
};

continuousProgressAction.started = false;
continuousProgressAction.startTime = null;
continuousProgressAction.progress = 0;

continuousProgressAction.reset = function() {
  this.started = false;
  this.startTime = null;
  this.progress = 0;
};
```

### 2. Actions conditionnelles

Ces actions attendent qu'une condition externe soit remplie (ex: attente d'arrivée) :

```javascript
export const conditionalAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
  
  // Initialisation
  if (!conditionalAction.started) {
    conditionalAction.started = true;
    conditionalAction.targetCoord = "E5"; // exemple
    
    fsmLogger.action(`Starting conditional action, waiting for bot to reach ${conditionalAction.targetCoord}`);
    return undefined;
  }
  
  // Vérification de la condition
  if (botVehicle.coord === conditionalAction.targetCoord) {
    fsmLogger.action(`Condition met: bot reached ${conditionalAction.targetCoord}`);
    changeState(BOT_STATES.IDLE);
    conditionalAction.reset();
    return true;
  }
  
  return undefined;
};

conditionalAction.started = false;
conditionalAction.targetCoord = null;

conditionalAction.reset = function() {
  this.started = false;
  this.targetCoord = null;
};
```

### 3. Actions multi-étapes

Ces actions suivent une séquence d'étapes distinctes :

```javascript
export const multiStepAction = (playerStore, tileStore, addAction, changeState) => {
  // Initialisation
  if (!multiStepAction.started) {
    multiStepAction.started = true;
    multiStepAction.currentStep = 1;
    multiStepAction.totalSteps = 3;
    
    fsmLogger.action(`Starting multi-step action (1/${multiStepAction.totalSteps})`);
    return undefined;
  }
  
  // Logique spécifique à l'étape actuelle
  switch (multiStepAction.currentStep) {
    case 1:
      // Logique de l'étape 1
      // ...
      if (/* condition de complétion de l'étape 1 */) {
        multiStepAction.currentStep++;
        fsmLogger.action(`Moving to step (2/${multiStepAction.totalSteps})`);
      }
      break;
      
    case 2:
      // Logique de l'étape 2
      // ...
      if (/* condition de complétion de l'étape 2 */) {
        multiStepAction.currentStep++;
        fsmLogger.action(`Moving to step (3/${multiStepAction.totalSteps})`);
      }
      break;
      
    case 3:
      // Logique de l'étape finale
      // ...
      if (/* condition de complétion de l'étape finale */) {
        fsmLogger.action('Multi-step action completed');
        changeState(BOT_STATES.IDLE);
        multiStepAction.reset();
        return true;
      }
      break;
  }
  
  return undefined;
};

multiStepAction.started = false;
multiStepAction.currentStep = 1;
multiStepAction.totalSteps = 3;

multiStepAction.reset = function() {
  this.started = false;
  this.currentStep = 1;
};
```

## Bonnes pratiques

### 1. Séparation des responsabilités

Une action ne doit PAS contenir de logique de décision d'état :
- Ne pas vérifier les conditions globales (niveau carburant, capacité max)
- Ne pas décider du prochain état basé sur des conditions externes
- Toujours retourner à IDLE pour la prise de décision centralisée

### 2. Gestion des états internes

L'action doit gérer son état proprement :
- Utiliser des propriétés statiques pour suivre l'état interne
- Implémenter une méthode `reset()` complète pour éviter les fuites mémoire
- Retourner `undefined` tant que l'action est en cours
- Retourner `true` pour succès ou `false` pour échec

### 3. Journalisation avancée

Utilisez le système `fsmLogger` pour faciliter le débogage :

```javascript
// Différents types de journalisation selon le contexte
fsmLogger.action(`Starting action at ${botVehicle.coord}`);    // Pour les événements d'action
fsmLogger.state(`Changing to state ${newState}`);              // Pour les changements d'état
fsmLogger.info(`Bot has ${botVehicle.fuel}% fuel remaining`);  // Pour les informations générales
fsmLogger.mouvement(`Bot moving to ${targetCoord}`);           // Pour les événements de mouvement
fsmLogger.condition(`Condition check: ${result}`);             // Pour l'évaluation des conditions
fsmLogger.error('Something went wrong: ${error.message}');     // Pour les erreurs
```

### 4. Pattern Start-Continue

Pour les actions qui s'exécutent sur plusieurs cycles, utilisez le pattern Start-Continue avec journalisation appropriée :

```javascript
if (!myAction.started) {
  fsmLogger.action(`Execute: Start: ${actionType}`);
  // Logique d'initialisation
} else {
  fsmLogger.action(`Execute: Continue: ${actionType}`);
  // Logique de continuation
}
```

### 5. Gestion des erreurs

Implémentez une gestion appropriée des erreurs et des cas limites :

```javascript
// Vérifications préliminaires
if (!botVehicle) {
  fsmLogger.error('Action failed: Bot vehicle not found');
  return false;
}

// Timeouts pour éviter les blocages
if (elapsedTime > 5000) { // 5 secondes maximum
  fsmLogger.error(`Action timed out after ${elapsedTime}ms`);
  myAction.reset();
  changeState(BOT_STATES.IDLE);
  return false;
}

// Gestion des exceptions
try {
  // Code qui peut échouer
} catch (error) {
  fsmLogger.error(`Action failed with error: ${error.message}`);
  myAction.reset();
  changeState(BOT_STATES.IDLE);
  return false;
}
```

## Exemple complet : collectResourceAction

```javascript
export const collectResourceAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
  const botMemory = playerStore?.players?.player2?.memory;
  
  // Vérifications préliminaires
  if (!botVehicle || !tileStore) {
    fsmLogger.error('collectResource: Missing required stores');
    return false;
  }
  
  // Extraction du contexte
  const targetResource = botMemory?.currentTargetResource;
  
  // Debug
  fsmLogger.action(`Debug: collectResource called at position ${botVehicle.coord}, state: ${collectResourceAction.started}`);
  fsmLogger.action(`Debug: Target resource coord: ${targetResource?.coord}, Bot coord: ${botVehicle.coord}`);
  
  // Si première exécution, initialiser
  if (!collectResourceAction.started) {
    // Vérifier si le bot est sur une tuile avec des ressources
    if (!targetResource || botVehicle.coord !== targetResource.coord) {
      fsmLogger.error(`Bot not at resource location: ${botVehicle.coord} vs ${targetResource?.coord}`);
      return false;
    }
    
    // Initialisation pour la collecte
    collectResourceAction.started = true;
    collectResourceAction.startTime = Date.now();
    collectResourceAction.collectionTime = 2000; // 2 secondes pour collecter
    
    // Mise à jour de la mémoire du joueur
    playerStore.updatePlayerMemory('player2', { isCollecting: true });
    
    // Récupérer les ressources de la tuile pour référence
    const tileCoord = botVehicle.coord;
    const tileResources = tileStore.getTileAtCoord(tileCoord)?.resources;
    
    // Enregistrer pour référence
    collectResourceAction.tileCoord = tileCoord;
    collectResourceAction.resources = tileResources;
    
    fsmLogger.action(`Starting resource collection at ${tileCoord}: ${JSON.stringify(tileResources)}`);
    
    return undefined; // Collection en cours
  }
  
  // Vérifier si la collecte est terminée
  const elapsedTime = Date.now() - collectResourceAction.startTime;
  
  if (elapsedTime >= collectResourceAction.collectionTime) {
    // Collection complétée, mettre à jour le véhicule avec les ressources collectées
    playerStore.updateVehicle('player2', 'ship', {
      resources: {
        food: (botVehicle.resources?.food || 0) + (collectResourceAction.resources?.food || 0),
        debris: (botVehicle.resources?.debris || 0) + (collectResourceAction.resources?.debris || 0), 
        special: (botVehicle.resources?.special || 0) + (collectResourceAction.resources?.special || 0)
      }
    });
    
    // Marquer la tuile comme collectée
    tileStore.setTileCollected(collectResourceAction.tileCoord, true);
    
    // Mettre à jour la mémoire avec la ressource collectée
    playerStore.updatePlayerMemory('player2', {
      isCollecting: false,
      collectedResources: [...(botMemory.collectedResources || []), {
        coord: collectResourceAction.tileCoord,
        resources: collectResourceAction.resources,
        collectedAt: new Date().toISOString()
      }],
      // Supprimer des ressources connues mais non collectées
      knownResources: (botMemory.knownResources || []).filter(
        r => r.coord !== collectResourceAction.tileCoord
      )
    });
    
    // Log succès
    fsmLogger.action(`Resources collected successfully: ${JSON.stringify(botVehicle.resources)}`);
    
    // Notifier que la collecte est terminée et retourner à IDLE
    fsmLogger.action('Collection completed. Returning to IDLE for next action decision.');
    changeState(BOT_STATES.IDLE);
    
    // Réinitialiser les variables d'état
    collectResourceAction.reset();
    
    return true; // Action terminée avec succès
  }
  
  return undefined; // Collection toujours en cours
};

// Propriétés statiques
collectResourceAction.started = false;
collectResourceAction.startTime = null;
collectResourceAction.collectionTime = 2000;
collectResourceAction.tileCoord = null;
collectResourceAction.resources = null;

// Méthode de réinitialisation
collectResourceAction.reset = function() {
  this.started = false;
  this.startTime = null;
  this.tileCoord = null;
  this.resources = null;
};
```

## Intégration dans le système

Après avoir implémenté votre action, vous devez l'intégrer dans le système FSM :

### 1. Ajout au registre des actions

Dans `src/ai/fsm/actions/botActions.js` :

```javascript
// Importer l'action
import { myNewAction } from './individual/myNewAction';

export const BotActions = {
  // Actions existantes...
  myNewAction,
  
  // Ajouter à la map des types d'actions
  actionMap: {
    // Types existants...
    'myNewAction': 'myNewAction'
  }
};
```

### 2. Associer à un état (optionnel)

Si l'action est l'action par défaut d'un état, dans `src/ai/fsm/states/botStates.js` :

```javascript
[BOT_STATES.SOME_STATE]: {
  // ...
  defaultAction: { type: 'myNewAction', priority: PRIORITY.MEDIUM }
  // ...
}
```

### 3. Test et validation

Testez l'action en utilisant les outils de débogage intégrés :

1. Utilisez BotDebugger pour observer l'état des actions
2. Vérifiez les logs via fsmLogger
3. Testez les cas limites et les conditions d'erreur