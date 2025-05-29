# Documentation FSM - Index

Ce fichier a été divisé en deux documents spécialisés :

## 📋 [Analyse de la FSM Actuelle](./fsm-current-analysis.md)
- Table détaillée des états, transitions et conditions actuelles
- Analyse des problèmes et limitations de l'architecture existante
- Critique de l'anti-pattern IDLE central et des incohérences

## 🚀 [Architecture FSM Optimisée](./fsm-optimized-architecture.md)
- Nouvelle architecture React-Robot avec états optimisés
- Structure de fichiers modulaire sans stores séparés
- Actions partagées et interface uniforme Bot/Player
- Exemples d'implémentation complets

---

## Résumé des Changements Principaux

### ❌ **Problèmes Actuels Identifiés**
1. **Anti-pattern IDLE central** - Tous les états reviennent à IDLE
2. **Pas de transitions d'urgence directes** - Délais dangereux
3. **Timeouts incohérents** - 30s vs 2s selon les états
4. **Duplication de logique** - Conditions répétées
5. **Couplage fort Store/FSM** - Difficile à maintenir

### ✅ **Solutions Proposées**
1. **État EVALUATING dédié** - Évaluation rapide (1s) sans être un hub
2. **Transitions directes `* → RETURNING`** - Urgences immédiates
3. **Timeouts unifiés** - Gestion cohérente par état
4. **Guards composables** - Logique réutilisable
5. **Actions partagées** - Bot/Player utilisent les mêmes actions core

### 🎯 **Architecture Cible**
```
EVALUATING ↔ EXPLORING ↔ COLLECTING
    ↕            ↕          ↕
IDLE_AT_BASE ← RETURNING ←  *
```

- **5 états optimisés** vs 4 états actuels
- **React-Robot** au lieu de FSM custom
- **Structure Player uniforme** pour bots et humains
- **Actions shared/core/** réutilisables

## Table des États, Transitions, Actions et Conditions

| **État** | **Transitions Possibles** | **Actions Disponibles** | **Conditions de Transition** | **Actions d'Entrée** | **Actions de Sortie** |
|----------|---------------------------|--------------------------|------------------------------|----------------------|----------------------|
| **IDLE** | `EXPLORING`<br>`COLLECTING`<br>`RETURNING` | - `evaluateConditionsFromIdle`<br>- `refuel` (si à la base)<br>- `moveToResource`<br>- `exploreDrone`<br>- `returnToBase` | **Vers EXPLORING:**<br>- À la base ET carburant plein<br>- Pas assez de ressources connues<br>- `hasEnoughFuel() && !hasEnoughKnownResources()`<br><br>**Vers COLLECTING:**<br>- Ressources connues disponibles<br>- Carburant suffisant<br>- `hasEnoughKnownResources() && hasEnoughFuel()`<br><br>**Vers RETURNING:**<br>- Carburant bas (`fuel < 50`)<br>- Capacité maximale atteinte<br>- `isLowFuel() \|\| isAtMaxCapacity()` | `StateUtils.handleStateEnter()` | `StateUtils.handleStateExit()` |
| **EXPLORING** | `IDLE` | - `exploreWithDrone`<br>- Timeout après 30s<br>- Retour automatique à IDLE | **Vers IDLE:**<br>- Drone de retour au vaisseau<br>- Ressources découvertes<br>- Exploration terminée<br>- `isDroneAtShip() && hasExplored`<br>- Conditions critiques (carburant/capacité) | `StateUtils.handleStateEnter()` | `StateUtils.handleStateExit()` |
| **COLLECTING** | `IDLE`<br>`RETURNING` | - `moveToResourceAction`<br>- `collectResourceAction`<br>- Séquence en 2 étapes | **Vers IDLE:**<br>- Toutes ressources collectées<br>- `allKnownResourcesCollected()`<br><br>**Vers RETURNING:**<br>- Capacité maximale atteinte<br>- `isAtMaxCapacity()` | `StateUtils.handleStateEnter()` | `StateUtils.handleStateExit()` |
| **RETURNING** | `IDLE` | - `returnToBaseAction`<br>- Déplacement vers base<br>- Timeout après 30s | **Vers IDLE:**<br>- Arrivé à la base<br>- `isAtBase(botVehicle)`<br>- `botVehicle.coord === botVehicle.startCoord` | `StateUtils.handleStateEnter()` | `StateUtils.handleStateExit()` |

## Conditions Détaillées

### 🔴 Conditions de Sécurité (Priorité SAFETY = 4)

| **Condition** | **Fonction** | **Seuils** | **Action Résultante** |
|---------------|-------------|------------|----------------------|
| Carburant bas | `isLowFuel(botVehicle, threshold=50)` | `fuel < 50` | `returnToBase` (PRIORITY.HIGH) |
| Carburant suffisant | `hasEnoughFuel(botVehicle, threshold=50)` | `fuel >= 50` | Permet autres actions |
| Capacité maximale | `isAtMaxCapacity(botVehicle)` | `food >= maxFood \|\| debris >= maxDebris \|\| special >= maxSpecial` | `returnToBase` (PRIORITY.HIGH) |

### 🟡 Conditions de Capacité (Priorité CAPACITY = 3)

| **Condition** | **Fonction** | **Logique** | **Action Résultante** |
|---------------|-------------|-------------|----------------------|
| À la base | `isAtBase(botVehicle)` | `botVehicle.coord === botVehicle.startCoord` | Permet ravitaillement |
| Plein de carburant | `isFullyRefueled(botVehicle)` | `fuel >= 100` | Permet exploration/collecte |

### 🟠 Conditions d'Efficacité (Priorité EFFICIENCY = 2)

| **Condition** | **Fonction** | **Logique** | **Action Résultante** |
|---------------|-------------|-------------|----------------------|
| Ressources connues suffisantes | `hasEnoughKnownResources()` | `knownResources.length >= 3` | `moveToResource` vers COLLECTING |
| Ressources découvertes | `hasDiscoveredResources()` | `hasNewResourceDiscovery === true` | Transition vers IDLE pour réévaluation |
| Toutes ressources collectées | `allKnownResourcesCollected()` | Vérification mémoire du bot | Retour IDLE |

### 🔵 Conditions de Découverte (Priorité DISCOVERY = 1)

| **Condition** | **Fonction** | **Logique** | **Action Résultante** |
|---------------|-------------|-------------|----------------------|
| Besoin d'explorer | `shouldExplore(botVehicle)` | `!hasEnoughKnownResources() && hasEnoughFuel()` | `exploreDrone` vers EXPLORING |
| Drone au vaisseau | `isDroneAtShip()` | `useDroneState.isDroneDocked(botDroneId)` | Permet nouvelle exploration |
| Drone en mouvement | `isDroneMoving()` | `droneState.isDroneInState(...MOVING_TO_TARGET \|\| RETURNING_TO_SHIP)` | Attendre fin mouvement |

## Actions Spécifiques

### Actions par État

| **Action** | **État Source** | **Description** | **Durée/Timeout** | **Conditions d'Échec** |
|------------|-----------------|-----------------|------------------|----------------------|
| `evaluateConditionsFromIdle` | IDLE | Évalue les conditions et décide du prochain état | Throttling 2s | - |
| `exploreWithDrone` | EXPLORING | Envoie drone explorer tuile non découverte | 30s timeout | Drone indisponible |
| `moveToResourceAction` | COLLECTING | Déplace vaisseau vers meilleure ressource | 30s timeout | Pas de ressources |
| `collectResourceAction` | COLLECTING | Collecte ressource à la position actuelle | - | Pas à la tuile cible |
| `returnToBaseAction` | RETURNING | Retour à la tuile de départ | 30s timeout | Base introuvable |
| `refuelAtBaseAction` | IDLE/BASE | Ravitaillement et transfert ressources | - | Pas à la base |

### Logique de File d'Actions

- **File unique par bot** dans `useBotStore`
- **Priorités**: URGENT(4) > HIGH(3) > MEDIUM(2) > LOW(1)
- **États d'action**: PENDING, IN_PROGRESS, COMPLETED, FAILED
- **Vidage de file** lors des changements d'état

## Architecture React-Robot Optimisée

### Table des États, Transitions, Actions et Conditions (Version Améliorée)

| **État** | **Transitions Possibles** | **Actions Disponibles** | **Conditions de Transition** | **Actions d'Entrée** | **Actions de Sortie** |
|----------|---------------------------|--------------------------|------------------------------|----------------------|----------------------|
| **EVALUATING** | `EXPLORING`<br>`COLLECTING`<br>`RETURNING`<br>`IDLE_AT_BASE` | - `assessSituation`<br>- `prioritizeActions`<br>- `checkSafetyConditions` | **Vers EXPLORING:**<br>- `needsExploration && hasEnoughFuel && !atBase`<br>- `knownResources.length < 3 && fuel >= 50`<br><br>**Vers COLLECTING:**<br>- `hasKnownResources && hasEnoughFuel`<br>- `knownResources.length > 0 && fuel >= 50`<br><br>**Vers RETURNING:**<br>- `isLowFuel \|\| isAtMaxCapacity`<br>- `fuel < 50 \|\| atMaxCapacity`<br><br>**Vers IDLE_AT_BASE:**<br>- `isAtBase && isFullyRefueled`<br>- `coord === startCoord && fuel >= 100` | `logStateEntry('EVALUATING')` | `logStateExit('EVALUATING')` |
| **EXPLORING** | `COLLECTING`<br>`RETURNING`<br>`EVALUATING` | - `deployDrone`<br>- `scanArea`<br>- `updateResourceMap`<br>- Timeout: 30s | **Vers COLLECTING:**<br>- `resourcesDiscovered && hasEnoughFuel`<br>- `newResources.length > 0 && fuel >= 50`<br><br>**Vers RETURNING:**<br>- `isLowFuel \|\| isAtMaxCapacity`<br>- `fuel < 50 \|\| atMaxCapacity`<br><br>**Vers EVALUATING:**<br>- `explorationComplete \|\| droneTimeout`<br>- `isDroneAtShip && hasExplored` | `deployDrone()`<br>`startExplorationTimer()` | `recallDrone()`<br>`clearExplorationTimer()` |
| **COLLECTING** | `EXPLORING`<br>`RETURNING`<br>`EVALUATING` | - `moveToResource`<br>- `harvestResource`<br>- `updateInventory`<br>- Timeout: 30s | **Vers EXPLORING:**<br>- `areaDepletedButCanExplore`<br>- `allLocalResourcesCollected && hasEnoughFuel && needsMoreResources`<br><br>**Vers RETURNING:**<br>- `isAtMaxCapacity \|\| isLowFuel`<br>- `atMaxCapacity \|\| fuel < 50`<br><br>**Vers EVALUATING:**<br>- `allTargetResourcesCollected`<br>- `targetResources.every(r => r.collected)` | `selectBestResource()`<br>`startCollectionTimer()` | `finalizeCollection()`<br>`clearCollectionTimer()` |
| **RETURNING** | `IDLE_AT_BASE`<br>`EVALUATING` | - `navigateToBase`<br>- `optimizeRoute`<br>- `monitorFuel`<br>- Timeout: 45s | **Vers IDLE_AT_BASE:**<br>- `arrivedAtBase`<br>- `coord === startCoord`<br><br>**Vers EVALUATING:**<br>- `emergencyConditionsResolved && !atBase`<br>- `fuel > 70 && !atMaxCapacity && !atBase` | `calculateRouteToBase()`<br>`startReturnTimer()` | `clearReturnTimer()` |
| **IDLE_AT_BASE** | `EVALUATING` | - `refuelVehicle`<br>- `transferResources`<br>- `performMaintenance`<br>- `awaitOrders` | **Vers EVALUATING:**<br>- `refuelingComplete \|\| manualCommand`<br>- `fuel >= 100 \|\| hasNewObjectives`<br><br>**Auto-transition après:**<br>- Ravitaillement complet<br>- Nouveau commandement reçu | `initializeRefueling()`<br>`transferResourcesToBase()` | `finalizeBaseOperations()` |

### Guards Optimisés pour React-Robot

| **Guard** | **Fonction** | **Logique** | **États Concernés** |
|-----------|-------------|-------------|-------------------|
| `needsExploration` | `(ctx) => ctx.knownResources?.length < 3` | Besoin de découvrir plus de ressources | EVALUATING → EXPLORING |
| `hasKnownResources` | `(ctx) => ctx.knownResources?.length > 0` | Des ressources sont disponibles pour collecte | EVALUATING → COLLECTING |
| `hasEnoughFuel` | `(ctx) => ctx.botVehicle?.fuel >= 50` | Carburant suffisant pour opérations | Toutes transitions sauf RETURNING |
| `isLowFuel` | `(ctx) => ctx.botVehicle?.fuel < 50` | Carburant critique - retour obligatoire | Toutes → RETURNING |
| `isAtMaxCapacity` | `(ctx) => ctx.botVehicle?.atMaxCapacity === true` | Inventaire plein - retour obligatoire | Toutes → RETURNING |
| `isAtBase` | `(ctx) => ctx.botVehicle?.coord === ctx.botVehicle?.startCoord` | Position à la base de départ | RETURNING → IDLE_AT_BASE |
| `isFullyRefueled` | `(ctx) => ctx.botVehicle?.fuel >= 100` | Ravitaillement terminé | IDLE_AT_BASE → EVALUATING |
| `resourcesDiscovered` | `(ctx) => ctx.hasNewResourceDiscovery === true` | Nouvelles ressources trouvées | EXPLORING → COLLECTING |
| `explorationComplete` | `(ctx) => ctx.isDroneAtShip && ctx.hasExplored` | Exploration terminée avec succès | EXPLORING → EVALUATING |
| `areaDepletedButCanExplore` | `(ctx) => ctx.allLocalResourcesCollected && hasEnoughFuel(ctx) && needsExploration(ctx)` | Zone épuisée mais peut explorer ailleurs | COLLECTING → EXPLORING |

### Événements Système Optimisés

| **Événement** | **Données** | **Transitions Déclenchées** | **Réducteur (Context Update)** |
|---------------|-------------|----------------------------|--------------------------------|
| `FUEL_CRITICAL` | `{ fuel: number, threshold: 30 }` | `* → RETURNING` | `updateFuel` |
| `CAPACITY_REACHED` | `{ resources: object }` | `COLLECTING → RETURNING` | `updateInventory` |
| `RESOURCES_DISCOVERED` | `{ resources: array, location: coord }` | `EXPLORING → COLLECTING` | `addKnownResources` |
| `AREA_EXPLORED` | `{ completedSections: array }` | `EXPLORING → EVALUATING` | `markAreaExplored` |
| `RESOURCE_COLLECTED` | `{ resource: object, newInventory: object }` | `COLLECTING → EVALUATING` | `updateInventory` |
| `BASE_REACHED` | `{ coord: string, timestamp: number }` | `RETURNING → IDLE_AT_BASE` | `updatePosition` |
| `REFUEL_COMPLETE` | `{ fuel: 100 }` | `IDLE_AT_BASE → EVALUATING` | `updateFuel` |
| `EMERGENCY_RESOLVED` | `{ condition: string }` | `RETURNING → EVALUATING` | `clearEmergencyFlag` |
| `MANUAL_OVERRIDE` | `{ command: string, params: object }` | `* → EVALUATING` | `setManualCommand` |

### Actions avec Side Effects

| **Action** | **État** | **Side Effects** | **Timeout** | **Événements Émis** |
|------------|----------|------------------|-------------|-------------------|
| `deployDrone` | EXPLORING | `droneStore.launchDrone(targetArea)` | 30s | `DRONE_DEPLOYED` |
| `harvestResource` | COLLECTING | `resourceStore.collectResource(targetResource)` | 10s | `RESOURCE_HARVESTED` |
| `navigateToBase` | RETURNING | `movementStore.moveToCoord(baseCoord)` | 45s | `MOVEMENT_STARTED` |
| `refuelVehicle` | IDLE_AT_BASE | `vehicleStore.refuel(botId)` | 5s | `REFUEL_STARTED` |
| `assessSituation` | EVALUATING | `conditionsStore.evaluateAll(botId)` | 1s | `ASSESSMENT_COMPLETE` |

### Avantages de cette Architecture

1. **✅ Élimination de l'anti-pattern IDLE central**
2. **✅ Transitions directes pour urgences** (`* → RETURNING`)
3. **✅ État EVALUATING rapide** (1s vs 2s throttling)
4. **✅ Guards composables et réutilisables**
5. **✅ Gestion cohérente des timeouts**
6. **✅ Séparation claire : logique vs exécution**
7. **✅ Context centralisé dans la machine**
8. **✅ Side effects externalisés**

Cette architecture optimisée élimine les problèmes identifiés tout en conservant la logique métier essentielle du système actuel.

# Structure de Fichiers pour FSM Optimisée avec React-Robot

## Architecture Proposée (Sans Store)

```
src/
├── ai/
│   └── fsm/
│       ├── index.js                     # Point d'entrée principal
│       ├── machine/
│       │   ├── botMachine.js           # Définition de la machine principale
│       │   ├── context/
│       │   │   ├── index.js            # Export du contexte initial
│       │   │   ├── initialContext.js   # Création du contexte initial
│       │   │   └── contextHelpers.js   # Utilitaires pour le contexte
│       │   ├── states/
│       │   │   ├── index.js            # Export des constantes d'états
│       │   │   ├── evaluating.js      # État EVALUATING + transitions
│       │   │   ├── exploring.js       # État EXPLORING + transitions
│       │   │   ├── collecting.js      # État COLLECTING + transitions
│       │   │   ├── returning.js       # État RETURNING + transitions
│       │   │   └── idleAtBase.js       # État IDLE_AT_BASE + transitions
│       │   ├── guards/
│       │   │   ├── index.js            # Export de tous les guards
│       │   │   ├── safety.js          # Guards de sécurité (fuel, capacity)
│       │   │   ├── efficiency.js      # Guards d'efficacité (resources)
│       │   │   ├── discovery.js       # Guards d'exploration
│       │   │   └── base.js             # Guards liés à la base
│       │   ├── actions/
│       │   │   ├── index.js            # Export de toutes les actions
│       │   │   ├── exploration.js     # Actions d'exploration
│       │   │   ├── collection.js      # Actions de collecte
│       │   │   ├── navigation.js      # Actions de navigation
│       │   │   ├── assessment.js      # Actions d'évaluation
│       │   │   └── base.js             # Actions à la base
│       │   ├── events/
│       │   │   ├── index.js            # Export des événements
│       │   │   ├── system.js          # Événements système
│       │   │   ├── user.js            # Événements utilisateur
│       │   │   └── emergency.js       # Événements d'urgence
│       │   └── reducers/
│       │       ├── index.js            # Export des réducteurs
│       │       ├── fuel.js             # Gestion du carburant
│       │       ├── inventory.js        # Gestion des ressources
│       │       └── position.js         # Gestion de la position
│       ├── hooks/
│       │   ├── useBotMachine.js        # Hook principal pour la machine
│       │   ├── useBotActions.js        # Hook pour les actions
│       │   └── useBotEvents.js         # Hook pour les événements
│       ├── utils/
│       │   ├── machineHelpers.js       # Utilitaires pour la machine
│       │   ├── stateValidation.js      # Validation des états
│       │   └── debugging.js            # Outils de debug
│       └── types/
│           ├── machine.d.ts            # Types TypeScript (optionnel)
│           └── context.d.ts            # Types pour le contexte
├── components/
│   ├── Bot/
│   │   ├── BotController.jsx           # Contrôleur principal du bot
│   │   ├── BotDebugPanel.jsx           # Panel de debug FSM
│   │   ├── BotStateDisplay.jsx         # Affichage d'état
│   │   └── BotActionButtons.jsx        # Boutons d'actions manuelles
│   └── FSM/
│       ├── FSMVisualizer.jsx           # Visualisateur de la machine
│       ├── StateTransitionGraph.jsx    # Graphique des transitions
│       └── ContextInspector.jsx        # Inspecteur du contexte
└── tests/ (optionnel)
    ├── ai/
    │   ├── fsm/
    │   │   ├── machine.test.js          # Tests de la machine
    │   │   ├── guards.test.js           # Tests des guards
    │   │   ├── actions.test.js          # Tests des actions
    │   │   └── integration.test.js      # Tests d'intégration
    │   └── scenarios/
    │       ├── exploration.test.js      # Scénarios d'exploration
    │       ├── collection.test.js       # Scénarios de collecte
    │       └── emergency.test.js        # Scénarios d'urgence
    └── components/
        └── Bot/
            └── BotController.test.jsx
```

## Détail des Fichiers Clés

### 1. Machine Principale (`src/ai/fsm/machine/botMachine.js`)

```javascript
import { createMachine } from 'robot3';
import { BOT_STATES } from './states';
import { guards } from './guards';
import { actions } from './actions';
import { createInitialContext } from './context';

export const createBotMachine = (botId, initialData = {}) => {
  return createMachine(
    BOT_STATES.EVALUATING,
    {
      [BOT_STATES.EVALUATING]: evaluatingState,
      [BOT_STATES.EXPLORING]: exploringState,
      [BOT_STATES.COLLECTING]: collectingState,
      [BOT_STATES.RETURNING]: returningState,
      [BOT_STATES.IDLE_AT_BASE]: idleAtBaseState,
    },
    () => createInitialContext(botId, initialData)
  );
};
```

### 2. Contexte Initial (`src/ai/fsm/machine/context/initialContext.js`)

```javascript
export const createInitialContext = (botId, initialData = {}) => ({
  // Identité du bot
  botId,
  
  // État du véhicule
  botVehicle: {
    fuel: 100,
    maxFuel: 100,
    coord: '0,0',
    startCoord: '0,0',
    food: 0,
    maxFood: 50,
    debris: 0,
    maxDebris: 50,
    special: 0,
    maxSpecial: 10,
    ...initialData.vehicle
  },
  
  // Ressources connues
  knownResources: [],
  
  // État de l'exploration
  hasExplored: false,
  isDroneAtShip: true,
  hasNewResourceDiscovery: false,
  
  // Seuils configurables
  fuelThreshold: 50,
  
  // Données de l'état actuel
  currentAction: null,
  lastStateChange: Date.now(),
  
  // Override des données initiales
  ...initialData
});
```

### 3. États Modulaires (`src/ai/fsm/machine/states/evaluating.js`)

```javascript
import { state, transition } from 'robot3';
import { BOT_STATES } from './index';
import { guards } from '../guards';
import { actions } from '../actions';

export const evaluatingState = state(
  // Transitions de sécurité (priorité max)
  transition('FUEL_CRITICAL', BOT_STATES.RETURNING, {
    guard: guards.isLowFuel,
    reduce: actions.updateFuelLevel
  }),
  
  transition('CAPACITY_REACHED', BOT_STATES.RETURNING, {
    guard: guards.isAtMaxCapacity,
    reduce: actions.updateInventory
  }),
  
  // Transitions de logique métier
  transition('NEEDS_EXPLORATION', BOT_STATES.EXPLORING, {
    guard: guards.needsExploration,
    reduce: actions.startExploration
  }),
  
  transition('HAS_RESOURCES', BOT_STATES.COLLECTING, {
    guard: guards.hasKnownResources,
    reduce: actions.startCollection
  }),
  
  transition('AT_BASE_REFUELED', BOT_STATES.IDLE_AT_BASE, {
    guard: guards.isAtBaseAndRefueled,
    reduce: actions.prepareForBase
  })
);
```

### 4. Guards Composables (`src/ai/fsm/machine/guards/safety.js`)

```javascript
// Guards de sécurité - Priorité maximale
export const safetyGuards = {
  isLowFuel: (ctx) => {
    const fuel = ctx.botVehicle?.fuel ?? 0;
    return fuel < (ctx.fuelThreshold ?? 50);
  },
  
  isAtMaxCapacity: (ctx) => {
    const vehicle = ctx.botVehicle;
    if (!vehicle) return false;
    
    return vehicle.food >= vehicle.maxFood ||
           vehicle.debris >= vehicle.maxDebris ||
           vehicle.special >= vehicle.maxSpecial;
  },
  
  hasEnoughFuel: (ctx) => {
    const fuel = ctx.botVehicle?.fuel ?? 0;
    return fuel >= (ctx.fuelThreshold ?? 50);
  }
};
```

### 5. Hook Bot avec Actions Partagées et Structure Player

```javascript
// filepath: /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/hooks/useBotMachine.js

import { useMachine } from 'react-robot';
import { useCallback, useRef } from 'react';
import { createBotMachine } from '../machine/botMachine';
import { movementActions } from '../../../shared/actions/core/movement';
import { inventoryActions } from '../../../shared/actions/core/inventory';

export const useBotMachine = (botId, initialData = {}) => {
  const machineRef = useRef(createBotMachine(botId, initialData));
  const [current, send] = useMachine(machineRef.current);
  
  const getPrimaryVehicle = useCallback(() => {
    return Object.values(current.context.player.vehicles)[0];
  }, [current.context.player.vehicles]);

  const actions = useCallback({
    // Actions FSM standard
    emergencyReturn: () => send('FUEL_CRITICAL'),
    startExploration: () => send('NEEDS_EXPLORATION'),
    
    // Actions partagées utilisées directement
    moveTo: async (targetCoord) => {
      const vehicle = getPrimaryVehicle();
      
      const result = await movementActions.moveEntity(
        vehicle,
        targetCoord,
        {
          onProgress: (coord) => {
            send('UPDATE_POSITION', { coord });
          },
          onComplete: (finalCoord) => {
            send('MOVEMENT_COMPLETE', { coord: finalCoord });
          }
        }
      );
      
      return result;
    },

    collectResource: (resource) => {
      const vehicle = getPrimaryVehicle();
      const result = inventoryActions.collectResource(vehicle, resource);
      
      if (result.success) {
        send('RESOURCE_COLLECTED', {
          newVehicle: result.newVehicle,
          resource: result.newResource,
          collected: result.collected
        });
      }
      
      return result;
    },

    canMoveTo: (targetCoord) => {
      const vehicle = getPrimaryVehicle();
      return movementActions.canMoveTo(vehicle.coord, targetCoord, vehicle.fuel);
    },

    getCapacityInfo: () => {
      const vehicle = getPrimaryVehicle();
      return inventoryActions.getCapacityInfo(vehicle);
    }
  }, [send, getPrimaryVehicle]);

  return {
    state: current.name,
    context: current.context,
    send,
    actions,
    // Accès facilité aux données player
    player: current.context.player,
    vehicle: getPrimaryVehicle(),
    memory: current.context.player.memory,
    resources: current.context.player.resources,
    fsm: current.context.fsm,
    config: current.context.config
  };
};
```

### 6. Hook Player Unifié (Interface Identique)

```javascript
// filepath: /home/fanch/Documents/jff/react-three-vite/src/hooks/usePlayer.js

import { useCallback } from 'react';
import usePlayerStore from '../stores/usePlayerStore';
import { movementActions } from '../shared/actions/core/movement';
import { inventoryActions } from '../shared/actions/core/inventory';

export const usePlayer = (playerId) => {
  const player = usePlayerStore(state => state.getPlayer(playerId));
  const vehicle = usePlayerStore(state => state.getVehicle(playerId));
  
  const movePlayerTo = usePlayerStore(state => state.movePlayerTo);
  const collectResourceWith = usePlayerStore(state => state.collectResourceWith);

  const actions = useCallback({
    moveTo: (targetCoord) => movePlayerTo(playerId, targetCoord),
    collectResource: (resource) => collectResourceWith(playerId, resource),
    canMoveTo: (targetCoord) => {
      if (!vehicle) return false;
      return movementActions.canMoveTo(vehicle.coord, targetCoord, vehicle.fuel);
    },
    getCapacityInfo: () => {
      if (!vehicle) return {};
      return inventoryActions.getCapacityInfo(vehicle);
    }
  }, [playerId, movePlayerTo, collectResourceWith, vehicle]);

  return {
    player,
    vehicle,
    actions,
    memory: player?.memory,
    resources: player?.resources,
    // Interface identique au bot
    fuel: vehicle?.fuel ?? 0,
    position: vehicle?.coord ?? '0,0',
    isMoving: vehicle?.isMoving ?? false
  };
};
```

### 7. Composant Contrôleur Bot (utilisant structure Player)

```javascript
// filepath: /home/fanch/Documents/jff/react-three-vite/src/components/Bot/BotController.jsx

import React from 'react';
import { useBotMachine } from '../../ai/fsm/hooks/useBotMachine';
import { BotStateDisplay } from './BotStateDisplay';
import { BotActionButtons } from './BotActionButtons';

export const BotController = ({ 
  botId, 
  initialData = {},
  onStateChange,
  onContextUpdate 
}) => {
  const { 
    state, 
    player,
    vehicle,
    actions, 
    fsm
  } = useBotMachine(botId, initialData);
  
  // Notifications optionnelles vers le parent
  React.useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);
  
  React.useEffect(() => {
    onContextUpdate?.(player);
  }, [player, onContextUpdate]);
  
  return (
    <div className="bot-controller">
      <BotStateDisplay 
        botId={botId}
        state={state}
        fuel={vehicle?.fuel ?? 0}
        position={vehicle?.coord ?? '0,0'}
        resources={{
          food: vehicle?.food ?? 0,
          debris: vehicle?.debris ?? 0,
          special: vehicle?.special ?? 0
        }}
        knownResources={player?.memory?.knownResources?.length ?? 0}
        fsmState={fsm?.currentAction}
      />
      
      <BotActionButtons
        actions={actions}
        currentState={state}
        canExplore={actions.canMoveTo && vehicle?.fuel >= 50}
      />
    </div>
  );
};
```

### 8. Composant Player pour Comparaison (Interface Identique)

```javascript
// filepath: /home/fanch/Documents/jff/react-three-vite/src/components/Player/PlayerController.jsx

import React from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { BotStateDisplay } from '../Bot/BotStateDisplay'; // Même composant !
import { BotActionButtons } from '../Bot/BotActionButtons'; // Même composant !

export const PlayerController = ({ 
  playerId,
  onPositionChange 
}) => {
  const { 
    player,
    vehicle,
    actions
  } = usePlayer(playerId);
  
  React.useEffect(() => {
    onPositionChange?.(vehicle?.coord);
  }, [vehicle?.coord, onPositionChange]);
  
  return (
    <div className="player-controller">
      <BotStateDisplay 
        botId={playerId}
        state="MANUAL" // Pas de FSM pour les players
        fuel={vehicle?.fuel ?? 0}
        position={vehicle?.coord ?? '0,0'}
        resources={{
          food: vehicle?.food ?? 0,
          debris: vehicle?.debris ?? 0,
          special: vehicle?.special ?? 0
        }}
        knownResources={player?.memory?.knownResources?.length ?? 0}
        fsmState="Player Controlled"
      />
      
      <BotActionButtons
        actions={actions}
        currentState="MANUAL"
        canExplore={actions.canMoveTo && vehicle?.fuel >= 50}
        isPlayer={true} // Flag pour UI différente
      />
    </div>
  );
};
```

### 9. Comparaison d'Usage : Bot vs Player (Interface Identique)

```javascript
// Bot utilisant FSM + actions partagées + structure Player
const BotComponent = ({ botId }) => {
  const { actions, vehicle, player, fsm } = useBotMachine(botId);
  
  return (
    <div>
      <h3>Bot {botId} (État FSM: {fsm.currentAction})</h3>
      <p>Fuel: {vehicle.fuel} | Position: {vehicle.coord}</p>
      <p>Known Resources: {player.memory.knownResources.length}</p>
      <button onClick={() => actions.moveTo('5,5')}>Move Bot</button>
      <button onClick={() => actions.startExploration()}>Explore</button>
    </div>
  );
};

// Player utilisant Store unifié + actions partagées
const PlayerComponent = ({ playerId }) => {
  const { actions, vehicle, player } = usePlayer(playerId);
  
  return (
    <div>
      <h3>Player {playerId}</h3>
      <p>Fuel: {vehicle.fuel} | Position: {vehicle.coord}</p>
      <p>Known Resources: {player.memory.knownResources.length}</p>
      <button onClick={() => actions.moveTo('5,5')}>Move Player</button>
      <button onClick={() => console.log('Manual exploration')}>Explore</button>
    </div>
  );
};
```

### 10. Scene avec Bots et Players Côte à Côte

```javascript
// filepath: /home/fanch/Documents/jff/react-three-vite/src/components/Scene.jsx

import React, { useState } from 'react';
import { BotController } from './Bot/BotController';
import { PlayerController } from './Player/PlayerController';

const Scene = () => {
  const [bots] = useState(() => [
    { id: 'bot1', startCoord: '0,0' },
    { id: 'bot2', startCoord: '10,10' }
  ]);
  
  const [players] = useState(() => [
    { id: 'player1', startCoord: '5,5' }
  ]);
  
  return (
    <div className="scene">
      <div className="entities">
        <section className="bots">
          <h2>Autonomous Bots</h2>
          {bots.map(bot => (
            <BotController
              key={bot.id}
              botId={bot.id}
              initialData={{ 
                playerOverrides: {
                  vehicles: {
                    primary: { startCoord: bot.startCoord }
                  }
                }
              }}
              onStateChange={(state) => 
                console.log(`Bot ${bot.id} -> ${state}`)
              }
            />
          ))}
        </section>
        
        <section className="players">
          <h2>Human Players</h2>
          {players.map(player => (
            <PlayerController
              key={player.id}
              playerId={player.id}
              onPositionChange={(coord) => 
                console.log(`Player ${player.id} moved to ${coord}`)
              }
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Scene;
```

## Avantages de cette Architecture Unifiée

### 🎯 **Interface Uniforme Bot/Player**
- **Hook similaires** : `useBotMachine` et `usePlayer` ont la même interface
- **Composants réutilisables** : `BotStateDisplay` et `BotActionButtons` fonctionnent pour les deux
- **Actions identiques** : Même API pour `moveTo`, `collectResource`, etc.
- **Données cohérentes** : Même structure Player pour bots et humains

### 🔄 **Actions Partagées Sans Duplication**
- **Core actions** : Une seule implémentation pour movement, inventory, fuel
- **Contexte différent** : FSM pour bots, Store pour players
- **Interface identique** : Même API publique, implémentation différente

### 🚀 **Performance et Maintenance**
- **Pas d'adapters** : Actions core directement utilisées
- **Store unifié** : Player data + actions dans un seul endroit
- **Tests partagés** : Logique métier testée une seule fois

### 📦 **Flexibilité et Évolution**
- **Migration douce** : Réutilise la structure Player existante
- **Ajout de bots facile** : Même factory que les players
- **Debug simplifié** : Interface de debug partagée

Cette architecture unifiée permet d'avoir des bots autonomes utilisant la FSM et des players manuels utilisant le store, mais avec la même structure de données et les mêmes actions métier, facilitant grandement le développement et la maintenance.