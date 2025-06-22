# 🚁 Plan d'Implémentation - Exploration Multi-Tuiles et Collecte Optimisée

## 📋 Vue d'Ensemble de la Fonctionnalité

**Objectif** : Les bots peuvent désormais explorer plusieurs tuiles avant de passer à la collecte. Après avoir exploré 3 tuiles, ils identifient automatiquement la tuile avec le plus de ressources et passent en mode collecte.

**Workflow cible** :
```
EVALUATING → EXPLORING_DEPLOYING (x3 tuiles) → COLLECTING_MOVING_TO_TARGET (meilleure tuile) → COLLECTING_RETURNING_TO_BASE → EVALUATING → [décision selon conditions]
```

**Note importante** : 
- **EXPLORING_RETURNING** = Retour du **drone** vers le **vaisseau**
- **COLLECTING_MOVING_TO_TARGET** = Déplacement du **vaisseau** vers la tuile à collecter
- **COLLECTING_RETURNING_TO_BASE** = Retour du **vaisseau** vers la **base** après collecte

**🔥 UTILISATION DES ÉVÉNEMENTS** : 
- Toutes les transitions d'états utilisent la syntaxe des fichiers events (ex: `MOVEMENT_EVENT_TYPES.SHIP_REACHED_BASE`)
- Les événements manquants pour le vaisseau seront créés/adaptés dans movementEvents.js
- Distinction claire entre événements drone (`DRONE_*`) et vaisseau (`SHIP_*`)

---

## 🎯 PROMPT 1 : Modifier les Guards d'Exploration

**Fichiers cibles** :
- `/src/ai/fsm/machine/guards/core/explorationGuard.js`
- `/src/ai/fsm/machine/guards/discoveryGuard.js`

**🔥 IMPORTS REQUIS** :
```javascript
import { EXPLORATION_CYCLE_CONFIG } from '../constants/constants.js';
```

### 📝 Modifications Requises

1. **Ajouter guard `hasExploredEnoughTiles`** :
   ```javascript
   hasExploredEnoughTiles: (context, event) => {
     const exploredCount = context.memory?.stats?.tilesExplored || 0;
     return exploredCount >= EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION; // Utilise la constante
   }
   ```

2. **Ajouter guard `hasBestTileForCollection`** :
   ```javascript
   hasBestTileForCollection: (context, event) => {
     const collectibleTiles = Array.from(context.memory.knownTiles.values())
       .filter(tile => tile.explored && tile.hasResources && !tile.collected);
     return collectibleTiles.length > 0;
   }
   ```

3. **Modifier `needsExploration`** pour tenir compte du seuil :
   ```javascript
   needsExploration: (context, event) => {
     const exploredCount = context.memory?.stats?.tilesExplored || 0;
     if (exploredCount >= EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION) {
       // Vérifier s'il y a des tuiles collectibles avant de continuer l'exploration
       const collectibleTiles = Array.from(context.memory.knownTiles.values())
         .filter(tile => tile.explored && tile.hasResources && !tile.collected);
       return collectibleTiles.length === 0; // Continue exploration seulement si rien à collecter
     }
     return exploredCount < EXPLORATION_CONSTANTS.MAX_EXPLORED_TILES;
   }
   ```

4. **Ajouter guard `shouldTransitionToCollection`** :
   ```javascript
   shouldTransitionToCollection: (context, event) => {
     const exploredCount = context.memory?.stats?.tilesExplored || 0;
     const collectibleTiles = Array.from(context.memory.knownTiles.values())
       .filter(tile => tile.explored && tile.hasResources && !tile.collected);
     
     return exploredCount >= EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION && collectibleTiles.length > 0;
   }
   ```

---

## 🎯 PROMPT 2 : Ajouter Actions de Sélection de Meilleure Tuile

**Fichier cible** :
- `/src/ai/fsm/machine/actions/core/shipCollectingActions.js`

**🔥 IMPORTS REQUIS** :
```javascript
import { EXPLORATION_CYCLE_CONFIG } from '../constants/constants.js';
```

### 📝 Nouvelles Actions

1. **Action `selectBestTileForCollection`** :
   ```javascript
   selectBestTileForCollection: (context, event) => {
     const collectibleTiles = Array.from(context.memory.knownTiles.values())
       .filter(tile => tile.explored && tile.hasResources && !tile.collected);
     
     if (collectibleTiles.length === 0) {
       return { ...context, error: 'No collectible tiles available' };
     }
     
     // Trier par total des ressources (utilise les priorités configurées)
     const sortedTiles = collectibleTiles.sort((a, b) => {
       const getTotalValue = (tile) => {
         const res = tile.resources || {};
         const priorities = EXPLORATION_CYCLE_CONFIG.RESOURCE_PRIORITIES;
         return (res.special || 0) * priorities.special + 
                (res.food || 0) * priorities.food + 
                (res.debris || 0) * priorities.debris;
       };
       return getTotalValue(b) - getTotalValue(a);
     });
     
     return {
       ...context,
       selectedTileForCollection: sortedTiles[0],
       lastAction: 'selectBestTileForCollection_success'
     };
   }
   ```

2. **Action `resetExplorationCycleStats`** :
   ```javascript
   resetExplorationCycleStats: (context, event) => {
     return {
       ...context,
       memory: {
         ...context.memory,
         stats: {
           ...context.memory.stats,
           tilesExplored: 0, // Reset pour nouveau cycle
           cycleStartTime: Date.now()
         }
       },
       lastAction: 'resetExplorationCycleStats_success'
     };
   }
   ```

---

## 🎯 PROMPT 3 : Modifier l'État EVALUATING

**Fichier cible** :
- `/src/ai/fsm/machine/states/evaluatingState.js`

### 📝 Modifications des Transitions

1. **Modifier transition vers COLLECTING** (priorité haute) :
   ```javascript
   // NOUVELLE PRIORITÉ : Si 3+ tuiles explorées ET tuiles collectibles → COLLECTING_MOVING_TO_TARGET
   transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.COLLECTING_MOVING_TO_TARGET, 
     guard((context, event) => {
       const hasEnoughExplored = discoveryGuards.hasExploredEnoughTiles(context, event);
       const hasBestTile = discoveryGuards.hasBestTileForCollection(context, event);
       const shouldTransition = discoveryGuards.shouldTransitionToCollection(context, event);
       
       return hasEnoughExplored && hasBestTile && shouldTransition;
     }),
     reduce((context, event) => {
       // Sélectionner la meilleure tuile et préparer la collecte
       const contextWithSelection = shipCollectingActions.selectBestTileForCollection(context, event);
       
       return contextReducers.state.prepareCollectingMovingToTarget(contextWithSelection, {
         ...event,
         tileCoord: contextWithSelection.selectedTileForCollection?.coord,
         reason: 'best_tile_after_exploration_cycle'
       });
     })
   ),
   ```

2. **Modifier transition vers EXPLORING_DEPLOYING** (priorité moyenne) :
   ```javascript
   // Si pas assez de tuiles explorées OU pas de tuiles collectibles → EXPLORING_DEPLOYING
   transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_DEPLOYING, 
     guard((context, event) => {
       const hasUnexplored = discoveryGuards.hasUnexploredAreas(context, event);
       const needsMoreExploration = discoveryGuards.needsExploration(context, event);
       const isDroneInactive = !context.droneFleet?.drones?.explorer?.isActive;
       const canDeploy = !context.droneFleet?.deploymentAttempted;
       
       return (hasUnexplored || needsMoreExploration) && isDroneInactive && canDeploy;
     }),
     // Reducer inchangé...
   ),
   ```

---

## 🎯 PROMPT 4 : Modifier l'État COLLECTING

**Fichier cible** :
- `/src/ai/fsm/machine/states/collectingState.js`

### 📝 Nouvelles Transitions

1. **Arrivée à la tuile cible et collecte** :
   ```javascript
   // SHIP_ARRIVED_AT_TILE - Vaisseau arrivé à la tuile cible pour collecte
   transition(MOVEMENT_EVENT_TYPES.SHIP_ARRIVED_AT_TILE, BOT_STATES.COLLECTING_RETURNING_TO_BASE,
     guard((context) => context.currentAction === 'moving_to_target'),
     reduce((context, event) => {
       // Collecter automatiquement la tuile cible
       const collectedContext = shipCollectsFromTile(context, {
         coord: context.selectedTileForCollection?.coord,
         resourceType: 'all'
       });
       
       // Préparer le retour automatique à la base après collecte
       return contextReducers.state.prepareReturningToBase(collectedContext, {
         reason: 'tile_collected_returning_to_base'
       });
     })
   ),

   // SHIP_MOVEMENT_STARTED - Suivi du mouvement vers la tuile cible
   transition(MOVEMENT_EVENT_TYPES.SHIP_MOVEMENT_STARTED, BOT_STATES.COLLECTING_MOVING_TO_TARGET,
     guard((context) => context.currentAction === 'moving_to_target'),
     reduce((context, event) => {
       return contextReducers.movement.updateMovementProgress(context, event);
     })
   )
   ```

2. **Transitions pour le sous-état COLLECTING_RETURNING_TO_BASE** :
   ```javascript
   // SHIP_REACHED_BASE - Vaisseau arrivé à la base après collecte
   transition(MOVEMENT_EVENT_TYPES.SHIP_REACHED_BASE, BOT_STATES.EVALUATING,
     guard((context) => context.currentAction === 'returning_to_base'),
     reduce((context, event) => {
       // Retour à EVALUATING qui décidera de la suite (IDLE_AT_BASE ou nouveau cycle)
       return contextReducers.state.prepareEvaluating(context, {
         reason: 'returned_to_base_after_collection'
       });
     })
   ),

   // SHIP_MOVEMENT_STARTED - Suivi du retour à la base
   transition(MOVEMENT_EVENT_TYPES.SHIP_MOVEMENT_STARTED, BOT_STATES.COLLECTING_RETURNING_TO_BASE,
     guard((context) => context.currentAction === 'returning_to_base'),
     reduce((context, event) => {
       return contextReducers.movement.updateMovementProgress(context, event);
     })
   )
   ```

**Note importante** : EVALUATING décidera ensuite selon les conditions :
- Si maintenance nécessaire → IDLE_AT_BASE  
- Si peut continuer → Nouveau cycle d'exploration
- Logique de décision centralisée dans EVALUATING

---

## 🛠️ CORRECTIF NÉCESSAIRE : Erreurs dans collectingState.js

**Problème identifié** : Le fichier `/src/ai/fsm/machine/states/collectingState.js` contient des références à `BOT_STATES.RETURNING` qui n'existe pas (l'état a été supprimé).

**Fichiers à corriger** :
- `/src/ai/fsm/machine/states/collectingState.js` (lignes 74, 114, 128)

**Corrections à apporter** :
```javascript
// ❌ INCORRECT (état RETURNING n'existe pas)
transition('INVENTORY_FULL', BOT_STATES.RETURNING, ...)
transition(EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED, BOT_STATES.RETURNING, ...)
transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.RETURNING, ...)

// ✅ CORRECT (retour via EVALUATING ou COLLECTING_RETURNING_TO_BASE)
transition(RESOURCE_EVENT_TYPES.INVENTORY_FULL, BOT_STATES.EVALUATING, ...)
transition(EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED, BOT_STATES.COLLECTING_RETURNING_TO_BASE, ...)
transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.COLLECTING_RETURNING_TO_BASE, ...)
```

**Rationale** :
- **INVENTORY_FULL** → EVALUATING : Laisse EVALUATING décider (continuer collecte vs retour base)
- **Urgences** → COLLECTING_RETURNING_TO_BASE : Retour direct du vaisseau à la base dans le contexte de collecte

**🔥 EVENTS UTILISÉS** :
- `RESOURCE_EVENT_TYPES.INVENTORY_FULL` : Quand l'inventaire est plein
- `EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED` : Carburant faible
- `EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED` : Urgence générale

---

## 🔥 ÉVÉNEMENTS À CRÉER/VÉRIFIER

**Fichier cible** : `/src/ai/fsm/machine/events/movementEvents.js`

### 📝 Événements Vaisseau Existants

Les événements suivants existent déjà dans movementEvents.js :
- ✅ `MOVEMENT_EVENT_TYPES.SHIP_MOVEMENT_STARTED` 
- ✅ `MOVEMENT_EVENT_TYPES.SHIP_REACHED_BASE`
- ✅ `MOVEMENT_EVENT_TYPES.SHIP_ARRIVED_AT_TILE`
- ✅ `MOVEMENT_EVENT_TYPES.SHIP_UPDATE_POSITION`
- ✅ `MOVEMENT_EVENT_TYPES.SHIP_COLLECTION_COMPLETED`

### 📝 Événements Drone Existants

Les événements suivants existent déjà dans movementEvents.js :
- ✅ `MOVEMENT_EVENT_TYPES.DRONE_DEPLOYED`
- ✅ `MOVEMENT_EVENT_TYPES.DRONE_REACHED_TARGET`
- ✅ `MOVEMENT_EVENT_TYPES.DRONE_REACHED_SHIP`
- ✅ `MOVEMENT_EVENT_TYPES.DRONE_POSITION_UPDATE`

### 📝 Événements Système Existants

Dans systemEvents.js :
- ✅ `SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE`

### 📝 Événements Ressources Existants

Dans resourceEvents.js :
- ✅ `RESOURCE_EVENT_TYPES.RESOURCES_DISCOVERED`
- ✅ `RESOURCE_EVENT_TYPES.AREA_EXPLORED`
- ✅ `RESOURCE_EVENT_TYPES.INVENTORY_FULL`
- ✅ `RESOURCE_EVENT_TYPES.RESOURCE_COLLECTED`
- ✅ `RESOURCE_EVENT_TYPES.CAPACITY_REACHED`

Dans emergencyEvents.js :
- ✅ `EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED`
- ✅ `EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED`
- ✅ `EMERGENCY_EVENT_TYPES.EMERGENCY_RESOLVED`

### 📝 Événements Complets - Tous Disponibles !

**Excellente nouvelle** : Tous les événements nécessaires pour l'implémentation existent déjà dans les fichiers events. Aucun événement à créer !

**🔥 ÉVÉNEMENTS PRÊTS À UTILISER** :
- **Mouvement** : `MOVEMENT_EVENT_TYPES.SHIP_*` et `MOVEMENT_EVENT_TYPES.DRONE_*`
- **Système** : `SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE`
- **Ressources** : `RESOURCE_EVENT_TYPES.INVENTORY_FULL`, `RESOURCE_EVENT_TYPES.RESOURCE_COLLECTED`
- **Urgences** : `EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED`, `EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED`

---

## 🎯 PROMPT 5 : Ajouter Configuration du Cycle d'Exploration

**Fichier cible** :
- `/src/ai/fsm/machine/constants/constants.js`

### 📝 Nouvelles Constantes

```javascript
/**
 * Configuration du cycle d'exploration multi-tuiles
 */
export const EXPLORATION_CYCLE_CONFIG = {
  TILES_BEFORE_COLLECTION: 3,           // Nombre de tuiles à explorer avant collecte
  MIN_TILES_BEFORE_COLLECTION: 2,       // Minimum de tuiles avant d'autoriser la collecte
  MAX_EXPLORATION_CYCLES: 5,             // Maximum de cycles d'exploration par session
  CYCLE_TIMEOUT: 600000,                 // 10 minutes maximum par cycle
  
  // Priorités des ressources pour sélection de meilleure tuile
  RESOURCE_PRIORITIES: {
    special: 10,     // Ressources spéciales = priorité max
    food: 2,         // Nourriture = priorité moyenne
    debris: 1        // Débris = priorité basse
  }
};
```

---

## 🎯 PROMPT 5 : Mise à Jour du Contexte Initial

**Fichier cible** :
- `/src/ai/fsm/machine/context/initialContext.js`

**🔥 IMPORTS REQUIS** :
```javascript
import { EXPLORATION_CYCLE_CONFIG } from '../constants/constants.js';
```

### 📝 Ajouts au Contexte

```javascript
// Dans la section memory.stats
stats: {
  tilesExplored: 0,
  tilesCollected: 0,
  totalResourcesFound: 0,
  lastExploration: null,
  lastCollection: null,
  
  // NOUVEAU : Statistiques de cycle d'exploration
  explorationCycles: 0,                    // Nombre de cycles d'exploration terminés
  currentCycleStartTime: null,             // Début du cycle actuel
  tilesExploredInCycle: 0,                 // Tuiles explorées dans le cycle actuel
  bestTileInCycle: null                    // Meilleure tuile trouvée dans le cycle
},

// NOUVEAU : Données du cycle d'exploration actuel
explorationCycle: {
  isActive: false,                         // Cycle d'exploration en cours
  targetTilesCount: EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION,
  exploredTiles: [],                       // Tuiles explorées dans ce cycle
  bestTileFound: null,                     // Meilleure tuile trouvée
  startTime: null,                         // Timestamp de début de cycle
  phase: 'idle'                            // 'idle', 'exploring', 'evaluating', 'collecting'
}
```

---

## 🎯 PROMPT 6 : Logique de Décision Post-Collecte dans EVALUATING

**Fichier cible** :
- `/src/ai/fsm/machine/states/evaluatingState.js`

### 📝 Nouvelle Logique de Décision

**EVALUATING devient le point de décision après retour de collecte** :

1. **Après retour de collecte** : `COLLECTING_RETURNING_TO_BASE → EVALUATING`
2. **Décision selon conditions** : EVALUATING analyse la situation et décide :
   - **Si maintenance requise** → `IDLE_AT_BASE` (carburant bas, réparations, etc.)
   - **Si peut continuer** → Nouveau cycle d'exploration via `EXPLORING_DEPLOYING`
   - **Si conditions spéciales** → Autres actions selon la logique métier

### 📝 Guards de Décision à Ajouter

```javascript
// Dans evaluatingState.js - Nouvelles transitions après retour de collecte
transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.IDLE_AT_BASE,
  guard((context, event) => {
    // Conditions pour aller en maintenance
    const needsMaintenance = context.vehicle?.fuel < 30 || 
                            context.vehicle?.damage > 50 ||
                            context.vehicle?.needsRepair;
    const justReturnedFromCollection = context.lastStateChange === 'returned_to_base_after_collection';
    
    return needsMaintenance && justReturnedFromCollection;
  }),
  reduce((context, event) => {
    return contextReducers.state.prepareIdleAtBase(context, {
      reason: 'maintenance_required_after_collection'
    });
  })
),

// Si pas besoin de maintenance → Nouveau cycle d'exploration
transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_DEPLOYING,
  guard((context, event) => {
    const justReturnedFromCollection = context.lastStateChange === 'returned_to_base_after_collection';
    const canContinue = context.vehicle?.fuel >= 30 && 
                       context.vehicle?.damage <= 50;
    const hasUnexplored = discoveryGuards.hasUnexploredAreas(context, event);
    
    return justReturnedFromCollection && canContinue && hasUnexplored;
  }),
  reduce((context, event) => {
    // Reset les stats pour nouveau cycle avant de commencer
    const resetContext = shipCollectingActions.resetExplorationCycleStats(context, event);
    return contextReducers.state.prepareExploring(resetContext, event);
  })
)
```

---

## 🆕 PROMPT PRÉALABLE : Ajouter le Sous-État COLLECTING_RETURNING_TO_BASE

**Objectif** : Ajouter `COLLECTING_MOVING_TO_TARGET` et `COLLECTING_RETURNING_TO_BASE` comme sous-états de collecting dans le fichier `collectingState.js`.

**Fichiers à modifier** :
- **MODIFIER** : `/src/ai/fsm/machine/constants/constants.js` (ajouter BOT_STATES.COLLECTING_MOVING_TO_TARGET et COLLECTING_RETURNING_TO_BASE)
- **MODIFIER** : `/src/ai/fsm/machine/states/collectingState.js` (ajouter transitions pour le sous-état)

### 📝 Constante à Ajouter

```javascript
// Dans /src/ai/fsm/machine/constants/constants.js
export const BOT_STATES = {
  EVALUATING: 'evaluating',
  EXPLORING: 'exploring',
  EXPLORING_DEPLOYING: 'exploring_deploying',
  EXPLORING_RETURNING: 'exploring_returning',                    // Retour DRONE vers VAISSEAU
  COLLECTING_MOVING_TO_TARGET: 'collecting_moving_to_target',    // Déplacement VAISSEAU vers tuile cible
  COLLECTING_RETURNING_TO_BASE: 'collecting_returning_to_base',  // Retour VAISSEAU vers BASE après collecte
  IDLE_AT_BASE: 'idleAtBase'
};
```

### 📝 Architecture du Sous-État

```javascript
// Dans collectingState.js - Le fichier gère maintenant deux phases :
// 1. COLLECTING_MOVING_TO_TARGET : Phase de déplacement vers la tuile cible
// 2. COLLECTING_RETURNING_TO_BASE : Phase de retour à la base après collecte

// Les transitions permettront :
// COLLECTING_MOVING_TO_TARGET → COLLECTING_RETURNING_TO_BASE (après arrivée et collecte)
// COLLECTING_RETURNING_TO_BASE → EVALUATING (une fois arrivé à la base)
```

---

## 📝 Nouveau Reducer à Ajouter

```javascript
// Dans /src/ai/fsm/machine/reducers/context.js
// Ajouter un nouveau reducer pour préparer le mouvement vers la tuile cible

stateTransitionReducers: {
  // ...existing code...
  
  prepareCollectingMovingToTarget: (context, event) => {
    return {
      ...context,
      currentAction: 'moving_to_target',
      lastDecision: 'collect_best_tile',
      targetTile: event.tileCoord ? context.memory.knownTiles.get(event.tileCoord) : null,
      lastStateChange: Date.now()
    };
  },
  
  prepareReturningToBase: (context, event) => {
    return {
      ...context,
      currentAction: 'returning_to_base',
      lastDecision: 'return_after_collection',
      lastStateChange: Date.now()
    };
  }
}
```

---

## 📋 RÉCAPITULATIF : TRANSITIONS AVEC ÉVÉNEMENTS CORRECTS

### 🎯 EVALUATING → COLLECTING_MOVING_TO_TARGET
```javascript
transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.COLLECTING_MOVING_TO_TARGET, ...)
```

### 🎯 EVALUATING → EXPLORING_DEPLOYING  
```javascript
transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_DEPLOYING, ...)
```

### 🎯 COLLECTING_MOVING_TO_TARGET → COLLECTING_RETURNING_TO_BASE
```javascript
transition(MOVEMENT_EVENT_TYPES.SHIP_ARRIVED_AT_TILE, BOT_STATES.COLLECTING_RETURNING_TO_BASE, ...)
```

### 🎯 COLLECTING_RETURNING_TO_BASE → EVALUATING
```javascript
transition(MOVEMENT_EVENT_TYPES.SHIP_REACHED_BASE, BOT_STATES.EVALUATING, ...)
```

### 🎯 EXPLORING_DEPLOYING → EXPLORING_RETURNING (drone)
```javascript
transition(MOVEMENT_EVENT_TYPES.DRONE_REACHED_TARGET, BOT_STATES.EXPLORING_RETURNING, ...)
```

### 🎯 EXPLORING_RETURNING → EVALUATING (drone retour)
```javascript
transition(MOVEMENT_EVENT_TYPES.DRONE_REACHED_SHIP, BOT_STATES.EVALUATING, ...)
```

### 🎯 Transitions d'Urgence
```javascript
// Inventaire plein → Évaluation pour décision
transition(RESOURCE_EVENT_TYPES.INVENTORY_FULL, BOT_STATES.EVALUATING, ...)

// Carburant faible → Retour immédiat à la base
transition(EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED, BOT_STATES.COLLECTING_RETURNING_TO_BASE, ...)

// Urgence générale → Retour immédiat à la base
transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.COLLECTING_RETURNING_TO_BASE, ...)
```

**🔥 CONVENTION DE NOMMAGE** :
- **Drone** : `MOVEMENT_EVENT_TYPES.DRONE_*` (ex: DRONE_REACHED_TARGET, DRONE_REACHED_SHIP)
- **Vaisseau** : `MOVEMENT_EVENT_TYPES.SHIP_*` (ex: SHIP_ARRIVED_AT_TILE, SHIP_REACHED_BASE)  
- **Système** : `SYSTEM_EVENT_TYPES.*` (ex: EVALUATION_COMPLETE)
- **Ressources** : `RESOURCE_EVENT_TYPES.*` (ex: INVENTORY_FULL, RESOURCE_COLLECTED)
- **Urgences** : `EMERGENCY_EVENT_TYPES.*` (ex: LOW_FUEL_DETECTED, EMERGENCY_DETECTED)

---

## 🔥 VÉRIFICATION : UTILISATION DES CONSTANTES

### ✅ Constantes Correctement Utilisées

**Dans les Guards (`explorationGuard.js`, `discoveryGuard.js`)** :
- ✅ `EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION` (au lieu de `3` codé en dur)
- ✅ `EXPLORATION_CONSTANTS.MAX_EXPLORED_TILES` (constante existante)

**Dans les Actions (`shipCollectingActions.js`)** :
- ✅ `EXPLORATION_CYCLE_CONFIG.RESOURCE_PRIORITIES.special` (au lieu de `10`)
- ✅ `EXPLORATION_CYCLE_CONFIG.RESOURCE_PRIORITIES.food` (au lieu de `2`)
- ✅ `EXPLORATION_CYCLE_CONFIG.RESOURCE_PRIORITIES.debris` (au lieu de `1`)

**Dans le Contexte Initial (`initialContext.js`)** :
- ✅ `EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION` pour `targetTilesCount`

**Dans la Configuration (`constants.js`)** :
- ✅ `EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION: 3` (valeur par défaut)
- ✅ `EXPLORATION_CYCLE_CONFIG.MIN_TILES_BEFORE_COLLECTION: 2` (minimum)
- ✅ `EXPLORATION_CYCLE_CONFIG.MAX_EXPLORATION_CYCLES: 5` (maximum de cycles)
- ✅ `EXPLORATION_CYCLE_CONFIG.CYCLE_TIMEOUT: 600000` (timeout 10 min)

### 🎯 Avantages de l'Utilisation des Constantes

1. **Configurabilité** : Facile de changer le seuil de 3 tuiles à autre chose
2. **Maintenabilité** : Une seule source de vérité pour les valeurs
3. **Lisibilité** : Le code est auto-documenté avec des noms explicites
4. **Évolutivité** : Possibilité d'ajouter des configurations dynamiques plus tard

### 🔧 Imports Requis dans Chaque Fichier

```javascript
// Dans explorationGuard.js, discoveryGuard.js, shipCollectingActions.js, initialContext.js
import { EXPLORATION_CYCLE_CONFIG } from '../constants/constants.js';
```
