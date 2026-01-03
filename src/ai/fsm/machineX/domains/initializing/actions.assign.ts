/**
 * ✅ Phase 4: Pure actions for initializing domain
 * Uses context.gridInfo instead of useTileStore.getState()
 */
import { findTileAtPosition, worldToGrid } from '../../../../../core/spatial/index.ts';
import fsmLogger from '../../../../../logger/fsmLogger.ts';
import { createAssignAction } from '../global/actions.assign.ts';

export const processDroneInitRequest = createAssignAction(({ context, event }) => {
	if (event.type !== 'DRONE_INITIALIZE_REQUEST') return context;
	
	// Protection : vérifier que la coordonnée du vaisseau existe
	const shipCoord = context.vehicle?.coord;
	if (!shipCoord) {
		return context;
	}
	
	fsmLogger.context(`🛸 [${context.entityId}] Processing ${event.droneType} drone init request`, {
		shipCoord,
		droneType: event.droneType,
	});
	
	// Pour l'initialisation des drones, on les place à la même position que le ship (docked)
	// Les offsets de formation ne sont utilisés que pour le rendu (animation hooks)
	return {
		droneFleet: {
			...context.droneFleet,
			drones: {
				...context.droneFleet?.drones,
				[event.droneType]: {
					...context.droneFleet?.drones?.[event.droneType],
					coord: shipCoord,  // Drone starts at ship position
					targetDroneTile: null,
					isActive: true,
					visualState: 'docked',
				},
			},
		},
	};
});

export const processShipInitRequest = createAssignAction(({ context, event }) => {
	if (event.type !== 'SHIP_INITIALIZE_REQUEST') return context;
	
	// Protection : vérifier que initialPosition existe
	if (!event.initialPosition) {
		return context;
	}
	
	// ✅ Phase 4: Use context.gridInfo instead of useTileStore.getState()
	const tiles = context.gridInfo?.tiles || {};
	const spacing = context.gridInfo?.spacing ?? 1.2;
	
	// Trouver la tuile la plus proche
	const nearestTile = findTileAtPosition(event.initialPosition, tiles);
	let basePosition;

	if (nearestTile && nearestTile.position) {
		basePosition = { 
			...event.initialPosition, 
			coord: nearestTile.position.coord 
		};
	} else {
		const coord = worldToGrid(event.initialPosition, { spacing });
		basePosition = { ...event.initialPosition, coord };

		fsmLogger.warn(`🚢 [${context.entityId}] No tile found at position, using worldToGrid fallback`, {
			initialPosition: event.initialPosition,
			calculatedCoord: coord
		});
	}

	return {
		vehicle: {
			...context.vehicle,
			position: { ...event.initialPosition, coord: basePosition.coord },
			basePosition: basePosition,
			type: event.shipType as "main-ship",
			visualState: 'docked', // Mark ship as initialized
		},
	};
});
// Actions d'assignation pour le domaine initializing

