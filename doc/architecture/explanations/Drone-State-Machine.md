# Machine à États des Drones

## Introduction

La machine à états des drones est un système implémenté avec Zustand qui gère les différents états et transitions possibles pour les drones dans le jeu. Ce système remplace l'ancienne approche basée sur des flags dans la mémoire du joueur, comme `droneReturnedToShip`.

## États disponibles

Les drones peuvent se trouver dans l'un des états suivants :

- `DOCKED_WITH_SHIP`: Le drone est attaché à son vaisseau parent.
- `MOVING_TO_TARGET`: Le drone est en mouvement vers une cible assignée.
- `AT_TARGET`: Le drone a atteint sa cible et peut effectuer des actions sur place.
- `RETURNING_TO_SHIP`: Le drone retourne vers son vaisseau parent.
- `IDLE`: État neutre peu utilisé (principalement pour initialisation ou situations spéciales).

## Diagramme de transitions

```
┌─────────────────┐         ┌───────────────┐         ┌─────────────┐
│ DOCKED_WITH_SHIP ├────────►MOVING_TO_TARGET├────────► AT_TARGET   │
└────────┬────────┘         └───────┬───────┘         └─────┬───────┘
         │                          │                       │
         │                          │                       │
         │                          ▼                       │
         │                  ┌───────────────┐               │
         └──────────────────┤RETURNING_TO_SHIP◄─────────────┘
                            └───────────────┘
```

## Implémentation technique

Le système est implémenté avec Zustand dans `/src/hooks/useDroneState.js` et fournit les fonctions suivantes :

- `initializeDrone(droneId)`: Initialise l'état d'un drone à `DOCKED_WITH_SHIP`.
- `transitionDroneState(droneId, newState)`: Tente une transition vers un nouvel état.
- `isDroneInState(droneId, state)`: Vérifie si un drone est dans un état spécifique.
- `getDroneState(droneId)`: Récupère l'état actuel d'un drone.
- `isDroneDocked(droneId)`: Raccourci pour vérifier si un drone est dans l'état `DOCKED_WITH_SHIP`.

## Utilisation et bonnes pratiques

### Vérification d'état

```javascript
// Récupérer l'instance de l'état
const droneState = useDroneState.getState();

// Vérifier si un drone est docké
if (droneState.isDroneDocked(droneId)) {
  // Actions à effectuer quand le drone est au vaisseau
}

// Vérifier un état spécifique
if (droneState.isDroneInState(droneId, DRONE_STATES.MOVING_TO_TARGET)) {
  // Actions spécifiques au mouvement
}
```

### Transition d'état

```javascript
// Déclencher un mouvement vers une cible
droneState.transitionDroneState(droneId, DRONE_STATES.MOVING_TO_TARGET);

// Marquer le drone comme étant arrivé à sa cible
droneState.transitionDroneState(droneId, DRONE_STATES.AT_TARGET);

// Déclencher le retour du drone vers le vaisseau
droneState.transitionDroneState(droneId, DRONE_STATES.RETURNING_TO_SHIP);

// Marquer le drone comme docké avec le vaisseau
droneState.transitionDroneState(droneId, DRONE_STATES.DOCKED_WITH_SHIP);
```

## Migration depuis l'ancien système

Le flag `droneReturnedToShip` qui était stocké dans la mémoire du joueur est maintenant **DÉPRÉCIÉ**. Voici comment migrer le code existant :

### Anciennes vérifications

```javascript
// Ancien code
if (playerState.players[botId]?.memory?.droneReturnedToShip === true) {
  // Action spécifique
}
```

### Nouvelles vérifications

```javascript
// Nouveau code
const droneState = useDroneState.getState();
const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
if (droneState.isDroneDocked(botDroneId)) {
  // Action spécifique
}
```

## Avantages du nouveau système

1. **Robustesse** : Les transitions invalides sont rejetées et produisent des messages d'erreur.
2. **Traçabilité** : Les changements d'état sont journalisés par fsmLogger.
3. **Centralisation** : Toute la logique d'état est centralisée dans un seul store Zustand.
4. **Cohérence** : Évite les problèmes de synchronisation entre différentes parties du code.
5. **Extensibilité** : Facile à étendre avec de nouveaux états ou transitions si nécessaire.
