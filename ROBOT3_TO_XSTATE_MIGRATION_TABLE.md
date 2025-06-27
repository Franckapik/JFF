# Tableau de Migration FSM Robot3 → XState

## Vue d'ensemble

Ce tableau répertorie tous les **événements**, **guards**, **actions**, et **reducers** utilisés dans l'ancien système Robot3 pour faciliter la migration vers XState.

---

## 📋 ÉTATS ET LEURS TRANSITIONS

### 1. État `EVALUATING` (État central de décision)

| Événement | État cible | Guards | Reducers/Actions | Utilisation |
|-----------|------------|--------|------------------|-------------|
| `EVALUATION_COMPLETE` | `IDLE_AT_BASE` | `needsMaintenance && justReturnedFromCollection` | `contextReducers.state.prepareIdleAtBase` | ✅ UTILISÉ |
| `EVALUATION_COMPLETE` | `IDLE_AT_BASE` | `shouldConsiderIdle && (isLowEnergy \|\| needsRepair \|\| hasWorkedEnough)` | `contextReducers.state.prepareIdleAtBase` | ✅ UTILISÉ |
| `EVALUATION_COMPLETE` | `EXPLORING_DEPLOYING` | `justReturnedFromCollection && canContinue && hasUnexplored && isDroneInactive && canDeploy` | `shipCollectingActions.resetExplorationCycleStats` + `contextReducers.state.prepareExploring` + `contextReducers.droneDeployment.deployDrone` | ✅ UTILISÉ |
| `EVALUATION_COMPLETE` | `COLLECTING_RETURNING_TO_BASE` | `safetyGuards.needsEmergencyReturn \|\| efficiencyGuards.shouldReturnForEfficiency` | `contextReducers.state.prepareReturningToBase` | ✅ UTILISÉ |
| `EVALUATION_COMPLETE` | `COLLECTING_MOVING_TO_TARGET` | `discoveryGuards.hasBestTileForCollection && hasEnoughExplored && isShipNotFull` | `shipCollectingActions.selectBestTileForCollection` + `contextReducers.state.prepareCollectingMovingToTarget` | ✅ UTILISÉ |
| `EVALUATION_COMPLETE` | `COLLECTING_MOVING_TO_TARGET` | `discoveryGuards.hasExploredEnoughTiles && discoveryGuards.hasBestTileForCollection && discoveryGuards.shouldTransitionToCollection` | `shipCollectingActions.selectBestTileForCollection` + `contextReducers.state.prepareCollectingMovingToTarget` | ✅ UTILISÉ |
| `EVALUATION_COMPLETE` | `EXPLORING_DEPLOYING` | `(discoveryGuards.hasUnexploredAreas \|\| discoveryGuards.needsExploration) && isDroneInactive && canDeploy` | `contextReducers.state.prepareExploring` + `contextReducers.droneDeployment.deployDrone` | ✅ UTILISÉ |
| `EVALUATION_COMPLETE` | `EXPLORING_RETURNING` | `!baseGuards.isAtBase` | Simple context update | ✅ UTILISÉ |
| `EVALUATION_COMPLETE` | `IDLE_AT_BASE` | `true` (par défaut) | Simple context update | ✅ UTILISÉ |
| `SHIP_UPDATE_POSITION` | `EVALUATING` | `true` | `shipCollectingActions.shipUpdatePosition` | ✅ UTILISÉ |
| `DRONE_POSITION_UPDATE` | `EVALUATING` | `true` | `droneExploringActions.droneUpdatePosition` | ✅ UTILISÉ |

### 2. État `EXPLORING` (Exploration et découverte)

| Événement | État cible | Guards | Reducers/Actions | Utilisation |
|-----------|------------|--------|------------------|-------------|
| `TILE_EXPLORED` | `EXPLORING_DEPLOYING` | `context.droneFleet?.drones?.explorer?.isActive` | `droneExploresTile` + `droneRecallToShip` | ✅ UTILISÉ |
| `DRONE_REACHED_SHIP` | `EVALUATING` | `drone?.isActive && drone?.state === 'returning'` | `droneDockToShip` + `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |
| `EMERGENCY_RESOLVED` | `EVALUATING` | `true` | `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |
| `CRITICAL_FUEL` | `IDLE_AT_BASE` | `true` | Simple context update | ✅ UTILISÉ |

### 3. État `COLLECTING` (Collecte de ressources)

| Événement | État cible | Guards | Reducers/Actions | Utilisation |
|-----------|------------|--------|------------------|-------------|
| `SHIP_ARRIVED_AT_TILE` | `COLLECTING_RETURNING_TO_BASE` | `isMovingToTarget && shipShouldReturnToBase` | `shipCollectsFromTile` + `contextReducers.state.prepareReturningToBase` | ✅ UTILISÉ |
| `SHIP_ARRIVED_AT_TILE` | `EVALUATING` | `isMovingToTarget && !shipShouldReturnToBase` | `shipCollectsFromTile` + `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |
| `SHIP_ARRIVED_AT_TILE` | `EVALUATING` | `currentAction === 'returning_to_base'` | `shipDepositResources` + `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |
| `SHIP_MOVEMENT_STARTED` | `COLLECTING_MOVING_TO_TARGET` | `currentAction === 'moving_to_target'` | `contextReducers.movement.updateMovementProgress` | ✅ UTILISÉ |
| `SHIP_MOVEMENT_STARTED` | `COLLECTING_RETURNING_TO_BASE` | `currentAction === 'returning_to_base'` | `contextReducers.movement.updateMovementProgress` | ✅ UTILISÉ |
| `SHIP_REACHED_BASE` | `EVALUATING` | `currentAction === 'returning_to_base'` | `shipDepositResourcesAtBase` + `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |
| `SHIP_COLLECTION_COMPLETED` | `COLLECTING_RETURNING_TO_BASE` | `shipShouldReturnToBase` | `contextReducers.state.prepareReturningToBase` | ✅ UTILISÉ |
| `SHIP_COLLECTION_COMPLETED` | `EVALUATING` | `!shipShouldReturnToBase` | `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |
| `TILE_COLLECTED` | `EVALUATING` | `true` | `shipCollectsFromTile` + `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |
| `INVENTORY_FULL` | `COLLECTING_RETURNING_TO_BASE` | `totalResources >= maxCapacity * 0.8` | `contextReducers.state.prepareReturningToBase` | ✅ UTILISÉ |
| `RESOURCE_UNAVAILABLE` | `EVALUATING` | `true` | `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |
| `LOW_FUEL_DETECTED` | `COLLECTING_RETURNING_TO_BASE` | `true` | `contextReducers.state.prepareReturningToBase` | ✅ UTILISÉ |
| `EMERGENCY_DETECTED` | `COLLECTING_RETURNING_TO_BASE` | `true` | `contextReducers.state.prepareReturningToBase` | ✅ UTILISÉ |

### 4. État `IDLE_AT_BASE` (Attente et maintenance à la base)

| Événement | État cible | Guards | Reducers/Actions | Utilisation |
|-----------|------------|--------|------------------|-------------|
| `REFUEL_COMPLETE` | `EVALUATING` | `efficiencyGuards.isFullTank` | `contextReducers.fuel.refuel` + `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |
| `UNLOAD_COMPLETE` | `EVALUATING` | `true` | `contextReducers.resource.depositResources` + `contextReducers.state.prepareEvaluating` | ✅ UTILISÉ |

---

## 🛡️ GUARDS (Conditions de Transition)

### Safety Guards (`safetyGuards`)

| Guard | Description | Paramètres | Utilisation |
|-------|-------------|------------|-------------|
| `needsEmergencyReturn` | Vérifie si un retour d'urgence est nécessaire | `context, event` | ✅ UTILISÉ |
| `isCriticalFuel` | Vérifie si le carburant est critique | `context, event` | ✅ UTILISÉ |

### Efficiency Guards (`efficiencyGuards`)

| Guard | Description | Paramètres | Utilisation |
|-------|-------------|------------|-------------|
| `shouldReturnForEfficiency` | Détermine si retour pour efficacité | `context, event` | ✅ UTILISÉ |
| `isFullTank` | Vérifie si le réservoir est plein | `context, event` | ✅ UTILISÉ |

### Discovery Guards (`discoveryGuards`)

| Guard | Description | Paramètres | Utilisation |
|-------|-------------|------------|-------------|
| `hasBestTileForCollection` | Vérifie s'il y a une meilleure tuile à collecter | `context, event` | ✅ UTILISÉ |
| `hasExploredEnoughTiles` | Vérifie si assez de tuiles ont été explorées | `context, event` | ✅ UTILISÉ |
| `shouldTransitionToCollection` | Détermine si transition vers collecte | `context, event` | ✅ UTILISÉ |
| `hasUnexploredAreas` | Vérifie s'il y a des zones non explorées | `context, event` | ✅ UTILISÉ |
| `needsExploration` | Détermine si plus d'exploration est nécessaire | `context, event` | ✅ UTILISÉ |

### Base Guards (`baseGuards`)

| Guard | Description | Paramètres | Utilisation |
|-------|-------------|------------|-------------|
| `isAtBase` | Vérifie si l'entité est à la base | `context, event` | ✅ UTILISÉ |

---

## ⚙️ ACTIONS

### Drone Exploring Actions (`droneExploringActions`)

| Action | Description | Paramètres | Utilisation |
|--------|-------------|------------|-------------|
| `droneExploresTile` | Drone explore une tuile et découvre ressources | `context, event` | ✅ UTILISÉ |
| `droneDeployForExploration` | Déploie drone vers zone cible | `context, event` | ✅ UTILISÉ |
| `droneRecallToShip` | Rappelle drone au vaisseau | `context, event` | ✅ UTILISÉ |
| `droneDockToShip` | Finalise ancrage drone | `context, event` | ✅ UTILISÉ |
| `droneUpdatePosition` | Met à jour position drone | `context, event` | ✅ UTILISÉ |
| `calculateDroneFleetStatus` | Calcule statut flotte | `context` | ✅ UTILISÉ |

### Ship Collecting Actions (`shipCollectingActions`)

| Action | Description | Paramètres | Utilisation |
|--------|-------------|------------|-------------|
| `shipCollectsFromTile` | Vaisseau collecte ressources d'une tuile | `context, event` | ✅ UTILISÉ |
| `shipDepositResources` | Dépose ressources à la base | `context, event` | ✅ UTILISÉ |
| `shipDepositResourcesAtBase` | Dépose toutes ressources à la base | `context` | ✅ UTILISÉ |
| `shipShouldReturnToBase` | Détermine si retour base nécessaire | `context` | ✅ UTILISÉ |
| `selectBestTileForCollection` | Sélectionne meilleure tuile pour collecte | `context, event` | ✅ UTILISÉ |
| `resetExplorationCycleStats` | Réinitialise stats cycle exploration | `context, event` | ✅ UTILISÉ |
| `shipUpdatePosition` | Met à jour position vaisseau | `context, event` | ✅ UTILISÉ |

---

## 🔄 REDUCERS (Modifications d'État)

### State Reducers (`contextReducers.state`)

| Reducer | Description | Paramètres | Utilisation |
|---------|-------------|------------|-------------|
| `prepareIdleAtBase` | Prépare état idle à la base | `context, event` | ✅ UTILISÉ |
| `prepareExploring` | Prépare état exploration | `context, event` | ✅ UTILISÉ |
| `prepareReturningToBase` | Prépare retour à la base | `context, event` | ✅ UTILISÉ |
| `prepareCollectingMovingToTarget` | Prépare déplacement vers cible | `context, event` | ✅ UTILISÉ |
| `prepareEvaluating` | Prépare état évaluation | `context, event` | ✅ UTILISÉ |

### Drone Deployment Reducers (`contextReducers.droneDeployment`)

| Reducer | Description | Paramètres | Utilisation |
|---------|-------------|------------|-------------|
| `deployDrone` | Déploie un drone | `context, event` | ✅ UTILISÉ |

### Movement Reducers (`contextReducers.movement`)

| Reducer | Description | Paramètres | Utilisation |
|---------|-------------|------------|-------------|
| `updateMovementProgress` | Met à jour progression mouvement | `context, event` | ✅ UTILISÉ |

### Fuel Reducers (`contextReducers.fuel`)

| Reducer | Description | Paramètres | Utilisation |
|---------|-------------|------------|-------------|
| `refuel` | Fait le plein de carburant | `context, event` | ✅ UTILISÉ |

### Resource Reducers (`contextReducers.resource`)

| Reducer | Description | Paramètres | Utilisation |
|---------|-------------|------------|-------------|
| `depositResources` | Dépose ressources | `context` | ✅ UTILISÉ |

---

## 🎯 ÉVÉNEMENTS PAR CATÉGORIE

### Événements Système (`SYSTEM_EVENT_TYPES`)

| Événement | Description | Utilisation |
|-----------|-------------|-------------|
| `EVALUATION_COMPLETE` | Évaluation terminée | ✅ UTILISÉ |
| `REFUEL_COMPLETE` | Ravitaillement terminé | ✅ UTILISÉ |
| `UNLOAD_COMPLETE` | Déchargement terminé | ✅ UTILISÉ |

### Événements de Mouvement (`MOVEMENT_EVENT_TYPES`)

| Événement | Description | Utilisation |
|-----------|-------------|-------------|
| `SHIP_UPDATE_POSITION` | Mise à jour position vaisseau | ✅ UTILISÉ |
| `SHIP_MOVEMENT_STARTED` | Mouvement vaisseau commencé | ✅ UTILISÉ |
| `SHIP_ARRIVED_AT_TILE` | Vaisseau arrivé à la tuile | ✅ UTILISÉ |
| `SHIP_REACHED_BASE` | Vaisseau arrivé à la base | ✅ UTILISÉ |
| `SHIP_COLLECTION_COMPLETED` | Collecte vaisseau terminée | ✅ UTILISÉ |
| `DRONE_POSITION_UPDATE` | Mise à jour position drone | ✅ UTILISÉ |
| `DRONE_REACHED_SHIP` | Drone de retour au vaisseau | ✅ UTILISÉ |

### Événements d'Urgence (`EMERGENCY_EVENT_TYPES`)

| Événement | Description | Utilisation |
|-----------|-------------|-------------|
| `EMERGENCY_RESOLVED` | Urgence résolue | ✅ UTILISÉ |
| `CRITICAL_FUEL` | Carburant critique | ✅ UTILISÉ |
| `LOW_FUEL_DETECTED` | Carburant faible détecté | ✅ UTILISÉ |
| `EMERGENCY_DETECTED` | Urgence détectée | ✅ UTILISÉ |

### Événements de Ressources (`RESOURCE_EVENT_TYPES`)

| Événement | Description | Utilisation |
|-----------|-------------|-------------|
| `INVENTORY_FULL` | Inventaire plein | ✅ UTILISÉ |

### Événements Personnalisés

| Événement | Description | Utilisation |
|-----------|-------------|-------------|
| `TILE_EXPLORED` | Tuile explorée | ✅ UTILISÉ |
| `TILE_COLLECTED` | Tuile collectée | ✅ UTILISÉ |
| `RESOURCE_UNAVAILABLE` | Ressource indisponible | ✅ UTILISÉ |

---

## 📊 STATISTIQUES D'UTILISATION

- **Total États**: 4 (EVALUATING, EXPLORING, COLLECTING, IDLE_AT_BASE)
- **Total Transitions**: ~25 transitions actives
- **Total Guards**: ~10 guards uniques
- **Total Actions**: ~15 actions uniques  
- **Total Reducers**: ~12 reducers uniques
- **Total Événements**: ~20 événements uniques

## 🚀 RECOMMANDATIONS DE MIGRATION

### Priorité 1 - État Central
1. Migrer l'état `EVALUATING` et ses guards principaux
2. Implémenter les actions `shipCollectingActions` essentielles
3. Migrer les reducers `contextReducers.state`

### Priorité 2 - Cycles d'Actions  
1. Migrer les états `EXPLORING` et `COLLECTING`
2. Implémenter les actions `droneExploringActions`
3. Migrer les événements de mouvement

### Priorité 3 - Finitions
1. Migrer l'état `IDLE_AT_BASE`
2. Implémenter la gestion d'urgence complète
3. Optimiser les guards et reducers

### Fonctions Non Utilisées (À Supprimer)
- Aucune fonction non utilisée détectée - toutes les fonctions listées sont activement utilisées dans le système Robot3.

---

*Tableau généré automatiquement à partir de l'analyse du code Robot3 FSM*
