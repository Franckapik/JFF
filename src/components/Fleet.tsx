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
import { useXFSMShipTracker } from "../ai/fsm/hooks/trackers/ship/useXFSMShipTracker";
import { useDroneAnimation } from "../animations/useDroneAnimation";
import { useShipAnimation } from "../animations/useShipAnimation.js";
import useXFSMStore from "../stores/useXFSMStore/index.ts";

// === Types ===
import type { FSMContext } from "../types/fsm.d";
import type { FleetProps } from "../types/r3f";

import DroneMesh from "./Vehicles/DroneMesh";
import ShipMesh from "./Vehicles/ShipMesh";

import { XFSMStoreType } from "@/types/index.js";

const Fleet: React.FC<FleetProps> = React.memo(({ botId, shipPosition, color = "red", tileCoord: _tileCoord }) => {
  // === FSM Context & Send ===
  const botState = useXFSMStore((state: XFSMStoreType) => state.botStates[botId]);
  const context = (botState && 'context' in botState) ? (botState as { context: FSMContext }).context : undefined;
  const send = useXFSMStore((state: XFSMStoreType) => state.send);

  const fsmSend = useCallback((event: { type: string; [key: string]: unknown }) => {
    send(event, botId);
  }, [send, botId]);

  // === Trackers & Animations ===
  const dronePosition = useDroneTracker({
    context: context || {} as FSMContext,
    send: fsmSend,
    botId,
    droneType: 'explorer',
    position: { x: 0, y: 0, z: 0 }
  });
  const updateShipVisualPosition = useXFSMShipTracker(context || {} as FSMContext, fsmSend, botId, 'ship');

  const { droneRef, droneState } = useDroneAnimation(
    context || {} as FSMContext, shipPosition, () => dronePosition, 'explorer', true
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
          dronePosition?.x || 0,
          dronePosition?.y || 0,
          dronePosition?.z || 0
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
            position: dronePosition || { x: 0, y: 0, z: 0 },
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
    prevProps.shipPosition?.z === nextProps.shipPosition?.z
  );
});

Fleet.displayName = 'Fleet';
export default Fleet;
