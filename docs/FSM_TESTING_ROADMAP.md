# 🧪 FSM Testing Roadmap - Amélioration de la validation

**Date:** 23 décembre 2025  
**Status:** Phase 1 complétée ✅

---

## 📊 État actuel des tests

### ✅ Phase 1 : Guards réels et assertions contextuelles (COMPLÉTÉE)

**Implémenté:**
- ✅ Guards purs importés dans `machine.terminal.v5.ts`
- ✅ Méthode `assertContextValue()` ajoutée à `EventSimulator`
- ✅ Assertions contextuelles dans tous les scénarios de test
- ✅ Pattern `context.injectedData` pour `hasMoreCollectibleTiles`
- ✅ Contexte initial conforme à `FSMContext` TypeScript

**Guards migrés (8/11):**
| Guard | Domaine | Type | Status |
|-------|---------|------|--------|
| `shouldExplore` | Evaluation | Pure | ✅ |
| `shouldCollect` | Evaluation | Pure | ✅ |
| `shouldMaintain` | Evaluation | Pure | ✅ |
| `canCollectTile` | Collection | Pure | ✅ |
| `isVehicleOverloaded` | Collection | Pure | ✅ |
| `hasMoreCollectibleTiles` | Collection | Impure → Pure (injected) | ✅ |
| `needsDeposit` | Maintenance | Pure | ✅ |
| `needsRefuel` | Maintenance | Pure | ✅ |
| `needsRepair` | Maintenance | Pure | ✅ |
| `isShipOnBase` | Maintenance | Pure | ✅ |
| `maintenanceComplete` | Maintenance | Pure | ✅ |

**Guards non migrés (stubs conservés):**
- `areAllEntitiesInitialized` : Impure (dépend de `useGameStore.getState().isGameInitialized()`)
  - **Raison:** Nécessite émulation du store game pour validation
  - **Alternative:** Déféré à tests E2E React ou mock store Node.js

---

## 🎯 Couverture de test actuelle

### Ce qui est validé ✅

1. **Structure FSM**
   - ✅ Transitions d'états correctes
   - ✅ Événements acceptés dans chaque état
   - ✅ États imbriqués (exploring.drone_deploying, etc.)

2. **Logique des guards**
   - ✅ `shouldExplore` : vérifie fuel >= 20, damage <= 80, exploredThisCycle <= 2
   - ✅ `needsRefuel` : vérifie fuel < 30
   - ✅ `needsRepair` : vérifie damage > 50
   - ✅ `needsDeposit` : vérifie resources.total > 0
   - ✅ `isVehicleOverloaded` : vérifie resources >= 80% maxCapacity
   - ✅ `canCollectTile` : vérifie capacité, fuel, damage

3. **Contexte FSM**
   - ✅ Structure conforme aux types TypeScript
   - ✅ Valeurs initiales cohérentes (fuel=45, damage=35, resources=75)
   - ✅ `injectedData.availableTiles` pour shouldCollect

### Ce qui N'est PAS validé ❌

1. **Actions de mutation du contexte**
   - ❌ Actions `assign*Context` ne modifient pas réellement le contexte (stubs)
   - ❌ Pas de vérification que `assignDroneDeployingContext` change `drone.status`
   - ❌ Pas de vérification que `assignShipLoadResourcesContext` incrémente `vehicle.resources`

2. **Effets side-effects**
   - ❌ Animations R3F (mouvements 3D)
   - ❌ Logs fsmLogger (seulement console.log dans terminal)
   - ❌ Queries spatiales (distance, pathfinding)
   - ❌ Interaction avec stores Zustand

3. **Scénarios de régression**
   - ❌ Fuel décrémente pendant collection
   - ❌ Damage augmente avec le temps
   - ❌ Resources ne dépassent jamais maxCapacity
   - ❌ Événements d'urgence (EMERGENCY_STOP, LOW_FUEL_WARNING)

4. **Conditions edge-case**
   - ❌ Fuel = 0 (vehicle immobilisé)
   - ❌ Damage = 100 (vehicle détruit)
   - ❌ Resources = maxCapacity (collection bloquée)
   - ❌ Tuiles épuisées (RESOURCE_DEPLETED)

---

## 🚀 Phase 2 : Actions réelles et validation de contexte

### Objectif
Remplacer les actions stub par de vraies implémentations qui modifient le contexte, puis ajouter des assertions pour valider les mutations.

### Tâches

**2.1. Migrer actions assign dans machine.terminal.v5.ts**

```typescript
// Avant (stub - retourne context inchangé)
assignDroneDeployingContext: assign(({ context }) => context)

// Après (vrai assign)
assignDroneDeployingContext: assign(({ context }) => {
  const firstDrone = Object.values(context.droneFleet.drones)[0];
  return {
    ...context,
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        [Object.keys(context.droneFleet.drones)[0]]: {
          ...firstDrone,
          visualState: 'deploying',
          targetPosition: context.explorationQueue[0]?.coord || null,
        }
      }
    },
    fsmState: 'exploring'
  };
})
```

**Effort estimé:** 4-6 heures (15+ actions à migrer)

**2.2. Ajouter assertions après chaque action**

```javascript
// Dans testExplorationCycle
await simulator.send({ type: 'NEED_EXPLORING' }, 100);
await simulator.waitForState('exploring.drone_deploying', 1000);

// ✅ Vérifier que le drone a changé de status
simulator.assertContextValue('droneFleet.drones.explorer.visualState', 'deploying');
simulator.assertContextValue('fsmState', 'exploring');
```

**Effort estimé:** 2-3 heures

**Impact:** Tests détecteront les bugs dans les actions (mutations incorrectes)

---

## 🔬 Phase 3 : Scénarios de régression et edge-cases

### Objectif
Créer des tests pour valider les comportements limites et détecter les régressions.

### 3.1. Tests de consommation de ressources

**Fichier:** `scripts/test-fsm-resource-consumption.js`

```javascript
async function testFuelConsumption(simulator) {
  const initialFuel = simulator.actor.getSnapshot().context.vehicle.fuel;
  
  // Collection qui devrait consommer du fuel
  await simulator.send({ type: 'NEED_COLLECTING' });
  await simulator.send({ type: 'SHIP_REACHES_TILE' });
  
  const finalFuel = simulator.actor.getSnapshot().context.vehicle.fuel;
  
  // ✅ Fuel devrait avoir baissé
  if (finalFuel >= initialFuel) {
    throw new Error(`Fuel consumption bug: ${initialFuel} → ${finalFuel}`);
  }
  
  console.log(`✅ Fuel consumed: ${initialFuel} → ${finalFuel}`);
}
```

**Effort estimé:** 3-4 heures (fuel, damage, capacity)

### 3.2. Tests d'événements d'urgence

**Fichier:** `scripts/test-fsm-emergency.js`

```javascript
async function testLowFuelWarning(simulator) {
  // Forcer fuel bas
  const ctx = simulator.actor.getSnapshot().context;
  ctx.vehicle.fuel = 15; // < 20 threshold
  
  // Essayer de collecter
  await simulator.send({ type: 'NEED_COLLECTING' });
  
  // ✅ Devrait rejeter (shouldCollect = false)
  const state = simulator.actor.getSnapshot().value;
  if (state === 'collecting') {
    throw new Error('Low fuel should prevent collection');
  }
  
  console.log('✅ Low fuel correctly blocks collection');
}
```

**Effort estimé:** 2-3 heures

### 3.3. Tests de capacité maximale

```javascript
async function testCapacityLimit(simulator) {
  // Remplir à 100%
  const ctx = simulator.actor.getSnapshot().context;
  ctx.vehicle.resources = { food: 200, debris: 1800, special: 3, total: 2003 };
  
  // Essayer de charger plus
  await simulator.send({ type: 'SHIP_LOAD_RESOURCES', amount: 100 });
  
  const resources = simulator.actor.getSnapshot().context.vehicle.resources;
  
  // ✅ Ne devrait pas dépasser maxCapacity
  if (resources.total > 2003) {
    throw new Error(`Capacity overflow: ${resources.total} > 2003`);
  }
  
  console.log('✅ Capacity limit respected');
}
```

**Effort estimé:** 2 heures

**Impact total Phase 3:** 7-9 heures → Détection des bugs de logique métier

---

## 🏗️ Phase 4 : Tests d'intégration avec stores mockés

### Objectif
Tester les guards impurs en créant des mocks de `useTileStore` et `useGameStore` en Node.js.

### 4.1. Mock store pour hasMoreCollectibleTiles

**Fichier:** `scripts/mocks/mockTileStore.js`

```javascript
export const createMockTileStore = (tiles = []) => {
  return {
    getState: () => ({
      tiles: tiles.reduce((acc, tile) => {
        acc[`${tile.coord.x},${tile.coord.z}`] = tile;
        return acc;
      }, {}),
      tileInRadius: (position, radius) => {
        return tiles.filter(tile => {
          const dx = tile.coord.x - position.x;
          const dz = tile.coord.z - position.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          return distance <= radius;
        });
      },
      calculateDistance: (pos1, pos2) => {
        const dx = pos2.x - pos1.x;
        const dz = pos2.z - pos1.z;
        return Math.sqrt(dx * dx + dz * dz);
      },
    }),
  };
};
```

**Utilisation:**

```javascript
import { createMockTileStore } from './mocks/mockTileStore.js';

// Injecter le mock
global.useTileStore = createMockTileStore([
  { coord: { x: 3, z: 3 }, resources: { total: 150 } },
  { coord: { x: 7, z: 7 }, resources: { total: 200 } },
]);

// Maintenant hasMoreCollectibleTiles peut fonctionner
await simulator.send({ type: 'SHIP_LOAD_RESOURCES' });
// Devrait continuer car 2 tuiles disponibles
```

**Effort estimé:** 4-5 heures (mock tile + game stores)

**Impact:** Teste guards impurs sans R3F

---

## 🌐 Phase 5 : Tests E2E avec React Testing Library

### Objectif
Tester le FSM dans un environnement React réel avec R3F mocké.

### 5.1. Setup test harness

**Fichier:** `src/ai/fsm/machineX/__tests__/machine.e2e.test.tsx`

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { useMachine } from '@xstate-ninja/react';
import { machineXV5Pure } from '../machine.pure.v5';

describe('FSM E2E Tests', () => {
  it('should complete exploration cycle', async () => {
    const wrapper = ({ children }) => <Canvas>{children}</Canvas>;
    
    const { result } = renderHook(() => useMachine(machineXV5Pure), { wrapper });
    
    act(() => {
      result.current.send({ type: 'NEED_EXPLORING' });
    });
    
    await waitFor(() => {
      expect(result.current.state.matches('exploring')).toBe(true);
    });
    
    // Simuler mouvement drone
    act(() => {
      result.current.send({ type: 'DRONE_REACHES_TILE' });
    });
    
    await waitFor(() => {
      expect(result.current.state.matches('exploring.drone_scanning')).toBe(true);
    });
  });
});
```

**Effort estimé:** 8-10 heures (setup + tests)

**Impact:** Validation dans environnement production-like

---

## 📈 Phase 6 : Tests de performance et benchmarks

### Objectif
Mesurer les performances du FSM et détecter les régressions de latence.

### 6.1. Benchmark guards execution

**Fichier:** `scripts/benchmark-guards.js`

```javascript
import Benchmark from 'benchmark';
import { needsRefuel, needsRepair } from '../src/ai/fsm/machineX/domains/maintenance/guards.pure.ts';

const suite = new Benchmark.Suite();

const mockContext = {
  vehicle: { fuel: 25, damage: 60, resources: { total: 100 } }
};

suite
  .add('needsRefuel', () => {
    needsRefuel({ context: mockContext, event: {} });
  })
  .add('needsRepair', () => {
    needsRepair({ context: mockContext, event: {} });
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .run();
```

**Métriques attendues:**
- Guards purs : < 0.01ms
- Transitions : < 5ms
- Cycle complet : < 100ms

**Effort estimé:** 3-4 heures

---

## 🔧 Améliorations futures (non prioritaires)

### Property-Based Testing

```javascript
import fc from 'fast-check';

fc.assert(
  fc.property(fc.integer(0, 100), (fuel) => {
    const result = needsRefuel({ context: { vehicle: { fuel } }, event: {} });
    return (fuel < 30) === result; // Invariant
  })
);
```

**Effort:** 6-8 heures

### Snapshot testing

```javascript
expect(context).toMatchSnapshot('after-exploration');
```

**Effort:** 2-3 heures

### Visual Regression Testing

- Capturer screenshots avec Playwright
- Comparer avant/après changements

**Effort:** 10-12 heures

---

## 📋 Limitations documentées

### Ce qui ne peut PAS être testé en terminal

1. **Animations Three.js**
   - Mouvements 3D
   - Interpolation de positions
   - Effets visuels (trails, particles)
   - **Raison:** Pas d'environnement WebGL en Node.js

2. **Interactions UI**
   - Clics utilisateur
   - Hover states
   - Modal dialogs
   - **Alternative:** Tests E2E avec Playwright

3. **Queries spatiales réelles**
   - Pathfinding avec obstacles
   - Line-of-sight
   - Collision detection
   - **Alternative:** Mock avec données pré-calculées

4. **Stores Zustand complexes**
   - State hydration
   - Persistence
   - Middleware effects
   - **Alternative:** Mock stores simples

### Solutions de contournement

| Limitation | Solution actuelle | Phase |
|------------|-------------------|-------|
| Guards impurs | Pattern `injectedData` | ✅ Phase 1 |
| Actions R3F | Console.log stubs | 🚧 Phase 2 |
| Store queries | Mock stores Node.js | 🔮 Phase 4 |
| UI interactions | E2E avec React Testing Library | 🔮 Phase 5 |

---

## 🎯 Priorisation recommandée

### Court terme (1-2 jours)
1. ✅ **Phase 1 complétée**
2. 🚧 **Phase 2** : Actions réelles (haute priorité)
   - Détecte bugs de mutation contexte
   - Bloque régressions logique métier
   - **Effort:** 6-9 heures

### Moyen terme (1 semaine)
3. 🔮 **Phase 3** : Scénarios edge-case (moyenne priorité)
   - Valide comportements limites
   - **Effort:** 7-9 heures

### Long terme (1+ mois)
4. 🔮 **Phase 4** : Mock stores (basse priorité si `injectedData` suffit)
5. 🔮 **Phase 5** : E2E React (pour validation finale avant release)
6. 🔮 **Phase 6** : Benchmarks (pour optimisation performances)

---

## 📝 Notes d'implémentation

### Pattern `injectedData` (Option A - Implémenté)

**Avantages:**
- ✅ Guards restent purs et testables
- ✅ Pas de refactor des stores
- ✅ Séparation claire effect/guard

**Inconvénients:**
- ⚠️ Nécessite actions effects pour injecter data
- ⚠️ Data peut être stale si pas mise à jour

**Exemple actuel:**

```typescript
// Effect (dans onEvaluatingEntry)
const tiles = useTileStore.getState().tileInRadius(position, radius);
context.injectedData = { availableTiles: tiles };

// Guard (pure)
const shouldCollect = ({ context }) => {
  const tiles = context.injectedData?.availableTiles || [];
  return tiles.length > 0 && !context.vehicle.isAtCapacity;
};
```

### Alternative envisagée (Option B - Non implémentée)

**Mock stores en Node.js:**
```javascript
global.useTileStore = createMockTileStore([...]);
```

**Raison de rejet:** Plus complexe, nécessite setup global, `injectedData` suffit pour l'instant.

---

## ✅ Checklist de validation

### Phase 1 (Complétée)
- [x] Guards purs importés dans `machine.terminal.v5.ts`
- [x] `assertContextValue()` ajouté à `EventSimulator`
- [x] Assertions dans `testExplorationCycle`
- [x] Assertions dans `testCollectionCycle`
- [x] Assertions dans `testMaintenanceCycle`
- [x] Pattern `injectedData` pour `hasMoreCollectibleTiles`
- [x] Contexte initial conforme à `FSMContext`
- [x] Documentation roadmap créée

### Phase 2 (À faire)
- [ ] Migrer `assignDroneDeployingContext` (vraie mutation)
- [ ] Migrer `assignDroneScanningContext`
- [ ] Migrer `assignDroneReturningContext`
- [ ] Migrer `assignDroneDockedContext`
- [ ] Migrer `assignShipMovingToTileContext`
- [ ] Migrer `assignShipCollectingContext`
- [ ] Migrer `assignShipLoadResourcesContext`
- [ ] Migrer `assignShipReturningContext`
- [ ] Migrer `assignShipReachedBaseContext`
- [ ] Migrer `assignShipDepositResourcesContext`
- [ ] Migrer `assignShipRefuelContext`
- [ ] Migrer `assignShipRepairContext`
- [ ] Assertions après chaque mutation

### Phase 3 (À faire)
- [ ] Test fuel consumption
- [ ] Test damage accumulation
- [ ] Test capacity limit
- [ ] Test LOW_FUEL_WARNING event
- [ ] Test EMERGENCY_STOP event
- [ ] Test RESOURCE_DEPLETED event

---

**Dernière mise à jour:** 23 décembre 2025  
**Auteur:** Migration FSM Testing Phase 1  
**Statut:** Phase 1 ✅ | Phase 2-6 🔮 Planifiées
