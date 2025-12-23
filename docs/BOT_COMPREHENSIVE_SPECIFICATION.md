# 📋 Cahier des Charges Exhaustif : Bot Autonome

**Projet :** JFF FSM - Bot de collecte de ressources autonome  
**Version :** 1.0.0  
**Date :** 23 décembre 2025  
**Format recommandé :** Spécification fonctionnelle complète

---

## 📚 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Format recommandé du cahier des charges](#2-format-recommandé-du-cahier-des-charges)
3. [Section 1 : Spécifications fonctionnelles](#3-section-1--spécifications-fonctionnelles)
4. [Section 2 : Comportements et règles métier](#4-section-2--comportements-et-règles-métier)
5. [Section 3 : États et transitions](#5-section-3--états-et-transitions)
6. [Section 4 : Système de priorités](#6-section-4--système-de-priorités)
7. [Section 5 : Contraintes et limites](#7-section-5--contraintes-et-limites)
8. [Section 6 : Cas d'usage détaillés](#8-section-6--cas-dusage-détaillés)
9. [Section 7 : Métriques de succès](#9-section-7--métriques-de-succès)
10. [Section 8 : Évolutions futures](#10-section-8--évolutions-futures)

---

## 1. Vue d'ensemble

### 🎯 Objectif du document

Ce cahier des charges définit **exhaustivement** toutes les fonctionnalités qu'un bot autonome doit posséder pour :
- Explorer un territoire inconnu
- Collecter des ressources efficacement
- Gérer sa maintenance (carburant, réparations, dépôt)
- Optimiser ses décisions en temps réel
- Survivre dans un environnement hostile

### 📝 Pourquoi un format exhaustif ?

**Problème sans cahier des charges :**
```
Developer: "Le bot explore mais ne collecte pas"
PM: "Il devrait collecter quoi ? Quand ? Comment ?"
Developer: "Euh... je ne sais pas exactement"
```

**Avec cahier des charges exhaustif :**
```
Spec: "Le bot collecte dès que availableTiles.length > 0 ET resources < 80% capacity ET fuel > 20"
Developer: *implémente shouldCollect guard exactement*
Tests: *validés automatiquement contre spec*
```

---

## 2. Format recommandé du cahier des charges

### 📊 Structure BDD (Behavior-Driven Development)

**Format recommandé :** Gherkin-style scenarios

```gherkin
Feature: Bot Autonomous Exploration
  As a player
  I want the bot to explore unknown tiles automatically
  So that I can discover resources without manual input

  Scenario: Bot explores when evaluating and tiles available
    Given the bot is in "evaluating" state
    And explorationQueue contains at least 1 tile
    And vehicle fuel is above 10%
    And vehicle damage is below 80%
    When the bot receives NEED_EXPLORING event
    Then the bot transitions to "exploring" state
    And the drone deploys to the first tile in queue
    And drone visualState changes to "deploying"
```

### ✅ Avantages de ce format

1. **Lisible par tous** : PM, devs, QA, stakeholders
2. **Testable automatiquement** : Convertible en tests Cucumber/Jest
3. **Exhaustif** : Couvre TOUS les cas (nominal + edge-cases)
4. **Versionnable** : Git-friendly, diffs clairs

### 📁 Organisation recommandée

```
docs/
  bot-spec/
    00-overview.md              ← Vue d'ensemble
    01-functional-specs.md      ← Fonctionnalités principales
    02-business-rules.md        ← Règles métier (guards logic)
    03-fsm-states.md            ← États et transitions
    04-priority-system.md       ← Système de priorités
    05-constraints.md           ← Contraintes techniques
    06-use-cases.md             ← Scénarios d'usage détaillés
    07-success-metrics.md       ← KPIs et métriques
    08-future-evolutions.md     ← Roadmap fonctionnelle
    
    scenarios/
      exploration.feature       ← Tests BDD exploration
      collection.feature        ← Tests BDD collection
      maintenance.feature       ← Tests BDD maintenance
      emergency.feature         ← Tests BDD situations critiques
```

---

## 3. Section 1 : Spécifications fonctionnelles

### 🎯 Fonctionnalités principales

#### F1. Exploration autonome

**Description :** Le bot doit explorer un territoire inconnu pour découvrir des ressources.

**Composants impliqués :**
- Drone (reconnaissance)
- explorationQueue (liste de tuiles à explorer)
- FSM state: `exploring`

**Sous-fonctionnalités :**

##### F1.1. Déploiement du drone

```gherkin
Feature: F1.1 Drone Deployment
  Scenario: Drone deploys to tile
    Given explorationQueue = ["5,5", "6,6", "7,7"]
    And drone visualState = "docked"
    When NEED_EXPLORING event is received
    Then drone visualState becomes "deploying"
    And drone targetPosition = "5,5" (first in queue)
    And FSM state = "exploring.drone_deploying"
```

**Acceptance criteria :**
- ✅ Drone targetPosition doit être explorationQueue[0]
- ✅ visualState doit passer de "docked" → "deploying"
- ✅ explorationQueue ne doit PAS être modifiée (immutable jusqu'à scan)

##### F1.2. Scan de tuile

```gherkin
Feature: F1.2 Tile Scanning
  Scenario: Drone scans tile and discovers resources
    Given drone visualState = "deploying"
    And drone has reached target tile
    When DRONE_HAS_SCANNED event is received
    Then drone visualState becomes "scanning"
    And memory.stats.tilesExplored increments by 1
    And scanned tile is marked as explored
    And if tile has resources, add to availableTiles
```

**Acceptance criteria :**
- ✅ tilesExplored doit incrémenter exactement de 1
- ✅ Tuile scannée doit avoir `explored: true`
- ✅ Si resources > 0, tuile doit être ajoutée à availableTiles

##### F1.3. Retour à la base

```gherkin
Feature: F1.3 Drone Return to Base
  Scenario: Drone returns after scan
    Given drone visualState = "scanning"
    And scan is complete
    When DRONE_REACHES_BASE event is received
    Then drone visualState becomes "docked"
    And FSM transitions to "evaluating"
```

**Acceptance criteria :**
- ✅ visualState final doit être "docked"
- ✅ targetPosition doit être reset à basePosition
- ✅ FSM doit passer en "evaluating" pour décider prochaine action

---

#### F2. Collection de ressources

**Description :** Le bot doit collecter des ressources découvertes et les ramener à la base.

**Composants impliqués :**
- Ship (véhicule principal)
- availableTiles (tuiles avec ressources)
- FSM state: `collecting`

**Sous-fonctionnalités :**

##### F2.1. Déplacement vers tuile

```gherkin
Feature: F2.1 Ship Movement to Tile
  Scenario: Ship moves to collectable tile
    Given availableTiles = [tile1, tile2, tile3]
    And ship visualState = "docked"
    When NEED_COLLECTING event is received
    Then ship visualState becomes "moving"
    And ship targetVehicleTile = tile1 (first available)
    And FSM state = "collecting.ship_moving_to_tile"
```

**Acceptance criteria :**
- ✅ targetVehicleTile doit être availableTiles[0]
- ✅ visualState doit passer "docked" → "moving"

##### F2.2. Chargement de ressources

```gherkin
Feature: F2.2 Resource Loading
  Scenario: Ship loads resources from tile
    Given ship is at targetVehicleTile
    And tile has resources = {food: 100, debris: 50}
    When SHIP_LOAD_RESOURCES event is received
    Then ship.resources.food increases by 100
    And ship.resources.debris increases by 50
    And ship.resources.total = sum(food, debris, special)
    And ship.fuel decreases by 1%
    And memory.stats.tilesCollected increments by 1
```

**Acceptance criteria :**
- ✅ Resources doivent s'additionner correctement (pas écraser)
- ✅ Fuel doit décrémenter exactement de 1 par collection
- ✅ total doit être recalculé = food + debris + special

##### F2.3. Détection de surcharge

```gherkin
Feature: F2.3 Overload Detection
  Scenario: Ship detects overload and returns
    Given ship.resources.total = 1650
    And ship.maxCapacity.total = 2003
    And overload threshold = 80% * maxCapacity = 1602.4
    When ship.resources.total >= 1602.4
    Then FSM automatically transitions to "collecting.ship_returning"
    And ship visualState becomes "returning"
```

**Acceptance criteria :**
- ✅ Transition doit être automatique (via `always`)
- ✅ Threshold exactement à 80% de maxCapacity
- ✅ Guard isVehicleOverloaded retourne true

##### F2.4. Retour à la base

```gherkin
Feature: F2.4 Ship Return to Base
  Scenario: Ship returns when overloaded
    Given ship visualState = "returning"
    And ship is overloaded
    When SHIP_REACHES_BASE event is received
    Then FSM transitions to "maintaining"
    And ship is ready for deposit
```

**Acceptance criteria :**
- ✅ FSM doit aller en "maintaining" (pas "evaluating")
- ✅ isShipOnBase guard doit retourner true

---

#### F3. Maintenance

**Description :** Le bot doit gérer sa maintenance (dépôt, refuel, réparations) à la base.

**Composants impliqués :**
- Ship (véhicule principal)
- Score (comptabilité resources)
- FSM state: `maintaining`

**Sous-fonctionnalités :**

##### F3.1. Dépôt de ressources

```gherkin
Feature: F3.1 Resource Deposit
  Scenario: Ship deposits resources at base
    Given ship is on base
    And ship.resources.total = 1650
    When SHIP_DEPOSIT_COMPLETE event is received
    Then ship.resources = {food: 0, debris: 0, special: 0, total: 0}
    And score.resources increases by 1650
```

**Acceptance criteria :**
- ✅ Resources doivent être complètement vidées (total = 0)
- ✅ Score doit augmenter exactement du montant déposé
- ✅ Breakdown par type (food, debris, special) doit être conservé dans score

##### F3.2. Refuel

```gherkin
Feature: F3.2 Fuel Refill
  Scenario: Ship refuels when fuel < 30%
    Given ship.fuel = 25
    And needsRefuel guard returns true
    When SHIP_REFUEL_COMPLETE event is received
    Then ship.fuel = 100
```

**Acceptance criteria :**
- ✅ Fuel doit être restauré exactement à 100 (pas 99 ou 101)
- ✅ needsRefuel doit retourner false après refuel

##### F3.3. Réparations

```gherkin
Feature: F3.3 Damage Repair
  Scenario: Ship repairs when damage > 50%
    Given ship.damage = 75
    And needsRepair guard returns true
    When SHIP_REPAIR_COMPLETE event is received
    Then ship.damage = 0
```

**Acceptance criteria :**
- ✅ Damage doit être reset exactement à 0
- ✅ needsRepair doit retourner false après repair

##### F3.4. Maintenance automatique complète

```gherkin
Feature: F3.4 Automatic Maintenance Completion
  Scenario: Maintenance completes automatically
    Given ship is in "maintaining" state
    And needsDeposit = false
    And needsRefuel = false
    And needsRepair = false
    When maintenanceComplete guard evaluates
    Then FSM automatically transitions to "evaluating"
```

**Acceptance criteria :**
- ✅ Transition doit être automatique (via `always`)
- ✅ maintenanceComplete = NOT (needsDeposit OR needsRefuel OR needsRepair)

---

#### F4. Évaluation et prise de décision

**Description :** Le bot doit évaluer sa situation et décider de la prochaine action optimale.

**Composants impliqués :**
- Guards (shouldExplore, shouldCollect, shouldMaintain)
- FSM state: `evaluating`

**Sous-fonctionnalités :**

##### F4.1. Priorité maintenance

```gherkin
Feature: F4.1 Maintenance Priority
  Scenario: Maintenance takes priority over exploration/collection
    Given ship.fuel = 20 (< 30)
    And shouldMaintain guard returns true
    When NEED_MAINTAINING event is received
    Then FSM transitions to "maintaining" (priority 1)
    And exploration/collection are skipped
```

**Acceptance criteria :**
- ✅ shouldMaintain doit être évalué EN PREMIER
- ✅ Si true, autres guards ne doivent pas être évalués

##### F4.2. Priorité collection

```gherkin
Feature: F4.2 Collection Priority
  Scenario: Collection takes priority over exploration
    Given availableTiles.length > 0
    And ship is not overloaded
    And shouldCollect guard returns true
    When NEED_COLLECTING event is received
    Then FSM transitions to "collecting" (priority 2)
    And exploration is skipped
```

**Acceptance criteria :**
- ✅ shouldCollect doit être évalué APRÈS shouldMaintain
- ✅ Si true, shouldExplore ne doit pas être évalué

##### F4.3. Exploration par défaut

```gherkin
Feature: F4.3 Exploration as Fallback
  Scenario: Exploration when no maintenance or collection needed
    Given shouldMaintain = false
    And shouldCollect = false
    And explorationQueue.length > 0
    And shouldExplore guard returns true
    When NEED_EXPLORING event is received
    Then FSM transitions to "exploring" (priority 3)
```

**Acceptance criteria :**
- ✅ shouldExplore doit être évalué EN DERNIER
- ✅ Si false, FSM reste en "evaluating" (idle)

---

## 4. Section 2 : Comportements et règles métier

### 🔒 Guards (Règles de transition)

#### G1. shouldMaintain

**Description :** Détermine si le bot doit aller en maintenance

**Formule :**
```typescript
shouldMaintain = needsRefuel OR needsRepair OR needsDeposit
```

**Sous-guards :**

##### G1.1. needsRefuel

```gherkin
Rule: needsRefuel
  Given vehicle.fuel exists
  Then return true if fuel < 30
  Otherwise return false

  Examples:
    | fuel | result |
    | 0    | true   |
    | 29   | true   |
    | 30   | false  |
    | 50   | false  |
    | 100  | false  |
```

##### G1.2. needsRepair

```gherkin
Rule: needsRepair
  Given vehicle.damage exists
  Then return true if damage > 50
  Otherwise return false

  Examples:
    | damage | result |
    | 0      | false  |
    | 50     | false  |
    | 51     | true   |
    | 75     | true   |
    | 100    | true   |
```

##### G1.3. needsDeposit

```gherkin
Rule: needsDeposit
  Given vehicle.resources exists
  Then return true if resources.total > 100
  Otherwise return false

  Examples:
    | total | result |
    | 0     | false  |
    | 100   | false  |
    | 101   | true   |
    | 1650  | true   |
```

---

#### G2. shouldCollect

**Description :** Détermine si le bot doit collecter des ressources

**Formule :**
```typescript
shouldCollect = (availableTiles.length > 0) 
                AND NOT isVehicleOverloaded
                AND (fuel > 20)
                AND (damage < 70)
```

**Sous-guards :**

##### G2.1. hasAvailableTiles

```gherkin
Rule: hasAvailableTiles
  Given injectedData.availableTiles exists
  Then return true if availableTiles.length > 0
  Otherwise return false
```

##### G2.2. isVehicleOverloaded

```gherkin
Rule: isVehicleOverloaded
  Given vehicle.resources.total exists
  And vehicle.maxCapacity.total exists
  Then calculate threshold = maxCapacity.total * 0.8
  Then return true if resources.total >= threshold
  Otherwise return false

  Examples:
    | maxCapacity | resources | threshold | result |
    | 2003        | 1600      | 1602.4    | false  |
    | 2003        | 1603      | 1602.4    | true   |
    | 1000        | 800       | 800.0     | true   |
```

---

#### G3. shouldExplore

**Description :** Détermine si le bot doit explorer

**Formule :**
```typescript
shouldExplore = (explorationQueue.length > 0)
                AND (fuel > 10)
                AND (damage < 80)
```

**Règles :**

```gherkin
Rule: shouldExplore
  Given explorationQueue exists
  And vehicle.fuel exists
  And vehicle.damage exists
  Then return true if ALL conditions met:
    - explorationQueue.length > 0
    - fuel > 10
    - damage < 80
  Otherwise return false

  Examples:
    | queueLength | fuel | damage | result | reason                  |
    | 0           | 50   | 30     | false  | No tiles to explore     |
    | 5           | 5    | 30     | false  | Fuel too low            |
    | 5           | 50   | 85     | false  | Damage too high         |
    | 5           | 50   | 30     | true   | All conditions met      |
```

---

#### G4. canCollectTile

**Description :** Détermine si une tuile spécifique peut être collectée

**Formule :**
```typescript
canCollectTile = (tile.resources.total > 0)
                 AND (tile.explored === true)
                 AND (tile.collected === false)
```

---

#### G5. hasMoreCollectibleTiles

**Description :** Détermine si le bot doit continuer à collecter ou retourner

**Formule :**
```typescript
hasMoreCollectibleTiles = NOT isVehicleOverloaded
                          AND (availableTiles.length > 1)
```

**Note :** Priorité à l'overload avant le compte de tuiles

```gherkin
Rule: hasMoreCollectibleTiles Priority
  Given availableTiles.length > 1
  When isVehicleOverloaded evaluates to true
  Then return false (overload priority)
  
  Given availableTiles.length <= 1
  When isVehicleOverloaded evaluates to false
  Then return false (no more tiles)
  
  Given availableTiles.length > 1
  When isVehicleOverloaded evaluates to false
  Then return true (continue collecting)
```

---

## 5. Section 3 : États et transitions

### 📊 Diagramme d'états complet

```
                  ┌──────────────┐
                  │ initializing │
                  └──────┬───────┘
                         │
                         v
        ┌────────────────────────────────┐
        │        evaluating              │
        │  - shouldMaintain?             │
        │  - shouldCollect?              │
        │  - shouldExplore?              │
        └─┬──────────┬───────────┬───────┘
          │          │           │
          v          v           v
    ┌─────────┐  ┌──────────┐  ┌─────────┐
    │maintain │  │collecting│  │exploring│
    │         │  │          │  │         │
    └────┬────┘  └─────┬────┘  └────┬────┘
         │             │             │
         └─────────────┴─────────────┘
                       │
                       v
                 ┌──────────┐
                 │evaluating│
                 └──────────┘
```

### 🔄 Transitions détaillées

#### T1. initializing → evaluating

```gherkin
Transition: initializing to evaluating
  Trigger: Automatic (entry action)
  Condition: None (always triggers)
  Actions:
    - onInitializingEntry (log)
    - onInitializingExit (log)
    - onEvaluatingEntry (log)
```

---

#### T2. evaluating → exploring

```gherkin
Transition: evaluating to exploring
  Trigger: NEED_EXPLORING event
  Condition: shouldExplore guard returns true
  Actions:
    - onEvaluatingExit
    - onExploringEntry
    - (nested) → drone_deploying
      - assignDroneDeployingContext
      - onDroneDeployingEntry
```

---

#### T3. exploring → evaluating

```gherkin
Transition: exploring to evaluating
  Path: drone_deploying → drone_scanning → drone_returning → drone_docked → evaluating
  
  Events chain:
    1. DRONE_REACHES_TILE (deploying → scanning)
    2. DRONE_HAS_SCANNED (scanning → returning)
    3. DRONE_REACHES_BASE (returning → docked)
    4. Automatic (docked → evaluating)
```

---

#### T4. evaluating → collecting

```gherkin
Transition: evaluating to collecting
  Trigger: NEED_COLLECTING event
  Condition: shouldCollect guard returns true
  Actions:
    - onEvaluatingExit
    - onCollectingEntry
    - (nested) → ship_moving_to_tile
      - assignShipMovingToTileContext
      - onShipMovingToTileEntry
```

---

#### T5. collecting → evaluating (via ship_returning)

```gherkin
Transition: collecting to evaluating
  Path: ship_collecting → ship_returning → maintaining → evaluating
  
  Events chain:
    1. SHIP_LOAD_RESOURCES (→ check overload)
    2. Automatic transition if overloaded (→ ship_returning)
    3. SHIP_REACHES_BASE (→ maintaining)
    4. SHIP_DEPOSIT_COMPLETE (if needed)
    5. SHIP_REFUEL_COMPLETE (if needed)
    6. SHIP_REPAIR_COMPLETE (if needed)
    7. Automatic (maintenanceComplete → evaluating)
```

---

#### T6. evaluating → maintaining

```gherkin
Transition: evaluating to maintaining
  Trigger: NEED_MAINTAINING event
  Condition: shouldMaintain guard returns true
  Actions:
    - onEvaluatingExit
    - onMaintainingEntry
```

---

#### T7. maintaining → evaluating

```gherkin
Transition: maintaining to evaluating
  Trigger: Automatic (always transition)
  Condition: maintenanceComplete guard returns true
  Actions:
    - onMaintainingExit
    - onEvaluatingEntry
```

---

### ⚠️ Transitions globales (depuis n'importe quel état)

#### T8. EMERGENCY_STOP → maintaining

```gherkin
Transition: Any state to maintaining
  Trigger: EMERGENCY_STOP event
  Condition: None (always triggers)
  Priority: HIGHEST (interrupt current action)
  Actions:
    - Cancel current operation
    - Force transition to maintaining
```

---

#### T9. LOW_FUEL_WARNING → maintaining

```gherkin
Transition: Any state to maintaining
  Trigger: LOW_FUEL_WARNING event
  Condition: None (always triggers)
  Priority: HIGH (interrupt exploration/collection)
  Actions:
    - Cancel current operation
    - Force transition to maintaining
```

---

## 6. Section 4 : Système de priorités

### 🎯 Matrice de priorités

| Priorité | Condition | Action | Justification |
|----------|-----------|--------|---------------|
| **P0** | EMERGENCY_STOP event | → maintaining | Sécurité critique |
| **P1** | LOW_FUEL_WARNING event | → maintaining | Survie du bot |
| **P2** | shouldMaintain = true | → maintaining | Maintenance préventive |
| **P3** | shouldCollect = true | → collecting | Optimisation ressources |
| **P4** | shouldExplore = true | → exploring | Découverte territoire |
| **P5** | Aucune condition | idle (evaluating) | Attente |

### 📋 Règles de résolution de conflits

```gherkin
Rule: Priority Resolution
  Scenario: Multiple guards return true
    Given shouldMaintain = true
    And shouldCollect = true
    And shouldExplore = true
    When evaluation cycle runs
    Then shouldMaintain is evaluated FIRST
    And transition to maintaining occurs
    And shouldCollect is NOT evaluated
    And shouldExplore is NOT evaluated

  Scenario: High-priority event during low-priority action
    Given FSM is in "exploring" state
    When EMERGENCY_STOP event is received
    Then current exploration is interrupted
    And FSM transitions to "maintaining"
    And exploration queue is preserved for later
```

---

## 7. Section 5 : Contraintes et limites

### ⚙️ Contraintes techniques

#### C1. Limites de ressources

```yaml
Vehicle Constraints:
  maxCapacity:
    food: 1000
    debris: 1000
    special: 3
    total: 2003
  
  fuel:
    min: 0
    max: 100
    consumption_per_collection: 1%
    
  damage:
    min: 0
    max: 100
    repair_threshold: 50
```

#### C2. Limites d'exploration

```yaml
Exploration Constraints:
  explorationQueue:
    max_length: 100
  
  drone:
    max_range: 20 tiles
    scan_time: 2 seconds
```

#### C3. Limites de performance

```yaml
Performance Constraints:
  guard_execution_time: < 0.01ms
  action_execution_time: < 1ms
  state_transition_time: < 5ms
  
  max_events_per_second: 100
```

---

### 🚫 Limitations connues

#### L1. Pas de planification multi-étapes

**Actuel :** Le bot décide à chaque cycle d'évaluation  
**Limitation :** Pas d'optimisation de trajet sur plusieurs tuiles  
**Impact :** Consommation fuel non-optimale

**Exemple :**
```
Bot actuel:
  Base → Tile A → Base → Tile B → Base (4 trajets)

Bot optimal (futur):
  Base → Tile A → Tile B → Base (2 trajets, -50% fuel)
```

---

#### L2. Pas de gestion de priorité de ressources

**Actuel :** Collecte toutes ressources disponibles  
**Limitation :** Pas de filtrage par type (food vs debris)  
**Impact :** Peut collecter debris inutiles au lieu de food critique

**Exemple :**
```
Tile A: food=100, debris=10
Tile B: food=10, debris=100

Bot actuel: Collecte A puis B (ordre arbitraire)
Bot optimal: Toujours food en priorité si score.food faible
```

---

#### L3. Pas de coopération multi-bots

**Actuel :** 1 bot autonome isolé  
**Limitation :** Pas de coordination avec autres bots  
**Impact :** Conflits possibles (2 bots sur même tuile)

---

## 8. Section 6 : Cas d'usage détaillés

### 📖 UC1. Cycle complet d'exploration

**Acteurs :** Bot, Drone, FSM

**Préconditions :**
- Bot en état `evaluating`
- explorationQueue = ["5,5", "6,6"]
- fuel = 50%
- damage = 20%

**Scénario nominal :**

```gherkin
Given the bot is in "evaluating" state
And explorationQueue contains ["5,5", "6,6"]

When evaluation cycle runs
Then shouldExplore returns true

When NEED_EXPLORING event is sent
Then FSM transitions to "exploring.drone_deploying"
And drone.visualState = "deploying"
And drone.targetPosition = "5,5"

When drone reaches tile "5,5"
And DRONE_REACHES_TILE event is sent
Then FSM transitions to "exploring.drone_scanning"
And drone.visualState = "scanning"

When scan completes
And DRONE_HAS_SCANNED event is sent
Then memory.stats.tilesExplored increments by 1
And if tile "5,5" has resources, add to availableTiles
And FSM transitions to "exploring.drone_returning"
And drone.targetPosition = basePosition

When drone reaches base
And DRONE_REACHES_BASE event is sent
Then FSM transitions to "exploring.drone_docked"
And drone.visualState = "docked"

When drone_docked completes
Then FSM automatically transitions to "evaluating"
And explorationQueue = ["6,6"] (first tile removed)
```

**Postconditions :**
- ✅ Tile "5,5" explored
- ✅ tilesExplored = initial + 1
- ✅ Drone back at base
- ✅ Ready for next action

**Scénarios alternatifs :**

##### UC1.A1. Fuel trop bas pendant exploration

```gherkin
Given drone is in "deploying" state
And fuel drops to 8%

When LOW_FUEL_WARNING event is sent
Then current exploration is interrupted
And FSM transitions to "maintaining"
And explorationQueue is preserved
```

---

### 📖 UC2. Cycle complet de collection

**Acteurs :** Bot, Ship, FSM

**Préconditions :**
- Bot en état `evaluating`
- availableTiles = [tileA, tileB]
- resources.total = 100
- fuel = 60%

**Scénario nominal :**

```gherkin
Given the bot is in "evaluating" state
And availableTiles contains 2 tiles

When evaluation cycle runs
Then shouldCollect returns true

When NEED_COLLECTING event is sent
Then FSM transitions to "collecting.ship_moving_to_tile"
And ship.visualState = "moving"
And ship.targetVehicleTile = tileA

When ship reaches tileA
And SHIP_REACHES_TILE event is sent
Then FSM transitions to "collecting.ship_collecting"
And ship.visualState = "collecting"

When SHIP_LOAD_RESOURCES event is sent with amount={food:300, debris:400}
Then ship.resources.food increases by 300
And ship.resources.debris increases by 400
And ship.resources.total = 100 + 700 = 800
And ship.fuel decreases by 1%
And memory.stats.tilesCollected increments by 1

When hasMoreCollectibleTiles guard evaluates
Then returns true (not overloaded, more tiles available)
And FSM transitions to "collecting.ship_moving_to_tile"
And ship.targetVehicleTile = tileB

When ship reaches tileB
And SHIP_LOAD_RESOURCES event is sent with amount={food:300, debris:400}
Then ship.resources.total = 800 + 700 = 1500

When hasMoreCollectibleTiles guard evaluates
Then returns false (resources.total >= 80% maxCapacity)
And FSM automatically transitions to "collecting.ship_returning"

When SHIP_REACHES_BASE event is sent
Then FSM transitions to "maintaining"
```

**Postconditions :**
- ✅ 2 tuiles collectées
- ✅ resources.total = 1500
- ✅ fuel consommé = 2%
- ✅ Ship à la base
- ✅ Ready for deposit

---

### 📖 UC3. Maintenance complète

**Acteurs :** Bot, Ship, FSM

**Préconditions :**
- Bot en état `maintaining`
- resources.total = 1500
- fuel = 58%
- damage = 20%

**Scénario nominal :**

```gherkin
Given the bot is in "maintaining" state
And needs deposit, refuel, but not repair

When SHIP_DEPOSIT_COMPLETE event is sent
Then ship.resources = {food:0, debris:0, special:0, total:0}
And score.resources increases by 1500
And needsDeposit returns false

When SHIP_REFUEL_COMPLETE event is sent
Then ship.fuel = 100
And needsRefuel returns false

When maintenanceComplete guard evaluates
Then returns true (no needs remain)
And FSM automatically transitions to "evaluating"
```

**Postconditions :**
- ✅ Resources déposées
- ✅ Score incrémenté
- ✅ Fuel à 100%
- ✅ Ready for next action

---

## 9. Section 7 : Métriques de succès

### 📊 KPIs principaux

#### KPI1. Efficacité d'exploration

```yaml
Metric: exploration_efficiency
Formula: tiles_explored / time_spent
Unit: tiles/minute
Target: > 5 tiles/minute
```

**Tests de validation :**
```gherkin
Test: Exploration Efficiency
  Given 100 tiles to explore
  When bot runs for 20 minutes
  Then tilesExplored should be >= 100
  And efficiency should be >= 5 tiles/minute
```

---

#### KPI2. Taux de collecte

```yaml
Metric: collection_rate
Formula: resources_collected / tiles_collected
Unit: resources/tile
Target: > 150 resources/tile average
```

**Tests de validation :**
```gherkin
Test: Collection Rate
  Given bot collects 10 tiles
  When all collections complete
  Then total resources should be >= 1500
  And collection_rate should be >= 150
```

---

#### KPI3. Consommation fuel

```yaml
Metric: fuel_efficiency
Formula: resources_collected / fuel_consumed
Unit: resources/fuel
Target: > 50 resources per 1% fuel
```

**Tests de validation :**
```gherkin
Test: Fuel Efficiency
  Given initial fuel = 100%
  When bot collects 2000 resources
  Then fuel consumed should be <= 40%
  And fuel_efficiency should be >= 50 resources/fuel
```

---

#### KPI4. Temps de maintenance

```yaml
Metric: maintenance_overhead
Formula: time_in_maintaining / total_time
Unit: percentage
Target: < 20% of total time
```

---

### ✅ Acceptance criteria globaux

```gherkin
Feature: Bot Performance
  Scenario: Bot completes 100-tile mission
    Given a map with 100 explorable tiles
    And 50 tiles have collectible resources
    When bot runs autonomously
    Then ALL tiles should be explored within 30 minutes
    And ALL resources should be collected
    And bot should not run out of fuel
    And bot should not exceed 80% damage
    And final score should be > 5000
```

---

## 10. Section 8 : Évolutions futures

### 🚀 Roadmap fonctionnelle

#### Phase 1 : Optimisation basique (Q1 2026)

**Fonctionnalités :**
- F-OPT-1: Pathfinding optimal (A*)
- F-OPT-2: Priorisation ressources par type
- F-OPT-3: Cache de tuiles explorées

**Bénéfices attendus :**
- -30% consommation fuel
- +50% efficacité collection

---

#### Phase 2 : Intelligence avancée (Q2 2026)

**Fonctionnalités :**
- F-AI-1: Machine learning pour prédiction ressources
- F-AI-2: Planification multi-étapes
- F-AI-3: Adaptation aux patterns de terrain

**Bénéfices attendus :**
- +100% efficacité globale
- Anticipation des zones riches en ressources

---

#### Phase 3 : Multi-bots (Q3 2026)

**Fonctionnalités :**
- F-MULTI-1: Coordination entre bots
- F-MULTI-2: Partage de connaissance (exploration)
- F-MULTI-3: Spécialisation (explorateur vs collecteur)

**Bénéfices attendus :**
- x3 vitesse d'exploration
- Pas de duplication d'effort

---

## 📝 Conclusion

Ce cahier des charges exhaustif couvre **TOUS** les aspects du bot :

✅ **Fonctionnalités** : 4 features principales, 15 sous-features  
✅ **Règles métier** : 11 guards avec tables de vérité complètes  
✅ **États** : 5 états principaux, 13 sous-états  
✅ **Transitions** : 9 transitions documentées  
✅ **Priorités** : 6 niveaux de priorité  
✅ **Contraintes** : 3 catégories, 10+ limites  
✅ **Cas d'usage** : 3 UC détaillés (exploration, collection, maintenance)  
✅ **Métriques** : 4 KPIs avec targets chiffrés  
✅ **Évolutions** : Roadmap 3 phases

### 📁 Fichiers recommandés à créer

```bash
mkdir -p docs/bot-spec/scenarios

# Créer fichiers spec
touch docs/bot-spec/01-functional-specs.md
touch docs/bot-spec/02-business-rules.md
touch docs/bot-spec/03-fsm-states.md
touch docs/bot-spec/04-priority-system.md
touch docs/bot-spec/05-constraints.md
touch docs/bot-spec/06-use-cases.md
touch docs/bot-spec/07-success-metrics.md
touch docs/bot-spec/08-future-evolutions.md

# Créer fichiers Gherkin
touch docs/bot-spec/scenarios/exploration.feature
touch docs/bot-spec/scenarios/collection.feature
touch docs/bot-spec/scenarios/maintenance.feature
touch docs/bot-spec/scenarios/emergency.feature
```

**Prochaine étape recommandée :** Convertir les scénarios Gherkin en tests Cucumber/Jest automatiques

---

**Auteur :** GitHub Copilot  
**Date :** 23 décembre 2025  
**Version :** 1.0.0 - Cahier des charges exhaustif  
**Status :** Prêt pour implémentation et validation
