/**
 * ============================================================================
 * HOOK D'ANIMATION SHIP SPÉCIALISÉ - Ship Animation Hook
 * ============================================================================
 * 
 * Hook dédié pour l'animation des vaisseaux dans Fleet.
 * Gère les animations visuelles basées sur l'état FSM du vaisseau.
 */

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import fsmLogger from '../logger/fsmLogger';

/**
 * Hook d'animation spécialisé pour les vaisseaux
 * @param {Object} context - Contexte FSM
 * @param {Object} shipWorldPosition - Position mondiale du vaisseau (pour les trackers)
 * @param {Function} updateVisualPosition - Callback pour envoyer la position au tracker
 * @returns {Object} - Ref du vaisseau et données d'animation
 */
export const useShipAnimation = (context, shipWorldPosition, updateVisualPosition) => {
  const shipRef = useRef();
  const lastUpdateTime = useRef(0);

  // 🆕 TRANSMISSION DE LA POSITION INITIALE
  // Envoie la position de départ au tracker FSM dès que la position mondiale est disponible
  useEffect(() => {
    if (shipWorldPosition && updateVisualPosition) {
      fsmLogger.mouvement(`🏠 [Ship] Transmitting initial position to FSM tracker:`, shipWorldPosition);
      updateVisualPosition(shipWorldPosition);
    }
  }, [shipWorldPosition, updateVisualPosition]);

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
      fsmLogger.error(`⚠️ [Ship] Action ${currentAction} mais pas en mouvement`);
      lastUpdateTime.current = now;
    }
    
    // 🎭 MOUVEMENT FLUIDE DU VAISSEAU
    if (isMoving && targetPosition) {
      const speed = delta * 0.6; // Plus lent que les drones
      
      // Calculer la position cible en coordonnées locales
      const localTargetPosition = {
        x: targetPosition.x - shipWorldPosition.x,
        y: targetPosition.y - shipWorldPosition.y, 
        z: targetPosition.z - shipWorldPosition.z
      };
      
      currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, localTargetPosition.x, speed);
      currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, localTargetPosition.y, speed);
      currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, localTargetPosition.z, speed);
      
      // Rotation douce pendant le mouvement
      shipRef.current.rotation.y += delta * 0.5;
      
      // 🔄 COMMUNICATION VERS LE TRACKER (coordonnées mondiales)
      const worldPosition = {
        x: currentPosition.x + shipWorldPosition.x,
        y: currentPosition.y + shipWorldPosition.y,
        z: currentPosition.z + shipWorldPosition.z
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
