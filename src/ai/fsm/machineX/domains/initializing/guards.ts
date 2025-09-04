/**
 * Guard composite : vérifie que le drone, le véhicule et la base sont tous initialisés
 */
export function areAllEntitiesInitialized(context: import('../../../../../types/fsm.d.ts').FSMContext): boolean {
	return isVehiclePositionInitialized(context)
		&& isDronePositionInitialized(context)
		&& isBasePositionInitialized(context);
}
// Guards pour le domaine initializing
import useGameStore from '../../../../../stores/useGameStore';
import type { FSMContext } from '../../../../../types/fsm.d.ts';

/**
 * Vérifie que la position du véhicule principal est assignée et que le jeu est initialisé
 */
export function isVehiclePositionInitialized(context: FSMContext): boolean {
	const vehiclePos = context?.vehicle?.position;
	const isGameInit = useGameStore.getState().isGameInitialized();
	return !!vehiclePos && isGameInit;
}

/**
 * Vérifie que la position du drone est assignée et que le jeu est initialisé
 */
export function isDronePositionInitialized(context: FSMContext): boolean {
	// On vérifie le premier drone actif
	const drones = context?.droneFleet?.drones || {};
	const firstDrone = Object.values(drones)[0] as { position?: unknown };
	const dronePos = firstDrone?.position;
	const isGameInit = useGameStore.getState().isGameInitialized();
	return !!dronePos && isGameInit;
}

/**
 * Vérifie que la position de base de départ du véhicule est assignée et que le jeu est initialisé
 */
export function isBasePositionInitialized(context: FSMContext): boolean {
	const basePos = context?.vehicle?.basePosition;
	const isGameInit = useGameStore.getState().isGameInitialized();
	return !!basePos && isGameInit;
}

