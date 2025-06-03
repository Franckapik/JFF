import React, { useRef, useMemo, useEffect } from "react";
import { Cone, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFSMDroneState } from "../hooks/useFSMDroneState.js";
import { movementEvents } from "../ai/fsm/machine/events/movementEvents.js";
import { useBotMachineFixed } from "../ai/fsm/hooks/useBotMachineFixed.js";
import fsmLogger from "../logger/fsmLogger.js";

/**
 * =================================================================
 * Composant Fleet - Lien FSM → Animation Drone (Version Minimale)
 * =================================================================
 * Démontre le pipeline : FSM State → Position → Animation Three.js
 * 
 * @param {Object} props
 * @param {string} props.botId - ID du bot FSM (ex: 'fsm-bot-0')  
 * @param {number} props.botIndex - Index du bot pour la compatibilité
 * @param {Object} props.shipPosition - Position du vaisseau {x,y,z}
 * @param {string} props.color - Couleur des drones
 * @param {string} props.tileCoord - Coordonnée de la tuile de départ
 */
const Fleet = React.memo(({ 
  botId, 
  botIndex,
  shipPosition = { x: 0, y: 0, z: 0 },
  color = "red",
  tileCoord
}) => {
  // ===================================================================
  // FSM INTEGRATION - Hook autonome sans logique React
  // ===================================================================
  
  // Le hook gère autonomiquement la synchronisation de position
  const { current, send: fsmSend, context, vehicle, state } = useBotMachineFixed(botId, 'bot');

  // DEBUG: Afficher les données FSM reçues
  useEffect(() => {
    if (context) {
      console.log(`[Fleet] Debug for bot ${botId}:`, {
        vehiclePosition: context.vehicle?.position,
        droneFleet: context.droneFleet,
        explorerDrone: context.droneFleet?.drones?.explorer
      });
    }
  }, [botId, context]);

  // ===================================================================
  // RÉFÉRENCES POUR L'ANIMATION
  // ===================================================================
  
  const explorerDroneRef = useRef();

  // ===================================================================
  // PIPELINE FSM → ANIMATION
  // ===================================================================
  
  // 1. Récupérer l'état FSM des drones
  const {
    drones,
    calculateDronePositions,
    getDroneVisualState,
    isDroneMoving
  } = useFSMDroneState(botId);
  
  // 2. Calculer les positions basées sur l'état FSM
  const dronePositions = useMemo(() => {
    return calculateDronePositions(shipPosition);
  }, [shipPosition, calculateDronePositions]);
  
  // 3. États et positions du drone explorateur
  const explorerState = getDroneVisualState('explorer');
  const isExplorerMoving = isDroneMoving('explorer');
  
  // Position du drone : utiliser la position FSM, sinon fallback sur shipPosition
  const explorerPosition = useMemo(() => {
    if (context?.droneFleet?.drones?.explorer?.position) {
      return context.droneFleet.drones.explorer.position;
    }
    if (dronePositions.explorer) {
      return dronePositions.explorer;
    }
    // Fallback : position du vaisseau avec un petit offset pour voir le drone
    return {
      x: shipPosition.x + 0.5,
      y: shipPosition.y + 0.3,
      z: shipPosition.z + 0.5
    };
  }, [context?.droneFleet?.drones?.explorer?.position, dronePositions.explorer, shipPosition]);

  // ===================================================================
  // ANIMATION FLUIDE BASÉE SUR L'ÉTAT FSM
  // ===================================================================
  
  // Animation automatique basée sur les changements de contexte
  useFrame((state, delta) => {
    if (!explorerDroneRef.current) return;
    
    // Position cible depuis le contexte FSM (mise à jour via DRONE_POSITION_UPDATE)
    const targetPosition = explorerPosition;
    const currentPosition = explorerDroneRef.current.position;
    
    // Animation fluide vers la nouvelle position
    if (isExplorerMoving) {
      const speed = delta * 3; // Vitesse d'interpolation
      currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, targetPosition.x, speed);
      currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, targetPosition.y, speed);
      currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, targetPosition.z, speed);
      
      // Rotation continue pendant le mouvement
      explorerDroneRef.current.rotation.y += delta * 2;
    }
    
    // Animation idle quand le drone est en attente
    if (explorerState === 'docked') {
      explorerDroneRef.current.rotation.y += delta * 0.5;
      explorerDroneRef.current.position.y = shipPosition.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    
    // Animation d'exploration active
    if (explorerState === 'exploring') {
      // Oscillation légère pour simuler le mouvement de recherche
      explorerDroneRef.current.position.y = targetPosition.y + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      explorerDroneRef.current.rotation.y += delta * 1.5;
      
      // Exemple de déclenchement automatique de mise à jour de position
      if (fsmSend && Math.random() < 0.005) { // 0.5% de chance par frame
        // Générer une nouvelle position d'exploration
        const newPosition = {
          x: shipPosition.x + (Math.random() - 0.5) * 20,
          y: shipPosition.y + 1 + Math.random() * 3,
          z: shipPosition.z + (Math.random() - 0.5) * 20
        };
        
        // Déclencher la mise à jour via FSM
        const positionEvent = movementEvents.createDronePositionUpdateEvent(newPosition, 'explorer', 'exploring');
        fsmSend(positionEvent); // ← Utilise le send du hook FSM
      }
    }
  });

  // ===================================================================
  // VISUEL SIMPLE - UN DRONE POUR DÉMONSTRATION
  // ===================================================================
  
  return (
    <>
      {/* VAISSEAU PRINCIPAL */}
      <mesh position={[shipPosition.x, shipPosition.y, shipPosition.z]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* DRONE EXPLORATEUR - Exemple du pipeline FSM → Animation */}
      <group 
        ref={explorerDroneRef}
        position={[explorerPosition.x, explorerPosition.y, explorerPosition.z]}
      >
        <Cone 
          args={[0.15, 0.4, 8]} 
          rotation={[Math.PI, 0, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color={color}
            // État FSM → Couleur émissive
            emissive={explorerState === 'exploring' ? color : "black"}
            emissiveIntensity={explorerState === 'exploring' ? 0.8 : 0.2}
          />
        </Cone>
        
        {/* DEBUG: État FSM en temps réel - TOUJOURS AFFICHÉ POUR DEBUG */}
        <Html position={[0, 0.8, 0]} center>
          <div style={{ 
            color: 'white', 
            fontSize: '16px', 
            background: 'rgba(0,0,0,0.9)', 
            padding: '8px 12px', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            border: '2px solid ' + color,
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>
              {explorerState === 'exploring' ? '🔍' : 
               explorerState === 'returning' ? '🏠' : '🛡️'}
            </div>
            <div style={{ fontSize: '14px' }}>
              🚁 {explorerState?.toUpperCase() || 'UNKNOWN'}
              <br />
              {isExplorerMoving ? '📍 Moving' : '⚡ Idle'}
              <br />
              <span style={{ fontSize: '12px' }}>
                Pos: {explorerPosition.x?.toFixed(1)},{explorerPosition.z?.toFixed(1)}
              </span>
            </div>
          </div>
        </Html>
      </group>
    </>
  );
}, (prevProps, nextProps) => {
  // Optimisation mémoire simple
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