# Système de communication des drones

Ce document technique détaille le système de communication entre les drones et le vaisseau principal, ainsi que son intégration avec le système FSM du bot.

## 1. Architecture du système de messages

### 1.1 Vue d'ensemble

Le système de communication des drones repose sur un mécanisme de messages asynchrones, permettant aux drones d'envoyer des informations au vaisseau principal et de recevoir des commandes.

```
┌─────────────┐    commandes     ┌─────────────┐
│   Vaisseau  │ ───────────────> │    Drone    │
│  Principal  │                  │             │
│             │ <─────────────── │             │
└─────────────┘    messages      └─────────────┘
        ↑                               │
        │                               │
        └───────────────────────────────┘
            mise à jour de la mémoire
```

### 1.2 Types de messages

Le système utilise différents types de messages selon la fonction du drone et l'information transmise:

```javascript
// Principaux types de messages des drones
const DRONE_MESSAGE_TYPES = {
  // Messages généraux
  RESOURCE: 'resource',        // Ressources découvertes
  DANGER: 'danger',            // Danger détecté
  FUEL: 'fuel',                // Source de carburant
  REPAIR: 'repair',            // Point de réparation
  
  // Messages du drone de combat
  COMBAT_ENGAGE: 'combat_engage', // Engagement de combat
  MINE_LAID: 'mine_laid',         // Mine posée
  
  // Messages du drone spécial
  SPECIAL_SCAN: 'special_scan',       // Scan spécial initié
  SPECIAL_DISCOVERED: 'special_discovered', // Ressource spéciale
  SCAN_COMPLETE: 'scan_complete',     // Scan terminé
  
  // Autres
  STATUS_UPDATE: 'status_update', // Mise à jour de statut
  ERROR: 'error'                 // Erreur
};
```

## 2. Implémentation du système

### 2.1 Hook `useMessageManager`

Le système s'appuie sur le hook `useMessageManager` pour centraliser la gestion des messages:

```javascript
// Extrait de useMessageManager.js
const useMessageManager = () => {
  // Envoi d'un message depuis un véhicule
  const sendVehicleMessage = (playerId, vehicleId, type, payload = {}) => {
    const message = {
      type,
      payload,
      sender: { playerId, vehicleId },
      timestamp: new Date().toISOString()
    };
    
    // Enregistrer le message dans le store
    playerStore.addMessage(playerId, message);
    
    // Logique spécifique selon le type de message
    handleMessageEffects(message);
    
    return message;
  };
  
  // Gestion des effets secondaires des messages
  const handleMessageEffects = (message) => {
    const { type, payload, sender } = message;
    
    switch (type) {
      case 'resource':
        handleResourceDiscovery(sender.playerId, payload);
        break;
      case 'danger':
        handleDangerAlert(sender.playerId, payload);
        break;
      // Autres types...
    }
  };
  
  return { sendVehicleMessage, /* autres fonctions */ };
};
```

### 2.2 Intégration dans `UnifiedDroneMovement`

Dans le composant `UnifiedDroneMovement`, l'envoi de messages est déclenché lorsqu'un drone atteint sa cible:

```jsx
// Dans handleDroneReachedTarget
const handleDroneReachedTarget = (reachedTileCoord) => {
  if (!reachedTileCoord) return;
  
  const reachedTile = tiles[reachedTileCoord];
  if (!reachedTile) return;
  
  // Récupérer les informations de ressources
  const resources = reachedTile.resources || { food: 0, debris: 0, special: 0 };
  
  // Comportement spécifique selon le type de drone
  switch(droneType) {
    case VEHICLE_TYPES.EXPLORER_DRONE:
      if (reachedTile.type === "resource") {
        sendVehicleMessage(playerId, droneId, 'resource', {
          ...resources,
          explorationBonus: drone.explorationBonus,
          coord: reachedTileCoord
        });
      }
      // Autres cas...
      break;
    
    // Autres types de drones...
  }
  
  // Mise à jour de la mémoire du bot...
};
```

## 3. Flux de données

### 3.1 Cycle de vie d'un message

1. **Génération**: Un drone atteint une tuile et détecte quelque chose d'intéressant
2. **Envoi**: Appel à `sendVehicleMessage` avec les détails
3. **Enregistrement**: Le message est ajouté au store du joueur
4. **Traitement**: Les effets secondaires sont déclenchés via `handleMessageEffects`
5. **Mise à jour**: La mémoire du bot est mise à jour avec les informations
6. **Réaction**: Le système FSM réagit aux changements dans la mémoire

### 3.2 Exemple de flux complet

```
1. Explorer Drone découvre une ressource en A2
2. sendVehicleMessage('player2', 'explorer_drone_2', 'resource', {...})
3. Le message est enregistré dans player2.messages
4. handleResourceDiscovery met à jour la mémoire du bot
5. BotConditions.hasDiscoveredResources() détecte la découverte
6. La FSM déclenche une transition EXPLORING → IDLE → COLLECTING
```

## 4. Traitement spécifique par type de drone

### 4.1 Explorer Drone

```javascript
// Traitement des messages de l'Explorer Drone
const handleExplorerDroneMessage = (message) => {
  const { type, payload, sender } = message;
  
  switch (type) {
    case 'resource':
      // Ajouter aux ressources connues avec bonus d'exploration
      const explorationValue = calculateResourceValue(payload) * 
                              (payload.explorationBonus || 1);
      
      // Mettre à jour la priorité selon la valeur
      addKnownResource(sender.playerId, {
        ...payload,
        priority: determinePriority(explorationValue)
      });
      break;
      
    case 'danger':
      // Ajouter aux dangers connus
      addKnownDanger(sender.playerId, {
        ...payload,
        avoidanceLevel: payload.severity === 'high' ? 2 : 1
      });
      break;
  }
};
```

### 4.2 Combat Drone

```javascript
// Traitement des messages du Combat Drone
const handleCombatDroneMessage = (message) => {
  const { type, payload, sender } = message;
  
  switch (type) {
    case 'combat_engage':
      // Enregistrer l'engagement et les dégâts infligés
      updateCombatEngagement(sender.playerId, {
        coord: payload.coord,
        damage: payload.damage,
        timestamp: new Date().toISOString()
      });
      
      // Vérifier si le danger est éliminé
      if (isDangerEliminated(payload.coord, payload.damage)) {
        removeKnownDanger(sender.playerId, payload.coord);
      }
      break;
      
    case 'mine_laid':
      // Enregistrer la position de la mine
      addPlacedMine(sender.playerId, {
        coord: payload.coord,
        timestamp: new Date().toISOString()
      });
      break;
      
    case 'resource':
      // Transférer les ressources collectées vers le drone
      updateVehicle(sender.playerId, sender.vehicleId, {
        resources: {
          food: payload.food || 0,
          debris: payload.debris || 0,
          special: payload.special || 0
        }
      });
      break;
  }
};
```

### 4.3 Special Drone

```javascript
// Traitement des messages du Special Drone
const handleSpecialDroneMessage = (message) => {
  const { type, payload, sender } = message;
  
  switch (type) {
    case 'special_scan':
      // Enregistrer le scan en cours
      updatePlayerMemory(sender.playerId, {
        currentScan: {
          center: payload.coord,
          radius: payload.radius,
          startTime: new Date().toISOString()
        }
      });
      break;
      
    case 'special_discovered':
      // Ajouter aux ressources spéciales avec haute priorité
      addKnownResource(sender.playerId, {
        ...payload,
        isSpecial: true,
        priority: 'HIGH'
      });
      break;
      
    case 'scan_complete':
      // Marquer la zone comme entièrement scannée
      addScannedArea(sender.playerId, {
        center: payload.coord,
        radius: payload.scanRange,
        completedAt: new Date().toISOString()
      });
      
      // Réinitialiser le scan en cours
      updatePlayerMemory(sender.playerId, { currentScan: null });
      break;
  }
};
```

## 5. Intégration avec le système FSM

### 5.1 Conditions basées sur les messages

```javascript
// Vérifier si des ressources spéciales ont été découvertes
export const hasDiscoveredSpecialResources = () => {
  const botId = getBotPlayerId();
  const store = usePlayerStore.getState();
  const botMemory = store.players?.[botId]?.memory;
  
  // Chercher dans les ressources connues s'il y en a avec isSpecial = true
  const hasSpecial = botMemory?.knownResources?.some(r => r.isSpecial === true);
  
  return {
    result: hasSpecial === true,
    label: 'Ressources spéciales découvertes',
    value: hasSpecial
  };
};

// Vérifier s'il y a un combat en cours
export const hasCombatEngagement = () => {
  const botId = getBotPlayerId();
  const store = usePlayerStore.getState();
  const botMemory = store.players?.[botId]?.memory;
  
  // Vérifier s'il y a des combats récents (moins de 10 secondes)
  const recentEngagements = botMemory?.combatEngagements?.filter(e => {
    const timestamp = new Date(e.timestamp).getTime();
    const now = Date.now();
    return (now - timestamp) < 10000; // 10 secondes
  });
  
  return {
    result: recentEngagements?.length > 0,
    label: 'Combat en cours',
    value: recentEngagements?.length || 0
  };
};
```

### 5.2 Actions déclenchées par messages

```javascript
// Action déclenchée par découverte de ressource spéciale
const investigateSpecialResourceAction = (botId, playerStore, tileStore, changeState) => {
  const botMemory = playerStore.players[botId]?.memory;
  
  // Trouver la ressource spéciale la plus récente
  const specialResources = botMemory?.knownResources?.filter(r => r.isSpecial);
  if (!specialResources || specialResources.length === 0) return false;
  
  // Trier par timestamp (plus récent d'abord)
  const sortedSpecials = [...specialResources].sort((a, b) => {
    return new Date(b.discoveredAt) - new Date(a.discoveredAt);
  });
  
  const targetResource = sortedSpecials[0];
  
  // Activer le drone spécial s'il n'est pas déjà actif
  const specialDroneId = getDroneId(botId, VEHICLE_TYPES.SPECIAL_DRONE);
  const specialDrone = playerStore.players[botId]?.vehicles[specialDroneId];
  
  if (!specialDrone?.isActive) {
    playerStore.updateVehicle(botId, specialDroneId, { isActive: true });
    return undefined; // Continue l'action
  }
  
  // Envoyer le drone faire une analyse plus approfondie
  playerStore.moveToTile(botId, specialDroneId, {
    coord: targetResource.coord,
    position: tileStore.tiles[targetResource.coord].position
  });
  
  // Marquer l'action comme en cours et enregistrer la cible
  playerStore.updatePlayerMemory(botId, {
    currentSpecialInvestigation: {
      coord: targetResource.coord,
      startedAt: new Date().toISOString()
    }
  });
  
  return undefined; // Action en cours
};
```

## 6. Bonnes pratiques et optimisations

### 6.1 Structuration des messages

Pour une maintenance plus facile et une évolution du système, il est recommandé de:

1. **Typer strictement les messages** - Utiliser des constantes pour les types
2. **Standardiser les payloads** - Structure cohérente pour tous les messages
3. **Inclure des métadonnées utiles** - Horodatage, coordonnées, etc.

### 6.2 Performance

Pour optimiser les performances du système de messages:

1. **Limiter la taille de l'historique des messages** - Purger les messages anciens
2. **Filtrer les messages redondants** - Éviter d'envoyer plusieurs fois la même information
3. **Traitement par lots** - Regrouper les mises à jour de mémoire liées à plusieurs messages

### 6.3 Debugging

Pour faciliter le debugging:

1. **Logger tous les messages** - Utiliser `fsmLogger.message`
2. **Ajouter des identifiants uniques** - Pour suivre un message spécifique
3. **Inclure le contexte** - Ajouter suffisamment d'informations pour comprendre le message

## 7. Évolutions futures possibles

Pour étendre le système de communication des drones:

1. **Communication entre drones** - Permettre aux drones de communiquer directement
2. **Priorités de messages** - Système de priorité pour les messages urgents
3. **Messages temporisés** - Messages qui se déclenchent après un délai
4. **Confirmations de réception** - Accusés de réception pour les messages critiques
5. **Compression de messages** - Regrouper plusieurs messages similaires
