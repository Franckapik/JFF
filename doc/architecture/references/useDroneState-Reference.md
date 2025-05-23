# Référence useDroneState

## API

| Fonction | Paramètres | Retour | Description |
|----------|------------|--------|-------------|
| `initializeDrone` | `droneId: String` | `void` | Initialise l'état d'un drone à `DOCKED_WITH_SHIP` |
| `transitionDroneState` | `droneId: String, newState: DRONE_STATES` | `Boolean` | Tente une transition d'état et retourne `true` si réussie, `false` sinon |
| `isDroneInState` | `droneId: String, state: DRONE_STATES` | `Boolean` | Vérifie si un drone est dans un état spécifique |
| `getDroneState` | `droneId: String` | `Object \| null` | Retourne l'objet d'état du drone ou `null` |
| `isDroneDocked` | `droneId: String` | `Boolean` | Raccourci pour vérifier si un drone est dans l'état `DOCKED_WITH_SHIP` |

## États (DRONE_STATES)

| État | Description | Transitions possibles vers |
|------|-------------|---------------------------|
| `DOCKED_WITH_SHIP` | Drone attaché au vaisseau | `MOVING_TO_TARGET` |
| `MOVING_TO_TARGET` | Drone en mouvement vers une cible | `AT_TARGET`, `RETURNING_TO_SHIP` |
| `AT_TARGET` | Drone arrivé à la cible | `RETURNING_TO_SHIP` |
| `RETURNING_TO_SHIP` | Drone retournant au vaisseau | `DOCKED_WITH_SHIP` |
| `IDLE` | État neutre (rarement utilisé) | `MOVING_TO_TARGET`, `RETURNING_TO_SHIP` |

## Exemple d'utilisation

```javascript
import useDroneState, { DRONE_STATES } from '../../hooks/useDroneState';

// Dans une action ou un composant
const droneState = useDroneState.getState();

// Initialiser un drone (généralement fait dans DroneMovement.jsx)
droneState.initializeDrone('explorer_drone_1');

// Vérifications d'état
const isDocked = droneState.isDroneDocked('explorer_drone_1');
const isMoving = droneState.isDroneInState('explorer_drone_1', DRONE_STATES.MOVING_TO_TARGET);
const currentState = droneState.getDroneState('explorer_drone_1')?.currentState;

// Transitions d'état
if (targetReached) {
  droneState.transitionDroneState('explorer_drone_1', DRONE_STATES.AT_TARGET);
}
```

## Remplacement du flag droneReturnedToShip

Le flag `droneReturnedToShip` qui était stocké dans la mémoire du joueur est maintenant **DÉPRÉCIÉ**. Utilisez toujours `useDroneState.isDroneDocked()` pour vérifier si un drone est revenu au vaisseau.

```javascript
// ❌ NE PLUS UTILISER:
if (playerState.players[botId]?.memory?.droneReturnedToShip) { /* ... */ }
playerStore.updatePlayerMemory(botId, { droneReturnedToShip: true });

// ✅ UTILISER À LA PLACE:
if (useDroneState.getState().isDroneDocked(droneId)) { /* ... */ }
useDroneState.getState().transitionDroneState(droneId, DRONE_STATES.DOCKED_WITH_SHIP);
```
