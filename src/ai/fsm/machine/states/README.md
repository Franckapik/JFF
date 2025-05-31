# Guide du Système d'États FSM

## Introduction

Ce document explique le système d'états pour l'architecture de la Machine à États Finis (FSM).
Les états définissent les comportements possibles du bot et les transitions entre ces comportements.

## Structure des États

Les états sont organisés selon les comportements principaux du bot :

1. **État d'Évaluation** (`evaluating.js`) - État central pour l'analyse de situation et la prise de décision
2. **État d'Exploration** (`exploring.js`) - Recherche de nouvelles ressources dans l'environnement
3. **État de Collecte** (`collecting.js`) - Collecte des ressources découvertes
4. **État de Retour** (`returning.js`) - Retour à la base pour ravitaillement/déchargement
5. **État d'Inactivité à la Base** (`idleAtBase.js`) - Maintenance et attente à la base
6. **Index** (`index.js`) - Exports centralisés et constantes

## Comment Utiliser les États

### Structure d'un État

Chaque fichier d'état suit une structure similaire :

```javascript
import { state, transition, reduce } from 'robot3';
import { BOT_STATES } from './index.js';
import { RESOURCE_EVENT_TYPES } from '../events/resourceEvents.js';
import { contextReducers } from '../reducers/context.js';
import { discoveryGuards } from '../guards/discovery.js';

/**
 * État COLLECTING - Collecte de ressources
 */
export const collectingState = state(
  // Transitions vers d'autres états basées sur des événements
  transition(RESOURCE_EVENT_TYPES.RESOURCE_COLLECTED,
    BOT_STATES.EVALUATING,
    (context, event) => discoveryGuards.isResourceCollectionComplete(context, event),
    reduce((context, event) => contextReducers.resources.updateInventory(context, event))
  ),
  
  // Autre transition...
  transition(EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED,
    BOT_STATES.RETURNING,
    (context, event) => safetyGuards.isFuelCritical(context, event),
    reduce((context, event) => contextReducers.state.prepareReturning(context, { reason: 'low_fuel' }))
  )
);
```

### Transitions

Les transitions définissent comment le système passe d'un état à un autre:

1. **Événement** - Le déclencheur de la transition (ex: `RESOURCE_COLLECTED`)
2. **État cible** - L'état vers lequel transitionner (ex: `BOT_STATES.EVALUATING`)
3. **Garde** - Fonction qui détermine si la transition est autorisée
4. **Réducteur** - Fonction qui met à jour le contexte lors de la transition

### Utilisation dans le machineFactory

Le machine factory incorpore tous les états pour créer la FSM complète:

```javascript
import { createMachine } from 'robot3';
import { BOT_STATES } from './states/index.js';
import { 
  evaluatingState,
  exploringState,
  collectingState,
  returningState,
  idleAtBaseState 
} from './states/index.js';

export const createBotMachine = (botId, initialData = {}) => {
  return createMachine(
    BOT_STATES.EVALUATING,  // État initial
    {
      // Mapper les noms d'états à leur configuration
      [BOT_STATES.EVALUATING]: evaluatingState,
      [BOT_STATES.EXPLORING]: exploringState,
      [BOT_STATES.COLLECTING]: collectingState,
      [BOT_STATES.RETURNING]: returningState,
      [BOT_STATES.IDLE_AT_BASE]: idleAtBaseState,
    },
    // Fonction de création du contexte initial
    () => createEntityContext(botId, initialData)
  );
};
```

## États Disponibles

### 1. EVALUATING
État central qui analyse la situation et décide de l'action suivante.
- **Entrées**: Depuis n'importe quel autre état, ou au démarrage
- **Sorties**: Vers EXPLORING, COLLECTING, RETURNING, ou IDLE_AT_BASE
- **Événements clés**: `ASSESSMENT_COMPLETE`

### 2. EXPLORING
État de recherche et découverte de ressources.
- **Entrées**: Principalement depuis EVALUATING
- **Sorties**: Vers EVALUATING (après exploration) ou COLLECTING (si ressources trouvées)
- **Événements clés**: `DRONE_DEPLOYED`, `RESOURCES_DISCOVERED`, `AREA_EXPLORED`

### 3. COLLECTING
État de collecte et d'extraction des ressources.
- **Entrées**: Depuis EVALUATING ou EXPLORING
- **Sorties**: Vers EVALUATING (après collecte) ou RETURNING (si inventaire plein)
- **Événements clés**: `RESOURCE_COLLECTED`, `INVENTORY_FULL`

### 4. RETURNING
État de retour et navigation vers la base.
- **Entrées**: Depuis n'importe quel état (souvent en urgence)
- **Sorties**: Vers IDLE_AT_BASE (à l'arrivée)
- **Événements clés**: `MOVEMENT_STARTED`, `BASE_REACHED`

### 5. IDLE_AT_BASE
État de ravitaillement et maintenance à la base.
- **Entrées**: Depuis RETURNING
- **Sorties**: Vers EVALUATING (après ravitaillement)
- **Événements clés**: `REFUEL_COMPLETE`, `UNLOAD_COMPLETE`, `MAINTENANCE_COMPLETE`

## Bonnes Pratiques

1. **Séparation des préoccupations** - Chaque état gère un ensemble cohérent de comportements
2. **Gardes explicites** - Utilisez des gardes clairs pour les conditions de transition
3. **Réducteurs atomiques** - Les réducteurs doivent effectuer des transformations simples du contexte
4. **Priorité de transitions** - Ordonnez les transitions par priorité (urgences d'abord)
5. **Documentation** - Documentez clairement le but de chaque état et ses transitions
