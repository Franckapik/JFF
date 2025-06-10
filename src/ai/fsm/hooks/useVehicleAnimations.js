/**
 * ============================================================================
 * HOOKS D'ANIMATION SPÉCIALISÉS - Fleet Vehicle Animations
 * ============================================================================
 * 
 * Hooks dédiés pour l'animation des différents types de véhicules dans Fleet.
 * Séparation claire entre logique d'animation et tracking FSM.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hook d'animation spécialisé pour les drones
 * @param {Object} context - Contexte FSM
 * @param {Object} shipPosition - Position du vaisseau de référence
 * @param {Function} updateVisualPosition - Callback pour envoyer la position au tracker
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns {Object} - Ref du drone et données d'animation
 */
export const useDroneAnimation = (context, shipPosition, updateVisualPosition, droneType = 'explorer') => {
  const droneRef = useRef();
  const lastUpdateTime = useRef(0);

  // Position initiale du drone (coordonnées locales au vaisseau)
  const initialPosition = {
    explorer: { x: 0.5, y: 0.3, z: 0.5 },
    combat: { x: -0.5, y: 0.3, z: 0.5 },
    special: { x: 0, y: 0.3, z: -0.7 }
  }[droneType] || { x: 0.5, y: 0.3, z: 0.5 };

  useFrame((state, delta) => {
    if (!droneRef.current) return;
    
    const currentPosition = droneRef.current.position;
    const now = state.clock.elapsedTime;
    
    // État du drone lu directement depuis le contexte FSM
    const drone = context?.droneFleet?.drones?.[droneType];
    if (!drone) return;
    
    const droneState = drone.state || 'docked';
    const isActive = drone.isActive || false;
    const droneTargetPos = drone.targetPosition;
    
    // Position cible calculée (coordonnées locales)
    const targetPosition = droneTargetPos ? {
      x: droneTargetPos.x - shipPosition.x,
      y: droneTargetPos.y - shipPosition.y,
      z: droneTargetPos.z - shipPosition.z
    } : initialPosition;
    
    const isMoving = droneState === 'deploying' || 
                     droneState === 'exploring' || 
                     droneState === 'prospecting' || 
                     droneState === 'returning';
    
    // Debug réduit - seulement en cas de problème
    if (now - lastUpdateTime.current > 5.0 && !isMoving && isActive) {
      console.log(`⚠️ [Drone ${droneType}] État ${droneState} mais pas en mouvement`);
      lastUpdateTime.current = now;
    }
    
    // 🎭 MOUVEMENT FLUIDE (INTERPOLATION VISUELLE)
    if (isMoving && targetPosition) {
      const speed = delta * 0.8;
      currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, targetPosition.x, speed);
      currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, targetPosition.y, speed);
      currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, targetPosition.z, speed);
      droneRef.current.rotation.y += delta * 2;
      
      // 🔄 COMMUNICATION VERS LE TRACKER
      const worldPosition = {
        x: currentPosition.x + shipPosition.x,
        y: currentPosition.y + shipPosition.y,
        z: currentPosition.z + shipPosition.z
      };
      
      updateVisualPosition(worldPosition);
    }
    
    // 🔄 COMMUNICATION SPÉCIALE POUR LE RETOUR
    if (droneState === 'returning' && targetPosition) {
      const worldPosition = {
        x: currentPosition.x + shipPosition.x,
        y: currentPosition.y + shipPosition.y,
        z: currentPosition.z + shipPosition.z
      };
      
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
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 4) * 0.15;
        droneRef.current.rotation.y += delta * 0.8;
        droneRef.current.rotation.z = Math.sin(now * 2) * 0.1;
        break;
        
      case 'returning':
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 6) * 0.1;
        droneRef.current.rotation.y += delta * 2.5;
        droneRef.current.rotation.z = 0;
        break;
    }
  });

  return {
    droneRef,
    initialPosition,
    droneState: context?.droneFleet?.drones?.[droneType]?.state || 'docked'
  };
};

/**
 * Hook d'animation spécialisé pour les vaisseaux
 * @param {Object} context - Contexte FSM
 * @param {Function} updateVisualPosition - Callback pour envoyer la position au tracker
 * @returns {Object} - Ref du vaisseau et données d'animation
 */
export const useShipAnimation = (context, updateVisualPosition) => {
  const shipRef = useRef();
  const lastUpdateTime = useRef(0);

  useFrame((state, delta) => {
    if (!shipRef.current) return;
    
    const now = state.clock.elapsedTime;
    const currentPosition = shipRef.current.position;
    
    // État du vaisseau lu directement depuis le contexte FSM
    const vehicle = context?.vehicle;
    const currentAction = context?.currentAction;
    const isMoving = context?.isMoving || false;
    
    if (!vehicle) return;
    
    const targetPosition = vehicle.targetPosition || context.targetPosition;
    
    // Debug pour les problèmes de mouvement
    if (now - lastUpdateTime.current > 3.0 && !isMoving && targetPosition) {
      console.log(`⚠️ [Ship] Action ${currentAction} mais pas en mouvement`);
      lastUpdateTime.current = now;
    }
    
    // 🎭 MOUVEMENT FLUIDE DU VAISSEAU
    if (isMoving && targetPosition) {
      const speed = delta * 0.6; // Plus lent que les drones
      currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, targetPosition.x, speed);
      currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, targetPosition.y, speed);
      currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, targetPosition.z, speed);
      
      // Rotation douce pendant le mouvement
      shipRef.current.rotation.y += delta * 0.5;
      
      // 🔄 COMMUNICATION VERS LE TRACKER
      const worldPosition = {
        x: currentPosition.x,
        y: currentPosition.y,
        z: currentPosition.z
      };
      
      updateVisualPosition(worldPosition);
    }
    
    // 🎭 ANIMATIONS PAR ACTION (PURE VISUEL)
    switch (currentAction) {
      case 'idling':
        shipRef.current.rotation.y += delta * 0.2;
        shipRef.current.position.y = 0.5 + Math.sin(now * 1) * 0.05;
        break;
        
      case 'collecting':
      case 'resource_collection':
        // Animation de collecte - oscillation plus rapide
        shipRef.current.position.y = 0.5 + Math.sin(now * 4) * 0.1;
        shipRef.current.rotation.y += delta * 1.0;
        break;
        
      case 'refueling':
      case 'fuel_maintenance':
        // Animation de refuel - rotation lente, position stable
        shipRef.current.rotation.y += delta * 0.3;
        shipRef.current.position.y = 0.5;
        break;
        
      case 'moving':
        // Animation de déplacement - inclinaison légère
        shipRef.current.rotation.z = Math.sin(now * 2) * 0.05;
        break;
    }
  });

  return {
    shipRef,
    currentAction: context?.currentAction || 'idling',
    isMoving: context?.isMoving || false
  };
};
