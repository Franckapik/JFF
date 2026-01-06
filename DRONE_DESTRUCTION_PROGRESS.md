# 🚀 DRONE DESTRUCTION PROGRESS

## Résumé de l'implémentation

**Date**: 6 janvier 2026  
**Fonctionnalité**: Destruction des drones sur tuiles danger avec mécanisme d'achat

---

## ✅ Fonctionnalités implémentées

### 1. État `drone_destroyed` dans exploration

**Fichier**: [machine.pure.v5.ts](src/ai/fsm/machineX/machine.pure.v5.ts)

- Nouveau sous-état `exploring.drone_destroyed`
- Transition depuis `drone_scanning` via guard `shouldDestroyDroneOnDanger`
- Action `assignDroneDestroyedContext` appliquée à l'entrée
- Transition automatique vers `evaluating`

```
exploring
  ├── drone_deploying
  ├── drone_scanning
  │     ├─→ drone_destroyed (si danger)
  │     └─→ drone_returning (normal)
  ├── drone_destroyed ─→ evaluating (always)
  ├── drone_returning
  └── drone_docked
```

### 2. État `purchasing_drone` dans maintenance

**Fichier**: [machine.pure.v5.ts](src/ai/fsm/machineX/machine.pure.v5.ts)

- Nouveau sous-état `maintaining.purchasing_drone`
- Transition depuis `evaluating` via événement `NEED_DRONE_PURCHASE`
- Guard `needsDronePurchase` vérifie si drone détruit
- Deux chemins de sortie via `DRONE_PURCHASE_COMPLETE`:
  - Avec ressources (>= 50): `assignPurchaseDroneContext` (coût: 50 resources)
  - Sans ressources (< 50): `assignDroneDamagePenaltyContext` (+20% damage)

```
maintaining
  ├── relocating
  ├── depositing
  ├── repairing
  ├── refueling
  └── purchasing_drone ─→ evaluating (toujours)
```

### 3. Guards implémentés

**Fichier**: [domains/maintenance/guards.pure.ts](src/ai/fsm/machineX/domains/maintenance/guards.pure.ts)

| Guard | Description | Condition |
|-------|-------------|-----------|
| `needsDronePurchase` | Vérifie si drone détruit | `isDestroyed === true \|\| isActive === false` |
| `hasResourcesForDrone` | Vérifie ressources suffisantes | `score.resources.total >= 50` |

**Fichier**: [domains/exploration/guards.pure.ts](src/ai/fsm/machineX/domains/exploration/guards.pure.ts)

| Guard | Description | Condition |
|-------|-------------|-----------|
| `shouldDestroyDroneOnDanger` | Vérifie si tuile danger | `targetDroneTile.type === 'danger'` |
| `isDroneDestroyed` | Vérifie état détruit | `isDestroyed === true` |

### 4. Actions implémentées

**Fichier**: [domains/maintenance/actions.assign.ts](src/ai/fsm/machineX/domains/maintenance/actions.assign.ts)

| Action | Description | Effet |
|--------|-------------|-------|
| `assignPurchaseDroneContext` | Achat avec ressources | -50 resources, drone actif |
| `assignDroneDamagePenaltyContext` | Achat avec pénalité | +20% damage, drone actif gratuit |

**Fichier**: [domains/exploration/actions.assign.ts](src/ai/fsm/machineX/domains/exploration/actions.assign.ts)

| Action | Description | Effet |
|--------|-------------|-------|
| `assignDroneDestroyedContext` | Destruction drone | `isDestroyed=true`, `isActive=false`, `health=0` |

### 5. Événements ajoutés

**Fichiers**: [events.d.ts](src/types/events.d.ts), [events.pure.v5.ts](src/ai/fsm/machineX/events.pure.v5.ts)

| Événement | Description |
|-----------|-------------|
| `NEED_DRONE_PURCHASE` | Déclenche transition vers `purchasing_drone` |
| `DRONE_PURCHASE_COMPLETE` | Termine l'achat du drone |

---

## 📊 Règles métier

### Coûts et pénalités

| Situation | Coût | Pénalité |
|-----------|------|----------|
| Achat drone (ressources >= 50) | -50 resources | Aucune |
| Achat drone (ressources < 50) | Gratuit | +20% damage au vaisseau |
| Drone touche tuile danger | N/A | Drone détruit |

### Propriétés du drone détruit

```typescript
{
  isActive: false,
  isDestroyed: true,
  visualState: 'failed',
  health: 0,
  isMoving: false,
  targetDroneTile: null
}
```

### Propriétés du drone acheté

```typescript
{
  isActive: true,
  isDestroyed: false,
  visualState: 'docked',
  health: 100,
  isMoving: false,
  coord: undefined // Retourne à la position du ship
}
```

---

## 🧪 Scénarios de test

**Fichier**: [danger-tiles.feature](docs/bot-spec/scenarios/danger-tiles.feature)

### Scénarios ajoutés

1. **Drone détruit sur tuile danger** - Transition `drone_scanning → drone_destroyed → evaluating`
2. **Drone non détruit sur tuile normale** - Transition normale vers `drone_returning`
3. **Achat de drone avec ressources suffisantes** - Coût 50 resources
4. **Achat de drone sans ressources** - Pénalité +20% damage
5. **Transition evaluating → purchasing_drone** - Guard `needsDronePurchase`
6. **Plan de scénario: Coût d'achat de drone** - Matrice de tests

---

## 🏗️ Architecture des fichiers modifiés

```
src/ai/fsm/machineX/
├── machine.pure.v5.ts          # États drone_destroyed, purchasing_drone
├── events.pure.v5.ts           # Événements NEED_DRONE_PURCHASE, DRONE_PURCHASE_COMPLETE
├── domains/
│   ├── exploration/
│   │   ├── actions.assign.ts   # assignDroneDestroyedContext (existait)
│   │   ├── actions.effects.ts  # onDroneDestroyedEntry/Exit (existaient)
│   │   ├── guards.pure.ts      # shouldDestroyDroneOnDanger (existait)
│   │   └── index.ts            # Exports
│   └── maintenance/
│       ├── actions.assign.ts   # assignPurchaseDroneContext, assignDroneDamagePenaltyContext (NOUVEAUX)
│       ├── actions.effects.ts  # onPurchasingDroneEntry/Exit (NOUVEAUX)
│       ├── guards.pure.ts      # needsDronePurchase, hasResourcesForDrone (NOUVEAUX)
│       └── index.ts            # Exports

src/types/
├── events.d.ts                 # Types événements
└── drone.d.ts                  # Types drone (isDestroyed, health existaient)

docs/bot-spec/scenarios/
└── danger-tiles.feature        # Scénarios BDD (6 nouveaux)
```

---

## 🔄 Flow complet

```
1. Drone déployé vers tuile danger
   ↓
2. drone_scanning: DRONE_HAS_SCANNED
   ↓ (guard: shouldDestroyDroneOnDanger = true)
3. drone_destroyed: assignDroneDestroyedContext
   ↓ (always transition)
4. evaluating: Check guards
   ↓ (guard: needsDronePurchase = true)
5. NEED_DRONE_PURCHASE event
   ↓
6. maintaining.purchasing_drone
   ↓ (event: DRONE_PURCHASE_COMPLETE)
7a. hasResourcesForDrone = true → assignPurchaseDroneContext (-50 resources)
7b. hasResourcesForDrone = false → assignDroneDamagePenaltyContext (+20% damage)
   ↓
8. evaluating (drone actif, cycle continue)
```

---

## ⚠️ Points d'attention

1. **Tracker à implémenter**: Le tracker doit envoyer `NEED_DRONE_PURCHASE` depuis `evaluating` et `DRONE_PURCHASE_COMPLETE` depuis `purchasing_drone`
2. **UI déjà prête**: `FSMVisualization.tsx` gère déjà `drone_destroyed` visuellement
3. **Pas de délai**: La transition `drone_destroyed → evaluating` est immédiate (always)

---

## ✅ Checklist de validation

- [x] Guards enregistrés dans machine setup
- [x] Actions enregistrées dans machine setup  
- [x] États ajoutés dans la machine
- [x] Événements typés dans events.d.ts et events.pure.v5.ts
- [x] Scénarios BDD ajoutés
- [ ] Vérification TypeScript (npm run dev:all)
- [ ] Test manuel: exploration tuile danger
- [ ] Test manuel: achat drone avec ressources
- [ ] Test manuel: achat drone sans ressources
