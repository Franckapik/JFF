# Guide du Système d'Événements FSM

## Introduction

Ce document explique le système d'événements centralisé pour l'architecture de la Machine à États Finis (FSM).
Les événements sont organisés par catégories et fournissent une manière structurée de communiquer entre les composants de l'application.

## Structure des Événements

Les événements sont organisés en plusieurs catégories :

1. **Événements Système** (`systemEvents.js`) - Événements générés par le système
2. **Événements Utilisateur** (`userEvents.js`) - Actions initiées par l'utilisateur
3. **Événements d'Urgence** (`emergencyEvents.js`) - Situations critiques requérant une attention immédiate
4. **Événements de Mouvement** (`movementEvents.js`) - Liés aux déplacements des entités
5. **Événements de Ressources** (`resourceEvents.js`) - Découverte et gestion des ressources
6. **Événements de Carburant** (`fuelEvents.js`) - Gestion du carburant des véhicules

## Comment Utiliser les Événements

### Création d'Événements

Pour créer un événement, utilisez les créateurs d'événements exportés dans chaque fichier de catégorie.

```javascript
import { events } from '../ai/fsm/machine/events';

// Créer un événement de mouvement
const moveEvent = events.movement.createMovementStartedEvent(
  { x: 0, y: 0 }, // startCoord
  { x: 10, y: 15 }, // targetCoord
  5000 // estimatedDuration en ms
);

// Envoyer l'événement à la machine FSM
send(moveEvent.type, moveEvent);
```

### Import des Événements Spécifiques

Si vous avez besoin uniquement d'une catégorie d'événements, vous pouvez les importer directement :

```javascript
import { movementEvents } from '../ai/fsm/machine/events';

const moveEvent = movementEvents.createMovementStartedEvent(
  startCoord, targetCoord, estimatedDuration
);
```

### Utilisation avec la Machine FSM

Dans les états FSM:

```javascript
import { RESOURCE_EVENT_TYPES } from '../events/resourceEvents';

export const collectingState = state(
  transition(RESOURCE_EVENT_TYPES.RESOURCE_COLLECTED,
    BOT_STATES.EVALUATING,
    (context, event) => discoveryGuards.isResourceCollectionComplete(context, event),
    reduce((context, event) => {
      return contextReducers.resources.updateInventory(context, event);
    })
  ),
  // ...autres transitions
);
```

Dans les hooks et composants React:

```javascript
import { useBotMachine } from '../hooks/useBotMachine';
import { events } from '../machine/events';

function BotController() {
  const { send } = useBotMachine('bot-1');
  
  const handleExploreClick = () => {
    const exploreEvent = events.user.createExplorationRequestedEvent({ x: 50, y: 50 });
    send(exploreEvent.type, exploreEvent);
  };
  
  // ...
}
```

## Avantages du Système Centralisé

1. **Cohérence** - Structure d'événement uniforme et prévisible
2. **Autodocumentation** - Chaque créateur d'événement décrit le format et les données attendues
3. **Typage** - Facilite l'autocomplétion et la validation des événements
4. **Maintenabilité** - Point central pour la gestion des événements
5. **Évolutivité** - Facile à étendre avec de nouveaux types d'événements

## Bonnes Pratiques

1. **Utilisez toujours les créateurs d'événements** plutôt que de construire des objets d'événement manuellement
2. **Incluez des données contextuelles** précises dans les événements
3. **Ajoutez de nouveaux événements** dans le fichier de catégorie approprié
4. **Réutilisez les événements existants** plutôt que d'en créer de nouveaux similaires
5. **Documentez les nouveaux événements** avec des commentaires JSDoc
