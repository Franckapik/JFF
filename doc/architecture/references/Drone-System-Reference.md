# Système de Drones - Référence Technique

Ce document détaille l'architecture et le fonctionnement du système de drones intégré au projet. Il couvre les différents types de drones, leurs comportements, et leur intégration avec le reste du système.

## 1. Vue d'ensemble

Le système de drones est implémenté pour fonctionner de manière unifiée pour les joueurs humains et les bots IA. Il utilise une architecture basée sur des types de drones spécialisés, chacun avec des comportements et des caractéristiques distincts.

### 1.1 Types de drones

```javascript
export const VEHICLE_TYPES = {
  SHIP: 'ship',
  EXPLORER_DRONE: 'explorer_drone',
  COMBAT_DRONE: 'combat_drone',
  SPECIAL_DRONE: 'special_drone'
};
```

### 1.2 Caractéristiques par type

| Type de drone | Vitesse | Rotation | Spécialité | Actif par défaut |
|---------------|---------|----------|------------|------------------|
| Explorer      | +20%    | -20% (stable) | Exploration, détection de ressources | Oui |
| Combat        | -10%    | +20% (agressive) | Combat, mines, collecte limitée | Non |
| Special       | Standard | -50% (scan lent) | Scan avancé, détection d'objets spéciaux | Non |

## 2. Architecture du composant `UnifiedDroneMovement`

Le composant `UnifiedDroneMovement.jsx` est au cœur du système, gérant le mouvement, le comportement et les interactions des drones.

### 2.1 Structure des props

```jsx
const UnifiedDroneMovement = ({ 
  playerId = HUMAN_PLAYER_ID, 
  droneId = "drone1", 
  children 
}) => { /* ... */ }
```

### 2.2 Cycle de vie d'un drone

1. **Initialisation** : Position basée sur le vaisseau parent, formation en triangle
2. **Déplacement** : 
   - Vers une cible assignée
   - Autonome (pour les drones du joueur humain, 20% de chance de suivre le vaisseau)
   - Retour au vaisseau après exploration/action
3. **Actions sur cible** : Comportement spécifique selon le type de drone
4. **Retour** : Retour au vaisseau avec cooldown variable par type
5. **Communication** : Envoi de messages selon les trouvailles

## 3. Comportements spécifiques par type

### 3.1 Explorer Drone (`EXPLORER_DRONE`)

**Comportement d'exploration :**
```jsx
// Envoyer des informations détaillées sur les ressources et dangers
if (reachedTile.type === "resource") {
  sendVehicleMessage(playerId, droneId, 'resource', {
    ...resources,
    explorationBonus: drone.explorationBonus,
    coord: reachedTileCoord
  });
} else if (reachedTile.type === "danger") {
  sendVehicleMessage(playerId, droneId, 'danger', {
    severity: "high",
    coord: reachedTileCoord
  });
}
```

**Paramètres :**
- Cooldown court (2s)
- Plus rapide mais stable
- Actif par défaut
- Bonus d'exploration

### 3.2 Combat Drone (`COMBAT_DRONE`)

**Capacités de combat :**
```jsx
// Vérifier les menaces et collecter des ressources si possible
if (reachedTile.type === "danger") {
  sendVehicleMessage(playerId, droneId, 'combat_engage', {
    damage: drone.damage,
    coord: reachedTileCoord
  });
} else if (resources.food > 0 || resources.debris > 0) {
  // Le drone de combat peut collecter de petites quantités
  const collectedResources = {
    food: Math.min(resources.food, drone.maxCapacity.food),
    debris: Math.min(resources.debris, drone.maxCapacity.debris),
    special: Math.min(resources.special, drone.maxCapacity.special)
  };
  sendVehicleMessage(playerId, droneId, 'resource', collectedResources);
}
```

**Pose de mines :**
```jsx
// Poser une mine si la capacité est disponible
if (drone.mineLayingCapacity > 0) {
  updateVehicle(playerId, droneId, {
    mineLayingCapacity: drone.mineLayingCapacity - 1
  });
  sendVehicleMessage(playerId, droneId, 'mine_laid');
}
```

**Paramètres :**
- Cooldown long (4s)
- Plus lent mais rotation agressive
- Capacité de collecte limitée
- Rechargement des mines au retour au vaisseau
- Transfert des ressources au vaisseau principal

### 3.3 Special Drone (`SPECIAL_DRONE`)

**Capacités de scan avancé :**
```jsx
// Scanner la zone pour des objets spéciaux
if (drone.specialDetection) {
  // Scan en spiral pour trouver des objets spéciaux
  const scanRadius = drone.specialScanRange || 5;
  sendVehicleMessage(playerId, droneId, 'special_scan', { radius: scanRadius });
}

// Scanner spécifiquement pour les ressources spéciales
if (resources.special > 0) {
  sendVehicleMessage(playerId, droneId, 'special_discovered', {
    special: resources.special,
    coord: reachedTileCoord,
    scanRange: drone.specialScanRange
  });
}
```

**Paramètres :**
- Cooldown moyen (3s)
- Vitesse standard mais rotation lente
- Portée de scan étendue
- Spécialisé dans la détection d'objets rares

## 4. Formation des drones

Les drones se positionnent en formation triangulaire autour du vaisseau parent, avec des hauteurs variables :

```jsx
// Configuration de la formation en triangle
const baseHeight = 1.0; // Hauteur de base plus basse
const radius = 0.8; // Rayon plus grand pour éviter la superposition
const isHuman = playerId === HUMAN_PLAYER_ID;
const direction = isHuman ? 1 : -1; // Inverse la direction pour le bot

// Calculer l'angle en fonction du type de drone
let angle = 0;
let heightOffset = 0;

switch(droneType) {
  case VEHICLE_TYPES.EXPLORER_DRONE:
    angle = 0; // Devant
    heightOffset = 0;
    break;
  case VEHICLE_TYPES.COMBAT_DRONE:
    angle = (2 * Math.PI) / 3; // 120 degrés
    heightOffset = 0.3; // Plus haut
    break;
  case VEHICLE_TYPES.SPECIAL_DRONE:
    angle = (4 * Math.PI) / 3; // 240 degrés
    heightOffset = -0.3; // Plus bas
    break;
  default:
    angle = 0;
    heightOffset = 0;
}
```

## 5. Intégration avec le système FSM

### 5.1 Actions déclenchées par les drones

- `explorerWithDroneAction` : Envoie un drone explorer les tuiles
- Messages envoyés par les drones pour déclencher des transitions d'état

### 5.2 Mémorisation des découvertes

```jsx
// Mise à jour de la mémoire via la méthode appropriée
updatePlayerMemory(playerId, {
  knownResources: updatedKnownResources,
  lastResourceDiscovery: {
    coord: reachedTileCoord,
    resources,
    timestamp: new Date().toISOString()
  },
  // Définir un flag indiquant qu'une nouvelle ressource a été découverte
  // Les conditions du bot pourront vérifier ce flag
  hasNewResourceDiscovery: true
});
```

## 6. Différences entre bots et joueur humain

### 6.1 Spécifique au joueur humain

- Exploration semi-autonome (20% de chance de suivre le vaisseau)
- État géré localement (useState)
- Position à droite du vaisseau

### 6.2 Spécifique aux bots

- Exploration dirigée par les actions FSM
- État géré dans le store
- Position à gauche du vaisseau
- Mémorisation automatique des ressources découvertes
- Compteur d'exploration incrémenté

## 7. Améliorations futures possibles

- Système d'amélioration des drones (upgrade)
- IA spécifique à chaque type de drone
- Interactions entre drones (assistance mutuelle)
- Capacités spéciales débloquables
- Système de dommages et réparations
