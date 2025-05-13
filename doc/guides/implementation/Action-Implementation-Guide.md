# Guide d'implémentation des actions

Ce document explique comment implémenter correctement une nouvelle action dans la FSM du Bot.

## Structure d'une action

Chaque action doit suivre la structure suivante :

```javascript
export const myNewAction = (playerStore, tileStore, addAction, changeState) => {
  // 1. Récupération du contexte
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  
  // 2. Vérifications préliminaires
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found');
    return false;
  }
  
  // 3. Logique d'initialisation (premier appel)
  if (!myNewAction.started) {
    // Initialisation
    myNewAction.started = true;
    myNewAction.startTime = Date.now();
    
    return undefined; // Action en cours, reste bloquante
  }
  
  // 4. Logique de progression
  const elapsedTime = Date.now() - myNewAction.startTime;
  
  // 5. Logique de complétion
  if (/* condition de complétion */) {
    // Actions finales
    
    // Retour à l'état IDLE pour centraliser les décisions
    changeState(BOT_STATES.IDLE);
    addAction('evaluateIdle', PRIORITY.HIGH);
    
    // Réinitialiser les variables d'état
    myNewAction.reset();
    
    return true; // Action terminée avec succès
  }
  
  return undefined; // Action toujours en cours
};

// Propriétés statiques pour suivre l'état de l'action
myNewAction.started = false;
myNewAction.startTime = null;
// Autres propriétés selon les besoins

// Méthode pour réinitialiser les variables statiques
myNewAction.reset = function() {
  this.started = false;
  this.startTime = null;
  // Réinitialiser les autres propriétés
};
```

## Bonnes pratiques

### 1. Séparation des responsabilités

Une action ne doit PAS contenir de logique de décision d'état :
- Ne pas vérifier les conditions (niveau carburant, capacité max)
- Ne pas décider du prochain état basé sur des conditions
- Toujours retourner à IDLE pour la prise de décision

### 2. Gestion des états

L'action doit pouvoir être interrompue et reprise :
- Utiliser des propriétés statiques pour suivre l'état
- Implémenter une méthode `reset()` pour réinitialiser l'état
- Retourner `undefined` tant que l'action est en cours

### 3. Journalisation

Utilisez `fsmLogger` pour documenter le déroulement de l'action :
```javascript
fsmLogger.action(`Starting my action at ${botVehicle.coord}`);
fsmLogger.error('Something went wrong');
```

## Exemple complet : collectResourceAction

Voir le fichier `src/ai/fsm/actions/individual/collectResourceAction.js` pour un exemple complet d'implémentation d'action.

## Intégration dans le système

Après avoir implémenté votre action, vous devez l'ajouter au registre des actions :

```javascript
// Dans src/ai/fsm/actions/botActions.js
export const BotActions = {
  // Actions existantes...
  myNewAction: myNewAction,
  
  // Map des types d'actions aux fonctions d'exécution
  actionMap: {
    // Types existants...
    'myNewActionType': 'myNewAction'
  }
};
```