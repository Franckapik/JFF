import { Cone } from "@react-three/drei";
import React from "react";

// Types
import type { VehicleId } from "../../types";
import type { FSMContext } from "../../types/fsm";

/**
 * Interface pour l'état du drone
 */
interface DroneState {
  /** État actuel du drone */
  state: string;
}

/**
 * Props interface for DroneMesh component
 */
interface DroneMeshProps {
  /** Couleur du drone */
  color: string;
  /** ID du bot FSM */
  botId: VehicleId;
  /** Contexte FSM pour l'état du drone */
  context?: FSMContext;
  /** État du drone */
  droneState: DroneState;
  /** Type de drone */
  droneType?: string;
}

/**
 * Types d'états de drone
 */
type DroneStateType = 
  | 'exploring'
  | 'returning'
  | 'deploying'
  | 'idle';

const DroneMesh: React.FC<DroneMeshProps> = ({ 
  color, 
  botId, 
  context, 
  droneState, 
  droneType = 'explorer' 
}) => {
  return (
    <>
      <Cone 
        args={[0.15, 0.4, 8]} 
        rotation={[Math.PI, 0, 0]}
        castShadow
      >
        {/* @ts-ignore - React Three Fiber elements */}
        <meshStandardMaterial 
          color={color}
          // État FSM → Couleur émissive
          emissive={
            droneState.state === 'exploring' ? color : 
            "black"
          }
          emissiveIntensity={
            droneState.state === 'exploring' ? 0.8 : 
            0.2
          }
        />
      </Cone>
    </>
  );
};

export default DroneMesh;
