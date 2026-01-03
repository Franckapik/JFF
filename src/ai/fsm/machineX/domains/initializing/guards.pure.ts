/**
 * ==========================================================================
 * INITIALIZING DOMAIN - Pure Guards (100% testable)
 * ==========================================================================
 * 
 * Guards purs pour l'initialisation du système FSM.
 * - Aucun appel à getState()
 * - Aucune dépendance externe (React, R3F, Zustand)
 * - Testables en Node.js via terminal
 * - TypeScript strict: XStateV5Guard
 * 
 * @see scripts/validate-guards/ pour les tests
 */

import type { FSMContext } from '../../../../../types/fsm.d.ts';

/**
 * Vérifie que la coordonnée du véhicule principal est assignée
 * ✅ Refactored: Uses GridCoordinate instead of WorldPosition
 * Note: Ne vérifie plus isGameInitialized() (dépendance store supprimée)
 */
export function isVehiclePositionInitialized(context: FSMContext): boolean {
  const vehicleCoord = context?.vehicle?.coord;
  return !!vehicleCoord && vehicleCoord !== '';
}

/**
 * Vérifie que la coordonnée du drone est assignée
 * ✅ Refactored: Uses GridCoordinate instead of WorldPosition
 * Note: Ne vérifie plus isGameInitialized() (dépendance store supprimée)
 */
export function isDronePositionInitialized(context: FSMContext): boolean {
  const drones = context?.droneFleet?.drones || {};
  const firstDrone = Object.values(drones)[0] as { coord?: string };
  const droneCoord = firstDrone?.coord;
  return !!droneCoord && droneCoord !== '';
}

/**
 * Vérifie que la coordonnée de base de départ du véhicule est assignée
 * ✅ Refactored: Uses GridCoordinate instead of WorldGridPosition
 * Note: Ne vérifie plus isGameInitialized() (dépendance store supprimée)
 */
export function isBasePositionInitialized(context: FSMContext): boolean {
  const baseCoord = context?.vehicle?.baseCoord;
  return !!baseCoord && baseCoord !== '';
}

/**
 * Guard composite : vérifie que le drone, le véhicule et la base sont tous initialisés
 */
export function areAllEntitiesInitialized(context: FSMContext): boolean {
  return isVehiclePositionInitialized(context)
    && isDronePositionInitialized(context)
    && isBasePositionInitialized(context);
}
