# 🔧 Maintenance System Refactoring - Planning Session

**Date**: 6 janvier 2026  
**Topic**: Refactoring du système de maintenance (refuel/repair) avec intégration des tuiles stations  
**Status**: Planning Phase - En attente de décision d'architecture

---

## 📋 Table of Contents

1. [Situation Actuelle](#situation-actuelle)
2. [Problèmes Identifiés](#problèmes-identifiés)
3. [Diagramme des Transitions Actuelles](#diagramme-des-transitions-actuelles)
4. [Solutions Proposées](#solutions-proposées)
5. [Recommandation Finale](#recommandation-finale)
6. [Prochaines Étapes](#prochaines-étapes)

---

## 🔍 Situation Actuelle

### Architecture Actuelle

Le système de maintenance est **entièrement basé sur la base** (tuile `depart`). Quand le vaisseau retourne à la base après une collecte, il passe par une **cascade d'événements** et de **sous-états**:

```
collecting.ship_returning 
  ↓ SHIP_REACHES_BASE
maintaining.depositing (1500ms)
  ↓ SHIP_DEPOSIT_COMPLETE
maintaining.refueling (1000ms) [si needsRefuel]
  ↓ SHIP_REFUEL_COMPLETE
maintaining.repairing (2000ms) [si needsRepair]
  ↓ SHIP_REPAIR_COMPLETE
evaluating
```

### Event-Driven Flow

**Tracker détecte l'état et envoie les événements:**

```typescript
// Dans useSimulatedTracker.ts
handleSnapshot(state) {
  if (state === 'maintaining.depositing') {
    scheduleEvent(
      { type: 'SHIP_DEPOSIT_COMPLETE' },
      1500ms,
      "Depositing resources"
    );
  } else if (state === 'maintaining.refueling') {
    scheduleEvent(
      { type: 'SHIP_REFUEL_COMPLETE' },
      1000ms,
      "Refueling ship"
    );
  } else if (state === 'maintaining.repairing') {
    scheduleEvent(
      { type: 'SHIP_REPAIR_COMPLETE' },
      2000ms,
      "Repairing ship"
    );
  }
}
```

### Tuiles Stations Existantes

Des tuiles spécialisées existent dans la grille mais **ne sont pas utilisées**:

```typescript
// types/coordinates.d.ts
export type TileType = 
  | 'empty'
  | 'resource'
  | 'obstacle'
  | 'danger'
  | 'fuel'      // ← Station existante mais INUTILISÉE
  | 'repair'    // ← Station existante mais INUTILISÉE
  | 'depart';

// Placement dans la grille
stationsConfig: {
  fuel: { 0: 0, 1: 1, default: 1 },      // 1 station fuel par radius
  repair: { 0: 0, 1: 1, default: 1 }     // 1 station repair par radius
}
```

### Guards Actuels

```typescript
// Tous les seuils et la logique de décision
needsRefuel:  (fuel < 30%)
needsRepair:  (damage > 50%)
needsDeposit: (resources > 100)

// Ordre de priorité dans maintaining
1. depositing (toujours d'abord)
2. refueling (si needsRefuel)
3. repairing (si needsRepair)
4. evaluating (quand tout est fait)
```

---

## ⚠️ Problèmes Identifiés

### 1️⃣ Stations Décoratives (Unused Feature)

**Problème**: Les tuiles `fuel` et `repair` existent mais ne sont jamais consultées ou visitées.

**Impact**:
- ❌ Aucune décision stratégique: "proche station vs retour à la base?"
- ❌ Pas de trade-off risque/reward
- ❌ Stations = décoration, pas mécanique

### 2️⃣ Maintenance Toujours à la Base

**Problème**: Le FSM hardcode le retour à `baseCoord` (tuile `depart`).

**Code actuel** (`assignShipReturningContext`):
```typescript
const baseTile: Tile = {
  position: { ...baseWorldPos },
  type: 'depart',  // ← Toujours base
  coord: baseCoord // ← Toujours même position
};
```

**Impact**:
- ❌ Pas de pathfinding vers stations
- ❌ Pas d'optimisation distance
- ❌ Refuel/repair instantanés (pas de déplacement)

### 3️⃣ Événements Spécialisés Sans Flexibilité

**Problème**: Un événement distinct par action (`SHIP_DEPOSIT_COMPLETE`, `SHIP_REFUEL_COMPLETE`, `SHIP_REPAIR_COMPLETE`).

**Impact**:
- ❌ Difficile de mélanger base + stations (même logique dupliquée)
- ❌ Pas de payload riche (où? quel type?)
- ❌ Pas de décision centralisée

### 4️⃣ Maintenance "Boîte Noire"

**Problème**: Les actions `assignShipRefuelContext` et `assignShipRepairContext` sont instantanées, pas de trace de **quoi** s'est passé ou **où**.

**Impact**:
- ❌ Pas de lien explicite: dépôt → refuel
- ❌ Pas de distinction: a-t-on refuelé à la base ou à une station?
- ❌ Logs confus

---

## 📊 Diagramme des Transitions Actuelles

```mermaid
stateDiagram-v2
    [*] --> initializing
    initializing --> evaluating: areAllEntitiesInitialized
    
    evaluating --> maintaining.purchasing_drone: needsDronePurchase
    evaluating --> maintaining.relocating: shouldRelocateShip
    evaluating --> exploring: canStartExploring
    evaluating --> collecting: shouldCollect
    evaluating --> maintaining: shouldMaintain
    
    state exploring {
        [*] --> drone_deploying
        drone_deploying --> drone_scanning: DRONE_REACHES_TILE
        drone_deploying --> maintaining.relocating: NO_TARGET_FOUND
        drone_scanning --> drone_destroyed: shouldDestroyDroneOnDanger
        drone_scanning --> drone_returning: Normal scan
        drone_destroyed --> evaluating: DRONE_DESTRUCTION_ACKNOWLEDGED
        drone_returning --> drone_docked: DRONE_REACHES_BASE
        drone_docked --> evaluating: DRONE_READY_FOR_REDEPLOY
    }
    
    state collecting {
        [*] --> ship_moving_to_tile
        ship_moving_to_tile --> ship_moving_to_tile: SHIP_REACHES_WAYPOINT<br/>(hasMoreWaypoints)
        ship_moving_to_tile --> ship_collecting: SHIP_REACHES_TILE
        ship_moving_to_tile --> evaluating: Cannot collect
        ship_collecting --> ship_returning: isVehicleOverloaded
        ship_collecting --> evaluating: noMoreCollectibleTiles
        ship_collecting --> ship_moving_to_tile: hasMoreCollectibleTiles
        ship_returning --> ship_returning: SHIP_REACHES_WAYPOINT<br/>(hasMoreWaypoints)
        ship_returning --> maintaining: SHIP_REACHES_BASE
    }
    
    state maintaining {
        [*] --> depositing
        depositing --> refueling: needsRefuel
        depositing --> repairing: needsRepair
        depositing --> evaluating: maintenanceComplete
        
        refueling --> depositing: needsDeposit
        refueling --> repairing: needsRepair
        refueling --> evaluating: maintenanceComplete
        
        repairing --> refueling: needsRefuel
        repairing --> depositing: needsDeposit
        repairing --> evaluating: maintenanceComplete
        
        relocating --> game_over: isAtMaxRadius
        relocating --> evaluating: canIncreaseRadius
        
        purchasing_drone --> evaluating: DRONE_PURCHASE_COMPLETE
    }
    
    maintaining --> game_over
    game_over --> [*]
    
    note right of maintaining.depositing
        ⚠️ TOUJOURS À LA BASE
        (tile 'depart')
        Stations fuel/repair
        NE SONT PAS UTILISÉES
    end note
    
    note right of maintaining.refueling
        Instantané à la base
        Pas de pathfinding
        vers station 'fuel'
    end note
    
    note right of maintaining.repairing
        Instantané à la base
        Pas de pathfinding
        vers station 'repair'
    end note
```

---

## 💡 Solutions Proposées

### Option A: Event-Driven Unifié ⭐ **RECOMMANDÉE**

**Principe**: Un seul événement `SHIP_REACHES_MAINTENANCE_POINT` avec payload riche indiquant le type de destination.

#### Architecture

```typescript
// Type d'événement unifié
type MaintenancePointReachedEvent = {
  type: 'SHIP_REACHES_MAINTENANCE_POINT';
  pointType: 'base' | 'fuel_station' | 'repair_station';
  coord: GridCoordinate;
};

// Machine transitions
collecting: {
  states: {
    ship_returning: {
      on: {
        SHIP_REACHES_MAINTENANCE_POINT: [
          {
            // Si fuel station → refuel direct
            target: '#machineXV5Pure.maintaining.refueling',
            guard: 'isAtFuelStation', 
            actions: 'assignShipAtStationContext'
          },
          {
            // Si repair station → repair direct
            target: '#machineXV5Pure.maintaining.repairing',
            guard: 'isAtRepairStation',
            actions: 'assignShipAtStationContext'
          },
          {
            // Si base → flow classique
            target: '#machineXV5Pure.maintaining.depositing',
            guard: 'isAtBase'
          }
        ]
      }
    }
  }
}

// Guards simples
isAtFuelStation: ({ context, event }) => event.pointType === 'fuel_station'
isAtRepairStation: ({ context, event }) => event.pointType === 'repair_station'
isAtBase: ({ context, event }) => event.pointType === 'base'
```

#### Advantages ✅

- ✅ **Un seul événement** pour tous les points de maintenance
- ✅ **Payload riche** : `pointType` indique la destination
- ✅ **Réutilise le pattern** `ship_returning` existant (pas de rupture)
- ✅ **Guards simples** : Just check event payload
- ✅ **Tracker décide dynamiquement** de la destination (base vs station)
- ✅ **Facile à logger/tracker** : même type d'événement partout

#### Disadvantages ❌

- ❌ Changement d'événement (SHIP_REACHES_BASE → SHIP_REACHES_MAINTENANCE_POINT)
- ❌ Tracker doit calculer la meilleure destination

#### Implementation Steps

1. Créer nouveau type d'événement `SHIP_REACHES_MAINTENANCE_POINT`
2. Ajouter guards `isAtFuelStation`, `isAtRepairStation`, `isAtBase`
3. Modifier `assignShipReturningContext` pour accepter `targetMaintenancePoint`
4. Modifier tracker pour décider destination (base vs station)

---

### Option B: States Parallèles (Station vs Base)

**Principe**: Deux branches séparées dans `maintaining`: une pour stations, une pour base.

#### Architecture

```typescript
maintaining: {
  initial: 'evaluating_location', // ← Nouveau
  states: {
    // 1. Décide où aller
    evaluating_location: {
      entry: 'assignMaintenanceLocationContext',
      always: [
        { target: 'station_maintenance', guard: 'shouldUseStation' },
        { target: 'base_maintenance' }
      ]
    },
    
    // 2a. Maintenance à une station
    station_maintenance: {
      initial: 'navigating',
      states: {
        navigating: {
          on: {
            SHIP_REACHES_STATION: [
              { target: 'servicing', guard: 'isCorrectStationType' }
            ]
          }
        },
        servicing: {
          on: {
            STATION_SERVICE_COMPLETE: '#machineXV5Pure.evaluating'
          }
        }
      }
    },
    
    // 2b. Maintenance à la base (flow actuel)
    base_maintenance: {
      initial: 'depositing',
      states: {
        depositing: { /* actuel */ },
        refueling: { /* actuel */ },
        repairing: { /* actuel */ }
      }
    }
  }
}
```

#### Advantages ✅

- ✅ Séparation claire : base VS station
- ✅ Garde le flow actuel intact
- ✅ Extensible : facile d'ajouter d'autres types de stations

#### Disadvantages ❌

- ❌ **Complexité accrue** : sous-états imbriqués
- ❌ **Duplication** : refuel/repair logique dupliquée (base vs station)
- ❌ **Plus de states** : 4 states supplémentaires vs 1 (Option A)

---

### Option C: Réutilisation du Pattern Collection

**Principe**: Traiter les stations comme des **tiles collectables spéciales** dans l'état `collecting`.

#### Architecture

```typescript
evaluating: {
  on: {
    NEED_MAINTENANCE: [
      {
        // Station proche → utilise pattern collection
        target: 'collecting.ship_moving_to_tile',
        guard: 'shouldUseNearbyStation',
        actions: 'assignShipMovingToStationContext'
      },
      {
        // Base → retour classique
        target: 'maintaining',
        guard: 'shouldMaintain'
      }
    ]
  }
}

collecting: {
  states: {
    ship_moving_to_tile: {
      on: {
        SHIP_REACHES_TILE: [
          {
            target: '#machineXV5Pure.evaluating',
            guard: 'isAtFuelStationTile',
            actions: ['assignShipRefuelContext', 'logStationUsed']
          },
          {
            target: '#machineXV5Pure.evaluating',
            guard: 'isAtRepairStationTile',
            actions: ['assignShipRepairContext', 'logStationUsed']
          },
          {
            target: 'ship_collecting',
            guard: 'canCollectTile',
            actions: 'assignShipCollectingContext'
          }
        ]
      }
    }
  }
}
```

#### Advantages ✅

- ✅ **Très simple** : réutilise 100% du code existant
- ✅ **Pas de nouvel état**
- ✅ **Pas de nouvel événement**
- ✅ Stations = tiles comme les autres (pathfinding gratuit)

#### Disadvantages ❌

- ❌ **Mélange des concerns** : collection VS maintenance
- ❌ **Sémantique floue** : station usage = fausse collection
- ❌ **Confusion pour le lecteur** : pourquoi faire de la "collection" pour refuel?

---

### Option D: Event-Driven Générique avec Payload Unifié

**Principe**: Un seul événement générique `MAINTENANCE_ACTION_COMPLETE` pour toutes les actions.

#### Architecture

```typescript
type MaintenanceCompleteEvent = {
  type: 'MAINTENANCE_ACTION_COMPLETE';
  action: 'deposit' | 'refuel' | 'repair';
  location: 'base' | 'station';
  stationType?: 'fuel' | 'repair';
};

maintaining: {
  states: {
    depositing: {
      on: {
        MAINTENANCE_ACTION_COMPLETE: [
          { target: 'refueling', guard: 'needsRefuel', actions: 'processMaintenanceResult' },
          { target: 'repairing', guard: 'needsRepair', actions: 'processMaintenanceResult' },
          { target: '#machineXV5Pure.evaluating', actions: 'processMaintenanceResult' }
        ]
      }
    },
    // ... refueling, repairing (même transitions)
  }
}

// Tracker envoie toujours le même événement
tracker.send({ 
  type: 'MAINTENANCE_ACTION_COMPLETE',
  action: 'refuel',
  location: atStation ? 'station' : 'base',
  stationType: atStation ? 'fuel' : undefined
});
```

#### Advantages ✅

- ✅ **Event-driven pur** : un seul événement, payload riche
- ✅ **Facile à logger/tracker** : actions clairement identifiées
- ✅ **Extension simple** : ajout de nouveaux types facile

#### Disadvantages ❌

- ❌ **Payload complexe** : beaucoup d'informations
- ❌ **Moins lisible** : `MAINTENANCE_ACTION_COMPLETE` vs `SHIP_REFUEL_COMPLETE`
- ❌ **Guards plus complexes** : doivent checker le type d'action

---

## 🏆 Recommandation Finale

### ✅ **Option A: Event-Driven Unifié**

**Raison**: Meilleur équilibre entre simplicité, clarté et extensibilité.

#### Architecture Proposée

```typescript
// 1. Décision en amont (dans evaluating ou nouveau sous-état planning)
evaluating: {
  on: {
    NEED_MAINTENANCE: {
      target: 'maintaining.planning',
      actions: 'assignMaintenancePlanContext' // Décide destination ici
    }
  }
}

// 2. Planning décide de la cible
maintaining: {
  initial: 'planning',
  states: {
    planning: {
      entry: 'assignMaintenanceTargetContext', // Calcule meilleure destination
      always: [
        { target: 'navigating', guard: 'needsNavigation' }, // Station loin
        { target: 'depositing' } // Base (déjà sur place)
      ]
    },
    
    // 3. Navigation partagée (si station loin)
    navigating: {
      on: {
        SHIP_REACHES_WAYPOINT: {
          guard: 'hasMoreWaypoints',
          actions: 'assignShipNextWaypointContext'
        },
        SHIP_REACHES_MAINTENANCE_POINT: [
          { target: 'refueling', guard: 'pointTypeIs_fuel' },
          { target: 'repairing', guard: 'pointTypeIs_repair' },
          { target: 'depositing', guard: 'pointTypeIs_base' }
        ]
      }
    },
    
    // 4. Actions de maintenance (flow actuel)
    depositing: { /* inchangé */ },
    refueling: { /* inchangé */ },
    repairing: { /* inchangé */ }
  }
}

// game_over (inchangé)
game_over: { type: 'final' }
```

#### Pourquoi cette approche?

- ✅ **Décision upstream** : `planning` calcule la meilleure destination
- ✅ **Réutilise `navigating`** : pattern identique à `ship_moving_to_tile`
- ✅ **Event-driven clair** : `SHIP_REACHES_MAINTENANCE_POINT` avec payload explicite
- ✅ **Backward compatible** : Si pas de station proche, flow actuel inchangé
- ✅ **Pas de duplication** : refuel/repair logic reste identique (base ou station)

#### Guard Decision Logic

```typescript
// Dans planning.entry (assignMaintenanceTargetContext)
const needsDeposit = resources > 100;
const needsRefuel = fuel < 30;
const needsRepair = damage > 50;

// Quelle action d'abord?
if (needsDeposit) {
  // Toujours à la base (où stocker les ressources?)
  targetPoint = 'base';
} else if (needsRefuel) {
  // Chercher station fuel la plus proche vs base
  const nearestFuelStation = findNearestStation(context, 'fuel');
  const distToStation = distance(ship, nearestFuelStation);
  const distToBase = distance(ship, baseCoord);
  targetPoint = distToStation < distToBase ? nearestFuelStation : 'base';
} else if (needsRepair) {
  // Chercher station repair la plus proche vs base
  const nearestRepairStation = findNearestStation(context, 'repair');
  const distToStation = distance(ship, nearestRepairStation);
  const distToBase = distance(ship, baseCoord);
  targetPoint = distToStation < distToBase ? nearestRepairStation : 'base';
}
```

---

## 📝 Prochaines Étapes

### Phase 1: Implémentation Minimale (Option A)

1. **Créer les nouveaux types d'événements**:
   - `SHIP_REACHES_MAINTENANCE_POINT` dans `src/types/events.d.ts`
   - Payload: `{ type, pointType: 'base' | 'fuel_station' | 'repair_station', coord }`

2. **Ajouter guards**:
   - `isAtFuelStation`, `isAtRepairStation`, `isAtBase` dans `src/ai/fsm/machineX/domains/maintenance/guards.pure.ts`

3. **Modifier le machine**:
   - Ajouter sous-état `planning` à `maintaining`
   - Ajouter sous-état `navigating` à `maintaining`
   - Modifier transitions de `ship_returning` pour utiliser `SHIP_REACHES_MAINTENANCE_POINT`

4. **Modifier le tracker**:
   - `useSimulatedTracker.ts` : ajouter logique pour décider destination
   - Envoyer `SHIP_REACHES_MAINTENANCE_POINT` au lieu de `SHIP_REACHES_BASE`

5. **Ajouter actions**:
   - `assignMaintenancePlanContext` (décide destination)
   - `assignMaintenanceTargetContext` (calcule trajet si nécessaire)

### Phase 2: Optimisations

1. **Pathfinding vers stations**:
   - `findNearestFuelStation(context)` → garde le plus proche
   - `findNearestRepairStation(context)` → garde le plus proche
   - Ajouter guard `needsNavigation` (station loin de la position actuelle)

2. **Avantages stations** (gameplay):
   - Station fuel : refuel 100% (vs 100% à la base)
   - Station repair : repair -5% damage bonus
   - Stations avec cooldown ou capacité limitée?

3. **Edge cases**:
   - Station détruite / visitée (cooldown)?
   - Aucune station dans le radius?
   - Fuel critique (< 8%) : override, aller à plus proche station?

4. **Scénarios Gherkin**:
   - Créer `maintenance-stations.feature` spécifiant:
     - "Maintenance à une station proche"
     - "Retour à la base quand station loin"
     - "Refuel à station vs repair à base"
     - Edge cases

### Phase 3: Testing & Validation

1. **Unit tests** : Guards `isAtFuelStation`, `isAtRepairStation`, `isAtBase`
2. **Integration tests** : Flow complet (evaluating → maintaining → station → refuel → evaluating)
3. **Scenario validation** : Tous les `.feature` doivent passer

---

## 📚 Fichiers à Modifier

### Core Files

- `src/ai/fsm/machineX/machine.pure.v5.ts` - Ajouter sub-states `planning` et `navigating`
- `src/types/events.d.ts` - Ajouter `SHIP_REACHES_MAINTENANCE_POINT`
- `src/ai/fsm/machineX/domains/maintenance/guards.pure.ts` - Ajouter guards
- `src/ai/fsm/machineX/domains/maintenance/actions.assign.ts` - Ajouter `assignMaintenancePlanContext`

### Tracker Files

- `src/ai/fsm/machineX/hooks/trackers/useSimulatedTracker.ts` - Décision destination
- `src/ai/fsm/machineX/shared/simulatedTrackerCore.ts` - Events pour `planning` et `navigating`

### Scenario Files

- `docs/bot-spec/scenarios/maintenance.feature` - Mettre à jour
- `docs/bot-spec/scenarios/maintenance-stations.feature` - Créer NEW

---

## 🎯 Questions à Valider

1. **Dépôt de ressources** : Toujours uniquement à la base? Ou accepter dépôt partiel aux stations?
2. **Avantages stations** : Doivent-elles avoir des bonuses (refuel 100% vs 100%, repair bonus)?
3. **Station capacity** : Stations avec cooldown/uses limités?
4. **Emergency override** : Si fuel critique (< 8%), forcer station PLUS proche?
5. **Graphisme** : Comment visualiser différemment station vs base au retour?

---

## 🔗 Références

- Machine principale: [machine.pure.v5.ts](src/ai/fsm/machineX/machine.pure.v5.ts#L270-L340)
- Guards maintenance: [guards.pure.ts](src/ai/fsm/machineX/domains/maintenance/guards.pure.ts)
- Actions maintenance: [actions.assign.ts](src/ai/fsm/machineX/domains/maintenance/actions.assign.ts)
- Tracker: [useSimulatedTracker.ts](src/ai/fsm/machineX/hooks/trackers/useSimulatedTracker.ts)
- Scenarios: [docs/bot-spec/scenarios/](docs/bot-spec/scenarios/)

---

## 📌 Notes Personnelles

**Avantages de faire cette refactorisation:**
- ✅ Utilise les tuiles stations (actuellement décoratives)
- ✅ Ajoute de la stratégie au gameplay
- ✅ Refactorisation propre sans casser le flow actuel
- ✅ Extensible pour futures stations spécialisées

**Risques:**
- ⚠️ Changement d'événement (SHIP_REACHES_BASE → SHIP_REACHES_MAINTENANCE_POINT)
- ⚠️ Tracker doit décider dynamiquement destination
- ⚠️ Plus de guards à tester

**Recommandation**: Commencer par Option A avec Phase 1 minimale, valider avec scenarios, puis ajouter optimisations Phase 2.
