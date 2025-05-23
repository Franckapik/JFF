# Guide d'implémentation des drones

Ce guide explique comment implémenter et étendre les fonctionnalités des différents types de drones dans le système. Il couvre les étapes nécessaires pour ajouter de nouveaux comportements, modifier les propriétés existantes et intégrer de nouvelles capacités.

## Table des matières

1. [Structure des drones](#1-structure-des-drones)
2. [Ajouter un nouveau type de drone](#2-ajouter-un-nouveau-type-de-drone)
3. [Modifier les comportements existants](#3-modifier-les-comportements-existants)
4. [Intégration avec le système FSM](#4-intégration-avec-le-système-fsm)
5. [Système de messages](#5-système-de-messages)
6. [Bonnes pratiques](#6-bonnes-pratiques)

## 1. Structure des drones

### 1.1 Propriétés et états fondamentaux

Chaque drone est un véhicule avec des propriétés spécifiques :

```javascript
// Dans vehicleFactory.js
const drone = {
  id: droneId,
  type: droneType,
  isActive: isDroneActiveByDefault(droneType),
  position: { x: 0, y: 0, z: 0 },
  coord: '',
  targetTile: null,
  isMoving: false,
  fuel: 100,
  health: 100,
  resources: { food: 0, debris: 0, special: 0 },
  maxCapacity: getMaxCapacityForDroneType(droneType),
  // Propriétés spécifiques selon le type
  ...getDroneSpecificProperties(droneType)
};
```

### 1.2 Propriétés spécifiques par type

```javascript
function getDroneSpecificProperties(droneType) {
  switch(droneType) {
    case VEHICLE_TYPES.EXPLORER_DRONE:
      return {
        explorationBonus: 2,
        detectionRange: 3
      };
    case VEHICLE_TYPES.COMBAT_DRONE:
      return {
        damage: 15,
        mineLayingCapacity: 3,
        armor: 20
      };
    case VEHICLE_TYPES.SPECIAL_DRONE:
      return {
        specialDetection: true,
        specialScanRange: 5
      };
    default:
      return {};
  }
}
```

## 2. Ajouter un nouveau type de drone

### 2.1 Définir la constante du type

```javascript
// Dans playerConstants.js
export const VEHICLE_TYPES = {
  // Types existants
  SHIP: 'ship',
  EXPLORER_DRONE: 'explorer_drone',
  COMBAT_DRONE: 'combat_drone',
  SPECIAL_DRONE: 'special_drone',
  // Nouveau type
  SCIENTIFIC_DRONE: 'scientific_drone'
};
```

### 2.2 Configurer les propriétés spécifiques

```javascript
// Dans vehicleFactory.js, mettre à jour getDroneSpecificProperties
case VEHICLE_TYPES.SCIENTIFIC_DRONE:
  return {
    researchBonus: 3,
    analysisCapability: true,
    scanPrecision: 2
  };
```

### 2.3 Configurer le comportement dans UnifiedDroneMovement

```jsx
// Dans UnifiedDroneMovement.jsx, mettre à jour getDroneType
const getDroneType = () => {
  if (droneId.startsWith(VEHICLE_TYPES.EXPLORER_DRONE)) return VEHICLE_TYPES.EXPLORER_DRONE;
  if (droneId.startsWith(VEHICLE_TYPES.COMBAT_DRONE)) return VEHICLE_TYPES.COMBAT_DRONE;
  if (droneId.startsWith(VEHICLE_TYPES.SPECIAL_DRONE)) return VEHICLE_TYPES.SPECIAL_DRONE;
  if (droneId.startsWith(VEHICLE_TYPES.SCIENTIFIC_DRONE)) return VEHICLE_TYPES.SCIENTIFIC_DRONE;
  return null;
};

// Ajouter les vitesses et rotations spécifiques
case VEHICLE_TYPES.SCIENTIFIC_DRONE:
  return state.movementSpeeds.drone.speed * 0.8; // Plus lent pour analyse détaillée

// Ajouter le comportement spécifique
case VEHICLE_TYPES.SCIENTIFIC_DRONE:
  // Analyse scientifique des tuiles
  if (drone?.targetTile?.coord && drone.isMoving && !returningToShip) {
    handleDroneReachedTarget(drone.targetTile.coord);
    // Analyser la tuile pour des informations scientifiques
    if (drone.analysisCapability) {
      sendVehicleMessage(playerId, droneId, 'scientific_analysis', {
        precision: drone.scanPrecision,
        coord: drone.targetTile.coord
      });
    }
  }
  break;
```

### 2.4 Ajouter le visuel du drone dans Bot.jsx

```jsx
{/* Scientific Drone - n'afficher que s'il est actif */}
{vehicles && vehicles[getDroneId(playerId, VEHICLE_TYPES.SCIENTIFIC_DRONE)]?.isActive && (
  <UnifiedDroneMovement
    playerId={playerId}
    droneId={getDroneId(playerId, VEHICLE_TYPES.SCIENTIFIC_DRONE)}
  >
    <group>
      <Sphere 
        args={[0.15, 8, 8]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={color === "red" ? "#E0A0FF" : "#80A0FF"} 
          metalness={0.2} 
          roughness={0.5}
          emissive={color === "red" ? "#800080" : "#0000FF"}
          emissiveIntensity={0.3}
        />
      </Sphere>
      <Cylinder
        args={[0.05, 0.05, 0.4, 8]}
        rotation={[Math.PI/2, 0, 0]}
        position={[0, 0, 0.1]}
      >
        <meshStandardMaterial 
          color="#A0A0A0" 
          metalness={0.8} 
          roughness={0.2}
        />
      </Cylinder>
    </group>
  </UnifiedDroneMovement>
)}
```

## 3. Modifier les comportements existants

### 3.1 Ajuster les fonctionnalités par type de drone

```jsx
// Dans handleDroneReachedTarget, ajouter ou modifier les comportements
case VEHICLE_TYPES.EXPLORER_DRONE:
  // Ajouter une nouvelle fonctionnalité pour l'Explorer Drone
  if (reachedTile.type === "anomaly") {
    sendVehicleMessage(playerId, droneId, 'anomaly_detected', {
      intensity: Math.random() * 10,
      coord: reachedTileCoord
    });
  }
  // Code existant...
  break;
```

### 3.2 Ajuster les paramètres de comportement

```jsx
// Modifier le cooldown
switch(droneType) {
  case VEHICLE_TYPES.EXPLORER_DRONE:
    setCooldown(1.5); // Réduire à 1.5 secondes pour plus de rapidité
    break;
  // Autres types...
}

// Modifier la formation
switch(droneType) {
  case VEHICLE_TYPES.EXPLORER_DRONE:
    angle = Math.PI / 6; // 30 degrés plutôt que 0
    heightOffset = 0.2; // Un peu plus haut
    break;
  // Autres types...
}
```

## 4. Intégration avec le système FSM

### 4.1 Ajouter une action spécifique à un type de drone

```javascript
// Dans un nouveau fichier, ex: useSpecialDroneAction.js
import { VEHICLE_TYPES, getDroneId } from '../../../constants/playerConstants';

const useSpecialDroneAction = (botId, playerStore, tileStore, changeState) => {
  const specialDroneId = getDroneId(botId, VEHICLE_TYPES.SPECIAL_DRONE);
  
  // Logique spécifique d'action pour ce drone
  // ...
  
  // Activer le drone s'il n'est pas actif
  const specialDrone = playerStore.players[botId]?.vehicles[specialDroneId];
  if (specialDrone && !specialDrone.isActive) {
    playerStore.updateVehicle(botId, specialDroneId, { isActive: true });
  }
  
  // Reste de la logique...
};

// Ajouter à botActions.js
actionMap: {
  // Autres actions...
  'useSpecialDrone': 'useSpecialDroneAction'
}
```

### 4.2 Réagir aux messages des drones

```javascript
// Dans le gestionnaire de messages
const handleDroneMessage = (message) => {
  if (message.type === 'special_discovered') {
    // Ajouter la ressource spéciale à la mémoire du bot
    // Peut-être déclencher une transition vers un état spécial
  }
};
```

## 5. Système de messages

### 5.1 Structure des messages des drones

```javascript
// Types de messages standards
const DRONE_MESSAGE_TYPES = {
  RESOURCE: 'resource',
  DANGER: 'danger',
  COMBAT: 'combat_engage',
  MINE: 'mine_laid',
  SPECIAL_SCAN: 'special_scan',
  SPECIAL_DISCOVERY: 'special_discovered',
  SCAN_COMPLETE: 'scan_complete',
  // Ajouter de nouveaux types au besoin
};

// Format d'un message
const message = {
  type: DRONE_MESSAGE_TYPES.RESOURCE,
  payload: {
    coord: 'A1',
    resources: { food: 10, debris: 5, special: 0 }
    // Autres données spécifiques
  },
  sender: {
    playerId: 'player2',
    vehicleId: 'explorer_drone_2'
  },
  timestamp: new Date().toISOString()
};
```

### 5.2 Ajouter un nouveau type de message

```jsx
// Dans handleDroneReachedTarget
sendVehicleMessage(playerId, droneId, 'terrain_analysis', {
  terrainType: reachedTile.terrain,
  difficulty: reachedTile.movementCost,
  coord: reachedTileCoord
});
```

## 6. Bonnes pratiques

### 6.1 Séparation des préoccupations

- Garder le composant `UnifiedDroneMovement` pour la logique de mouvement et d'animation
- Utiliser les actions FSM pour la prise de décision
- Utiliser le système de messages pour la communication

### 6.2 Convention de nommage

- Préfixer les propriétés spécifiques au type de drone (`explorationBonus`, `mineLayingCapacity`, etc.)
- Utiliser des noms explicites pour les messages (`special_discovered` plutôt que `special`)

### 6.3 Performance

- Éviter les calculs coûteux dans `useFrame` qui s'exécute à chaque frame
- Minimiser les mises à jour d'état React pour les drones des bots

### 6.4 Extensibilité

- Utiliser des structures génériques (ex: un système basé sur des capacités plutôt que des types fixes)
- Documenter toute nouvelle propriété ou comportement ajouté
- Penser à l'équilibrage du jeu lors de l'ajout de nouvelles capacités
