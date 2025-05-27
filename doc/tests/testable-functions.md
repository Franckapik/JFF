# Fonctions Testables du Projet

Ce document liste les fonctions unitaires qui peuvent être testées, organisées par catégorie fonctionnelle.

## 1. Système de Coordonnées
_Source: `/src/utils/coordinateSystem.js`_

### Validation
```javascript
// Vérifie si une coordonnée en format grille est valide
isValidGridCoord(coord)

// Vérifie si une position 3D du monde est valide
isValidWorldPosition(position)
```

### Conversion de Coordonnées
```javascript
// Convertit une coordonnée hex (ex: 'A1') en coordonnée grille (ex: '0,1')
hexToGridCoord(hexCoord)

// Convertit une coordonnée grille en coordonnée hex
gridToHexCoord(gridCoord)

// Convertit une coordonnée grille en position monde 3D
gridToWorld(coord)

// Convertit une position monde 3D en coordonnée grille
worldToGrid(position)
```

### Gestion des Vecteurs
```javascript
// Convertit un objet position en Vector3 de Three.js
toVector3(position)

// Convertit un Vector3 de Three.js en objet position
fromVector3(vector3)
```

### Navigation
```javascript
// Vérifie si une position est assez proche d'une tuile cible
hasReachedTarget(currentPos, targetCoord, threshold)
```

## 2. Gestion des Joueurs
_Source: `/src/ai/constants/playerConstants.js`_

### Identification
```javascript
// Obtient l'ID du joueur bot par son index
getBotId(botIndex)

// Obtient l'ID du vaisseau principal
getMainShipId()

// Vérifie si un ID de véhicule correspond au vaisseau principal
isMainShipId(vehicleId)

// Vérifie si un ID de joueur correspond à un bot
isBotPlayerId(playerId)
```

### Gestion des Drones
```javascript
// Obtient l'ID d'un drone pour un joueur et un type donnés
getDroneId(playerId, droneType)

// Obtient tous les IDs de drones pour un joueur
getAllDroneIds(playerId)

// Vérifie si un ID de véhicule correspond à un drone
isDroneId(vehicleId)

// Vérifie si un type de drone est actif par défaut
isDroneActiveByDefault(droneType)
```

### Gestion des états du drone
```javascript
// Initialise l'état d'un drone
initializeDrone(droneId)

// Fait transitionner un drone vers un nouvel état
transitionDroneState(droneId, newState)

// Vérifie si un drone est dans un état spécifique
isDroneInState(droneId, state)

// Obtient l'état actuel d'un drone
getDroneState(droneId)

// Vérifie si un drone est docké avec son vaisseau
isDroneDocked(droneId)
```

## 3. Gestion des Tuiles
_Source: `/src/stores/useTileStore.js`_

### Navigation et Exploration
```javascript
// Obtient les tuiles accessibles dans un rayon autour d'une position
getWalkableTilesInRadius(source, exploringRadius, onlyUnexplored, excludeDanger)

// Sélectionne une tuile accessible aléatoire
selectRandomWalkableTile()

// Obtient les tuiles voisines d'une coordonnée
getNeighbors(coord)
```

### Gestion des Ressources
```javascript
// Déduit des ressources d'une tuile après collecte
deductTileResources(coord, collectedResources)

// Analyse les ressources proches d'une position
analyzeResourcesNearPosition(source, radius)
```

### États des Tuiles
```javascript
// Marque une tuile comme explorée
markTileAsExplored(coord)

// Calcule la distance entre deux coordonnées
calculateDistance(coord1, coord2, formatted, usePathfinding)
```

## 4. Fabrication des Objets
_Source: `/src/stores/usePlayerStore/utils/vehicleFactory.js`_

### Création de Véhicules
```javascript
// Crée un nouveau véhicule avec l'ID et le type donnés
createVehicle(id, type)
```

## 5. Pathfinding et Navigation
_Source: `/src/utils/utils.js`_

### Pathfinding
```javascript
// Trouve un chemin entre deux coordonnées
findPath(startCoord, targetCoord, tiles)

// Calcule la distance totale d'un chemin
calculatePathDistance(path, tiles)

// Trouve la tuile à une position donnée
findTileAtPosition(position, tiles)
```

### Génération de la Carte
```javascript
// Génère des positions hexagonales pour la carte
generateHexPositions(radius, spacing)
```

## 6. Bot Actions
_Source: `/src/ai/fsm/actions/individual/`_

### Actions de Base
```javascript
// Action d'exploration avec un drone
// Renvoie: true (succès), false (échec), undefined (en cours)
exploreWithDroneAction(playerStore, tileStore, addAction, changeState)

// Action de déplacement vers une ressource
// Renvoie: true (succès), false (échec), undefined (en cours)
moveToResourceAction(playerStore, tileStore, addAction, changeState)

// Action de collecte de ressources
// Renvoie: true (succès), false (échec), undefined (en cours)
collectResourceAction(playerStore, tileStore, addAction, changeState)

// Action de retour à la base
// Renvoie: true (succès), false (échec), undefined (en cours)
returnToBaseAction(playerStore, tileStore, addAction, changeState)

// Action de ravitaillement à la base
// Renvoie: true (succès), false (échec)
refuelAtBaseAction(playerStore, tileStore, addAction, changeState)
```

Paramètres communs pour toutes les actions:
- `playerStore` - Store gérant l'état et les actions des joueurs
- `tileStore` - Store gérant l'état et les ressources des tuiles
- `addAction` - Fonction pour ajouter de nouvelles actions à la file du bot
- `changeState` - Fonction pour changer l'état de la FSM du bot

## Exemples de Tests

Voici quelques exemples de prompts pour générer des tests :

```markdown
1. Pour tester les conversions de coordonnées :
"Générer des tests unitaires pour les fonctions hexToGridCoord et gridToHexCoord, incluant des cas valides et invalides"

2. Pour tester la validation :
"Créer des tests pour isValidGridCoord et isValidWorldPosition avec différents types d'entrées"

3. Pour tester la gestion des joueurs :
"Écrire des tests pour les fonctions getBotId et isDroneId avec différents scénarios"

4. Pour tester le pathfinding :
"Développer des tests pour findPath avec différentes configurations de tuiles et obstacles"
```

## Types Communs

```javascript
// Structure d'une tuile
// TileInfo = {
//    coord: String,             // Coordonnée de la tuile (ex: "1,2")
//    position: Object,          // Position 3D {x, y, z}
//    walkable: Boolean,         // Si la tuile est accessible
//    type: String,              // Type de tuile
//    resources: ResourceInfo    // Ressources sur la tuile (optionnel)
// }

// Structure de ressources
// ResourceInfo = {
//    food: Number,              // Quantité de nourriture
//    debris: Number,            // Quantité de débris
//    special: Number            // Quantité d'objets spéciaux
// }

// Structure d'un véhicule
// VehicleObject = {
//    id: String,                // Identifiant du véhicule
//    type: String,              // Type de véhicule
//    position: Object,          // Position 3D {x, y, z} ou null
//    coord: String,             // Coordonnée actuelle ou null
//    isMoving: Boolean,         // Si le véhicule est en mouvement
//    resources: ResourceInfo    // Ressources transportées
//    // + autres propriétés
// }
```

```javascript
// Logging système
fsmLogger.info(message, data, playerId)
fsmLogger.state(message, data, playerId)
fsmLogger.action(message, data, playerId)
fsmLogger.condition(message, data, playerId)
fsmLogger.mouvement(message, data, playerId)
fsmLogger.error(message, data, playerId)
fsmLogger.stateTransition(from, to, context, playerId)

// Mise à jour des véhicules
updateVehicle(state, playerId, vehicleId, updates)
generateInitialDrones(count, spacing)

// Configuration du jeu
setClockRunning(isRunning)
setPlayerCount(count)

// Formatage et affichage
formatStateName(state)
getActionStatusColor(status)
getTileResourceBarStyle(quantity)
```
```
