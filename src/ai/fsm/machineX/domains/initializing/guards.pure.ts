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
 * Vérifie que la position du véhicule principal est assignée
 * Note: Ne vérifie plus isGameInitialized() (dépendance store supprimée)
 */
export function isVehiclePositionInitialized(context: FSMContext): boolean {
  const vehiclePos = context?.vehicle?.position;
  return !!vehiclePos && 
         vehiclePos.x !== undefined && 
         vehiclePos.z !== undefined;
}

/**
 * Vérifie que la position du drone est assignée
 * Note: Ne vérifie plus isGameInitialized() (dépendance store supprimée)
 */
export function isDronePositionInitialized(context: FSMContext): boolean {
  const drones = context?.droneFleet?.drones || {};
  const firstDrone = Object.values(drones)[0] as { position?: { x?: number; z?: number } };
  const dronePos = firstDrone?.position;
  return !!dronePos && 
         dronePos.x !== undefined && 
         dronePos.z !== undefined;
}

/**
 * Vérifie que la position de base de départ du véhicule est assignée
 * Note: Ne vérifie plus isGameInitialized() (dépendance store supprimée)
 */
export function isBasePositionInitialized(context: FSMContext): boolean {
  const basePos = context?.vehicle?.basePosition;
  return !!basePos && 
         basePos.x !== undefined && 
         basePos.z !== undefined;
}

/**
 * Guard composite : vérifie que le drone, le véhicule et la base sont tous initialisés
 */
export function areAllEntitiesInitialized(context: FSMContext): boolean {
  return isVehiclePositionInitialized(context)
    && isDronePositionInitialized(context)
    && isBasePositionInitialized(context);
}
