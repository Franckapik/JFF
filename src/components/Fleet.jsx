import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Cone, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { movementEvents } from "../ai/fsm/machine/events/movementEvents.js";
import { useBotMachineFixed } from "../ai/fsm/hooks/useBotMachineFixed.js";

/**
 * =================================================================
 * Composant Fleet - Lien FSM → Animation Drone (Version Minimale)
 * =================================================================
 * Démontre le pipeline : FSM State → Position → Animation Three.js
 * 
 * @param {Object} props
 * @param {string} props.botId - ID du bot FSM (ex: 'bot-0')  
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
  // PIPELINE FSM DIRECT → ANIMATION (DEBUG SIMPLIFIE + OPTIMISE)
  // ===================================================================
  
  // 🔍 Mémorisation du drone explorer pour éviter les re-calculs
  const explorerDrone = useMemo(() => 
    context?.droneFleet?.drones?.explorer, 
    [context?.droneFleet?.drones?.explorer]
  );
  
  // États calculés et mémorisés
  const droneState = useMemo(() => ({
    state: explorerDrone?.state || 'docked',
    isActive: explorerDrone?.isActive || false,
    position: explorerDrone?.position,
    targetPosition: explorerDrone?.targetPosition
  }), [
    explorerDrone?.state, 
    explorerDrone?.isActive, 
    explorerDrone?.position, 
    explorerDrone?.targetPosition
  ]);
  
  const isExplorerMoving = useMemo(() => 
    droneState.state === 'deploying' || 
    droneState.state === 'exploring' || 
    droneState.state === 'returning',
    [droneState.state]
  );
  
  // DEBUG: Log des changements de contexte drone (optimisé)
  const debugDroneChange = useCallback((droneData) => {
    console.log(`🚁 [Fleet-${botId}] Drone Context Change:`, droneData);
  }, [botId]);
  
  useEffect(() => {
    if (explorerDrone) {
      debugDroneChange({
        state: droneState.state,
        isActive: droneState.isActive,
        position: droneState.position,
        targetPosition: droneState.targetPosition,
        isMoving: isExplorerMoving
      });
    }
  }, [explorerDrone, droneState, isExplorerMoving, debugDroneChange]);
  
  // Position initiale du drone (position du vaisseau par défaut)
  const initialDronePosition = useMemo(() => ({
    x: shipPosition.x + 0.5,
    y: shipPosition.y + 0.3,
    z: shipPosition.z + 0.5
  }), [shipPosition]);
  
  // Position cible : utiliser targetPosition du contexte FSM
  const targetPosition = useMemo(() => {
    if (explorerDrone?.targetPosition) {
      return explorerDrone.targetPosition;
    }
    // Fallback : rester à la position initiale
    return initialDronePosition;
  }, [explorerDrone?.targetPosition, initialDronePosition]);

  // ===================================================================
  // ANIMATION SIMPLIFIEE - DEBUG DIRECT FSM → TARGET POSITION
  // ===================================================================
  
  // Mémorisation des paramètres d'animation pour éviter les recalculs
  const animationConfig = useMemo(() => ({
    speed: 0.8, // Vitesse réduite pour voir l'animation
    rotationSpeed: 2,
    idleRotationSpeed: 0.5,
    exploringRotationSpeed: 1.5,
    exploringOscillation: 0.2,
    idleOscillation: 0.1,
    reachThreshold: 0.1
  }), []);
  
  // Fonction de calcul de distance mémorisée
  const calculateDistance = useCallback((pos1, pos2) => {
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) +
      Math.pow(pos2.y - pos1.y, 2) +
      Math.pow(pos2.z - pos1.z, 2)
    );
  }, []);
  
  // État de debug pour éviter le spam de logs
  const debugState = useRef({
    lastReachedLog: 0,
    lastAnimationLog: 0,
    hasReachedTarget: false
  });
  
  // Animation automatique basée sur les changements de contexte FSM
  useFrame((state, delta) => {
    if (!explorerDroneRef.current) return;
    
    const currentPosition = explorerDroneRef.current.position;
    const now = state.clock.elapsedTime;
    
    // 🔍 DEBUG: Animation directe vers targetPosition (optimisée)
    if (isExplorerMoving && targetPosition) {
      // Log de debug réduit (seulement toutes les secondes)
      if (now - debugState.current.lastAnimationLog > 1) {
        const distance = calculateDistance(currentPosition, targetPosition);
        console.log(`🎯 [Fleet-${botId}] Animating drone to:`, {
          target: targetPosition,
          current: {x: currentPosition.x.toFixed(2), y: currentPosition.y.toFixed(2), z: currentPosition.z.toFixed(2)},
          distance: distance.toFixed(3)
        });
        debugState.current.lastAnimationLog = now;
      }
      
      const speed = delta * animationConfig.speed;
      currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, targetPosition.x, speed);
      currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, targetPosition.y, speed);
      currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, targetPosition.z, speed);
      
      // Rotation continue pendant le mouvement
      explorerDroneRef.current.rotation.y += delta * animationConfig.rotationSpeed;
      
      // DEBUG: Distance restante (calculé de manière optimisée)
      const distance = calculateDistance(currentPosition, targetPosition);
      
      // Log "reached target" seulement une fois quand on atteint la cible
      if (distance < animationConfig.reachThreshold && !debugState.current.hasReachedTarget) {
        console.log(`✅ [Fleet-${botId}] Drone reached target position (distance: ${distance.toFixed(3)})`);
        debugState.current.hasReachedTarget = true;
        debugState.current.lastReachedLog = now;
      }
      
      // Reset du flag si on s'éloigne de la cible (nouvelle target)
      if (distance > animationConfig.reachThreshold * 2) {
        debugState.current.hasReachedTarget = false;
      }
    }
    
    // Animation idle quand le drone est docké
    if (droneState.state === 'docked') {
      explorerDroneRef.current.rotation.y += delta * animationConfig.idleRotationSpeed;
      // Petit mouvement de flottement
      explorerDroneRef.current.position.y = targetPosition.y + Math.sin(state.clock.elapsedTime * 2) * animationConfig.idleOscillation;
    }
    
    // Animation d'exploration active
    if (droneState.state === 'exploring') {
      // Oscillation légère pour simuler le mouvement de recherche
      explorerDroneRef.current.position.y = targetPosition.y + Math.sin(state.clock.elapsedTime * 3) * animationConfig.exploringOscillation;
      explorerDroneRef.current.rotation.y += delta * animationConfig.exploringRotationSpeed;
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
        
        {/* ID LABEL - Vaisseau principal */}
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
            {context?.vehicle?.id || `${botId}-ship`}
          </div>
        </Html>
      </mesh>

      {/* DRONE EXPLORATEUR - Animation directe vers targetPosition */}
      <group 
        ref={explorerDroneRef}
        position={[initialDronePosition.x, initialDronePosition.y, initialDronePosition.z]}
      >
        <Cone 
          args={[0.15, 0.4, 8]} 
          rotation={[Math.PI, 0, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color={color}
            // État FSM → Couleur émissive
            emissive={droneState.state === 'exploring' ? color : "black"}
            emissiveIntensity={droneState.state === 'exploring' ? 0.8 : 0.2}
          />
        </Cone>
        
        {/* ID LABEL - Drone explorateur */}
        <Html position={[0, 0.3, 0]} center>
          <div style={{ 
            color: 'rgba(255,255,255,0.6)', 
            fontSize: '9px', 
            background: 'rgba(0,0,0,0.5)', 
            padding: '1px 4px', 
            borderRadius: '3px',
            fontFamily: 'monospace',
            textAlign: 'center'
          }}>
            {context?.droneFleet?.drones?.explorer?.id || `${botId}-explorer`}
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