/**
 * ============================================================================
 * REDUCERS INDEX - Export centralisé des réducteurs FSM
 * ============================================================================
 * 
 * Point d'entrée pour tous les réducteurs utilisés dans l'architecture FSM.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { contextReducers } from './context.js';

/**
 * Export centralisé de tous les reducers FSM
 */
export const reducers = {
  // Reducers de contexte - gestion centralisée de l'état FSM
  context: contextReducers,
  
  // Autres catégories de reducers à ajouter ici au besoin
  // vehicle: vehicleReducers,
  // resources: resourceReducers,
  // etc.
};

// Exports individuels pour accès direct
export { contextReducers } from './context.js';

export default reducers;
