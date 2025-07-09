/**
 * ============================================================================
 * HOOK D'ANIMATION SHIP SPÉCIALISÉ - Ship Animation Hook
 * ============================================================================
 * 
 * Hook dédié pour l'animation des vaisseaux dans Fleet.
 * Gère les animations visuelles basées sur l'état FSM du vaisseau.
 */

import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import fsmLogger from '../logger/fsmLogger';

/**
 * Hook d'animation spécialisé pour les vaisseaux
 * @param {Object} context - Contexte FSM
 * @param {Object} shipWorldPosition - Position mondiale du vaisseau (pour les trackers)
 * @param {Function} updateVisualPosition - Callback pour envoyer la position au tracker
 * @param {boolean} isActive - Si le bot est actif (animations complètes) ou non
 * @returns {Object} - Ref du vaisseau et données d'animation
 */
export const useShipAnimation = (context, shipWorldPosition, updateVisualPosition, isActive = true) => {
  const shipRef = useRef();
  const lastUpdateTime = useRef(0);
  const initialPositionSent = useRef(false); // 🆕 Flag pour éviter duplications

  // 🆕 TRANSMISSION DE LA POSITION INITIALE (UNE SEULE FOIS)
  // Envoie la position de départ au tracker FSM dès que la position mondiale est disponible
  useEffect(() => {
    if (shipWorldPosition && updateVisualPosition && !initialPositionSent.current) {
      fsmLogger.mouvement(`🏠 [Ship] Transmitting initial position to FSM tracker:`, shipWorldPosition);
      updateVisualPosition(shipWorldPosition);
      initialPositionSent.current = true; // ✅ Marquer comme envoyé
    }
  }, [shipWorldPosition, updateVisualPosition]);

  useFrame((state, delta) => {
    if (!shipRef.current || !context || !isActive) return; // 🆕 Sortir si inactif
    
    const now = state.clock.elapsedTime;
    const currentAction = context.currentAction || 'idling';
    const isMoving = context.vehicle?.isMoving || context.isMoving || false; // ⭐ Vérifier d'abord vehicle.isMoving
    const vehicle = context.vehicle || {};
    const targetPosition = vehicle.targetPosition || context.targetPosition;
    
    // Debug pour les problèmes de mouvement - logging détaillé
    if (now - lastUpdateTime.current > 3.0) {
      if (currentAction === 'moving_to_target' && !isMoving) {
        fsmLogger.error(`⚠️ [Ship] Action 'moving_to_target' mais isMoving=false`, {
          currentAction,
          isMoving,
          hasTargetPosition: !!targetPosition,
          targetPosition,
          botId: context.entityId
        });
      }
      
      if (currentAction === 'moving_to_target' && !targetPosition) {
        fsmLogger.error(`⚠️ [Ship] Action 'moving_to_target' mais pas de targetPosition`, {
          currentAction,
          isMoving,
          hasTargetPosition: !!targetPosition,
          vehicleTargetPosition: vehicle.targetPosition,
          contextTargetPosition: context.targetPosition,
          botId: context.entityId
        });
      }
      
      lastUpdateTime.current = now;
    }
    
    // 🎭 MOUVEMENT FLUIDE DU VAISSEAU
    if (isMoving && targetPosition) {
      // Vitesse adaptée selon l'action - plus rapide pour la collecte
      let speed = delta * 0.6; // Vitesse par défaut
      
      if (currentAction === 'moving_to_target' || currentAction === 'collecting') {
        speed = delta * 0.8; // Plus rapide pour aller collecter
      } else if (currentAction === 'returning_to_base') {
        speed = delta * 1.0; // Encore plus rapide pour le retour
      }
      
      // Calculer la position cible en coordonnées locales
      const localTargetPosition = {
        x: targetPosition.x - shipWorldPosition.x,
        y: targetPosition.y - shipWorldPosition.y, 
        z: targetPosition.z - shipWorldPosition.z
      };
      
      // Position actuelle du vaisseau (référence Three.js)
      const currentPosition = shipRef.current.position;
      
      // Calcul de la distance pour adapter l'animation
      const distance = Math.sqrt(
        Math.pow(localTargetPosition.x - currentPosition.x, 2) +
        Math.pow(localTargetPosition.z - currentPosition.z, 2)
      );
      
      // Interpolation adaptée à la distance avec convergence finale
      const adaptedSpeed = distance > 2.0 ? speed * 1.5 : speed;
      
      // Si très proche de la cible, snapper à la position exacte pour éviter l'oscillation
      if (distance < 0.1) {
        currentPosition.x = localTargetPosition.x;
        currentPosition.y = localTargetPosition.y;
        currentPosition.z = localTargetPosition.z;
      } else {
        currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, localTargetPosition.x, adaptedSpeed);
        currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, localTargetPosition.y, speed);
        currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, localTargetPosition.z, adaptedSpeed);
      }
      
      // Rotation douce orientée vers la cible
      if (distance > 0.1) {
        const targetAngle = Math.atan2(localTargetPosition.x - currentPosition.x, localTargetPosition.z - currentPosition.z);
        shipRef.current.rotation.y = THREE.MathUtils.lerp(shipRef.current.rotation.y, targetAngle, delta * 2.0);
      }
      
      // 🔄 COMMUNICATION VERS LE TRACKER (coordonnées mondiales)
      const worldPosition = {
        x: currentPosition.x + shipWorldPosition.x,
        y: currentPosition.y + shipWorldPosition.y,
        z: currentPosition.z + shipWorldPosition.z
      };
      
      // 🔍 DIAGNOSTIC: Log détaillé de la position du vaisseau
      if (now - lastUpdateTime.current > 2.0) {
        fsmLogger.info(`🚢 [SHIP-POSITION-DEBUG] Ship position update:`, {
          localPosition: currentPosition,
          worldBasePosition: shipWorldPosition,
          calculatedWorldPosition: worldPosition,
          contextVehiclePosition: context?.vehicle?.position,
          isMoving,
          currentAction,
          note: 'Calling updateVisualPosition with worldPosition'
        });
        lastUpdateTime.current = now;
      }
      
      updateVisualPosition(worldPosition);
    }
    
    // 🎭 ANIMATIONS PAR ACTION (PURE VISUEL)
    switch (currentAction) {
      case 'idling':
        shipRef.current.rotation.y += delta * 0.2;
        shipRef.current.position.y = 0.5 + Math.sin(now * 1) * 0.05;
        break;
        
      case 'moving_to_target':
        // Animation de déplacement vers tuile cible - anticipation de collecte
        shipRef.current.position.y = 0.5 + Math.sin(now * 2) * 0.08;
        // Rotation déjà gérée dans la section mouvement pour orientation vers cible
        break;
        
      case 'collecting':
      case 'resource_collection':
        // Animation de collecte intensive - oscillation rapide + rotation
        const collectIntensity = Math.sin(now * 6) * 0.15;
        shipRef.current.position.y = 0.5 + collectIntensity;
        shipRef.current.rotation.y += delta * 1.2;
        
        // Léger balancement pour simuler l'effort de collecte
        shipRef.current.rotation.x = Math.sin(now * 4) * 0.1;
        shipRef.current.rotation.z = Math.cos(now * 3) * 0.08;
        break;
        
      case 'returning_to_base':
        // Animation de retour - mouvement plus stable mais avec urgence
        shipRef.current.position.y = 0.5 + Math.sin(now * 1.5) * 0.06;
        shipRef.current.rotation.y += delta * 0.8;
        break;
        
      case 'refueling':
      case 'fuel_maintenance':
        // Animation de refuel - rotation lente, position stable
        shipRef.current.rotation.y += delta * 0.3;
        shipRef.current.position.y = 0.5;
        break;
        
      case 'moving':
        // Animation de déplacement générique - inclinaison légère
        shipRef.current.rotation.z = Math.sin(now * 2) * 0.05;
        break;
        
      default:
        // Animation par défaut si action inconnue
        shipRef.current.rotation.y += delta * 0.1;
        break;
    }
  });

  // 🧹 CLEANUP - Reset du flag lors du démontage
  useEffect(() => {
    return () => {
      initialPositionSent.current = false;
    };
  }, []);
  
  // 🎯 RESET DES ROTATIONS LORS DES CHANGEMENTS D'ACTION
  useEffect(() => {
    if (shipRef.current && context?.currentAction) {
      // Reset les rotations parasites lors de changement d'action
      if (context?.currentAction === 'idling' || context?.currentAction === 'refueling') {
        shipRef.current.rotation.x = 0;
        shipRef.current.rotation.z = 0;
      }
    }
  }, [context?.currentAction]);

  return {
    shipRef,
    currentAction: context?.currentAction || 'idling',
    isMoving: context?.vehicle?.isMoving || context?.isMoving || false, // ⭐ Vérifier d'abord vehicle.isMoving
    // 🆕 Ajout d'infos supplémentaires pour debug
    targetPosition: context?.vehicle?.targetPosition || context?.targetPosition,
    hasResources: !!(context?.vehicle?.resources && 
      (context.vehicle.resources.food > 0 || 
       context.vehicle.resources.debris > 0 || 
       context.vehicle.resources.special > 0)),
    // Debug info for troubleshooting
    contextAction: context?.currentAction,
    debugTimestamp: Date.now()
  };
};
