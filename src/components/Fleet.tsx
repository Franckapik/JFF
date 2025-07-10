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

import React, { useCallback, useEffect, useRef } from "react";

// === Hooks & Store Imports ===
import { useDroneTracker } from "../ai/fsm/hooks/trackers/drone/useDroneTracker";
import { useXFSMShipTracker } from "../ai/fsm/hooks/trackers/ship/useXFSMShipTracker";
import { useDroneAnimation } from "../animations/useDroneAnimation";
import { useShipAnimation } from "../animations/useShipAnimation.js";
import useGameStore from "../stores/useGameStore";
import useXFSMStore from "../stores/useXFSMStore/index.ts";

// === Logger ===
import fsmLogger from "../logger/fsmLogger.ts";

// === Types ===
import type { FSMContext } from "../types/fsm.d";
import type { FleetProps } from "../types/r3f";

// === Mesh Components ===
import DroneMesh from "./Vehicles/DroneMesh";
import ShipMesh from "./Vehicles/ShipMesh";

import { GameStoreType, XFSMStoreType } from "@/types/index.js";

const Fleet: React.FC<FleetProps> = React.memo(({
  botId,
  shipPosition ,
  dronePosition ,
  color = "red",
  tileCoord: _tileCoord
}) => {
  // === FSM Context & Send ===
  const botState = useXFSMStore((state: XFSMStoreType) => state.botStates[botId]);
  const context = (botState && 'context' in botState) ? (botState as { context: FSMContext }).context : undefined;
  const send = useXFSMStore((state: XFSMStoreType) => state.send);

  if (typeof send !== 'function') {
    throw new Error('Invalid send function provided to Fleet');
  }

  const fsmSend = useCallback((event: { type: string; [key: string]: unknown }) => {
    send(event, botId);
  }, [send, botId]);

  // === Initialisation automatique des positions (une seule fois) ===
  const isFleetPositionsInitialized = useGameStore((state: GameStoreType) => state.isFleetPositionsInitialized(botId));
  const markFleetPositionsAsInitialized = useGameStore((state: GameStoreType) => state.markFleetPositionsAsInitialized);
  useEffect(() => {
    if (!isFleetPositionsInitialized && shipPosition && dronePosition && fsmSend) {
      fsmSend({ type: 'SHIP_POSITION_UPDATE', position: shipPosition, shipType: 'ship' });
      fsmSend({ type: 'DRONE_POSITION_UPDATE', position: dronePosition, droneType: 'explorer' });
      markFleetPositionsAsInitialized(botId);
      fsmLogger.game(`[Fleet] Initial positions set for ${botId}`);
    }
  }, [isFleetPositionsInitialized, shipPosition, dronePosition, fsmSend, botId, markFleetPositionsAsInitialized]);

  // === Trackers & Animations ===
  //Le tracker transofrme la logique FSM en logique R3F et retourne une position visuelle
  const updateDroneVisualPosition = useDroneTracker({
    context: context || {} as FSMContext,
    send: fsmSend,
    botId,
    droneType: 'explorer',
    position: dronePosition || { x: 0, y: 0, z: 0 },
    initialPositionSent: useRef(false)
  });
  const updateShipVisualPosition = useXFSMShipTracker(context || {} as FSMContext, fsmSend, botId, 'ship');

  //La position visuelle est utilisée par l'animation et est retournée via useRef
  const { droneRef, initialPosition, droneState } = useDroneAnimation(
    context || {} as FSMContext, shipPosition, updateDroneVisualPosition, 'explorer', true
  );
  const { shipRef, currentAction, isMoving } = useShipAnimation(
    context || {} as FSMContext, shipPosition, updateShipVisualPosition, true
  );

  // === Render ===
  return (
    <>
      {/* Ship (main vessel) - relative to parent group */}
      <group ref={shipRef}>
        <ShipMesh
          color={color}
          botId={botId}
          context={context}
          currentAction={currentAction}
          isMoving={isMoving}
        />
      </group>

      {/* Drone explorer - relative position with initial offset */}
      <group
        ref={droneRef}
        position={[
          initialPosition.x, // explorer offset: [0.5, 0.3, 0.5]
          initialPosition.y,
          initialPosition.z
        ]}
      >
        <DroneMesh
          color={color}
          botId={botId}
          context={context}
          droneState={{
            id: `${botId}-explorer`,
            type: 'explorer',
            state: droneState,
            position: { x: initialPosition.x, y: initialPosition.y, z: initialPosition.z },
            targetPosition: { x: 0, y: 0, z: 0 },
            missionTarget: { type: 'tile', coord: '0,0' },
            isActive: true,
            lastUpdate: Date.now()
          }}
          droneType="explorer"
        />
      </group>
    </>
  );
}, (prevProps: FleetProps, nextProps: FleetProps) => {
  // === Mémo : évite les re-renders inutiles ===
  return (
    prevProps.botId === nextProps.botId &&
    prevProps.color === nextProps.color &&
    prevProps.shipPosition?.x === nextProps.shipPosition?.x &&
    prevProps.shipPosition?.y === nextProps.shipPosition?.y &&
    prevProps.shipPosition?.z === nextProps.shipPosition?.z &&
    prevProps.dronePosition?.x === nextProps.dronePosition?.x &&
    prevProps.dronePosition?.y === nextProps.dronePosition?.y &&
    prevProps.dronePosition?.z === nextProps.dronePosition?.z
  );
});

Fleet.displayName = 'Fleet';
export default Fleet;
