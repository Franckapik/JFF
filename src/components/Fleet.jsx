import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBotMachine } from "../ai/fsm/hooks/useBotMachine.js";
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
  
  const { current, send: fsmSend, context, vehicle, state } = useBotMachine(botId, 'bot');

  // 🎯 INTERMÉDIAIRE INTELLIGENT : Surveille et déclenche les événements FSM
  const updateVisualPosition = useFSMPositionTracker(context, fsmSend, botId);

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
    const droneTargetPos = context?.droneFleet?.drones?.explorer?.targetPosition;
    if (droneTargetPos) {
      return {
        x: droneTargetPos.x - shipPosition.x,
        y: droneTargetPos.y - shipPosition.y,
        z: droneTargetPos.z - shipPosition.z
      };
    }
    return initialPosition;
  }, [context?.droneFleet?.drones?.explorer?.targetPosition, initialPosition, shipPosition]);
  
  // ===================================================================
  // ANIMATION DRONE AVEC COMMUNICATION VERS LE TRACKER
  // ===================================================================
  
  // Debug tracking
  const lastUpdateTime = useRef(0);

  useFrame((state, delta) => {
    if (!droneRef.current) return;
    
    const currentPosition = droneRef.current.position;
    const now = state.clock.elapsedTime;
    
    // État du drone lu directement depuis le contexte FSM
    const droneState = context?.droneFleet?.drones?.explorer?.state || 'docked';
    const fsmState = context?.state;
    const isActive = context?.droneFleet?.drones?.explorer?.isActive || false;
    
    const isMoving = droneState === 'deploying' || 
                     droneState === 'exploring' || 
                     droneState === 'prospecting' || // ✅ Inclure prospecting comme mouvement actif
                     droneState === 'returning' ||
                     fsmState === 'exploring_deploying' ||
                     fsmState === 'exploring_prospecting' || // ✅ Inclure l'état FSM prospecting
                     fsmState === 'exploring_returning';
    
    // Debug réduit - seulement en cas de problème
    if (now - lastUpdateTime.current > 5.0 && !isMoving && isActive) {
      console.log(`⚠️ [Fleet] Drone ${droneState} mais pas en mouvement`);
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
      updateVisualPosition(worldPosition);
    }
    
    // 🔄 COMMUNICATION SPÉCIALE POUR LE RETOUR - Continuer à envoyer la position même si pas isMoving
    if ((droneState === 'returning' || fsmState === 'exploring_returning') && targetPosition) {
      const worldPosition = {
        x: currentPosition.x + shipPosition.x,
        y: currentPosition.y + shipPosition.y,
        z: currentPosition.z + shipPosition.z
      };
      
      // Envoyer la position au tracker pour détecter l'arrivée
      updateVisualPosition(worldPosition);
    }
    
    // 🎭 ANIMATIONS PAR ÉTAT (PURE VISUEL)
    switch (droneState) {
      case 'docked':
        droneRef.current.rotation.y += delta * 0.5;
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 2) * 0.1;
        break;
        
      case 'exploring':
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 3) * 0.2;
        droneRef.current.rotation.y += delta * 1.5;
        break;
        
      case 'prospecting':
        // Animation de prospection : rotation plus lente, oscillation distinctive
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 4) * 0.15;
        droneRef.current.rotation.y += delta * 0.8;
        droneRef.current.rotation.z = Math.sin(now * 2) * 0.1; // Léger balancement
        break;
        
      case 'returning':
        // Animation de retour : mouvement rapide et déterminé vers le vaisseau
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 6) * 0.1;
        droneRef.current.rotation.y += delta * 2.5; // Rotation plus rapide
        droneRef.current.rotation.z = 0; // Pas de balancement, vol stable
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
          droneState={{ state: context?.droneFleet?.drones?.explorer?.state || 'docked' }} 
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