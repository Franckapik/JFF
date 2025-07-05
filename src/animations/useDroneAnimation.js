/**
 * ============================================================================
 * DRONE ANIMATION HOOK - Animation spécialisée pour les drones
 * ============================================================================
 * 
 * Hook dédié pour l'animation des drones dans Fleet.
 * Gère le mouvement, les rotations et les effets visuels par état.
 */

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import fsmLogger from '../logger/fsmLogger';

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
  const initialPositionSent = useRef(false); // 🆕 Flag pour éviter duplications

  // Position initiale du drone (coordonnées locales au vaisseau)
  const initialPosition = {
    explorer: { x: 0.5, y: 0.3, z: 0.5 },
    combat: { x: -0.5, y: 0.3, z: 0.5 },
    special: { x: 0, y: 0.3, z: -0.7 }
  }[droneType] || { x: 0.5, y: 0.3, z: 0.5 };

  // 🆕 TRANSMISSION DE LA POSITION INITIALE DU DRONE (UNE SEULE FOIS)
  // Calcule et envoie la position mondiale initiale du drone au tracker FSM
  useEffect(() => {
    if (shipPosition && updateVisualPosition && !initialPositionSent.current) {
      const droneWorldPosition = {
        x: shipPosition.x + initialPosition.x,
        y: shipPosition.y + initialPosition.y, 
        z: shipPosition.z + initialPosition.z
      };
      
      fsmLogger.mouvement(`🛸 [${droneType}] Transmitting initial drone position to FSM tracker:`, droneWorldPosition);
      updateVisualPosition(droneWorldPosition);
      initialPositionSent.current = true; // ✅ Marquer comme envoyé
    }
  }, [shipPosition, updateVisualPosition, droneType]);

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
    
    // 🐛 DIAGNOSTIC : Log des informations du drone
    if (now - lastUpdateTime.current > 3.0) {
      const shipContextPosition = context?.vehicle?.position;
      fsmLogger.info(`🛸 [${droneType}] Drone diagnostic:`, {
        droneState,
        isActive,
        hasTargetPosition: !!droneTargetPos,
        targetPosition: droneTargetPos,
        currentPosition: currentPosition,
        shipPosition,
        shipContextPosition,
        positionSync: shipContextPosition ? 
          `Context(${shipContextPosition.x.toFixed(2)},${shipContextPosition.z.toFixed(2)}) vs Ship(${shipPosition.x.toFixed(2)},${shipPosition.z.toFixed(2)})` : 
          'No context position',
        // 🔍 DIAGNOSTIC DÉTAILLÉ: Vérifier si la position du contexte FSM est mise à jour
        contextPositionDetails: {
          hasVehicle: !!context?.vehicle,
          hasPosition: !!context?.vehicle?.position,
          vehicleLastUpdate: context?.vehicle?.lastPositionUpdate || 'No timestamp',
          vehicleCoord: context?.vehicle?.coord || 'No coord'
        }
      });
      lastUpdateTime.current = now;
    }
    
    // Position cible calculée (coordonnées locales)
    const targetPosition = (() => {
      if (droneState === 'drone_returning') {
        // 🔧 CORRECTION: Pour le retour, utiliser la position absolue du vaisseau depuis le contexte FSM
        const shipContextPosition = context?.vehicle?.position;
        if (shipContextPosition) {
          // 🎯 APPROCHE ABSOLUE: Retourner directement à la position absolue du contexte FSM
          // Convertir en coordonnées locales pour l'animation en soustrayant la position actuelle du vaisseau
          fsmLogger.info(`🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context:`, {
            shipContextPosition,
            shipAnimationPosition: shipPosition,
            willReturnTo: 'FSM context position'
          });
          
          return {
            x: shipContextPosition.x - shipPosition.x,
            y: shipContextPosition.y - shipPosition.y + 0.5, // Légère hauteur pour le retour
            z: shipContextPosition.z - shipPosition.z
          };
        } else {
          // Fallback : position relative au vaisseau si pas de contexte
          fsmLogger.warn(`⚠️ [${droneType}] No ship context position for return, using fallback`);
          return { x: 0, y: 0.5, z: 0 };
        }
      } else if (droneTargetPos) {
        // Pour les autres états, utiliser la cible du drone
        return {
          x: droneTargetPos.x - shipPosition.x,
          y: droneTargetPos.y - shipPosition.y,
          z: droneTargetPos.z - shipPosition.z
        };
      } else {
        // Fallback : position initiale
        return initialPosition;
      }
    })();
    
    // États de mouvement du drone (XState uniquement)
    const isMoving = droneState === 'drone_deploying' || 
                     droneState === 'drone_scanning' || 
                     droneState === 'drone_returning';
    
    // Debug réduit - seulement en cas de problème
    if (now - lastUpdateTime.current > 5.0 && !isMoving && isActive) {
      fsmLogger.error(`⚠️ [Drone ${droneType}] État ${droneState} mais pas en mouvement`);
      lastUpdateTime.current = now;
    }
    
    // 🎭 MOUVEMENT FLUIDE (INTERPOLATION VISUELLE)
    if (isMoving && targetPosition) {
      const speed = delta * 5.0; // 🚀 ACCÉLÉRATION TRÈS FORTE (augmenté de 3.0 à 5.0)
      currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, targetPosition.x, speed);
      currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, targetPosition.y, speed);
      currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, targetPosition.z, speed);
      droneRef.current.rotation.y += delta * 2;
      
      // 🔄 COMMUNICATION VERS LE TRACKER - POUR TOUS LES ÉTATS EN MOUVEMENT
      const worldPosition = {
        x: currentPosition.x + shipPosition.x,
        y: currentPosition.y + shipPosition.y,
        z: currentPosition.z + shipPosition.z
      };
      
      updateVisualPosition(worldPosition);
    } else {
      // Mettre à jour la position pour tous les états, pas seulement en mouvement
      // Envoi régulier de la position actuelle du drone pour mise à jour du contexte
      const worldPosition = {
        x: currentPosition.x + shipPosition.x,
        y: currentPosition.y + shipPosition.y,
        z: currentPosition.z + shipPosition.z
      };
      
      // 🚨 LOG CRITIQUE: Vérifier si on appelle bien le tracker (mode statique)
      if (now - lastUpdateTime.current > 1.0) {
        fsmLogger.info(`🚨 [ANIMATION-STATIC] Calling updateVisualPosition for ${droneType}`, {
          worldPosition,
          droneState,
          isMoving: false
        });
      }
      
      // Envoyer la position actuelle au tracker
      updateVisualPosition(worldPosition);
    }
    
    // 🎭 ANIMATIONS PAR ÉTAT (PURE VISUEL)
    switch (droneState) {
      case 'docked':
        droneRef.current.rotation.y += delta * 0.5;
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 2) * 0.1;
        break;
        
      case 'drone_scanning':
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 3) * 0.2;
        droneRef.current.rotation.y += delta * 1.5;
        break;
        
      case 'drone_returning':
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 6) * 0.1;
        droneRef.current.rotation.y += delta * 2.5;
        droneRef.current.rotation.z = 0;
        break;
    }
  });

  // 🧹 CLEANUP - Reset du flag lors du démontage
  useEffect(() => {
    return () => {
      initialPositionSent.current = false;
    };
  }, []);

  return {
    droneRef,
    initialPosition,
    droneState: context?.droneFleet?.drones?.[droneType]?.state || 'docked'
  };
};
