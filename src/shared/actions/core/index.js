/**
 * ============================================================================
 * SHARED ACTIONS CORE - Export centralisé
 * ============================================================================
 * 
 * Point d'entrée principal pour toutes les actions core partagées.
 * Facilite l'import et maintient une interface cohérente.
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

// Import des actions core
import movementCore from './movement.js';

// ============================================================================
// EXPORTS INDIVIDUELS
// ============================================================================

export { movementActions, movementSelectors, movementGuards, movementEvents } from './movement.js';

// ============================================================================
// EXPORT GROUPÉ PAR DOMAINE
// ============================================================================

export const movement = movementCore;

// ============================================================================
// EXPORT PAR DÉFAUT - TOUTES LES ACTIONS
// ============================================================================

export default {
  movement: movementCore,
  // Prêt pour les futurs ajouts :
  // inventory: inventoryCore,
  // fuel: fuelCore,
  // vehicle: vehicleCore
};
