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
import shipCollectingCore from './shipCollectingActions.js'; // NOUVEAU - Domaine métier collecting
import droneExploringCore from './droneExploringActions.js'; // NOUVEAU - Domaine métier exploring
import fuelCore from './fuelActions.js';
import resourceCore from './resourcesActions.js';

// ⚠️ ANCIENS IMPORTS SUPPRIMÉS - Fichiers supprimés lors du nettoyage
// import movementCore from './movementActions.js'; // SUPPRIMÉ
// import explorationCore from './explorationActions.js'; // SUPPRIMÉ  
// import droneCore from './droneActions.js'; // SUPPRIMÉ

// ============================================================================
// EXPORTS INDIVIDUELS - NOUVELLES ACTIONS REFACTORISÉES
// ============================================================================

// 🚢 Ship Collecting Actions - NOUVEAU (Domaine métier: Collecting)
export { shipCollectingActions } from './shipCollectingActions.js';

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
} from './shipCollectingActions.js';

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
export const shipCollecting = shipCollectingCore; // NOUVEAU - Domaine collecting
export const droneExploring = droneExploringCore; // NOUVEAU - Domaine exploring

// Domaines inchangés
export const fuel = fuelCore;
export const resource = resourceCore;

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
  shipCollecting: shipCollectingCore.actions, // NOUVEAU - Actions avec préfixe "ship"
  droneExploring: droneExploringCore.actions, // NOUVEAU - Actions avec préfixe "drone"
  
  // Domaines inchangés
  fuel: fuelCore.actions,
  resource: resourceCore.actions,
  
  // ⚠️ RÉTROCOMPATIBILITÉ - Redirige vers les nouvelles actions
  movement: shipCollectingCore.actions, // RÉTROCOMPATIBILITÉ - Redirige vers shipCollecting
  shipMovement: shipCollectingCore.shipActions, // RÉTROCOMPATIBILITÉ - Redirige vers shipCollecting
  entityMovement: shipCollectingCore.entityActions, // RÉTROCOMPATIBILITÉ - Redirige vers shipCollecting
  drone: droneExploringCore.actions, // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
  droneFleet: droneExploringCore.fleetActions, // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
  exploration: droneExploringCore.actions // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
};

// ============================================================================
// EXPORT PAR DÉFAUT - REFACTORISÉ AVEC DOMAINES MÉTIER
// ============================================================================

export default {
  // Nouveaux domaines métier
  shipCollecting: shipCollectingCore, // NOUVEAU - Domaine collecting avec préfixe "ship"
  droneExploring: droneExploringCore, // NOUVEAU - Domaine exploring avec préfixe "drone"
  
  // Domaines inchangés
  fuel: fuelCore,
  resource: resourceCore,
  
  // ⚠️ RÉTROCOMPATIBILITÉ - Redirige vers les nouvelles actions
  // Les anciens noms pointent maintenant vers les nouveaux domaines
  movement: shipCollectingCore, // RÉTROCOMPATIBILITÉ - Redirige vers shipCollecting
  exploration: droneExploringCore, // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
  drone: droneExploringCore, // RÉTROCOMPATIBILITÉ - Redirige vers droneExploring
  
  // Collection globale des actions
  actions: coreActions
};
