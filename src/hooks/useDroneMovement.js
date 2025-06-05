/**
 * ============================================================================
 * HOOK DRONE MOVEMENT - Abstraction de la logique de mouvement + événements FSM
 * ============================================================================
 * 
 * Ce hook encapsule toute la logique de mouvement et d'événements FSM,
 * permettant au composant Fleet.jsx de rester purement visuel.
 * 
 * @author FSM Clean Architecture
 * @version 1.0.0
 */

import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import fsmLogger from '../logger/fsmLogger.js';

/**
 * Hook pour gérer le mouvement des drones avec événements FSM automatiques
 * @param {Object} droneState - État du drone depuis la FSM
 * @param {Function} fsmSend - Fonction pour envoyer des événements FSM
 * @param {string} botId - ID du bot
 * @param {Object} shipPosition - Position du vaisseau
 * @returns {Object} Référence du drone et position cible calculée
 */
export const useDroneMovement = (droneState, fsmSend, botId, shipPosition) => {
  const droneRef = useRef();
  
  // Configuration d'animation mémorisée
  const animationConfig = useMemo(() => ({
    speed: 0.8,
    rotationSpeed: 2,
    idleRotationSpeed: 0.5,
    exploringRotationSpeed: 1.5,
    exploringOscillation: 0.2,
    idleOscillation: 0.1,
    reachThreshold: 0.1
  }), []);
  
  // État de debug pour éviter le spam
  const debugState = useRef({
    lastReachedLog: 0,
    lastAnimationLog: 0,
    hasReachedTarget: false
  });
  
  // Fonction de calcul de distance
  const calculateDistance = useCallback((pos1, pos2) => {
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) +
      Math.pow(pos2.y - pos1.y, 2) +
      Math.pow(pos2.z - pos1.z, 2)
    );
  }, []);
  
  // Position initiale du drone
  const initialPosition = useMemo(() => ({
    x: 0.5,
    y: 0.3,
    z: 0.5
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
  
  // Vérifie si le drone doit se déplacer
  const isMoving = useMemo(() => 
    droneState?.state === 'deploying' || droneState?.state === 'returning',
    [droneState?.state]
  );
  
  // ====================================================================
  // LOGIQUE DE MOUVEMENT + ÉVÉNEMENTS FSM AUTOMATIQUES
  // ====================================================================
  
  useFrame((state, delta) => {
    if (!droneRef.current) return;
    
    const currentPosition = droneRef.current.position;
    const now = state.clock.elapsedTime;
    
    // 🚀 MOUVEMENT VERS LA CIBLE
    if (isMoving && targetPosition) {
      // Log de debug réduit
      if (now - debugState.current.lastAnimationLog > 1) {
        const distance = calculateDistance(currentPosition, targetPosition);
        fsmLogger.mouvement(`🎯 [Drone-${botId}] Moving to target`, {
          distance: distance.toFixed(3),
          state: droneState.state
        });
        debugState.current.lastAnimationLog = now;
      }
      
      // Animation fluide
      const speed = delta * animationConfig.speed;
      currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, targetPosition.x, speed);
      currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, targetPosition.y, speed);
      currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, targetPosition.z, speed);
      
      // Rotation pendant le mouvement
      droneRef.current.rotation.y += delta * animationConfig.rotationSpeed;
      
      // 🎯 DÉTECTION D'ARRIVÉE + ÉVÉNEMENT FSM AUTOMATIQUE
      const distance = calculateDistance(currentPosition, targetPosition);
      
      if (distance < animationConfig.reachThreshold && !debugState.current.hasReachedTarget) {
        fsmLogger.mouvement(`✅ [Drone-${botId}] Target reached (distance: ${distance.toFixed(3)})`);
        debugState.current.hasReachedTarget = true;
        
        // 🚀 ENVOI AUTOMATIQUE DE L'ÉVÉNEMENT FSM
        if (droneState.state === 'deploying') {
          fsmSend('DRONE_DEPLOYED', {
            targetArea: 'auto',
            droneType: 'explorer',
            timestamp: Date.now()
          });
        } else if (droneState.state === 'returning') {
          fsmSend('DRONE_RETURNED', {
            droneType: 'explorer',
            timestamp: Date.now()
          });
        }
      }
      
      // Reset du flag si nouvelle cible
      if (distance > animationConfig.reachThreshold * 2) {
        debugState.current.hasReachedTarget = false;
      }
    }
    
    // 🎭 ANIMATIONS STATIQUES PAR ÉTAT
    switch (droneState?.state) {
      case 'docked':
        droneRef.current.rotation.y += delta * animationConfig.idleRotationSpeed;
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 2) * animationConfig.idleOscillation;
        break;
        
      case 'exploring':
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 3) * animationConfig.exploringOscillation;
        droneRef.current.rotation.y += delta * animationConfig.exploringRotationSpeed;
        break;
    }
  });
  
  return {
    droneRef,
    targetPosition,
    initialPosition,
    isMoving
  };
};

export default useDroneMovement;
