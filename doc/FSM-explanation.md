# Analyse de la logique FSM dans useBotStore

Le store `useBotStore` implémente une machine à états finis (FSM) complète avec les caractéristiques suivantes :

## 1. États clairement définis

```javascript
const BOT_STATES = {
  IDLE: 'idle',
  EXPLORING: 'exploring',
  COLLECTING: 'collecting',
  RETURNING: 'returning',
  AVOIDING: 'avoiding',
  REPAIRING: 'repairing',
  REFUELING: 'refueling',
};
```

Ces constantes définissent tous les états possibles dans lesquels un bot peut se trouver.

## 2. État actuel et historique

Chaque bot maintient son état actuel et son état précédent :

```javascript
ship: {
  currentState: BOT_STATES.IDLE,
  previousState: null,
  // ...autres propriétés
}
```

## 3. Transitions entre états

La méthode `changeState` gère les transitions entre les états :

```javascript
changeState: (playerId, vehicleId, newState) => {
  set((state) => {
    const botVehicle = state.bots[playerId][vehicleId];
    if (!botVehicle) return state;

    return {
      bots: {
        ...state.bots,
        [playerId]: {
          ...state.bots[playerId],
          [vehicleId]: {
            ...botVehicle,
            previousState: botVehicle.currentState,
            currentState: newState,
          },
        },
      },
    };
  });
}
```

Cette fonction enregistre l'état précédent avant de passer au nouvel état, permettant ainsi de suivre l'historique des transitions.

## 4. Actions basées sur l'état

La fonction `makeDecision` contient la logique de décision basée sur l'état actuel :

```javascript
makeDecision: (playerId, vehicleId) => {
  // ...
  switch (botVehicle.currentState) {
    case BOT_STATES.IDLE: {
      // Logique pour l'état IDLE
    }
    case BOT_STATES.EXPLORING: {
      // Logique pour l'état EXPLORING
    }
    // ...autres états
  }
}
```

## 5. Événements et conditions de transition

Les transitions sont déclenchées par des conditions spécifiques :

```javascript
// Exemple dans l'état IDLE
if (vehicle.damage > 50) {
  get().changeState(playerId, vehicleId, BOT_STATES.REPAIRING);
  return get().makeDecision(playerId, vehicleId);
}

if (vehicle.fuel < 30) {
  get().changeState(playerId, vehicleId, BOT_STATES.REFUELING);
  return get().makeDecision(playerId, vehicleId);
}
```

## 6. Actions séquentielles

La file d'actions (`actionQueue`) permet de programmer des séquences d'actions à exécuter dans un état donné :

```javascript
queueAction: (playerId, vehicleId, action) => {
  // Ajouter une action à la file
}

executeNextAction: (playerId, vehicleId) => {
  // Exécuter la prochaine action dans la file
}
```

## 7. Mémoire et contexte

Chaque bot maintient un contexte qui influence ses décisions :

```javascript
memory: {
  exploredTiles: [],
  knownResources: [],
  knownDangers: [],
  availableMoves: [],
}
```

## Diagramme de la FSM

La FSM peut être représentée par ce diagramme simplifié :

```
                +-------+
                | IDLE  |<-------+
                +---+---+        |
                    |            |
        +-----------+------------+------------+
        |           |            |            |
        v           v            v            v
+-------+---+ +-----+----+ +-----+----+ +-----+-----+
| EXPLORING | |COLLECTING| |RETURNING | |REPAIRING/ |
+-----------+ +-----+----+ +-----+----+ |REFUELING  |
      ^             |            |      +-----------+
      |             |            |            ^
      +-------------+            +------------+
```

## Conclusion

Le `useBotStore` implémente une FSM complète et bien structurée pour gérer le comportement des bots. Les transitions entre états sont clairement définies, chaque état a des comportements spécifiques, et le système maintient un contexte qui influence les décisions futures.
