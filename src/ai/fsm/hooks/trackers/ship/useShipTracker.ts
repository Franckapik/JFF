import { useCallback } from "react";

import { useTileStore } from "../../../../../stores/useTileStore/index";

import type { WorldPosition } from "../../../../../types/coordinates.d.ts";
import type { FSMContext } from "../../../../../types/fsm.d.ts";
import type { TileStoreType } from "../../../../../types/stores.d.ts";
import type { XStateSend } from "../../../../../types/tracker.d.ts";

import { createShipHandlers } from "./handlers";

interface ShipTrackerParams {
  context: FSMContext;
  send: XStateSend;
  botId: string;
  shipType?: "ship" | "main-ship";
}

export const useShipTracker = ({
  context,
  send,
  botId,
  shipType = "main-ship",
}: ShipTrackerParams): ((position: WorldPosition) => void) => {
  // Suppression de currentVisualPosition : non utilisée
  const { calculateDistance, gridToWorld } = useTileStore() as TileStoreType;

  const updatePosition = useCallback(
    (position: WorldPosition) => {
      // Suppression de l'affectation à currentVisualPosition

      // ⚠️ PROTECTION : Ne pas traiter si le drone est en cours d'exploration
      const isDroneExploring = context?.droneFleet?.drones?.explorer?.visualState === 'deploying' || 
                              context?.droneFleet?.drones?.explorer?.visualState === 'scanning' ||
                              context?.droneFleet?.drones?.explorer?.visualState === 'returning';
      
      if (isDroneExploring) {
        // Le drone est en cours d'exploration, ne pas interférer avec les événements du vaisseau
        return;
      }

      const handlers = createShipHandlers({ fsmSend: send, botId, shipType });
      const vehicle = context?.vehicle;
      const vehicleVisualState = vehicle?.visualState;
      if (!vehicle) return;

      let distance = Infinity;
      switch (vehicleVisualState) {
        case "uninitialized":
          // Utiliser le handler d'initialisation au début du jeu
          handlers.initializeHandler.process(position);
          break;
        case "moving":
          if (vehicle.targetTile) {
            distance = calculateDistance(position, gridToWorld(vehicle.targetTile.coord));
            if (distance !== Infinity) {
              handlers.movingToTileHandler.process(distance, position);
            }
          }
          break;
        case "collecting":
          handlers.collectingHandler.process(0, position);
          break;
        case "returning":
          if (vehicle.basePosition) {
            distance = calculateDistance(position, vehicle.basePosition);
            if (distance !== Infinity) {
              handlers.returningHandler.process(distance, position);
            }
          }
          break;
        case "docked":
        case "maintenance":

          break;
        default:
          // État non géré
          break;
      }
    },
    [context, send, botId, shipType, calculateDistance, gridToWorld]
  );

  return updatePosition;
};
