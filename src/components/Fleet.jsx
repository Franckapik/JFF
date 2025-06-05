import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBotMachineFixed } from "../ai/fsm/hooks/useBotMachineSync.js";
import { useFSMPositionTracker } from "../ai/fsm/hooks/useFSMPositionTracker.js";
import ShipMesh from "./Vehicles/ShipMesh.jsx";
import DroneMesh from "./Vehicles/DroneMesh.jsx";

/**
 * =================================================================
 * Composant Fleet - Architecture Hybride avec Intermédiaire Intelligent
 * =================================================================
 * 
 * ✅ SÉPARATION OPTIMALE :
 * - Fleet.jsx calcule les positions visuelles R3F (PAS de send FSM)
 * - useFSMPositionTracker agit comme intermédiaire intelligent
 * - Le tracker surveille les positions et déclenche les événements FSM
 * - FSM réagit selon sa logique interne
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
  // FSM INTEGRATION AVEC INTERMÉDIAIRE INTELLIGENT
  // ===================================================================
  
  const { current, send: fsmSend, context, vehicle, state } = useBotMachineFixed(botId, 'bot');

  // 🎯 INTERMÉDIAIRE INTELLIGENT : Surveille et déclenche les événements FSM
  const updateVisualPosition = useFSMPositionTracker(context, fsmSend, botId);

  // État du drone calculé depuis la FSM (LECTURE SEULE)
  const droneState = useMemo(() => {
    const fsmState = context?.state; // État FSM principal (exploring_deploying, exploring_recalling, etc.)
    const droneVisualState = context?.droneFleet?.drones?.explorer?.state || 'docked'; // État visuel du drone
    
    return {
      state: droneVisualState,
      fsmState: fsmState, // État FSM pour debugging
      isActive: context?.droneFleet?.drones?.explorer?.isActive || false,
      position: context?.droneFleet?.drones?.explorer?.position,
      targetPosition: context?.droneFleet?.drones?.explorer?.targetPosition
    };
  }, [context?.droneFleet?.drones?.explorer, context?.state]);

  // ===================================================================
  // ANIMATION R3F PURE (SANS AUCUNE LOGIQUE FSM)
  // ===================================================================
  
  const droneRef = useRef();

  // Position initiale du drone (coordonnées locales au vaisseau)
  const initialPosition = useMemo(() => ({
    x: 0.5, y: 0.3, z: 0.5
  }), []);
  
  // Position cible calculée (coordonnées locales)
  const targetPosition = useMemo(() => {
    if (droneState?.targetPosition) {
      return {
        x: droneState.targetPosition.x - shipPosition.x,
        y: droneState.targetPosition.y - shipPosition.y,
        z: droneState.targetPosition.z - shipPosition.z
      };
    }
    return initialPosition;
  }, [droneState?.targetPosition, initialPosition, shipPosition]);
  
  // ===================================================================
  // ANIMATION DRONE AVEC COMMUNICATION VERS LE TRACKER
  // ===================================================================
  
  // Debug tracking
  const lastUpdateTime = useRef(0);

  useFrame((state, delta) => {
    if (!droneRef.current) return;
    
    const currentPosition = droneRef.current.position;
    const now = state.clock.elapsedTime;
    const isMoving = droneState?.state === 'deploying' || 
                     droneState?.state === 'exploring' || 
                     droneState?.state === 'returning' ||
                     droneState?.fsmState === 'exploring_deploying' ||
                     droneState?.fsmState === 'exploring_recalling';
    
    // Debug réduit - seulement en cas de problème
    if (now - lastUpdateTime.current > 5.0 && !isMoving && droneState?.isActive) {
      console.log(`⚠️ [Fleet] Drone ${droneState?.state} mais pas en mouvement`);
      lastUpdateTime.current = now;
    }
    
    // 🎭 MOUVEMENT FLUIDE (INTERPOLATION VISUELLE)
    if (isMoving && targetPosition) {
      const speed = delta * 0.8;
      currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, targetPosition.x, speed);
      currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, targetPosition.y, speed);
      currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, targetPosition.z, speed);
      droneRef.current.rotation.y += delta * 2;
      
      // 🔄 COMMUNICATION VERS LE TRACKER - Version simplifiée (toutes les frames en mouvement)
      const worldPosition = {
        x: currentPosition.x + shipPosition.x,
        y: currentPosition.y + shipPosition.y,
        z: currentPosition.z + shipPosition.z
      };
      
      // Envoyer la position au tracker qui gérera les événements FSM
      updateVisualPosition(worldPosition, droneState.state);
    }
    
    // 🎭 ANIMATIONS PAR ÉTAT (PURE VISUEL)
    switch (droneState?.state) {
      case 'docked':
        droneRef.current.rotation.y += delta * 0.5;
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 2) * 0.1;
        break;
        
      case 'exploring':
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 3) * 0.2;
        droneRef.current.rotation.y += delta * 1.5;
        break;
    }
  });

  // ===================================================================
  // RENDU VISUEL - SÉPARATION CLAIRE DES RESPONSABILITÉS
  // ===================================================================
  
  return (
    <>
      {/* VAISSEAU PRINCIPAL */}
      <ShipMesh color={color} botId={botId} context={context} />

      {/* DRONE EXPLORATEUR - Animation R3F + Communication tracker */}
      <group 
        ref={droneRef}
        position={[initialPosition.x, initialPosition.y, initialPosition.z]}
      >
        <DroneMesh 
          color={color} 
          botId={botId} 
          context={context} 
          droneState={droneState} 
        />
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