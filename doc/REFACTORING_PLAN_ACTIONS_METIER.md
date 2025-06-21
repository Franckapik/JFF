# PLAN DE REFACTORISATION - RENOMMAGE ACTIONS MÉTIER

## 📋 CONTEXTE DE LA REFACTORISATION

### 🎯 OBJECTIFS
1. **Renommer `movementActions.js` → `shipCollectingActions.js`**
2. **Renommer `droneActions.js` → `droneExploringActions.js`**
3. **Fusionner le contenu de `explorationActions.js` dans `droneExploringActions.js`**
4. **Appliquer les préfixes "ship" et "drone" de manière systématique**
5. **Maintenir la rétrocompatibilité complète**

### 🔧 LOGIQUE MÉTIER
- **Ships = Collecte** : Les ships sont responsables de la collecte de ressources et du transport
- **Drones = Exploration** : Les drones sont responsables de l'exploration et de la découverte

## 🗂️ PLAN DÉTAILLÉ

### 📂 PHASE 1 : CRÉATION DES NOUVEAUX FICHIERS

#### 1.1 Créer `shipCollectingActions.js`
```javascript
/**
 * ============================================================================
 * SHIP COLLECTING ACTIONS CORE - Actions de collecte des ships
 * ============================================================================
 * 
 * Actions pures pour la collecte de ressources par les ships.
 * Ces fonctions gèrent le mouvement, la collecte et le transport de ressources.
 * 
 * 🚢 ACTIONS SHIP (shipCollectingActions):
 * - shipMoveToTile(context, event) : Initie mouvement ship vers tuile cible
 * - shipStopMovement(context) : Arrête le mouvement ship en cours
 * - shipUpdateProgress(context, event) : Met à jour progression ship (0-100)
 * - shipUpdatePosition(context, event) : Met à jour position ship + sync drones
 * - shipCompleteMovement(context) : Finalise un mouvement ship
 * - shipCreateWithCapacities(context, event) : Crée ship avec capacités
 * - shipCollectResource(context, event) : Collecte ressource sur position
 * - shipDepositResources(context, event) : Dépose ressources à la base
 * - shipUpdateInventory(context, event) : Met à jour l'inventaire ship
 */
```

#### 1.2 Créer `droneExploringActions.js`
```javascript
/**
 * ============================================================================
 * DRONE EXPLORING ACTIONS CORE - Actions d'exploration des drones
 * ============================================================================
 * 
 * Actions pures pour l'exploration et la découverte par les drones.
 * Fusionne les fonctionnalités de droneActions.js et explorationActions.js.
 * 
 * 🤖 ACTIONS DRONE (droneExploringActions):
 * - droneDeployForExploration(context, event) : Déploie drone vers zone cible
 * - droneRecallToShip(context, event) : Rappelle drone au vaisseau
 * - droneDockToShip(context, event) : Finalise retour drone (ancré)
 * - droneUpdatePosition(context, event) : Met à jour position drone
 * - droneStartExploration(context, event) : Démarre mission d'exploration
 * - droneMarkTileExplored(context, event) : Marque tuile comme explorée
 * - droneRecordDiscovery(context, event) : Enregistre découverte ressource
 * - droneUpdateExplorationStatus(context, event) : Met à jour statut exploration
 * - droneCompleteExploration(context, event) : Termine exploration actuelle
 * - droneCancelExploration(context, event) : Annule exploration en cours
 */
```

### 📂 PHASE 2 : MIGRATION DU CONTENU

#### 2.1 Migration de `movementActions.js` → `shipCollectingActions.js`

**Renommage des fonctions :**
```javascript
// AVANT (movementActions.js)
export const shipMovementActions = {
  moveShipToTile: (context, event) => { ... },
  stopShipMovement: (context) => { ... },
  updateShipProgress: (context, event) => { ... },
  updateShipPosition: (context, event) => { ... },
  completeShipMovement: (context) => { ... },
  createShipWithCapacities: (context, event) => { ... }
};

// APRÈS (shipCollectingActions.js)
export const shipCollectingActions = {
  shipMoveToTile: (context, event) => { ... },
  shipStopMovement: (context) => { ... },
  shipUpdateProgress: (context, event) => { ... },
  shipUpdatePosition: (context, event) => { ... },
  shipCompleteMovement: (context) => { ... },
  shipCreateWithCapacities: (context, event) => { ... },
  // NOUVELLES ACTIONS SHIP COLLECTE
  shipCollectResource: (context, event) => { ... },
  shipDepositResources: (context, event) => { ... },
  shipUpdateInventory: (context, event) => { ... },
  shipLoadCargo: (context, event) => { ... },
  shipUnloadCargo: (context, event) => { ... }
};
```

#### 2.2 Migration de `droneActions.js` + `explorationActions.js` → `droneExploringActions.js`

**Renommage des fonctions drones :**
```javascript
// AVANT (droneActions.js)
export const droneFleetActions = {
  deployDroneForExploration: (context, event) => { ... },
  recallDroneToShip: (context, event) => { ... },
  dockDroneToShip: (context, event) => { ... },
  updateDroneFleetPosition: (context, event) => { ... }
};

// APRÈS (droneExploringActions.js)
export const droneExploringActions = {
  droneDeployForExploration: (context, event) => { ... },
  droneRecallToShip: (context, event) => { ... },
  droneDockToShip: (context, event) => { ... },
  droneUpdatePosition: (context, event) => { ... },
  // FUSION AVEC explorationActions.js
  droneStartExploration: (context, event) => { ... },
  droneMarkTileExplored: (context, event) => { ... },
  droneRecordDiscovery: (context, event) => { ... },
  droneUpdateExplorationStatus: (context, event) => { ... },
  droneCompleteExploration: (context, event) => { ... },
  droneCancelExploration: (context, event) => { ... },
  droneMarkDiscoveriesProcessed: (context) => { ... }
};
```

### 📂 PHASE 3 : RÉTROCOMPATIBILITÉ

#### 3.1 Actions de rétrocompatibilité dans `shipCollectingActions.js`
```javascript
// ============================================================================
// 🔄 RÉTROCOMPATIBILITÉ - Actions héritées
// ============================================================================

/**
 * Actions de mouvement ship héritées
 * @deprecated Utilisez shipCollectingActions avec préfixes explicites
 */
export const shipMovementActions = {
  moveShipToTile: (context, event) => shipCollectingActions.shipMoveToTile(context, event),
  stopShipMovement: (context) => shipCollectingActions.shipStopMovement(context),
  updateShipProgress: (context, event) => shipCollectingActions.shipUpdateProgress(context, event),
  updateShipPosition: (context, event) => shipCollectingActions.shipUpdatePosition(context, event),
  completeShipMovement: (context) => shipCollectingActions.shipCompleteMovement(context),
  createShipWithCapacities: (context, event) => shipCollectingActions.shipCreateWithCapacities(context, event)
};

/**
 * Actions de mouvement génériques héritées
 * @deprecated Utilisez shipCollectingActions ou droneExploringActions selon le contexte
 */
export const movementActions = {
  moveToTile: (context, event) => shipCollectingActions.shipMoveToTile(context, event),
  stopMovement: (context) => shipCollectingActions.shipStopMovement(context),
  updateProgress: (context, event) => shipCollectingActions.shipUpdateProgress(context, event),
  updatePosition: (context, event) => shipCollectingActions.shipUpdatePosition(context, event),
  completeMovement: (context) => shipCollectingActions.shipCompleteMovement(context),
  createVehicleWithCapacities: (context, event) => shipCollectingActions.shipCreateWithCapacities(context, event)
};

/**
 * Actions entity génériques héritées
 * @deprecated Utilisez shipCollectingActions ou droneExploringActions selon le contexte
 */
export const entityMovementActions = {
  moveEntityToTile: (context, event) => shipCollectingActions.shipMoveToTile(context, event),
  stopEntityMovement: (context) => shipCollectingActions.shipStopMovement(context),
  updateEntityProgress: (context, event) => shipCollectingActions.shipUpdateProgress(context, event),
  updateEntityPosition: (context, event) => shipCollectingActions.shipUpdatePosition(context, event),
  completeEntityMovement: (context) => shipCollectingActions.shipCompleteMovement(context),
  createEntityWithCapacities: (context, event) => shipCollectingActions.shipCreateWithCapacities(context, event)
};
```

#### 3.2 Actions de rétrocompatibilité dans `droneExploringActions.js`
```javascript
// ============================================================================
// 🔄 RÉTROCOMPATIBILITÉ - Actions héritées
// ============================================================================

/**
 * Actions drone fleet héritées
 * @deprecated Utilisez droneExploringActions avec préfixes explicites
 */
export const droneFleetActions = {
  deployDroneForExploration: (context, event) => droneExploringActions.droneDeployForExploration(context, event),
  recallDroneToShip: (context, event) => droneExploringActions.droneRecallToShip(context, event),
  dockDroneToShip: (context, event) => droneExploringActions.droneDockToShip(context, event),
  updateDroneFleetPosition: (context, event) => droneExploringActions.droneUpdatePosition(context, event)
};

/**
 * Actions drone deployment héritées
 * @deprecated Utilisez droneExploringActions avec préfixes explicites
 */
export const droneDeploymentActions = {
  deployDrone: (context, event) => droneExploringActions.droneDeployForExploration(context, event),
  recallDrone: (context, event) => droneExploringActions.droneRecallToShip(context, event),
  dockDrone: (context, event) => droneExploringActions.droneDockToShip(context, event),
  updateDronePosition: (context, event) => droneExploringActions.droneUpdatePosition(context, event)
};

/**
 * Actions exploration héritées
 * @deprecated Utilisez droneExploringActions avec préfixes explicites
 */
export const explorationActions = {
  startExploration: (context, event) => droneExploringActions.droneStartExploration(context, event),
  markTileExplored: (context, event) => droneExploringActions.droneMarkTileExplored(context, event),
  recordDiscovery: (context, event) => droneExploringActions.droneRecordDiscovery(context, event),
  updateExplorationStatus: (context, event) => droneExploringActions.droneUpdateExplorationStatus(context, event),
  completeExploration: (context, event) => droneExploringActions.droneCompleteExploration(context, event),
  cancelExploration: (context, event) => droneExploringActions.droneCancelExploration(context, event),
  markDiscoveriesProcessed: (context) => droneExploringActions.droneMarkDiscoveriesProcessed(context)
};
```

### 📂 PHASE 4 : MISE À JOUR DES IMPORTS

#### 4.1 Mise à jour de `index.js`
```javascript
// ============================================================================
// EXPORTS INDIVIDUELS - NOUVELLES ACTIONS MÉTIER
// ============================================================================

// Ship Collecting Actions
export { shipCollectingActions, shipMovementActions, movementActions, entityMovementActions } from './shipCollectingActions.js';

// Drone Exploring Actions  
export { droneExploringActions, droneFleetActions, droneDeploymentActions, explorationActions } from './droneExploringActions.js';

// Autres Actions (inchangées)
export { fuelActions } from './fuelActions.js';
export { resourceActions } from './resourcesActions.js';

// ============================================================================
// EXPORT GROUPÉ PAR DOMAINE MÉTIER
// ============================================================================

export const shipCollecting = shipCollectingCore;
export const droneExploring = droneExploringCore;
export const fuel = fuelCore;
export const resource = resourceCore;

// ============================================================================
// EXPORTS COLLECTIONS - NOUVELLES ACTIONS MÉTIER
// ============================================================================

export const coreActions = {
  // Actions métier principales
  shipCollecting: shipCollectingCore.actions,
  droneExploring: droneExploringCore.actions,
  
  // Rétrocompatibilité
  movement: shipCollectingCore.actions, // Redirige vers ship collecting
  shipMovement: shipCollectingCore.shipActions,
  entityMovement: shipCollectingCore.entityActions,
  drone: droneExploringCore.actions, // Redirige vers drone exploring
  droneFleet: droneExploringCore.fleetActions,
  exploration: droneExploringCore.explorationActions,
  
  // Autres domaines
  fuel: fuelCore.actions,
  resource: resourceCore.actions
};
```

### 📂 PHASE 5 : MISE À JOUR DES DÉPENDANCES

#### 5.1 Fichiers à mettre à jour
```javascript
// /src/ai/fsm/machine/reducers/context.js
// AVANT
import { movementActions } from '../actions/core/movementActions.js';
import { droneDeploymentActions } from '../actions/core/droneActions.js';
import { explorationActions } from '../actions/core/explorationActions.js';

// APRÈS
import { shipCollectingActions } from '../actions/core/shipCollectingActions.js';
import { droneExploringActions } from '../actions/core/droneExploringActions.js';

// /src/ai/fsm/machine/states/evaluatingState.js
// AVANT
import { movementActions, droneDeploymentActions } from '../actions/core/index.js';

// APRÈS
import { shipCollectingActions, droneExploringActions } from '../actions/core/index.js';

// /src/ai/fsm/machine/states/exploringState.js
// AVANT
import { explorationActions } from '../actions/core/explorationActions.js';

// APRÈS
import { droneExploringActions } from '../actions/core/droneExploringActions.js';
```

### 📂 PHASE 6 : SUPPRESSION DES ANCIENS FICHIERS

#### 6.1 Fichiers à supprimer (après migration)
- `movementActions.js`
- `droneActions.js`  
- `explorationActions.js`

#### 6.2 Validation avant suppression
- [ ] Vérifier que tous les imports sont mis à jour
- [ ] Tester que la rétrocompatibilité fonctionne
- [ ] Vérifier qu'il n'y a pas d'erreurs de compilation
- [ ] Tester le comportement en runtime

## 🎯 CONVENTIONS DE NOMMAGE FINALES

### 📝 PRÉFIXES SYSTÉMATIQUES

| Entité | Préfixe | Exemple |
|---------|---------|---------|
| Ship | `ship` | `shipMoveToTile`, `shipCollectResource` |
| Drone | `drone` | `droneDeployForExploration`, `droneMarkTileExplored` |

### 📝 STRUCTURE STANDARDISÉE
```javascript
// NOUVELLES ACTIONS
export const [entity][Domain]Actions = {
  [entity][Action]: (context, event) => { ... }
};

// EXEMPLES
export const shipCollectingActions = {
  shipMoveToTile: (context, event) => { ... },
  shipCollectResource: (context, event) => { ... }
};

export const droneExploringActions = {
  droneDeployForExploration: (context, event) => { ... },
  droneMarkTileExplored: (context, event) => { ... }
};
```

## 🔄 AVANTAGES DE CETTE REFACTORISATION

### 🚀 CLARTÉ MÉTIER
1. **Séparation claire** : Ships = Collecte, Drones = Exploration
2. **Nommage explicite** : Chaque fonction indique clairement son entité et son domaine
3. **Organisation logique** : Actions groupées par responsabilité métier

### 🔧 MAINTENABILITÉ
1. **Moins de fichiers** : 2 fichiers au lieu de 3
2. **Cohérence** : Préfixes systématiques
3. **Évolutivité** : Facile d'ajouter de nouvelles actions par domaine

### 🔄 RÉTROCOMPATIBILITÉ
1. **Aucun breaking change** : Toutes les anciennes fonctions restent disponibles
2. **Migration progressive** : Possibilité de migrer le code petit à petit
3. **Documentation claire** : Dépréciation documentée avec `@deprecated`

## 📋 CHECKLIST D'IMPLÉMENTATION

### ✅ Phase 1 - Création
- [ ] Créer `shipCollectingActions.js`
- [ ] Créer `droneExploringActions.js`
- [ ] Migrer le contenu avec nouveaux préfixes
- [ ] Ajouter les actions de rétrocompatibilité

### ✅ Phase 2 - Intégration
- [ ] Mettre à jour `index.js`
- [ ] Mettre à jour les imports dans `context.js`
- [ ] Mettre à jour les imports dans les states
- [ ] Tester la compilation

### ✅ Phase 3 - Validation
- [ ] Tester le comportement runtime
- [ ] Vérifier la rétrocompatibilité
- [ ] Valider les nouvelles actions
- [ ] Supprimer les anciens fichiers

### ✅ Phase 4 - Documentation
- [ ] Mettre à jour la documentation
- [ ] Créer guide de migration
- [ ] Marquer les dépréciations

---

*Plan créé le : 13 juin 2025*
*Version : 1.0.0*
*Auteur : Refactorisation FSM Actions Métier*
