# Règles Métier : Guards et Logique de Décision

**Version :** 1.0.0  
**Date :** 23 décembre 2025

---

## Vue d'Ensemble

Les **guards** sont des fonctions pures qui décident si une transition FSM peut avoir lieu.

**Format :**
```typescript
type Guard = (context: FSMContext) => boolean;
```

---

## G1. shouldMaintain

**Rôle :** Détermine si le bot doit aller en maintenance

**Formule :**
```typescript
shouldMaintain = needsRefuel OR needsRepair OR needsDeposit
```

**Implémentation :**
```typescript
const shouldMaintain = ({ context }) => {
  return needsRefuel({ context }) 
      || needsRepair({ context }) 
      || needsDeposit({ context });
};
```

### Sous-guards

#### G1.1. needsRefuel

```gherkin
Rule: needsRefuel
  When vehicle.fuel < 30
  Then return true
  Otherwise return false

Examples:
  | fuel | result |
  | 0    | true   |
  | 29   | true   |
  | 30   | false  |
  | 50   | false  |
  | 100  | false  |
```

**Code :**
```typescript
const needsRefuel = ({ context }) => {
  const fuel = context.vehicle?.fuel ?? 0;
  return fuel < 30;
};
```

---

#### G1.2. needsRepair

```gherkin
Rule: needsRepair
  When vehicle.damage > 50
  Then return true
  Otherwise return false

Examples:
  | damage | result |
  | 0      | false  |
  | 50     | false  |
  | 51     | true   |
  | 75     | true   |
  | 100    | true   |
```

**Code :**
```typescript
const needsRepair = ({ context }) => {
  const damage = context.vehicle?.damage ?? 0;
  return damage > 50;
};
```

---

#### G1.3. needsDeposit

```gherkin
Rule: needsDeposit
  When vehicle.resources.total > 100
  Then return true
  Otherwise return false

Examples:
  | total | result |
  | 0     | false  |
  | 100   | false  |
  | 101   | true   |
  | 1650  | true   |
```

**Code :**
```typescript
const needsDeposit = ({ context }) => {
  const total = context.vehicle?.resources?.total ?? 0;
  return total > 100;
};
```

---

## G2. shouldCollect

**Rôle :** Détermine si le bot doit collecter des ressources

**Formule :**
```typescript
shouldCollect = hasAvailableTiles 
                AND NOT isVehicleOverloaded 
                AND (fuel > 20) 
                AND (damage < 70)
```

**Implémentation :**
```typescript
const shouldCollect = ({ context }) => {
  const hasAvailableTiles = (context.injectedData?.availableTiles?.length ?? 0) > 0;
  const isOverloaded = isVehicleOverloaded({ context });
  const fuel = context.vehicle?.fuel ?? 0;
  const damage = context.vehicle?.damage ?? 0;
  
  return hasAvailableTiles 
      && !isOverloaded 
      && fuel > 20 
      && damage < 70;
};
```

### Sous-guards

#### G2.1. isVehicleOverloaded

```gherkin
Rule: isVehicleOverloaded
  Given maxCapacity.total
  When resources.total >= maxCapacity.total * 0.8
  Then return true
  Otherwise return false

Examples:
  | maxCapacity | resources | threshold | result |
  | 2003        | 1600      | 1602.4    | false  |
  | 2003        | 1603      | 1602.4    | true   |
  | 1000        | 800       | 800.0     | true   |
  | 1000        | 799       | 800.0     | false  |
```

**Code :**
```typescript
const isVehicleOverloaded = ({ context }) => {
  const total = context.vehicle?.resources?.total ?? 0;
  const maxCapacity = context.vehicle?.maxCapacity?.total ?? 2003;
  const threshold = maxCapacity * 0.8;
  
  return total >= threshold;
};
```

---

#### G2.2. hasMoreCollectibleTiles

```gherkin
Rule: hasMoreCollectibleTiles
  Priority 1: Check overload
    When isVehicleOverloaded = true
    Then return false
  
  Priority 2: Check tiles count
    When availableTiles.length <= 1
    Then return false
  
  Default:
    When availableTiles.length > 1 AND NOT overloaded
    Then return true

Examples:
  | overloaded | availableTiles | result | reason               |
  | true       | 5              | false  | Overload priority    |
  | false      | 0              | false  | No tiles             |
  | false      | 1              | false  | Last tile            |
  | false      | 2              | true   | Continue collecting  |
```

**Code :**
```typescript
const hasMoreCollectibleTiles = ({ context }) => {
  // Priority 1: Check overload
  const totalResources = (context.vehicle?.resources?.food ?? 0) + 
                         (context.vehicle?.resources?.debris ?? 0) + 
                         (context.vehicle?.resources?.special ?? 0);
  const maxCapacity = context.vehicle?.maxCapacity?.total ?? 2003;
  const threshold = maxCapacity * 0.8;
  
  if (totalResources >= threshold) {
    return false; // Overloaded → stop
  }
  
  // Priority 2: Check tiles count
  const tiles = context.injectedData?.availableTiles;
  return tiles && tiles.length > 1;
};
```

---

## G3. shouldExplore

**Rôle :** Détermine si le bot doit explorer

**Formule :**
```typescript
shouldExplore = (explorationQueue.length > 0) 
                AND (fuel > 10) 
                AND (damage < 80)
```

```gherkin
Rule: shouldExplore
  When explorationQueue.length > 0
  And vehicle.fuel > 10
  And vehicle.damage < 80
  Then return true
  Otherwise return false

Examples:
  | queueLength | fuel | damage | result | reason              |
  | 0           | 50   | 30     | false  | No tiles to explore |
  | 5           | 5    | 30     | false  | Fuel too low        |
  | 5           | 50   | 85     | false  | Damage too high     |
  | 5           | 50   | 30     | true   | All conditions met  |
```

**Code :**
```typescript
const shouldExplore = ({ context }) => {
  const queueLength = context.explorationQueue?.length ?? 0;
  const fuel = context.vehicle?.fuel ?? 0;
  const damage = context.vehicle?.damage ?? 0;
  
  return queueLength > 0 && fuel > 10 && damage < 80;
};
```

---

## G4. canCollectTile

**Rôle :** Vérifie si une tuile spécifique peut être collectée

**Formule :**
```typescript
canCollectTile = (tile.resources.total > 0) 
                 AND (tile.explored === true) 
                 AND (tile.collected === false)
```

```gherkin
Rule: canCollectTile
  Given a tile
  When tile.resources.total > 0
  And tile.explored = true
  And tile.collected = false
  Then return true
  Otherwise return false
```

---

## G5. isShipOnBase

**Rôle :** Vérifie si le ship est à la base

**Formule :**
```typescript
isShipOnBase = (vehicle.position === vehicle.basePosition)
```

```gherkin
Rule: isShipOnBase
  When vehicle.position.x = basePosition.x
  And vehicle.position.z = basePosition.z
  Then return true
  Otherwise return false
```

---

## G6. maintenanceComplete

**Rôle :** Vérifie si toutes les maintenances sont terminées

**Formule :**
```typescript
maintenanceComplete = NOT (needsRefuel OR needsRepair OR needsDeposit)
```

```gherkin
Rule: maintenanceComplete
  When needsRefuel = false
  And needsRepair = false
  And needsDeposit = false
  Then return true
  Otherwise return false
```

---

## Matrice de Priorités

| Guard | Priority | Trigger | Impact |
|-------|----------|---------|--------|
| shouldMaintain | P1 | fuel<30 OR damage>50 OR resources>100 | → maintaining |
| shouldCollect | P2 | availableTiles>0 AND NOT overloaded | → collecting |
| shouldExplore | P3 | explorationQueue>0 | → exploring |

**Règle d'évaluation :**
1. Évaluer shouldMaintain EN PREMIER
2. Si false, évaluer shouldCollect
3. Si false, évaluer shouldExplore
4. Si tous false, rester en evaluating (idle)

---

## Tests de Validation

Tous les guards sont testés dans :
- `scripts/test-fsm-cycle.js` (tests Node.js)
- `docs/bot-spec/scenarios/*.feature` (specs Gherkin)

**Couverture :** 11/11 guards testés (100%)
