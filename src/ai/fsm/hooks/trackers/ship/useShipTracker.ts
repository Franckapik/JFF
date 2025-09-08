import { useCallback } from "react";

import { useTileStore } from "../../../../../stores/useTileStore/index";

import type { WorldPosition } from "../../../../../types/coordinates.d.ts";
import type { FSMContext } from "../../../../../types/fsm.d.ts";
import type { TileStoreType } from "../../../../../types/stores.d.ts";
import type { XStateSend } from "../../../../../types/tracker.d.ts";

import fsmLogger from "../../../../../logger/fsmLogger.ts";
// DEBUG: seuil ajusté pour correspondre au collectingRadius FSM

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
      // Synchronisation de position avec le contexte FSM (optimisée)
      send({
        type: 'SHIP_POSITION_UPDATE',
        position,
        shipType
      });

      // Traitement prioritaire des handlers pour les états de mouvement
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
        case "moving_to_tile":
          if (vehicle.targetVehicleTile && vehicle.targetVehicleTile.position) {
            // FIX: Utiliser directement la position FSM de la tuile, pas la conversion gridToWorld
            const targetPosition = vehicle.targetVehicleTile.position;
            distance = calculateDistance(position, targetPosition);
            if (distance !== Infinity) {
              handlers.movingToTileHandler.process(distance, position);
            }
          } else {
            fsmLogger.warn(`🚢 [${botId}] No target tile for moving`, { vehicle: vehicle.targetVehicleTile });
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
