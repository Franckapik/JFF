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

// Import des actions core refactorisées (après nettoyage)
import { droneExploringActions } from './droneExploringActions.js';
import { positionActions } from './positionActions.js';

// ⚠️ ANCIENS IMPORTS SUPPRIMÉS - Fichiers supprimés lors du nettoyage
// import movementCore from './movementActions.js'; // SUPPRIMÉ
// import explorationCore from './explorationActions.js'; // SUPPRIMÉ  
// import droneCore from './droneActions.js'; // SUPPRIMÉ

// ============================================================================
// EXPORTS INDIVIDUELS - NOUVELLES ACTIONS REFACTORISÉES
// ============================================================================

//  Drone Exploring Actions - Domaine métier: Exploring
export { droneExploringActions } from './droneExploringActions.js';
export { positionActions } from './positionActions.js';

// ============================================================================
// EXPORTS RÉTROCOMPATIBILITÉ - UTILISANT LES NOUVELLES ACTIONS
// ============================================================================

// (Rétrocompatibilité supprimée : shipCollecting/movement/fuel/resource n'existent plus)

// ============================================================================
// EXPORT GROUPÉ PAR DOMAINE MÉTIER - REFACTORISÉ
// ============================================================================

// Domaine métier restant
export const droneExploring = droneExploringActions;
export const position = positionActions;

// ⚠️ ANCIENS EXPORTS SUPPRIMÉS - Remplacés par les nouveaux domaines métier
// export const movement = movementCore; // SUPPRIMÉ - Utiliser shipCollecting
// export const exploration = explorationCore; // SUPPRIMÉ - Utiliser droneExploring  
// export const drone = droneCore; // SUPPRIMÉ - Utiliser droneExploring

// ============================================================================
// EXPORTS COLLECTIONS - ACTIONS RESTANTES
// ============================================================================

/**
 * Toutes les actions regroupées par domaine métier restant
 */
export const coreActions = {
  droneExploring: droneExploringActions.actions,
  position: positionActions.actions
};

// ============================================================================
// EXPORT PAR DÉFAUT - REFACTORISÉ AVEC DOMAINES MÉTIER
// ============================================================================

export default {
  droneExploring: droneExploringActions,
  position: positionActions,
  actions: coreActions
};
