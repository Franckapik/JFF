import React, { useCallback, useEffect } from "react";

import { useXFSMDroneTracker } from "../ai/fsm/hooks/trackers/drone/useXFSMDroneTracker";
import { useXFSMShipTracker } from "../ai/fsm/hooks/trackers/ship/useXFSMShipTracker";
import { useDroneAnimation } from "../animations/useDroneAnimation";
import { useShipAnimation } from "../animations/useShipAnimation.js";
import useGameStore from "../stores/useGameStore";
import useXFSMStore from "../stores/useXFSMStore/index.ts";

import type { FSMContext } from "../types/fsm.d";
import type { FleetProps } from "../types/r3f";

import DroneMesh from "./Vehicles/DroneMesh";

import ShipMesh from "./Vehicles/ShipMesh";

import { GameStoreType, XFSMStoreType } from "@/types/index.js";


const Fleet: React.FC<FleetProps> = ({ 
  botId, 
  color = "red",
  tileCoord: _tileCoord
}) => {
  // ===================================================================
  // 🚀 ACCÈS DIRECT AU STORE XFSM
  // ===================================================================
  
  // Accès direct au context FSM et à la fonction send
  const botState = useXFSMStore((state : XFSMStoreType) => state.botStates[botId]);
  const context = (botState && 'context' in botState) ? (botState as { context: FSMContext }).context : undefined;
  const send = useXFSMStore((state: XFSMStoreType) => state.send);

  // Fonction send spécifique au bot
  const fsmSend = useCallback((event: { type: string; [key: string]: unknown }) => {
    send(event, botId);
  }, [send, botId]);
  
  // ===================================================================
  // 🚀 INITIALISATION AUTOMATIQUE DES POSITIONS - UNE SEULE FOIS
  // ===================================================================
  
  // Vérifier si les positions sont déjà initialisées via le store
  const isFleetPositionsInitialized = useGameStore((state: GameStoreType) => state.isFleetPositionsInitialized(botId));
  const markFleetPositionsAsInitialized = useGameStore((state: GameStoreType) => state.markFleetPositionsAsInitialized);

  // Initialisation automatique des positions au premier rendu
  useEffect(() => {
    if (!isFleetPositionsInitialized && fsmSend) {
      // Utilise la position du contexte FSM ou une valeur par défaut
      const initialShipPosition = context?.vehicle?.position || { x: 0, y: 0.5, z: 0 };
      fsmSend({ 
        type: 'SHIP_POSITION_UPDATE', 
        position: initialShipPosition,
        shipType: 'ship'
      });
      const initialDronePosition = context?.droneFleet?.drones?.explorer?.position || { x: 0.5, y: 0.8, z: 0.5 };
      fsmSend({ 
        type: 'DRONE_POSITION_UPDATE', 
        position: initialDronePosition,
        droneType: 'explorer'
      });
      markFleetPositionsAsInitialized(botId);
    }
  }, [isFleetPositionsInitialized, fsmSend, botId, markFleetPositionsAsInitialized, context]);

  // 🎯 TRACKERS ET ANIMATIONS - TOUJOURS ACTIFS
  const dronePositionToTracker = useXFSMDroneTracker(context || {} as FSMContext, fsmSend, botId, 'explorer');
  const shipPositionToTracker = useXFSMShipTracker(context || {} as FSMContext, fsmSend, botId, 'ship');
  
  const { droneRef, initialPosition, droneState } = useDroneAnimation(
    context || {} as FSMContext, context?.vehicle?.position || { x: 0, y: 0.5, z: 0 }, dronePositionToTracker, 'explorer', true
  );
  const { shipRef, currentAction, isMoving } = useShipAnimation(
    context || {} as FSMContext, context?.vehicle?.position || { x: 0, y: 0.5, z: 0 }, shipPositionToTracker, true
  );

  // ===================================================================
  // 🎨 RENDU VISUEL - POSITIONNEMENT RELATIF OPTIMISÉ
  // ===================================================================
  // 
  // ⚡ ARCHITECTURE DE POSITIONNEMENT :
  // - Scene.tsx place Fleet dans un <group position={[tileX, 0.5, tileZ]}>
  // - Fleet utilise des positions relatives [0,0,0] pour éviter double transformation
  // - Animations calculent coordonnées locales puis envoient coordonnées mondiales aux trackers
  
  return (
    <>
      {/* 🚢 VAISSEAU PRINCIPAL - Position relative au group parent */}
      <group ref={shipRef}>
        <ShipMesh 
          color={color} 
          botId={botId} 
          context={context}
          currentAction={currentAction}
          isMoving={isMoving}
        />
      </group>

      {/* 🚁 DRONE EXPLORATEUR - Position relative avec offset initial */}
      <group 
        ref={droneRef}
        position={[
          initialPosition.x, // Offset relatif : explorer = [0.5, 0.3, 0.5]
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
};

export default Fleet;
