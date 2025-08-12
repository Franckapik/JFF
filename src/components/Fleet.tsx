/**
 * Fleet
 * -----
 * Affiche et anime le vaisseau principal et le drone explorateur pour un bot donné.
 * Utilise le contexte FSM comme source de vérité pour les positions et états.
 *
 * Architecture :
 * - Scene.tsx place <Fleet /> dans un <group position={[tileX, 0.5, tileZ]}>
 * - Fleet utilise des positions relatives [0,0,0] (pas de double transformation)
 * - Les animations calculent les coordonnées locales puis mettent à jour le store FSM
 */

import React, { useCallback } from "react";

// === Hooks & Store Imports ===
import { useDroneTracker } from "../ai/fsm/hooks/trackers/drone/useDroneTracker";
import { useShipTracker } from "../ai/fsm/hooks/trackers/ship/useShipTracker";
import { useDroneAnimation } from "../animations/useDroneAnimation";
import { useShipAnimation } from "../animations/useShipAnimation";
import useXFSMStore from "../stores/useXFSMStore/index.ts";

// === Types ===
import type { FSMContext } from "../types/fsm.d";
import type { FleetProps } from "../types/r3f";

import useGameStore from "../stores/useGameStore";

import DroneMesh from "./Vehicles/DroneMesh";
import ShipMesh from "./Vehicles/ShipMesh";

import { XFSMStoreType } from "@/types/index.js";


const Fleet: React.FC<FleetProps> = React.memo(({ botId, fleetPosition, tileCoord: _tileCoord }) => {
  // Récupérer la couleur du bot ici
  const getBotColorById = useGameStore(state => state.getBotColorById);
  const color = getBotColorById(botId);
  // === FSM Context & Send ===
  const botState = useXFSMStore((state: XFSMStoreType) => state.botStates[botId]);
  const context = (botState && 'context' in botState) ? (botState as { context: FSMContext }).context : undefined;
  const send = useXFSMStore((state: XFSMStoreType) => state.send);


  const fsmSend = useCallback((event: { type: string;[key: string]: unknown }) => {
    send(event, botId);
  }, [send, botId]);

  // === Trackers & Animations pilotées par le contexte FSM ===
  // Le tracker gère uniquement les handlers/événements FSM
  const updateDronePosition = useDroneTracker({
    context: context || {} as FSMContext,
    send: fsmSend,
    botId,
    droneType: 'explorer'
  });
  
  // === Ship Tracker ===
  const updateShipVisualPosition = useShipTracker({
    context,
    send: fsmSend,
    botId,
    shipType: 'main-ship',
    fleetPosition: fleetPosition, // 🆕 Position initiale du vaisseau depuis Scene
  });
  
  // === Drone Animation ===
  const droneType = 'explorer';
  const isDroneActive = !!context?.droneFleet?.drones?.[droneType]?.isActive;
  const isDroneMoving = !!context?.droneFleet?.drones?.[droneType]?.isMoving;

  const { droneRef, droneState } = useDroneAnimation({
    context: context || {} as FSMContext,
    fleetPosition: fleetPosition,
    updateVisualPosition: updateDronePosition,
    droneType,
    isActive: isDroneActive,
    isMoving: isDroneMoving,
  });
  
  // === Ship Animation ===
  const { shipRef, shipState } = useShipAnimation({
    context: context || {} as FSMContext,
    fleetPosition: fleetPosition, // Position mondiale du vaisseau pour l'initialisation
    updateVisualPosition: updateShipVisualPosition,
    shipType: 'main-ship',
    isActive: true,
    isMoving: context?.vehicle?.isMoving || false,
  });

  // === Render ===
  return (
    <>
      {/* Ship (main vessel) - position pilotée par le contexte FSM */}
      <ShipMesh
        color={color}
        botId={botId}
        context={context}
        send={fsmSend}
        currentAction={shipState}
        meshRef={shipRef}
        botStateValue={context?.currentState ?? "unknown"}
      />

      {/* Drone explorer - position pilotée par le contexte FSM */}
      <DroneMesh
        color={color}
        botId={botId}
        context={context}
        droneVisualState={droneState}
        droneType="explorer"
        meshRef={droneRef}
      />
    </>
  );
}, (prevProps: FleetProps, nextProps: FleetProps) => {
  // === Mémo : évite les re-renders inutiles ===
  return (
    prevProps.botId === nextProps.botId &&
    prevProps.fleetPosition?.x === nextProps.fleetPosition?.x &&
    prevProps.fleetPosition?.y === nextProps.fleetPosition?.y &&
    prevProps.fleetPosition?.z === nextProps.fleetPosition?.z
  );
});

Fleet.displayName = 'Fleet';
export default Fleet;
