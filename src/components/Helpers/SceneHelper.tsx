import { Html } from "@react-three/drei";
import React from "react";

import { config } from '../../config';
import { useFSMState } from '../../hooks/useFSMState';

const SceneHelper: React.FC = () => {
  // Utilise le hook personnalisé pour une surveillance robuste de l'état FSM
  const { fsmState, lastAction, entityType, botId, lastUpdate } = useFSMState();
  
  if (!config.showHelpers.scene) return null;

  // Debug: timestamp pour voir si le composant se re-rend
  const now = new Date(lastUpdate).toLocaleTimeString();

  return (
    <Html 
      position={[0, 8, 0]} 
      center 
      distanceFactor={15}
      style={{ pointerEvents: 'none' }}
    >
      <div style={{
        background: "rgba(20, 20, 20, 0.9)",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "500",
        fontFamily: "monospace",
        userSelect: "none",
        pointerEvents: "none",
        border: "1px solid #444",
        textAlign: "center",
        minWidth: "200px",
        backdropFilter: "blur(4px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
      }}>
        <div style={{ 
          fontSize: "14px", 
          opacity: 0.8, 
          marginBottom: "4px" 
        }}>
          FSM State Machine
        </div>
        <div style={{ 
          fontSize: "18px", 
          fontWeight: "bold",
          color: "#4CAF50",
          marginBottom: "2px"
        }}>
          {fsmState}
        </div>
        <div style={{ 
          fontSize: "12px", 
          opacity: 0.7,
          display: "flex",
          justifyContent: "space-between",
          gap: "16px"
        }}>
          <span>Entity: {entityType}</span>
          <span>Action: {lastAction}</span>
        </div>
        <div style={{ 
          fontSize: "10px", 
          opacity: 0.5,
          marginTop: "4px",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          paddingTop: "4px"
        }}>
          Bot: {botId} | Last update: {now}
        </div>
      </div>
    </Html>
  );
};

export default SceneHelper;
