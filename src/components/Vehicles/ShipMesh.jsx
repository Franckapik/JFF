import React from "react";
import { Html } from "@react-three/drei";

const ShipMesh = ({ color, botId, context, currentAction, isMoving }) => {
  return (
    <mesh position={[0, 0, 0]} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color={color} 
        // Couleur émissive selon l'action
        emissive={
          currentAction === 'collecting' ? "#32CD32" :  // Vert pour collecte
          currentAction === 'refueling' ? "#1E90FF" :   // Bleu pour refuel  
          isMoving ? "#FFD700" :                       // Or pour mouvement
          "black"
        }
        emissiveIntensity={
          currentAction === 'collecting' ? 0.3 :
          currentAction === 'refueling' ? 0.4 :
          isMoving ? 0.2 :
          0.1
        }
      />
      
      {/* ID LABEL - Vaisseau principal avec état */}
      <Html position={[0, 0.4, 0]} center>
        <div style={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: '10px', 
          background: 'rgba(0,0,0,0.6)', 
          padding: '2px 6px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          textAlign: 'center'
        }}>
          <div>{context?.vehicle?.id || `${botId}-ship`}</div>
          {currentAction && (
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)' }}>
              {currentAction.toUpperCase()}
            </div>
          )}
        </div>
      </Html>
    </mesh>
  );
};

export default ShipMesh;
