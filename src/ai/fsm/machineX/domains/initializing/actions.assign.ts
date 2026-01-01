/**
 * ✅ Phase 4: Pure actions for initializing domain
 * Uses context.gridInfo instead of useTileStore.getState()
 */
import { findTileAtPosition, worldToGrid } from '../../../../../core/spatial/index.ts';
import fsmLogger from '../../../../../logger/fsmLogger.ts';
import { createAssignAction } from '../global/actions.assign.ts';

export const processDroneInitRequest = createAssignAction(({ context, event }) => {
	if (event.type !== 'DRONE_INITIALIZE_REQUEST') return context;
	
	// Protection : vérifier que la position du vaisseau existe
	const shipPosition = context.vehicle?.position;
	if (!shipPosition) {
		return context;
	}
	
	fsmLogger.context(`🛸 [${context.entityId}] Processing ${event.droneType} drone init request`, {
		shipPosition,
		droneType: event.droneType,
	});
	
	// Calculer la position initiale du drone avec l'offset de formation
	const formationOffset = context.droneFleet?.formationOffsets?.[event.droneType] || { x: 0, y: 0, z: 0 };
	const droneInitialPosition = {
		x: shipPosition.x + formationOffset.x,
		y: shipPosition.y + formationOffset.y,
		z: shipPosition.z + formationOffset.z
	};
	return {
		droneFleet: {
			...context.droneFleet,
			drones: {
				...context.droneFleet?.drones,
				[event.droneType]: {
					...context.droneFleet?.drones?.[event.droneType],
					position: droneInitialPosition,
					targetDroneTile: droneInitialPosition,
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

