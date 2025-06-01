import React, { useRef, useMemo } from "react";
import { Cone, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useFSMDroneState } from "../hooks/useFSMDroneState.js";

/**
 * =================================================================
 * Composant Fleet - Lien FSM → Animation Drone (Version Minimale)
 * =================================================================
 * Démontre le pipeline : FSM State → Position → Animation Three.js
 * 
 * @param {Object} props
 * @param {string} props.botId - ID du bot FSM (ex: 'fsm-bot-0')  
 * @param {string} props.shipPosition - Position du vaisseau {x,y,z}
 * @param {string} props.color - Couleur des drones
 */
const Fleet = React.memo(({ 
  botId, 
  shipPosition = { x: 0, y: 0, z: 0 },
  color = "red"
}) => {
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
  
  // 3. Position finale du drone explorateur
  const explorerPosition = dronePositions.explorer || shipPosition;

  // ===================================================================
  // ANIMATION BASÉE SUR L'ÉTAT FSM
  // ===================================================================
  
  useFrame(() => {
    if (!explorerDroneRef.current) return;
    
    const droneState = getDroneVisualState('explorer');
    const time = Date.now() * 0.001;
    
    // Animation différente selon l'état FSM
    switch (droneState) {
      case 'docked':
        // Rotation lente en formation
        explorerDroneRef.current.rotation.y = time * 0.5;
        break;
        
      case 'exploring':
        // Oscillation plus rapide en exploration
        explorerDroneRef.current.rotation.y = time * 2;
        explorerDroneRef.current.position.y = explorerPosition.y + Math.sin(time * 3) * 0.2;
        break;
        
      case 'returning':
        // Mouvement de retour
        explorerDroneRef.current.rotation.y = time * -1;
        break;
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
            emissive={getDroneVisualState('explorer') === 'exploring' ? color : "black"}
            emissiveIntensity={getDroneVisualState('explorer') === 'exploring' ? 0.8 : 0.2}
          />
        </Cone>
        
        {/* DEBUG: État FSM en temps réel - DÉMONSTRATION PÉDAGOGIQUE */}
        {drones.explorer && (
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
                {getDroneVisualState('explorer') === 'exploring' ? '🔍' : 
                 getDroneVisualState('explorer') === 'returning' ? '🏠' : '🛡️'}
              </div>
              <div style={{ fontSize: '14px' }}>
                FSM: {getDroneVisualState('explorer')}
              </div>
              {isDroneMoving('explorer') && (
                <div style={{ fontSize: '12px', color: '#00ff00' }}>
                  ✈️ MOVING
                </div>
              )}
            </div>
          </Html>
        )}
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