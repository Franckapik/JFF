# Comparatif Actions : PlayerStore vs Architecture Partagée

## Vue d'ensemble

Ce document compare les actions actuelles du PlayerStore avec l'architecture partagée proposée utilisant React-Robot. L'objectif est de montrer comment la logique existante sera réorganisée et optimisée dans la nouvelle structure.

## Structure Actuelle vs Proposée

### Architecture Actuelle (PlayerStore)
```
src/stores/usePlayerStore/
├── index.js                    # Store principal Zustand
└── slices/
    ├── movementSlice.js       # 3 actions mouvement
    ├── vehicleSlice.js        # 4 actions véhicules
    ├── resourceSlice.js       # 4 actions ressources
    └── fuelSlice.js          # 4 actions carburant
```

### Architecture Proposée (Partagée)
```
src/shared/actions/core/
├── movement.js               # Actions mouvement unifiées
├── resource.js              # Actions ressources unifiées
├── fuel.js                  # Actions carburant unifiées
├── vehicle.js               # Actions véhicules unifiées
└── index.js                 # Export centralisé
```

---

## Comparaison Détaillée par Domaine

## 1. Actions de Mouvement

### ❌ Actuel : movementSlice.js
```javascript
// 3 actions séparées, couplées au store Zustand
moveToTile: (playerId, vehicleId, targetTile) => {
  // Validation + logging
  // Appel updateVehicle du vehicleSlice
  updateVehicle(playerId, vehicleId, {
    targetTile: { position: targetTile.position, coord: targetTile.coord },
    isMoving: true
  });
}

stopMovement: (playerId, vehicleId) => {
  // Simple appel updateVehicle
}

updateMovementProgress: (playerId, vehicleId, progress) => {
  // Simple appel updateVehicle
}
```

**Problèmes identifiés :**
- ✗ Dépendance forte au store Zustand
- ✗ Mélange validation/business logic/store update
- ✗ Pas de gestion d'erreurs avancée
- ✗ Duplication de code entre bot et player
- ✗ Impossible de tester unitairement

### ✅ Proposé : shared/actions/core/movement.js
```javascript
// Actions pures, réutilisables par Bot et Player
export const movementActions = {
  moveToTile: (context, event) => ({
    ...context,
    vehicle: {
      ...context.vehicle,
      targetTile: validateTargetTile(event.targetTile),
      isMoving: true,
      movementStartTime: Date.now()
    }
  }),

  stopMovement: (context) => ({
    ...context,
    vehicle: {
      ...context.vehicle,
      isMoving: false,
      targetTile: null,
      progress: 0
    }
  }),

  updateProgress: (context, event) => ({
    ...context,
    vehicle: {
      ...context.vehicle,
      progress: clamp(event.progress, 0, 100)
    }
  })
};

// Validation séparée, testable
const validateTargetTile = (tile) => {
  if (!tile?.position || !tile?.coord) {
    throw new Error('Invalid target tile');
  }
  return { position: tile.position, coord: tile.coord };
};
```

**Avantages :**
- ✅ Actions pures, facilement testables
- ✅ Validation séparée et réutilisable
- ✅ Gestion d'erreurs intégrée
- ✅ Compatible Bot et Player
- ✅ Immutabilité garantie

---

## 2. Actions de Ressources

### ❌ Actuel : resourceSlice.js
```javascript
// 4 actions complexes avec logique métier intégrée
processResourceDeposit: (playerId, vehicleId) => {
  set((state) => {
    // Logique complexe avec mutations directes
    // Mélange validation, calculs et mise à jour
    const updatedScore = calculateUpdatedScore(player.score.resources, vehicle.resources);
    return { /* state muté */ };
  });
}

isAtCapacity: (playerId, vehicleId) => {
  // Accès direct au store
  const vehicle = players[playerId]?.vehicles?.[vehicleId];
  return checkVehicleCapacity(vehicle);
}
```

**Problèmes identifiés :**
- ✗ Logique métier mélangée avec gestion d'état
- ✗ Mutations complexes difficiles à déboguer
- ✗ Calculs intégrés dans les actions
- ✗ Pas de séparation des responsabilités

### ✅ Proposé : shared/actions/core/resource.js
```javascript
// Actions atomiques et composables
export const resourceActions = {
  collectResource: (context, event) => ({
    ...context,
    vehicle: {
      ...context.vehicle,
      resources: addResources(context.vehicle.resources, event.resources)
    }
  }),

  depositResources: (context) => {
    const { vehicle, player } = context;
    if (!canDeposit(vehicle)) return context;

    return {
      ...context,
      vehicle: { ...vehicle, resources: EMPTY_RESOURCES },
      player: {
        ...player,
        score: {
          ...player.score,
          resources: addResources(player.score.resources, vehicle.resources)
        }
      }
    };
  }
};

// Fonctions utilitaires pures
const addResources = (current, toAdd) => ({
  food: (current.food || 0) + (toAdd.food || 0),
  debris: (current.debris || 0) + (toAdd.debris || 0),
  special: (current.special || 0) + (toAdd.special || 0)
});

const canDeposit = (vehicle) => 
  vehicle.isAtBase && hasResources(vehicle.resources);
```

**Avantages :**
- ✅ Actions atomiques et composables
- ✅ Fonctions utilitaires testables séparément
- ✅ Logique métier claire et séparée
- ✅ Immutabilité garantie

---

## 3. Actions de Carburant

### ❌ Actuel : fuelSlice.js
```javascript
// Actions avec effets de bord sur le store
consumeFuel: (playerId, vehicleId, amount = 5) => {
  const { players, updateVehicle } = get();
  // Accès direct + mutation
  if (vehicle.fuel <= 0) {
    updateVehicle(playerId, vehicleId, { isMoving: false });
    return false;
  }
  updateVehicle(playerId, vehicleId, { fuel: newFuelLevel });
  return newFuelLevel > 0;
}
```

**Problèmes identifiés :**
- ✗ Retour boolean + effet de bord
- ✗ Logique conditionnelle complexe
- ✗ Couplage fort avec le store

### ✅ Proposé : shared/actions/core/fuel.js
```javascript
// Actions pures avec gestion d'états
export const fuelActions = {
  consumeFuel: (context, event) => {
    const amount = event.amount || 5;
    const newFuel = Math.max(context.vehicle.fuel - amount, 0);
    
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        fuel: newFuel,
        isMoving: newFuel > 0 ? context.vehicle.isMoving : false
      },
      // Déclenchement automatique d'événements selon le niveau
      events: newFuel <= 0 ? ['FUEL_EMPTY'] : 
             newFuel <= 20 ? ['FUEL_LOW'] : []
    };
  },

  refuel: (context) => ({
    ...context,
    vehicle: { ...context.vehicle, fuel: 100 }
  })
};
```

**Avantages :**
- ✅ Actions pures sans effets de bord
- ✅ Gestion d'événements automatique
- ✅ État cohérent garanti

---

## 4. Actions de Véhicules

### ❌ Actuel : vehicleSlice.js
```javascript
// Action générique trop permissive
updateVehicle: (playerId, vehicleId, updates) => {
  set((state) => {
    // Mutation directe sans validation
    return createUpdatedVehicleState(state, playerId, vehicleId, updates);
  });
}

// Accesseurs mélangés avec les actions
getVehicle: (playerId, vehicleId) => {
  const player = get().players[playerId];
  return player?.vehicles?.[vehicleId] || null;
}
```

**Problèmes identifiés :**
- ✗ Action trop générique
- ✗ Pas de validation des updates
- ✗ Mélange actions/accesseurs

### ✅ Proposé : shared/actions/core/vehicle.js
```javascript
// Actions spécialisées et validées
export const vehicleActions = {
  updatePosition: (context, event) => ({
    ...context,
    vehicle: {
      ...context.vehicle,
      position: validatePosition(event.position),
      lastUpdate: Date.now()
    }
  }),

  updateStatus: (context, event) => ({
    ...context,
    vehicle: {
      ...context.vehicle,
      status: validateStatus(event.status)
    }
  })
};

// Les accesseurs sont séparés dans des selectors
export const vehicleSelectors = {
  getVehicle: (state, vehicleId) => state.vehicles?.[vehicleId],
  getVehiclePosition: (state, vehicleId) => state.vehicles?.[vehicleId]?.position
};
```

**Avantages :**
- ✅ Actions spécialisées et validées
- ✅ Séparation actions/selectors
- ✅ Validation intégrée

---

## Tableau Récapitulatif des Migrations

| Domaine | Actuel (PlayerStore) | Proposé (Partagé) | Gain Principal |
|---------|---------------------|-------------------|----------------|
| **Movement** | 3 actions couplées | Actions pures + validation | Testabilité, réutilisabilité |
| **Resources** | 4 actions avec mutations | Actions atomiques + utils | Simplicité, composabilité |
| **Fuel** | Actions avec effets de bord | Actions pures + événements | Prévisibilité, cohérence |
| **Vehicles** | Action générique | Actions spécialisées | Sécurité, validation |

## Impact sur l'Interface

### Avant (PlayerStore)
```javascript
// Utilisation directe du store
const { moveToTile, consumeFuel } = usePlayerStore();
moveToTile(playerId, vehicleId, targetTile);
consumeFuel(playerId, vehicleId, 5);
```

### Après (React-Robot)
```javascript
// Interface unifiée pour Bot et Player
const [state, send] = useBotMachine(); // ou usePlayer()

// Événements typés
send({ type: 'MOVE_TO_TILE', targetTile });
send({ type: 'CONSUME_FUEL', amount: 5 });
```

## Bénéfices de la Migration

### 🎯 Avantages Techniques
1. **Testabilité** : Actions pures facilement testables
2. **Réutilisabilité** : Même logique pour Bot et Player
3. **Immutabilité** : Prévention des bugs de mutation
4. **Type Safety** : Événements et états typés
5. **Prédictibilité** : FSM garantit les transitions valides

### 🔧 Avantages Développement
1. **Debugging** : Redux DevTools + traces FSM
2. **Maintenance** : Logique centralisée et claire
3. **Évolutivité** : Ajout d'états/événements simplifié
4. **Documentation** : Diagrammes FSM auto-générés

### 🚀 Avantages Performance
1. **Optimisation** : Moins de re-renders inutiles
2. **Batching** : Actions groupées dans les transitions
3. **Mémoire** : Pas de stores multiples
4. **Synchronisation** : État cohérent garanti

## Conclusion

La migration vers l'architecture partagée avec React-Robot représente une évolution majeure qui :

- **Simplifie** la logique métier en séparant les responsabilités
- **Unifie** l'interface Bot/Player pour une meilleure maintenance
- **Améliore** la robustesse avec des actions pures et typées
- **Facilite** les tests et le debugging
- **Prépare** l'extension vers de nouveaux comportements

Cette architecture est **rétrocompatible** et permet une **migration progressive** slice par slice.
