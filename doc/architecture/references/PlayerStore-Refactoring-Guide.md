# Guide de Refactoring du PlayerStore

Ce document détaille les problèmes identifiés dans la structure du PlayerStore et propose des solutions concrètes pour les corriger. Il est conçu pour servir de référence lors du travail avec GitHub Copilot pour refactoriser le code.

## 1. Incohérences d'ID de Véhicules

### Problèmes identifiés
- Présence simultanée de `"undefined-ship"` et `"ship"` pour le même joueur
- Les IDs ne suivent pas le format défini dans `playerConstants.js`
- `selectedVehicle.vehicleId` utilise `"ship"` au lieu du format d'ID approprié

### Solutions proposées

```javascript
// Exemple d'utilisation correcte de getMainShipId
function createPlayerVehicles(playerId) {
  // Vérifier que playerId n'est pas undefined
  if (!playerId) {
    console.error('Tentative de création de véhicules avec un playerId invalide:', playerId);
    return {};
  }
  
  const shipId = getMainShipId(playerId); // Doit donner: `${playerId}-ship`
  // Suite de la création...
}
```

### Tâches de refactoring
1. Auditer tous les appels à `getMainShipId` pour s'assurer qu'ils reçoivent un playerId valide
2. Remplacer toutes les occurrences de `"ship"` comme ID par le format approprié `${playerId}-ship`
3. Nettoyer les entrées dupliquées en consolidant les propriétés
4. Mettre à jour les références dans `selectedVehicle`

## 2. Manque de Cohérence dans les Propriétés des Véhicules

### Problèmes identifiés
- Les drones du joueur humain manquent de propriétés présentes dans les drones des bots (`isActive`, `fuel`, etc.)
- Structures de propriétés différentes pour le même type de véhicule
- Absence de propriétés spécifiques à certains types de véhicules

### Solution proposée: Fonction Factory Standardisée

```javascript
// Fonction factory pour créer des véhicules standardisés
function createVehicleByType(playerId, vehicleType) {
  // Structure de base commune à tous les véhicules
  const baseVehicle = {
    id: vehicleType === VEHICLE_TYPES.SHIP 
      ? getMainShipId(playerId) 
      : getDroneId(playerId, vehicleType),
    type: vehicleType,
    position: null,
    coord: null,
    isMoving: false,
    progress: 0,
    resources: { food: 0, debris: 0, special: 0 },
    targetTile: { position: null, coord: null },
    fuel: vehicleType === VEHICLE_TYPES.SHIP ? 100 : 50,
    damage: 0,
    isActive: isDroneActiveByDefault(vehicleType),
    maxCapacity: getMaxCapacityForType(vehicleType)
  };
  
  // Ajout des propriétés spécifiques au type
  switch(vehicleType) {
    case VEHICLE_TYPES.SHIP:
      return {
        ...baseVehicle,
        totalDistance: 0,
        path: [],
        startCoord: null,
        isAtCapacity: false
      };
    case VEHICLE_TYPES.EXPLORER_DRONE:
      return {
        ...baseVehicle,
        explorationBonus: 1.5
      };
    case VEHICLE_TYPES.COMBAT_DRONE:
      return {
        ...baseVehicle,
        attackRange: 2,
        mineLayingCapacity: 3,
        damage: 5
      };
    case VEHICLE_TYPES.SPECIAL_DRONE:
      return {
        ...baseVehicle,
        specialScanRange: 5,
        specialDetection: true,
        specialAbilityCharge: 100
      };
    default:
      return baseVehicle;
  }
}

// Fonction utilitaire pour déterminer la capacité maximale selon le type
function getMaxCapacityForType(vehicleType) {
  switch(vehicleType) {
    case VEHICLE_TYPES.SHIP:
      return { food: 100, debris: 1000, special: 2 };
    case VEHICLE_TYPES.COMBAT_DRONE:
      return { food: 20, debris: 50, special: 1 };
    case VEHICLE_TYPES.EXPLORER_DRONE:
    case VEHICLE_TYPES.SPECIAL_DRONE:
    default:
      return { food: 0, debris: 0, special: 0 };
  }
}
```

### Tâches de refactoring
1. Définir un ensemble standard de propriétés pour chaque type de véhicule
2. Assurer que tous les véhicules du même type ont des structures identiques
3. Ajouter les propriétés manquantes aux drones du joueur humain

## 3. Consolidation des Données de Position et Coordonnées

### Problèmes identifiés
- Données de position réparties entre deux objets ship différents
- Certains véhicules affichent des positions `null` alors que les coordonnées existent ailleurs

### Solution proposée


```

### Tâches de refactoring
1. Consolider les données de position dans une seule instance de véhicule
2. Supprimer les entrées dupliquées après migration des données
3. S'assurer que l'initialisation définit correctement les coordonnées et positions

## 4. Correction des Références de Véhicules Sélectionnés

### Problèmes identifiés
- `selectedVehicle` fait référence à `"ship"` qui n'est pas un ID de véhicule correct

### Solution proposée

```javascript
// Exemple de fonction de sélection de véhicule
function selectVehicle(state, playerId, vehicleType) {
  const vehicleId = vehicleType === VEHICLE_TYPES.SHIP
    ? getMainShipId(playerId)
    : getDroneId(playerId, vehicleType);
    
  // Vérifier que le véhicule existe
  const player = state.players[playerId];
  if (!player || !player.vehicles[vehicleId]) {
    console.error(`Le véhicule ${vehicleId} n'existe pas pour le joueur ${playerId}`);
    return false;
  }
  
  state.selectedVehicle = { playerId, vehicleId };
  return true;
}

// Fonction pour migrer les sélections existantes
function migrateVehicleSelections(state) {
  if (state.selectedVehicle) {
    const { playerId, vehicleId } = state.selectedVehicle;
    
    // Si l'ID est simplement "ship", le convertir en format correct
    if (vehicleId === "ship") {
      state.selectedVehicle.vehicleId = getMainShipId(playerId);
    }
  }
}
```

### Tâches de refactoring
1. Mettre à jour `selectedVehicle` pour référencer l'ID du véhicule correct
2. Ajouter une validation pour s'assurer que les véhicules sélectionnés existent

## 5. Création et Initialisation des Véhicules

### Problèmes identifiés
- Conditions de course possibles pendant la création des véhicules
- Utilisation involontaire de `undefined` pendant l'initialisation

### Solution proposée

```javascript
// Exemple d'initialisation défensive des véhicules
function initializeVehicles(gameState) {
  if (!gameState || !gameState.players) return;
  
  Object.keys(gameState.players).forEach(playerId => {
    if (!playerId) {
      console.error('ID de joueur invalide rencontré');
      return;
    }
    
    const player = gameState.players[playerId];
    const vehicles = {};
    
    // Créer le vaisseau principal
    const shipId = getMainShipId(playerId);
    vehicles[shipId] = createVehicleByType(playerId, VEHICLE_TYPES.SHIP);
    
    // Créer les drones
    Object.values(VEHICLE_TYPES)
      .filter(type => type !== VEHICLE_TYPES.SHIP)
      .forEach(droneType => {
        const droneId = getDroneId(playerId, droneType);
        vehicles[droneId] = createVehicleByType(playerId, droneType);
      });
    
    // Remplacer les véhicules du joueur par ceux correctement initialisés
    // et sauvegarder les données existantes si elles existent
    if (player.vehicles) {
      Object.keys(vehicles).forEach(vehicleId => {
        const oldVehicle = player.vehicles[vehicleId] || 
                          (vehicleId.endsWith('-ship') && player.vehicles['ship']);
        
        if (oldVehicle) {
          // Transférer les données non-null de l'ancien véhicule
          Object.keys(oldVehicle).forEach(key => {
            if (oldVehicle[key] !== null) {
              vehicles[vehicleId][key] = oldVehicle[key];
            }
          });
        }
      });
    }
    
    // Remplacer les véhicules du joueur
    player.vehicles = vehicles;
  });
}

// Fonction de validation à exécuter après l'initialisation
function validatePlayerVehicles(gameState) {
  let hasErrors = false;
  
  Object.keys(gameState.players).forEach(playerId => {
    const player = gameState.players[playerId];
    
    // Vérifier que le vaisseau principal existe et a l'ID correct
    const expectedShipId = getMainShipId(playerId);
    if (!player.vehicles[expectedShipId]) {
      console.error(`Le joueur ${playerId} n'a pas de vaisseau avec l'ID correct ${expectedShipId}`);
      hasErrors = true;
    }
    
    // Vérifier la présence de tous les types de drones
    Object.values(VEHICLE_TYPES)
      .filter(type => type !== VEHICLE_TYPES.SHIP)
      .forEach(droneType => {
        const expectedDroneId = getDroneId(playerId, droneType);
        if (!player.vehicles[expectedDroneId]) {
          console.error(`Le joueur ${playerId} n'a pas de drone ${droneType} avec l'ID correct ${expectedDroneId}`);
          hasErrors = true;
        }
      });
  });
  
  return !hasErrors;
}
```

### Tâches de refactoring
1. Auditer tous les chemins de création de véhicules
2. Ajouter des vérifications défensives pour éviter les IDs undefined
3. Corriger la séquence d'initialisation pour s'assurer que les propriétés sont correctement définies
4. Implémenter une fonction de validation pour vérifier la cohérence

## Plan d'Implémentation

1. **Étape 1: Audit du code existant**
   - Identifier tous les endroits où les IDs de véhicules sont créés ou référencés
   - Documenter toutes les structures actuelles de propriétés des véhicules

2. **Étape 2: Migration des IDs**
   - Standardiser tous les IDs de véhicules selon le modèle approprié
   - Mettre à jour les références dans `selectedVehicle`

3. **Étape 3: Consolidation des structures de véhicules**
   - Implémenter la fonction `createVehicleByType`
   - Ajouter les propriétés manquantes aux drones du joueur humain

4. **Étape 4: Fusion des données de position**
   - Consolider les données de position en une seule instance par véhicule
   - Supprimer les entrées dupliquées après migration

5. **Étape 5: Tests et validation**
   - Ajouter des tests unitaires pour vérifier l'initialisation correcte des véhicules
   - Implémenter une fonction de validation pour vérifier la cohérence de la structure

6. **Étape 6: Mise à jour du code UI**
   - Mettre à jour tout code UI qui référence directement les IDs de véhicules
   - Assurer que la sélection de véhicules fonctionne avec la nouvelle structure

## Validation

Pour chaque étape de refactoring, utiliser le code de validation suivant pour vérifier la cohérence du PlayerStore:

```javascript
// Fonction de débogage pour vérifier la structure du PlayerStore
function checkPlayerStoreConsistency(playerStore) {
  const issues = [];
  
  // Vérifier les IDs de véhicules
  Object.keys(playerStore.players).forEach(playerId => {
    const player = playerStore.players[playerId];
    
    // Vérifier si le vaisseau existe avec l'ID correct
    const expectedShipId = getMainShipId(playerId);
    if (!player.vehicles[expectedShipId]) {
      issues.push(`Le joueur ${playerId} n'a pas de vaisseau avec l'ID correct ${expectedShipId}`);
    }
    
    // Vérifier les drones
    Object.values(VEHICLE_TYPES).forEach(vehicleType => {
      if (vehicleType === VEHICLE_TYPES.SHIP) return;
      
      const expectedId = getDroneId(playerId, vehicleType);
      if (!player.vehicles[expectedId]) {
        issues.push(`Le joueur ${playerId} n'a pas de ${vehicleType} avec l'ID correct ${expectedId}`);
      }
    });
    
    // Vérifier s'il y a des entrées qui ne devraient pas exister
    Object.keys(player.vehicles).forEach(vehicleId => {
      const vehicle = player.vehicles[vehicleId];
      if (vehicleId === 'ship') {
        issues.push(`Le joueur ${playerId} a toujours un véhicule avec l'ID 'ship' qui devrait être remplacé par ${expectedShipId}`);
      }
      if (vehicleId === 'undefined-ship') {
        issues.push(`Le joueur ${playerId} a un véhicule avec l'ID 'undefined-ship' qui indique un problème d'initialisation`);
      }
    });
  });
  
  // Vérifier selectedVehicle
  if (playerStore.selectedVehicle) {
    const { playerId, vehicleId } = playerStore.selectedVehicle;
    const player = playerStore.players[playerId];
    
    if (!player) {
      issues.push(`selectedVehicle référence un joueur inexistant: ${playerId}`);
    } else if (!player.vehicles[vehicleId]) {
      issues.push(`selectedVehicle référence un véhicule inexistant: ${vehicleId} pour le joueur ${playerId}`);
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}
```

Utilisez cette fonction pendant le développement et dans les tests pour vérifier que le refactoring maintient la cohérence du PlayerStore.
