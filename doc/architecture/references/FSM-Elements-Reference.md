# Référence des éléments du système FSM

Ce document présente un tableau de référence qui met en relation les différents composants du système de machine à états finis (FSM) utilisé par le bot.

## Tableau de correspondance

| État (State) | Actions associées | Fonctions PlayerStore utilisées | Variables/Flags | Conditions BotConditions |
|--------------|-------------------|--------------------------------|----------------|--------------------------|
| **IDLE** | `evaluateConditionsFromIdleAction` | `updatePlayerMemory` | `botState` | `evaluateStateTransition`, `isLowFuel`, `isAtMaxCapacity`, `hasEnoughKnownResources`, `hasDiscoveredResources` |
| **EXPLORING** | `exploreDroneAction`, `moveToRandomTileAction` | `updatePlayerMemory`, `moveToTile` | `explorationCount`, `isMoving`, `droneReturnedToShip` | `isDroneMoving`, `isDroneAtShip`, `hasEnoughFuel` |
| **COLLECTING** | `moveToResourceAction`, `collectResourceAction` | `moveToTile`, `updatePlayerMemory`, `updateVehicle`, `checkResourceCapacity` | `currentTargetResource`, `isCollecting`, `collectionTile`, `knownResources` | `allKnownResourcesCollected`, `isShipMoving` |
| **RETURNING** | `returnToBaseAction`, `refuelAtBaseAction` | `moveToTile`, `transferResourcesToScore`, `refuelVehicle` | `isMoving`, `isAtCapacity` | `isAtBase`, `isFullyRefueled`, `shouldReturnToBase` |

## Actions et leurs dépendances

| Action | Description | Fonctions PlayerStore utilisées | Variables/Flags | Conditions utilisées |
|--------|-------------|--------------------------------|----------------|---------------------|
| `evaluateConditionsFromIdleAction` | Évalue les conditions pour transition d'état | - | `botState` | `evaluateStateTransition` |
| `moveToRandomTileAction` | Déplacement vers une tuile aléatoire | `moveToTile` | `isMoving` | - |
| `returnToBaseAction` | Retourne à la base/tuile de départ | `moveToTile` | `isMoving`, `startCoord`, `initiated` | `isAtBase`, `isShipMoving` |
| `refuelAtBaseAction` | Ravitaillement et transfert des ressources | `refuelVehicle`, `transferResourcesToScore`, `updatePlayerMemory` | - | `isAtBase`, `isFullyRefueled` |
| `exploreWithDroneAction` | Explore avec un drone | `moveToTile`, `updatePlayerMemory` | `explorationStarted`, `knownResources`, `droneReturnedToShip` | `isDroneMoving`, `isDroneAtShip` |
| `moveToResourceAction` | Déplacement vers une ressource connue | `moveToTile`, `updatePlayerMemory` | `started`, `startTime`, `targetCoord`, `currentTargetResource` | `isShipMoving` |
| `collectResourceAction` | Collecte une ressource | `updateVehicle`, `updatePlayerMemory`, `checkResourceCapacity` | `started`, `startTime`, `collectionTime`, `tileCoord`, `resources`, `isCollecting` | - |
| `testQueueAction` | Test de la file d'actions | - | `startTime` | - |

## Conditions et leurs utilisations

| Condition | Description | États qui l'utilisent | Actions qui l'utilisent | Variables examinées |
|-----------|-------------|------------------------|------------------------|---------------------|
| `isLowFuel` | Vérifie si le carburant est bas | IDLE | `evaluateConditionsFromIdleAction` | `fuel` |
| `hasEnoughFuel` | Vérifie s'il y a assez de carburant | IDLE, EXPLORING | `evaluateConditionsFromIdleAction`, `exploreWithDroneAction` | `fuel` |
| `isAtMaxCapacity` | Vérifie si capacité maximale atteinte | IDLE, COLLECTING | `evaluateConditionsFromIdleAction` | `isAtCapacity` |
| `hasEnoughKnownResources` | Vérifie s'il y a assez de ressources connues | IDLE | `evaluateConditionsFromIdleAction` | `knownResources` |
| `hasDiscoveredResources` | Vérifie si des ressources ont été découvertes | IDLE, EXPLORING | `evaluateConditionsFromIdleAction` | `hasNewResourceDiscovery`, `droneReturnedToShip` |
| `allKnownResourcesCollected` | Vérifie si toutes les ressources connues sont collectées | COLLECTING | `evaluateConditionsFromIdleAction` | `knownResources` |
| `isAtBase` | Vérifie si le véhicule est à la base | IDLE, RETURNING | `returnToBaseAction`, `refuelAtBaseAction` | `coord`, `startCoord` |
| `isFullyRefueled` | Vérifie si le ravitaillement est complet | RETURNING | `refuelAtBaseAction` | `fuel` |
| `isDroneMoving` | Vérifie si le drone est en mouvement | EXPLORING | `exploreWithDroneAction` | `isMoving` |
| `isDroneAtShip` | Vérifie si le drone est au même endroit que le vaisseau | EXPLORING | `exploreWithDroneAction` | `coord` |
| `isShipMoving` | Vérifie si le vaisseau est en mouvement | COLLECTING, RETURNING | `moveToResourceAction`, `returnToBaseAction` | `isMoving` |
| `shouldReturnToBase` | Vérifie si le bot doit retourner à sa base | IDLE | `evaluateConditionsFromIdleAction` | Combine `isLowFuel` et `isAtMaxCapacity` |
| `evaluateStateTransition` | Fonction centrale d'évaluation des transitions | Tous | `evaluateConditionsFromIdleAction`, `checkStateExitConditions` | Combine plusieurs conditions |

## Fonctions du PlayerStore et leurs utilisations

| Fonction PlayerStore | Description | Actions qui l'utilisent | États qui en dépendent |
|----------------------|-------------|------------------------|------------------------|
| `moveToTile` | Déplace un véhicule vers une tuile | `moveToResourceAction`, `returnToBaseAction`, `moveToRandomTileAction`, `exploreWithDroneAction` | EXPLORING, COLLECTING, RETURNING |
| `updatePlayerMemory` | Met à jour la mémoire d'un joueur | `collectResourceAction`, `exploreWithDroneAction`, `refuelAtBaseAction`, `moveToResourceAction` | Tous |
| `updateVehicle` | Met à jour l'état d'un véhicule | `collectResourceAction` | COLLECTING |
| `transferResourcesToScore` | Transfère les ressources au score | `refuelAtBaseAction` | RETURNING |
| `refuelVehicle` | Ravitaille un véhicule | `refuelAtBaseAction` | RETURNING |
| `checkResourceCapacity` | Vérifie la capacité des ressources | `collectResourceAction` | COLLECTING |

## Variables d'état importantes

| Variable/Flag | Localisation | Description | Utilisé par |
|--------------|--------------|-------------|-------------|
| `botState` | useBotStore | État actuel du bot | Tous |
| `isMoving` | usePlayerStore (vehicles) | Indique si un véhicule est en mouvement | Plusieurs conditions et actions |
| `currentTargetResource` | usePlayerStore (memory) | Ressource actuellement ciblée | `moveToResourceAction`, `collectResourceAction` |
| `knownResources` | usePlayerStore (memory) | Liste des ressources connues | `moveToResourceAction`, conditions de ressources |
| `explorationCount` | usePlayerStore (memory) | Nombre d'explorations effectuées | `exploreWithDroneAction` |
| `droneReturnedToShip` | usePlayerStore (memory) | Flag indiquant que le drone est revenu au vaisseau | `exploreWithDroneAction` |
| `isCollecting` | usePlayerStore (memory) | Flag indiquant une collecte en cours | `collectResourceAction` |
| `isAtCapacity` | usePlayerStore (vehicles) | Indique si le véhicule est à capacité maximale | Conditions de retour à la base |
| `fuel` | usePlayerStore (vehicles) | Niveau de carburant | Conditions de sécurité |