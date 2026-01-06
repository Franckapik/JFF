# 🏗️ Architecture : Achat de Drones en Parallèle

## Problématique

Actuellement, l'achat de drone bloque la machine :
```
drone_destroyed → evaluating → purchasing_drone → [WAIT] → evaluating
```

**Besoin :** Permettre au bot de continuer à agir pendant la construction du drone.

---

## ✅ Solution Recommandée : Construction Asynchrone

### Architecture proposée

```
┌─────────────────────────────────────────────────────────────┐
│ FSM Machine (séquentielle)                                  │
│                                                              │
│  evaluating → [achète drone] → evaluating                   │
│      ↓                             ↓                         │
│  exploring (si drone actif)    collecting                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Context: dronesInConstruction: number
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Tracker (asynchrone)                                         │
│                                                              │
│  - Détecte dronesInConstruction > 0                         │
│  - Attend délai (ex: 3s)                                    │
│  - Envoie DRONE_CONSTRUCTION_COMPLETE                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Modifications requises

#### 1. Contexte FSM (fsm.d.ts)

```typescript
export interface FSMContext {
  // ... existing fields
  droneFleet: {
    drones: { explorer: DroneState; ... };
    stats: { ... };
    // 🆕 NEW: Compteur de drones en construction
    dronesInConstruction: number;
  };
}
```

#### 2. Action `assignPurchaseDroneContext` (rapide)

```typescript
export const assignPurchaseDroneContext = createAssignAction(({ context }) => {
  const cost = context.score?.resources?.total >= 50 ? 50 : 0;
  const penalty = cost === 0 ? 20 : 0;

  return {
    score: {
      resources: { /* déduction -50 ou 0 */ }
    },
    vehicle: {
      damage: context.vehicle.damage + penalty
    },
    droneFleet: {
      ...context.droneFleet,
      dronesInConstruction: context.droneFleet.dronesInConstruction + 1
      // ⚠️ NE PAS réactiver le drone ici
    },
    lastAction: 'drone_purchase_started' // ⚠️ Pas "success" encore
  };
});
```

#### 3. État `purchasing_drone` (instantané)

```typescript
purchasing_drone: {
  entry: 'onPurchasingDroneEntry',
  exit: 'onPurchasingDroneExit',
  // ⚠️ Transition IMMÉDIATE vers evaluating (pas d'attente)
  always: {
    target: '#machineXV5Pure.evaluating'
  }
}
```

#### 4. Nouveau Tracker : `droneConstructionTracker.ts`

```typescript
import { useXFSMStore } from '../stores/useXFSMStore';

const CONSTRUCTION_DELAY = 3000; // 3 secondes

export function useDroneConstructionTracker(botId: string) {
  const { botStates, sendEventToBot } = useXFSMStore();
  const snapshot = botStates[botId];

  useEffect(() => {
    if (!snapshot || !snapshot.context) return;

    const inConstruction = snapshot.context.droneFleet?.dronesInConstruction || 0;

    if (inConstruction > 0) {
      console.log(`🛒 [TRACKER] ${inConstruction} drone(s) in construction`);

      const timeout = setTimeout(() => {
        sendEventToBot(botId, { type: 'DRONE_CONSTRUCTION_COMPLETE' });
      }, CONSTRUCTION_DELAY);

      return () => clearTimeout(timeout);
    }
  }, [snapshot?.context.droneFleet?.dronesInConstruction, botId]);
}
```

#### 5. Nouvelle Action `assignDroneConstructionCompleteContext`

```typescript
export const assignDroneConstructionCompleteContext = createAssignAction(({ context }) => {
  const currentDrone = context.droneFleet.drones.explorer;

  return {
    droneFleet: {
      ...context.droneFleet,
      dronesInConstruction: Math.max(0, context.droneFleet.dronesInConstruction - 1),
      drones: {
        ...context.droneFleet.drones,
        explorer: {
          ...currentDrone,
          isActive: true,
          isDestroyed: false,
          visualState: 'docked',
          health: 100
        }
      }
    },
    lastAction: 'drone_construction_complete'
  };
});
```

#### 6. Événement global `DRONE_CONSTRUCTION_COMPLETE`

```typescript
// Dans machine.pure.v5.ts, section on: (événements globaux)
on: {
  SHIP_POSITION_UPDATE: { actions: 'updateShipPosition' },
  DRONE_POSITION_UPDATE: { actions: 'updateDronePosition' },
  TILES_UPDATED: { actions: 'updateGridInfo' },
  
  // 🆕 NEW: Événement global de fin de construction
  DRONE_CONSTRUCTION_COMPLETE: {
    actions: 'assignDroneConstructionCompleteContext'
  }
}
```

---

## 🎯 Comportement attendu

### Cas 1 : Drone détruit, achat avec ressources, bot continue

```
1. Drone détruit sur danger tile
   ├─ State: exploring.drone_destroyed
   └─ Context: explorer.isDestroyed = true

2. Transition vers evaluating
   ├─ Guard needsDronePurchase = true
   └─ Event NEED_DRONE_PURCHASE envoyé

3. Achat instantané
   ├─ State: maintaining.purchasing_drone (< 100ms)
   ├─ Action: assignPurchaseDroneContext
   │   ├─ score.resources: -50
   │   ├─ dronesInConstruction: +1
   │   └─ drone reste isDestroyed = true
   └─ Transition immédiate vers evaluating

4. Bot continue (sans drone actif)
   ├─ Guard canStartExploring = false (drone détruit)
   ├─ Peut faire: shouldCollect (tiles déjà explorées)
   └─ Peut faire: shouldMaintain (refuel, repair, deposit)

5. Après 3 secondes
   ├─ Tracker envoie DRONE_CONSTRUCTION_COMPLETE
   ├─ Action: assignDroneConstructionCompleteContext
   │   ├─ dronesInConstruction: -1
   │   └─ explorer.isActive = true, isDestroyed = false
   └─ Prochain evaluating: canStartExploring = true
```

### Cas 2 : Drone détruit, achat sans ressources, pénalité

```
1-3. Identique au cas 1, mais:
   ├─ Action: assignDroneDamagePenaltyContext
   ├─ vehicle.damage: +20%
   └─ dronesInConstruction: +1 (gratuit)

4-5. Identique au cas 1
```

### Cas 3 : Plusieurs drones détruits

```
Si 2 drones détruits coup sur coup:
├─ Achat 1: dronesInConstruction = 1
├─ Achat 2: dronesInConstruction = 2
└─ Après 3s: DRONE_CONSTRUCTION_COMPLETE × 2
    ├─ Event 1: dronesInConstruction = 1, active 1er drone
    └─ Event 2: dronesInConstruction = 0, active 2e drone
```

---

## 🔄 Comparaison : Avant / Après

| Aspect | Avant (bloquant) | Après (asynchrone) |
|--------|------------------|-------------------|
| Achat drone | Bloque machine (DRONE_PURCHASE_COMPLETE après délai) | Instantané, construction en arrière-plan |
| Temps d'attente | Bot immobile pendant 3s | Bot continue (collecte, maintenance) |
| Exploration | Impossible pendant construction | Impossible (pas de drone), mais collecte OK |
| Événements | 1 événement (DRONE_PURCHASE_COMPLETE) | 2 événements (purchase → construction complete) |
| Contexte | Drone réactivé immédiatement | Drone réactivé après délai |
| Complexité | Simple (séquentiel) | Moyenne (tracker asynchrone) |

---

## 📋 Checklist d'implémentation

### Phase 1 : Contexte et Types
- [ ] Ajouter `dronesInConstruction: number` dans `FSMContext.droneFleet`
- [ ] Ajouter événement `DRONE_CONSTRUCTION_COMPLETE` dans `events.d.ts`
- [ ] Initialiser `dronesInConstruction: 0` dans `createMachineContext()`

### Phase 2 : Actions FSM
- [ ] Modifier `assignPurchaseDroneContext` (ne plus réactiver drone, incrémenter compteur)
- [ ] Créer `assignDroneConstructionCompleteContext` (décrémenter compteur, activer drone)
- [ ] Enregistrer actions dans `machine.pure.v5.ts`

### Phase 3 : Machine
- [ ] Changer `purchasing_drone` : transition `always` vers `evaluating`
- [ ] Ajouter événement global `DRONE_CONSTRUCTION_COMPLETE` avec action
- [ ] Supprimer événement `DRONE_PURCHASE_COMPLETE` (plus nécessaire)

### Phase 4 : Tracker
- [ ] Créer `src/ai/fsm/machineX/hooks/trackers/droneConstructionTracker.ts`
- [ ] Utiliser tracker dans `App.tsx` pour tous les bots actifs
- [ ] Tester délai de 3s et envoi d'événement

### Phase 5 : UI
- [ ] Afficher "🛒 Constructing..." dans FSMVisualization quand `dronesInConstruction > 0`
- [ ] Afficher countdown timer (optionnel)
- [ ] Mise à jour DroneStatsDisplay avec indicateur de construction

---

## ⚠️ Points d'attention

1. **Race condition** : Si 2 drones détruits en même temps, gérer correctement le compteur
2. **Persistence** : Le compteur `dronesInConstruction` doit survivre aux transitions d'état
3. **Cleanup** : Si bot atteint `game_over` avec drone en construction, pas de problème (événement ignoré)
4. **Multi-bot** : Chaque bot a son propre compteur indépendant
5. **Fuel** : Le bot peut continuer à consommer du fuel pendant la construction (pas de pénalité)

---

## 🚀 Bénéfices

✅ **Gameplay plus fluide** : Le bot ne reste pas inactif  
✅ **Stratégie** : Le bot peut optimiser son temps (maintenance pendant construction)  
✅ **Réalisme** : Un drone prend du temps à construire  
✅ **Évolutivité** : Facile d'ajouter plusieurs types de drones avec temps différents  

---

## 🔮 Évolutions futures

1. **Temps variables** : Explorer = 3s, Combat = 5s, Special = 7s
2. **Queue d'achat** : Acheter plusieurs drones d'un coup
3. **Upgrade** : Réduire temps de construction via ressources
4. **Factory** : Construire plusieurs drones en parallèle
