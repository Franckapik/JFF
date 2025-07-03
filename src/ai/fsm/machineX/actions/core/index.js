/**
 * ============================================================================
 * SHARED ACTIONS CORE - Export centralisé avec refactoring métier
 * ============================================================================
 * 
 * Point d'entrée principal pour toutes les actions core partagées.
 * Facilite l'import et maintient une interface cohérente.
 * 
 * 📋 MODULES REFACTORISÉS - DOMAINES MÉTIER:
 * ==========================================
 * 
 * 🚢 SHIP COLLECTING (shipCollectingActions.js) - NOUVEAU:
 * - Actions: shipMoveToTile, shipStopMovement, shipUpdatePosition, shipCollectResource, etc.
 * - Domaine métier: Transport et collecte de ressources
 * - Rétrocompatibilité: movementActions, shipMovementActions, entityMovementActions
 * 
 * 🚁 DRONE EXPLORING (droneExploringActions.js) - NOUVEAU:
 * - Actions: droneDeployForExploration, droneRecallToShip, droneStartExploration, droneMarkTileExplored, etc.
 * - Domaine métier: Exploration et découverte
 * - Rétrocompatibilité: droneFleetActions, droneDeploymentActions, explorationActions
 * 
 * ⛽ FUEL (fuelActions.js):
 * - Actions: consumeFuel, refuelVehicle, addFuel, setFuelLevel, etc.
 * 
 * 📦 RESOURCES (resourcesActions.js):
 * - Actions: collectResources, depositResources, addResources, etc.
 * 
 * 📊 EXPORTS ORGANISÉS:
 * - Exports individuels par action avec nouvelles conventions
 * - Exports groupés par domaine métier (shipCollecting, droneExploring, fuel, resource)
 * - Collection globale des actions (coreActions)
 * - Rétrocompatibilité complète maintenue
 * 
 * @author FSM Migration  
 * @version 3.0.0 - Refactoring métier complet
 */

// Import des actions core refactorisées
import { shipCollectingActions } from './core/shipCollectingActions.js'; // NOUVEAU - Domaine métier collecting
import { droneExploringActions } from './droneExploringActions.js'; // NOUVEAU - Domaine métier exploring
import { fuelActions } from './fuelActions.js';
import { resourceActions } from './resourcesActions.js';

// ⚠️ ANCIENS IMPORTS SUPPRIMÉS - Fichiers supprimés lors du nettoyage
// import movementCore from './movementActions.js'; // SUPPRIMÉ
// import explorationCore from './explorationActions.js'; // SUPPRIMÉ  
// import droneCore from './droneActions.js'; // SUPPRIMÉ

// ============================================================================
// EXPORTS INDIVIDUELS - NOUVELLES ACTIONS REFACTORISÉES
// ============================================================================

// 🚢 Ship Collecting Actions - NOUVEAU (Domaine métier: Collecting)
export { shipCollectingActions } from './core/shipCollectingActions.js';

// 🚁 Drone Exploring Actions - NOUVEAU (Domaine métier: Exploring) 
export { droneExploringActions } from './droneExploringActions.js';

// Autres Actions inchangées
export { fuelActions } from './fuelActions.js';
export { resourceActions } from './resourcesActions.js';

// ============================================================================
// EXPORTS RÉTROCOMPATIBILITÉ - UTILISANT LES NOUVELLES ACTIONS
// ============================================================================

// Movement Actions - RÉTROCOMPATIBILITÉ (Redirige vers shipCollectingActions)
export { 
  movementActions, 
  shipMovementActions, 
  entityMovementActions 
} from './core/shipCollectingActions.js';

// Drone Actions - RÉTROCOMPATIBILITÉ (Redirige vers droneExploringActions)
export { 
  droneDeploymentActions, 
  droneFleetActions 
} from './droneExploringActions.js';

// Exploration Actions - RÉTROCOMPATIBILITÉ (Redirige vers droneExploringActions)  
export { 
  explorationActions 
} from './droneExploringActions.js';

// ============================================================================
// EXPORT GROUPÉ PAR DOMAINE MÉTIER - REFACTORISÉ
// ============================================================================

// Nouveaux domaines métier
export const shipCollecting = shipCollectingActions; // NOUVEAU - Domaine collecting
export const droneExploring = droneExploringActions; // NOUVEAU - Domaine exploring

// Domaines inchangés
export const fuel = fuelActions;
export const resource = resourceActions;

// ⚠️ ANCIENS EXPORTS SUPPRIMÉS - Remplacés par les nouveaux domaines métier
// export const movement = movementCore; // SUPPRIMÉ - Utiliser shipCollecting
// export const exploration = explorationCore; // SUPPRIMÉ - Utiliser droneExploring  
// export const drone = droneCore; // SUPPRIMÉ - Utiliser droneExploring

// ============================================================================
// EXPORTS COLLECTIONS - ACTIONS REFACTORISÉES
// ============================================================================

/**
 * Toutes les actions regroupées par domaine métier
 */
export const coreActions = {
  // Nouveaux domaines métier avec préfixes cohérents
  shipCollecting: shipCollectingActions.actions, // NOUVEAU - Actions avec préfixe "ship"
  droneExploring: droneExploringActions.actions, // NOUVEAU - Actions avec préfixe "drone"
  
  // Domaines inchangés
  fuel: fuelActions.actions,
  resource: resourceActions.actions,
  
  // ⚠️ RÉTROCOMPATIBILITÉ - Redirige vers les nouvelles actions
  movement: shipCollectingActions.actions, // RÉTROCOMPATIBILITÉ - Redirige vers shipCollecting
  shipMovement: shipCollectingActions.shipActions, // RÉTROCOMPATIBILITÉ - Redirige vers shipCollecting
  entityMovement: shipCollectingActions.entityActions, // RÉTROCOMPATIBILITÉ - Redirige vers shipCollecting
  drone: droneExploringActions.actions, // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
  droneFleet: droneExploringActions.fleetActions, // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
  exploration: droneExploringActions.actions // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
};

// ============================================================================
// EXPORT PAR DÉFAUT - REFACTORISÉ AVEC DOMAINES MÉTIER
// ============================================================================

export default {
  // Nouveaux domaines métier
  shipCollecting: shipCollectingActions, // NOUVEAU - Domaine collecting avec préfixe "ship"
  droneExploring: droneExploringActions, // NOUVEAU - Domaine exploring avec préfixe "drone"
  
  // Domaines inchangés
  fuel: fuelActions,
  resource: resourceActions,
  
  // ⚠️ RÉTROCOMPATIBILITÉ - Redirige vers les nouvelles actions
  // Les anciens noms pointent maintenant vers les nouveaux domaines
  movement: shipCollectingActions, // RÉTROCOMPATIBILITÉ - Redirige vers shipCollecting
  exploration: droneExploringActions, // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
  drone: droneExploringActions, // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
  
  // Collection globale des actions
  actions: coreActions
};
