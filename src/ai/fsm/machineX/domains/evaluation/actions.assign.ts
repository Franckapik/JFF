/**
 * ==========================================================================
 * EVALUATION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * 
 * CONVENTION : assign[Action]Context
 * Actions pures qui modifient le contexte via assign()
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger.ts';
import type { GridCoordinate } from '../../../../../types/coordinates.d.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { Tile } from '../../../../../types/tile.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Assign action pour l'évaluation initiale du contexte
 * Réinitialise le compteur d'exploration si toutes les tuiles connues sont collectées
 */
export const assignEvaluationContext = createAssignAction(({ context: _context, event: _event }) => {
  
  // ✅ FIX: Vérifier si toutes les tuiles connues ont été collectées
  const knownTiles = _context.memory?.knownTiles || [];
  const allTilesCollected = knownTiles.length > 0 && knownTiles.every(tile => tile.collected || !tile.hasResources);
  
  // Si toutes les tuiles sont collectées, réinitialiser le compteur d'exploration
  // pour permettre un nouveau cycle d'exploration
  if (allTilesCollected && (_context.memory?.stats?.tilesExploredInCycle ?? 0) > 0) {
    return {
      memory: {
        ..._context.memory,
        stats: {
          ..._context.memory?.stats,
          tilesExploredInCycle: 0
        }
      },
      lastAction: 'evaluationCycleReset_allTilesCollected'
    };
  }
  
  // Pour le moment, l'évaluation ne modifie pas le contexte directement
  // La logique de décision se fait dans onEvaluatingEntry
  return {};
});

/**
 * Assign action pour la relocalisation du vaisseau vers une nouvelle zone inexplrorée
 * 
 * Stratégie:
 * 1. Trouver toutes les tuiles connues dans gridInfo
 * 2. Identifier les tuiles non explorées en dehors du rayon actuel
 * 3. Sélectionner la plus proche comme nouvelle destination
 * 4. Consommer du fuel proportionnel à la distance
 */
export const assignShipRelocationContext = createAssignAction(({ context }) => {
  const tiles = context.gridInfo?.tiles || {};
  const shipCoord = context.vehicle?.coord || context.vehicle?.baseCoord;
  const exploringRadius = context.config?.exploringRadius ?? 2;
  
  if (!shipCoord || Object.keys(tiles).length === 0) {
    fsmLogger.warn(`⚠️ [${context.entityId}] Cannot relocate: no tiles or ship coord`);
    return {};
  }
  
  // Parse ship coordinate
  const [shipCol, shipRow] = shipCoord.split(',').map(Number);
  if (isNaN(shipCol) || isNaN(shipRow)) {
    return {};
  }
  
  // Get explored coords from memory.knownTiles
  const exploredCoords = new Set(
    (context.memory?.knownTiles ?? [])
      .filter(t => t?.explored)
      .map(t => t?.position?.coord)
  );
  
  // Find unexplored tiles OUTSIDE current radius
  const unexploredOutsideRadius: Array<{ coord: GridCoordinate; distance: number; tile: unknown }> = [];
  
  for (const [coord, tile] of Object.entries(tiles)) {
    const [col, row] = coord.split(',').map(Number);
    if (isNaN(col) || isNaN(row)) continue;
    
    // Skip base tile
      if ((tile as Tile)?.type === 'depart') continue;
      
      // Calculate distance from ship
      const distance = Math.max(Math.abs(col - shipCol), Math.abs(row - shipRow));
      
      // Only consider tiles OUTSIDE current radius
      if (distance > exploringRadius) {
        // Check if not explored
        const isExploredInStore = (tile as Tile)?.explored === true;
        const isExploredInMemory = exploredCoords.has(coord as `${number},${number}`);
      if (!isExploredInStore && !isExploredInMemory) {
        unexploredOutsideRadius.push({ 
          coord: coord as GridCoordinate, 
          distance, 
          tile 
        });
      }
    }
  }
  
  if (unexploredOutsideRadius.length === 0) {
    fsmLogger.info(`✅ [${context.entityId}] All tiles explored! No relocation needed.`);
    return {
      lastAction: 'shipRelocation_allTilesExplored'
    };
  }
  
  // Sort by distance and pick the closest unexplored tile outside radius
  unexploredOutsideRadius.sort((a, b) => a.distance - b.distance);
  const targetCoord = unexploredOutsideRadius[0].coord;
  const targetDistance = unexploredOutsideRadius[0].distance;
  
  // Find the target tile object
  const targetTileData = tiles[targetCoord];
  
  // Get world position from tiles data or create from coord
  const targetTile = targetTileData ? {
    ...targetTileData,
    position: {
      ...(targetTileData as Tile)?.position,
      coord: targetCoord
    }
  } : null;
  
  if (!targetTile) {
    return {};
  }
  
  // Calculate fuel consumption (1 fuel per unit of distance)
  const fuelConsumption = Math.max(1, Math.floor(targetDistance * 0.5));
  const currentFuel = context.vehicle?.fuel || 100;
  const newFuel = Math.max(0, currentFuel - fuelConsumption);
  
  fsmLogger.info(`🚢 [${context.entityId}] Ship relocating to explore new area:`, {
    from: shipCoord,
    to: targetCoord,
    distance: targetDistance,
    fuelConsumed: fuelConsumption,
    fuelRemaining: newFuel,
    unexploredTilesAvailable: unexploredOutsideRadius.length
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      targetVehicleTile: targetTile as Tile,
      fuel: newFuel
    },
    memory: {
      ...context.memory,
      stats: {
        ...context.memory?.stats,
        tilesExploredInCycle: 0 // Reset cycle counter for new area
      }
    },
    lastAction: 'shipRelocation_toNewArea'
  };
});

/**
 * Action assign pour mettre à jour la position du ship après relocalisation
 * Appelé quand SHIP_REACHES_TILE est reçu dans l'état maintaining.relocating
 */
export const assignShipRelocatedContext = createAssignAction(({ context }) => {
  const targetTile = context.vehicle?.targetVehicleTile;
  const targetCoord = targetTile?.position?.coord;
  
  if (!targetCoord) {
    fsmLogger.warn(`⚠️ [${context.entityId}] Cannot update position: no target coord`);
    return {};
  }
  
  fsmLogger.info(`✅ [${context.entityId}] Ship relocation complete - updating position:`, {
    from: context.vehicle?.coord,
    to: targetCoord
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      coord: targetCoord,
      position: targetTile.position
    },
    lastAction: 'shipRelocation_complete'
  };
});
