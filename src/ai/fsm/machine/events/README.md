# Guide du Système d'Événements FSM

## Introduction

Ce document explique le système d'événements centralisé pour l'architecture de la Machine à États Finis (FSM).
Les événements sont organisés par catégories et fournissent une manière structurée de communiquer entre les composants de l'application.

**Statut**: Analyse basée sur l'utilisation réelle observée dans les logs et le code.

## Structure des Événements

Les événements sont organisés en plusieurs catégories avec leur statut d'utilisation :

1. **Événements Système** (`systemEvents.js`) ✅ **UTILISÉS** - Événements générés par le système
2. **Événements Utilisateur** (`userEvents.js`) ✅ **DISPONIBLES** - Actions initiées par l'utilisateur
3. **Événements d'Urgence** (`emergencyEvents.js`) ✅ **DISPONIBLES** - Situations critiques
4. **Événements de Mouvement** (`movementEvents.js`) ⚠️ **PARTIELS** - Déplacements des entités
5. **Événements de Ressources** (`resourceEvents.js`) ❌ **NON UTILISÉS** - Gestion des ressources
6. **Événements de Carburant** (`fuelEvents.js`) ❌ **NON UTILISÉS** - Gestion du carburant

## Événements par Statut d'Utilisation

### ✅ Événements Activement Utilisés

#### System Events (systemEvents.js)
- `EVALUATION_COMPLETE` - Fin d'évaluation, déclenche transitions
- `AUTO` - Événement automatique périodique  
- `PROSPECTING_COMPLETE` - Fin de prospection
- `DRONE_REACHED_TARGET` - Drone arrivé à destination

#### Movement Events (movementEvents.js) - Partiels
- `MOVEMENT_STARTED` ✅ - Début de mouvement (fonctionne)
- `MOVEMENT_PROGRESS` ✅ - Progression de mouvement (fonctionne)  
- `BASE_REACHED` ❌ - Arrivée à la base (PROBLÉMATIQUE - ne se déclenche jamais)

#### User Events (userEvents.js) - Disponibles
- `MANUAL_OVERRIDE` - Override manuel (fonctionne quand utilisé)
- `EXPLORATION_REQUESTED` - Demande d'exploration manuelle

#### Emergency Events (emergencyEvents.js) - Disponibles
- `EMERGENCY_DETECTED` - Urgence générale (système fonctionnel)

### ❌ Événements Non Utilisés (Candidats à Commenter)

#### Resource Events (resourceEvents.js) - Totalement inutilisés
```javascript
// ❌ TOUS NON UTILISÉS - Collection de ressources non implémentée
// RESOURCE_DISCOVERED, RESOURCE_COLLECTED, RESOURCE_DEPLETED
// RESOURCE_UNAVAILABLE, INVENTORY_FULL, INVENTORY_EMPTY
```

#### Fuel Events (fuelEvents.js) - Totalement inutilisés  
```javascript
// ❌ TOUS NON UTILISÉS - Gestion carburant non implémentée
// REFUEL_STARTED, REFUEL_COMPLETE, LOW_FUEL_DETECTED
// CRITICAL_FUEL_DETECTED, FUEL_CONSUMED
```

## Comment Utiliser les Événements

> ⚠️ **Important**: Utiliser la syntaxe correcte React-Robot/XState pour l'envoi d'événements

### ✅ Événements Recommandés (Utilisés)

```javascript
import { events } from '../ai/fsm/machine/events';

// Événements système (utilisés)
const evalComplete = events.system.createAssessmentCompleteEvent('exploring', 'auto_exploration');
const autoEvent = events.system.createAutoEvent();

// Événements de mouvement (partiellement utilisés)
const moveEvent = events.movement.createMovementStartedEvent(
  { x: 0, y: 0 }, // startCoord
  { x: 10, y: 15 }, // targetCoord
  5000 // estimatedDuration en ms
);

// Événements utilisateur (disponibles)
const overrideEvent = events.user.createManualOverrideEvent('stop', {});

// ✅ SYNTAXE CORRECTE - Passer l'objet événement ENTIER
send(moveEvent); // ✅ Correct
// ❌ send(moveEvent.type, moveEvent); // Incorrect - ne transmet pas les données
```

### 🔍 Syntaxe React-Robot/XState

#### ❌ Syntaxe Incorrecte (Ne Fonctionne Pas)
```javascript
// ❌ FAUX - L'action ne recevra que le type, sans les données
const eventObject = movementEvents.createUpdatePositionEvent(
  visualPosition,
  'ship',
  tileCoord,
  tileCoord
);

send(eventObject.type, {
  position: eventObject.position,
  coord: eventObject.coord,
  newCoord: eventObject.newCoord
}); // ❌ Les données ne seront pas transmises
```

#### ✅ Syntaxe Correcte (Fonctionne)
```javascript
// ✅ CORRECT - L'action reçoit toutes les propriétés
const eventObject = movementEvents.createUpdatePositionEvent(
  visualPosition,
  'ship',
  tileCoord,
  tileCoord
);

send(eventObject); // ✅ Passer l'objet événement complet
```

### ⚠️ Import des Événements Spécifiques

```javascript
// Recommandé - événements utilisés
import { systemEvents } from '../ai/fsm/machine/events/systemEvents';
import { movementEvents } from '../ai/fsm/machine/events/movementEvents';
import { userEvents } from '../ai/fsm/machine/events/userEvents';

// ❌ À éviter - événements non utilisés
// import { resourceEvents } from '../ai/fsm/machine/events/resourceEvents';
// import { fuelEvents } from '../ai/fsm/machine/events/fuelEvents';
```

### ✅ Utilisation dans les États FSM (Fonctionnelle)

```javascript
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents';
import { MOVEMENT_EVENT_TYPES } from '../events/movementEvents';

export const exploringState = state(
  // ✅ Transition utilisée et fonctionnelle
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE,
    BOT_STATES.EXPLORING_DEPLOYING,
    (context, event) => discoveryGuards.hasUnexploredAreas(context, event),
    reduce((context, event) => {
      // ✅ L'événement contient toutes les propriétés nécessaires
      return contextReducers.state.prepareExploring(context, event);
    })
  ),

  // ⚠️ Transition problématique
  transition(MOVEMENT_EVENT_TYPES.BASE_REACHED,
    BOT_STATES.IDLE_AT_BASE,
    (context, event) => baseGuards.isAtBase(context, event), // ❌ Guard peut être défaillant
    reduce((context, event) => {
      // ✅ Toutes les propriétés de l'événement sont disponibles
      const { position, coord, timestamp } = event;
      return contextReducers.state.prepareIdleAtBase(context, event);
    })
  )
);
```

### 🔧 Exemples d'Envoi dans les Hooks/Composants

#### ✅ Dans un Hook de Tracking
```javascript
// src/ai/fsm/hooks/useFSMShipTracker.js
import { movementEvents } from '../machine/events/movementEvents';

const useFSMShipTracker = (botId) => {
  const { send } = useBotMachine(botId);
  
  const handlePositionUpdate = (visualPosition, tileCoord) => {
    // ✅ Créer l'événement avec tous les paramètres
    const eventObject = movementEvents.createUpdatePositionEvent(
      visualPosition,
      'ship',
      tileCoord,
      tileCoord
    );
    
    // ✅ Validation recommandée (debugging)
    fsmLogger.context(`🚀 Sending UPDATE_POSITION event:`, {
      hasPosition: !!eventObject.position,
      hasCoord: !!eventObject.coord,
      eventData: eventObject
    });
    
    // ✅ SYNTAXE CORRECTE - Objet complet
    send(eventObject);
  };
};
```

#### ✅ Dans un Composant React
```javascript
// Composant de contrôle bot
function BotController({ botId }) {
  const { send } = useBotMachine(botId);
  
  const handleManualOverride = () => {
    // ✅ Créer l'événement avec la factory
    const overrideEvent = userEvents.createManualOverrideEvent('stop', {
      reason: 'user_intervention',
      timestamp: Date.now()
    });
    
    // ✅ Envoi correct
    send(overrideEvent);
  };
  
  const handleExplorationRequest = (targetCoord) => {
    // ✅ Événement d'exploration
    const exploreEvent = userEvents.createExplorationRequestedEvent(targetCoord);
    
    // ✅ Toujours passer l'objet complet
    send(exploreEvent);
  };
}
    reduce((context, event) => {
      return contextReducers.state.prepareIdleAtBase(context, event);
    })
  )
);
```

### ❌ Utilisation Non Recommandée (Non Implémentée)

```javascript
// ❌ ÉVITER - Ces événements ne sont jamais déclenchés
import { RESOURCE_EVENT_TYPES } from '../events/resourceEvents';

export const collectingState = state(
  // ❌ Transition non utilisée car collection non implémentée
  transition(RESOURCE_EVENT_TYPES.RESOURCE_COLLECTED,
    BOT_STATES.EVALUATING,
    (context, event) => discoveryGuards.isResourceCollectionComplete(context, event),
    reduce((context, event) => {
      return contextReducers.resources.updateInventory(context, event);
    })
  )
);
```

## Problèmes Identifiés et Solutions

### ⚠️ Événement BASE_REACHED Problématique

**Problème**: L'événement `BASE_REACHED` ne se déclenche jamais, causant des bots bloqués dans `exploring_returning`.

**Code Problématique**:
```javascript
// ❌ Cette transition ne fonctionne jamais
transition(MOVEMENT_EVENT_TYPES.BASE_REACHED, BOT_STATES.IDLE_AT_BASE,
  guard((context, event) => baseGuards.isAtBase(context, event)), // Guard défaillant
  reduce(...)
)
```

**Solution Recommandée**: Ajouter un mécanisme de timeout
```javascript
// ✅ Solution de contournement
transition(SYSTEM_EVENT_TYPES.EXPLORATION_TIMEOUT, BOT_STATES.IDLE_AT_BASE,
  guard((context, event) => {
    const timeInState = Date.now() - (context.lastStateChange || 0);
    return timeInState > 30000; // 30 secondes
  }),
  reduce(...)
)
```

## Avantages du Système Centralisé

1. **Organisation claire** - Événements groupés par domaine fonctionnel
2. **Typage strict** - Constantes exportées pour éviter les erreurs de frappe
3. **Créateurs standardisés** - Interface cohérente pour créer des événements
4. **Documentation intégrée** - Chaque événement est documenté avec ses paramètres
5. **Analyse d'utilisation** - Identification facile des composants utilisés vs non utilisés

## Bonnes Pratiques

1. **Utilisez les créateurs d'événements** - Ne créez jamais d'événements manuellement
2. **Vérifiez le statut d'utilisation** - Évitez les événements marqués comme non utilisés
3. **Testez les transitions critiques** - Notamment BASE_REACHED et les timeouts  
4. **Commentez les événements non utilisés** - Gardez le code propre
5. **Surveillez les logs** - Identifiez les événements qui ne se déclenchent jamais
```

## Migration depuis l'Ancienne Syntaxe

Pour les développeurs migrant depuis l'ancienne syntaxe:

```javascript
// ❌ ANCIENNE SYNTAXE (Ne fonctionne pas correctement)
import { useBotMachine } from '../hooks/useBotMachine';
import { events } from '../machine/events';

function BotController() {
  const { send } = useBotMachine('bot-1');
  
  const handleExploreClick = () => {
    const exploreEvent = events.user.createExplorationRequestedEvent({ x: 50, y: 50 });
    // ❌ INCORRECT - Les données de l'événement ne sont pas transmises
    send(exploreEvent.type, exploreEvent);
  };
}

// ✅ NOUVELLE SYNTAXE (Correcte)
function BotController() {
  const { send } = useBotMachine('bot-1');
  
  const handleExploreClick = () => {
    const exploreEvent = events.user.createExplorationRequestedEvent({ x: 50, y: 50 });
    // ✅ CORRECT - L'objet événement complet est transmis
    send(exploreEvent);
  };
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
