import React, { useCallback, useEffect } from "react";
import { useXFSMDroneTracker } from "../ai/fsm/hooks/trackers/drone/useXFSMDroneTracker";
import { useXFSMShipTracker } from "../ai/fsm/hooks/trackers/ship/useXFSMShipTracker";
import { useDroneAnimation } from "../animations/useDroneAnimation";
import { useShipAnimation } from "../animations/useShipAnimation.js";
import fsmLogger from "../logger/fsmLogger.js";
import useGameStore from "../stores/useGameStore";
import useXFSMStore from "../stores/useXFSMStore/index.ts";
import DroneMesh from "./Vehicles/DroneMesh";
import ShipMesh from "./Vehicles/ShipMesh";

// Types
import type { VehicleId, WorldPosition } from "../types";
import type { TileCoordinate } from "../types/coordinates";
import "../types/r3f.d.ts"; // Import R3F types

/**
 * Props interface for Fleet component
 */
interface FleetProps {
  /** ID du bot FSM (ex: 'bot-0') */
  botId: VehicleId;
  /** Position mondiale du vaisseau {x,y,z} */
  shipPosition: WorldPosition;
  /** Position mondiale du drone {x,y,z} */
  dronePosition: WorldPosition;
  /** Couleur des véhicules */
  color: string;
  /** Coordonnée de la tuile de départ */
  tileCoord: TileCoordinate;
}

/**
 * =================================================================
 * Composant Fleet - Architecture Simplifiée
 * =================================================================
 * 
 * ✅ LOGIQUE SIMPLIFIÉE :
 * - Scene conditionne l'affichage de Fleet quand le bot est actif
 * - Scene calcule et passe les positions ship et drone
 * - Fleet initialise automatiquement les positions au premier rendu (une seule fois)
 * - Trackers et animations toujours actifs
 * - Logging minimal
 */
const Fleet: React.FC<FleetProps> = React.memo(({ 
  botId, 
  shipPosition = { x: 0, y: 0, z: 0 },
  dronePosition = { x: 0.5, y: 0.8, z: 0.5 },
  color = "red",
  tileCoord
}) => {
  // ===================================================================
  // 🚀 ACCÈS DIRECT AU STORE XFSM
  // ===================================================================
  
  // Accès direct au context FSM et à la fonction send
  const botState = useXFSMStore((state) => state.botStates[botId]);
  const context = (botState && 'context' in botState) ? (botState as any).context : undefined;
  const send = useXFSMStore((state) => state.send);
  
  // Fonction send spécifique au bot
  const fsmSend = useCallback((event: any) => {
    send(event, botId);
  }, [send, botId]);
  
  // ===================================================================
  // 🚀 INITIALISATION AUTOMATIQUE DES POSITIONS - UNE SEULE FOIS
  // ===================================================================
  
  // Vérifier si les positions sont déjà initialisées via le store
  const isFleetPositionsInitialized = useGameStore((state) => state.isFleetPositionsInitialized(botId));
  const markFleetPositionsAsInitialized = useGameStore((state) => state.markFleetPositionsAsInitialized);

  // Initialisation automatique des positions au premier rendu
  useEffect(() => {
    if (!isFleetPositionsInitialized && shipPosition && dronePosition && fsmSend) {
      // Envoyer les positions initiales au contexte FSM
      fsmSend({ 
        type: 'SHIP_POSITION_UPDATE', 
        position: shipPosition,
        shipType: 'ship'
      });
      
      fsmSend({ 
        type: 'DRONE_POSITION_UPDATE', 
        position: dronePosition,
        droneType: 'explorer'
      });
      
      markFleetPositionsAsInitialized(botId);
      fsmLogger.game(`[Fleet] Initial positions set for ${botId}`);
    }
  }, [isFleetPositionsInitialized, shipPosition, dronePosition, fsmSend, botId, markFleetPositionsAsInitialized]);

  // 🎯 TRACKERS ET ANIMATIONS - TOUJOURS ACTIFS
  const updateDroneVisualPosition = useXFSMDroneTracker(context, fsmSend, botId, 'explorer');
  const updateShipVisualPosition = useXFSMShipTracker(context, fsmSend, botId, 'ship');
  
  const { droneRef, initialPosition, droneState } = useDroneAnimation(
    context, shipPosition, updateDroneVisualPosition, 'explorer', true
  );
  const { shipRef, currentAction, isMoving } = useShipAnimation(
    context, shipPosition, updateShipVisualPosition, true
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
      {/* @ts-ignore - React Three Fiber elements */}
      <group ref={shipRef}>
        <ShipMesh 
          color={color} 
          botId={botId} 
          context={context}
          currentAction={currentAction}
          isMoving={isMoving}
        />
      {/* @ts-ignore */}
      </group>

      {/* 🚁 DRONE EXPLORATEUR - Position relative avec offset initial */}
      {/* @ts-ignore - React Three Fiber elements */}
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
          droneState={{ state: droneState }}
          droneType="explorer"
        />
      {/* @ts-ignore */}
      </group>
    </>
  );
}, (prevProps: FleetProps, nextProps: FleetProps) => {
  // 🚀 OPTIMISATION MÉMOIRE - Évite les re-renders inutiles
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
