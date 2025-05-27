# Guide d'intégration des drones au système FSM

> **[IMPORTANT]** La gestion des états des drones a été modernisée avec une machine à états dédiée `useDroneState`. Le flag `droneReturnedToShip` dans la mémoire du joueur est désormais **DÉPRÉCIÉ**. Toutes les vérifications d'état des drones doivent utiliser les méthodes de `useDroneState`, notamment `isDroneDocked()`, `isDroneInState()`, etc.

Ce guide explique comment intégrer efficacement les différents types de drones au système de Machine à États Finis (FSM) du bot. Il couvre les aspects d'actions, de conditions et de transitions d'état liés aux drones.

## Table des matières

1. [Introduction](#1-introduction)
2. [Actions FSM liées aux drones](#2-actions-fsm-liées-aux-drones)
3. [Conditions de transition](#3-conditions-de-transition)
4. [Intégration aux états FSM](#4-intégration-aux-états-fsm)
5. [Variables de mémoire importantes](#5-variables-de-mémoire-importantes)
6. [Patterns d'utilisation avancés](#6-patterns-dutilisation-avancés)
7. [Dépannage et debugging](#7-dépannage-et-debugging)
8. [Machine à États des Drones (useDroneState)](#8-machine-à-états-des-drones-usedronestate)

## 1. Introduction

Les drones sont des extensions du vaisseau principal qui permettent d'effectuer des actions spécialisées : exploration, combat, et analyse spéciale. Leur intégration avec le système FSM permet au bot de les utiliser de manière automatisée et intelligente.

### 1.1 Vue d'ensemble

```
Actions FSM → Commandes aux drones → Messages des drones → Transitions d'état
```

Cette chaîne d'événements constitue le cycle principal d'intégration des drones au système FSM.

## 2. Actions FSM liées aux drones

### 2.1 Explorer avec un drone (`exploreWithDroneAction`)

L'action principale pour l'exploration est `exploreWithDroneAction` qui utilise principalement l'Explorer Drone.

```javascript
// Phases principales de l'action
if (!exploreWithDroneAction.explorationStarted) {
  // PHASE 1: Première exécution - Envoyer le drone explorer
  // ...
} else {
  // PHASE 2: Suivi de l'exploration en cours
  // ...
}

// Vérifier si le drone est revenu au vaisseau en utilisant la machine d'état
const droneState = useDroneState.getState();
if (droneState.isDroneDocked(botDroneId)) {
  // Fin de l'exploration, passer à la suite
  // ...
}
```

### 2.2 Utiliser des drones spécialisés

Pour les autres types de drones, vous pouvez créer des actions dédiées:

```javascript
// Action pour utiliser le drone de combat
const useCombatDroneAction = (botId, playerStore, tileStore, changeState) => {
  const combatDroneId = getDroneId(botId, VEHICLE_TYPES.COMBAT_DRONE);
  const botMemory = playerStore.players[botId]?.memory;
  
  // Activer le drone de combat si nécessaire
  if (!playerStore.players[botId]?.vehicles[combatDroneId]?.isActive) {
    playerStore.updateVehicle(botId, combatDroneId, { isActive: true });
    return undefined; // Continuer l'action au prochain cycle
  }
  
  // Logique pour utiliser le drone de combat
  // ...
};
```

## 3. Conditions de transition

### 3.1 Conditions spécifiques aux drones

```javascript
// Vérifier si un drone est en mouvement
export const isDroneMoving = () => {
  const botId = getBotId();
  const store = usePlayerStore.getState();
  const droneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
  const drone = store.players?.[botId]?.vehicles?.[droneId];
  
  return {
    result: drone?.isMoving === true,
    label: 'Drone en mouvement',
    value: drone?.isMoving
  };
};

// Vérifier si un drone est revenu au vaisseau
export const isDroneAtShip = () => {
  const botId = getBotId();
  const store = usePlayerStore.getState();
  const shipId = getMainShipId();
  const droneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
  
  const ship = store.players?.[botId]?.vehicles?.[shipId];
  const drone = store.players?.[botId]?.vehicles?.[droneId];
  
  const shipCoord = ship?.coord;
  const droneCoord = drone?.coord;
  
  return {
    result: shipCoord && droneCoord && shipCoord === droneCoord,
    label: 'Drone au vaisseau',
    value: { shipCoord, droneCoord }
  };
};
```

### 3.2 Conditions de découverte de ressources

```javascript
// Vérifier si le drone a découvert de nouvelles ressources
export const hasDiscoveredResources = () => {
  const botId = getBotId();
  const store = usePlayerStore.getState();
  const botMemory = store.players?.[botId]?.memory;
  
  // Soit le flag est explicitement à true, soit le drone est revenu (vérifié via useDroneState) et a des ressources connues
  const explicitDiscovery = botMemory?.hasNewResourceDiscovery === true;
  const droneState = useDroneState.getState();
  const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
  const isDroneDocked = droneState.isDroneDocked(botDroneId);
  const implicitDiscovery = isDroneDocked && 
                           botMemory?.knownResources?.length > 0;
  
  return {
    result: explicitDiscovery || implicitDiscovery,
    label: 'Ressources découvertes',
    value: explicitDiscovery ? 
      'Flag direct' : 
      (implicitDiscovery ? 'Drone revenu + ressources connues' : 'Aucune découverte')
  };
};
```

## 4. Intégration aux états FSM

### 4.1 État EXPLORING

L'état EXPLORING est principalement concerné par l'utilisation des drones pour l'exploration.

```javascript
// Dans botStates.js
export const EXPLORING = {
  onEnterState: (botId) => {
    fsmLogger.state('Entering EXPLORING state');
    // Potentiellement activer les drones nécessaires
    const store = usePlayerStore.getState();
    const specialDroneId = getDroneId(botId, VEHICLE_TYPES.SPECIAL_DRONE);
    
    // Activer occasionnellement le drone spécial pour des scans avancés
    if (Math.random() < 0.3) {  // 30% de chance
      store.updateVehicle(botId, specialDroneId, { isActive: true });
    }
  },
  
  onExitState: (botId) => {
    fsmLogger.state('Exiting EXPLORING state - Returning to IDLE for evaluation');
    // Éventuellement désactiver certains drones pour économiser les ressources
    const store = usePlayerStore.getState();
    const specialDroneId = getDroneId(botId, VEHICLE_TYPES.SPECIAL_DRONE);
    store.updateVehicle(botId, specialDroneId, { isActive: false });
  },
  
  defaultAction: 'exploreDrone',
  defaultActionPriority: PRIORITY.MEDIUM
};
```

### 4.2 État COLLECTING avec assistance des drones

```javascript
// Dans botStates.js
export const COLLECTING = {
  onEnterState: (botId) => {
    fsmLogger.state('Entering COLLECTING state');
    // Activer le drone de combat pour protéger pendant la collecte
    const store = usePlayerStore.getState();
    const combatDroneId = getDroneId(botId, VEHICLE_TYPES.COMBAT_DRONE);
    store.updateVehicle(botId, combatDroneId, { isActive: true });
  },
  
  onExitState: (botId) => {
    fsmLogger.state('Exiting COLLECTING state');
    // Désactiver le drone de combat si nécessaire
    const store = usePlayerStore.getState();
    const combatDroneId = getDroneId(botId, VEHICLE_TYPES.COMBAT_DRONE);
    
    // Vérifier si le drone est en pleine action avant de le désactiver
    const combatDrone = store.players?.[botId]?.vehicles?.[combatDroneId];
    if (!combatDrone?.isMoving) {
      store.updateVehicle(botId, combatDroneId, { isActive: false });
    }
  },
  
  defaultAction: 'collectResource',
  defaultActionPriority: PRIORITY.MEDIUM
};
```

## 5. Variables de mémoire importantes

### 5.1 Variables spécifiques de mémoire

```javascript
// Mémoire du bot relative aux drones
const botMemory = {
  // Explorer Drone
  explorationCount: 0,           // Nombre d'explorations réalisées
  // droneReturnedToShip: false, // DÉPRÉCIÉ - Utiliser useDroneState.isDroneDocked() à la place
  hasNewResourceDiscovery: false, // Une nouvelle ressource a été découverte
  
  // Combat Drone
  minesLaid: [],                 // Positions des mines posées 
  engagedEnemies: [],            // Ennemis avec lesquels le combat est engagé
  
  // Special Drone
  specialDiscoveries: [],        // Objets spéciaux découverts
  scannedAreas: [],              // Zones déjà scannées en détail
  
  // Variables générales
  knownResources: [],            // Ressources connues par position
  lastResourceDiscovery: null    // Dernière ressource découverte
};
```

### 5.2 Mise à jour et utilisation de la mémoire

```javascript
// Mise à jour après exploration
updatePlayerMemory(botId, {
  explorationCount: currentCount + 1,
  // Ne plus utiliser droneReturnedToShip - utiliser useDroneState à la place
  hasNewResourceDiscovery: hasNewResources
});

// L'état du drone est géré via useDroneState
const droneState = useDroneState.getState();
droneState.transitionDroneState(botDroneId, DRONE_STATES.DOCKED_WITH_SHIP);

// Enregistrement d'un scan spécial
updatePlayerMemory(botId, {
  scannedAreas: [...botMemory.scannedAreas, {
    center: coordCentral,
    radius: scanRadius,
    timestamp: Date.now()
  }]
});
```

## 6. Patterns d'utilisation avancés

### 6.1 Formation de drones et vaisseau

Pour créer une stratégie coordonnée entre les drones et le vaisseau:

```javascript
// Action de formation coordonnée
const coordinatedFormationAction = (botId, playerStore, tileStore, changeState) => {
  const shipId = getMainShipId();
  const explorerDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
  const combatDroneId = getDroneId(botId, VEHICLE_TYPES.COMBAT_DRONE);
  
  // Tous les véhicules sont-ils actifs?
  const ship = playerStore.players[botId]?.vehicles[shipId];
  const explorerDrone = playerStore.players[botId]?.vehicles[explorerDroneId];
  const combatDrone = playerStore.players[botId]?.vehicles[combatDroneId];
  
  if (!ship || !explorerDrone || !combatDrone) return false;
  
  // Activer les drones nécessaires
  if (!combatDrone.isActive) {
    playerStore.updateVehicle(botId, combatDroneId, { isActive: true });
    return undefined; // Continue l'action
  }
  
  // Configurer la cible et lancer le mouvement en formation
  // ...
};
```

### 6.2 Système de protection avancé

```javascript
// Action de défense proactive
const droneDefensePatternAction = (botId, playerStore, tileStore, changeState) => {
  const combatDroneId = getDroneId(botId, VEHICLE_TYPES.COMBAT_DRONE);
  const shipId = getMainShipId();
  
  const ship = playerStore.players[botId]?.vehicles[shipId];
  const combatDrone = playerStore.players[botId]?.vehicles[combatDroneId];
  
  // Activation du drone de combat si nécessaire
  if (!combatDrone?.isActive) {
    playerStore.updateVehicle(botId, combatDroneId, { isActive: true });
    return undefined;
  }
  
  // Créer un périmètre de défense autour du vaisseau
  // ...
  
  // Poser des mines stratégiquement
  // ...
};
```

## 7. Dépannage et debugging

### 7.1 Problèmes courants et solutions

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| Le drone ne bouge pas | `isActive` est à false | Activer le drone avec `updateVehicle(botId, droneId, { isActive: true })` |
| Drone bloqué en mouvement | Problème de tuile cible | Vérifier si `targetTile` est valide et accessible |
| Pas de retour après exploration | Transition d'état du drone non effectuée | Vérifier les transitions avec `useDroneState.transitionDroneState()` et le bon état cible |
| Transitions d'état incorrectes | Séquence de transition invalide | S'assurer que les transitions suivent le flux valide : DOCKED_WITH_SHIP → MOVING_TO_TARGET → AT_TARGET → RETURNING_TO_SHIP → DOCKED_WITH_SHIP |
| Ressources non détectées | Message du drone non traité | Vérifier l'intégration avec `sendVehicleMessage` et le gestionnaire de messages |

### 7.2 Utilisation des logs pour le debugging

```javascript
// Debug des actions des drones
fsmLogger.action(`Sending drone to explore tile: ${targetTileInfo.coord}, distance: ${targetTileInfo.distance.toFixed(2)}`);
fsmLogger.action(`Exploration in progress: ${(elapsedTime/1000).toFixed(1)}s elapsed`);
fsmLogger.action(`Drone has returned to ship, exploration sequence fully complete after ${(elapsedTime/1000).toFixed(1)}s`);

// Debug des mouvements
fsmLogger.mouvement(`[UnifiedDroneMovement] Bot drone discovered new resources at ${reachedTileCoord}:`, resources);
fsmLogger.mouvement(`[UnifiedDroneMovement] Bot exploration count increased to ${currentCount + 1}`);
fsmLogger.mouvement(`[UnifiedDroneMovement] Drone for ${playerId} returned to ship`);

// Debug des messages
fsmLogger.message(`Drone ${droneId} sent message: ${type}`, payload);
```

## 8. Machine à États des Drones (useDroneState)

### 8.1 Vue d'ensemble

Les drones utilisent désormais un système de machine à états dédié, implémenté avec Zustand, qui remplace l'ancienne approche basée sur des flags dans la mémoire du joueur. Ce système gère les transitions entre différents états du drone de manière robuste et prévisible.

```javascript
import useDroneState, { DRONE_STATES } from '../../../../hooks/useDroneState';

// États disponibles
const DRONE_STATES = {
  IDLE: 'IDLE',
  MOVING_TO_TARGET: 'MOVING_TO_TARGET',
  AT_TARGET: 'AT_TARGET',
  RETURNING_TO_SHIP: 'RETURNING_TO_SHIP',
  DOCKED_WITH_SHIP: 'DOCKED_WITH_SHIP'
};
```

### 8.2 Transitions d'état valides

Le système n'autorise que des transitions valides entre les états :

```
DOCKED_WITH_SHIP → MOVING_TO_TARGET
MOVING_TO_TARGET → AT_TARGET ou RETURNING_TO_SHIP
AT_TARGET → RETURNING_TO_SHIP
RETURNING_TO_SHIP → DOCKED_WITH_SHIP
IDLE → MOVING_TO_TARGET ou RETURNING_TO_SHIP
```

### 8.3 Utilisation dans le code

#### Initialisation

```javascript
// Dans un composant ou une action
const droneState = useDroneState.getState();
droneState.initializeDrone(droneId); // Initialise à DOCKED_WITH_SHIP
```

#### Transitions d'état

```javascript
// Pour changer l'état d'un drone
droneState.transitionDroneState(droneId, DRONE_STATES.MOVING_TO_TARGET);
```

#### Vérifications d'état

```javascript
// Vérifier si un drone est dans un état spécifique
if (droneState.isDroneInState(droneId, DRONE_STATES.AT_TARGET)) {
  // Logique spécifique à l'état AT_TARGET
}

// Vérifier si un drone est docké avec le vaisseau (remplace droneReturnedToShip)
if (droneState.isDroneDocked(droneId)) {
  // Le drone est revenu au vaisseau
}
```

### 8.4 Migration depuis l'ancien système

Si vous rencontrez encore du code utilisant l'ancien flag `droneReturnedToShip`, voici comment le migrer :

#### Remplacer les vérifications

```javascript
// Ancien code
if (playerState.players[botId]?.memory?.droneReturnedToShip) {
  // Actions...
}

// Nouveau code
const droneState = useDroneState.getState();
const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
if (droneState.isDroneDocked(botDroneId)) {
  // Actions...
}
```

#### Remplacer les mises à jour

```javascript
// Ancien code
playerStore.updatePlayerMemory(botId, { droneReturnedToShip: true });

// Nouveau code
const droneState = useDroneState.getState();
const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
droneState.transitionDroneState(botDroneId, DRONE_STATES.DOCKED_WITH_SHIP);
```
