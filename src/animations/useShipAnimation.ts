/**
 * ============================================================================
 * SHIP ANIMATION HOOK - Animation optimisée pour le vaisseau principal
 * ============================================================================
 * 
 * Hook d'animation spécialisé pour le vaisseau avec :
 * ✅ Positionnement absolu (contrairement aux drones en relatif)
 * ✅ Calcul de chemin BFS tuile par tuile
 * ✅ Interpolation progressive entre tuiles
 * ✅ useFrame conditionnel selon l'état FSM
 * ✅ Intégration avec les trackers de position
 */

import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import type { WorldPosition } from '../types';
import type { ShipAnimationProps, ShipAnimationReturn } from '../types/r3f';
import type { VehicleVisualState } from '../types/vehicle.d.ts';

import fsmLogger from '../logger/fsmLogger.ts';
import { useTileStore } from '../stores/useTileStore/index.ts';

import { applyShipVisualAnimations } from './utils/shipAnimationUtils';
import {
  calculateShipPath,
  getShipSpeed,
  isPathCompleted,
  shouldAnimateShip
} from './utils/shipPositionUtils';

export const useShipAnimation = ({
  context,
  fleetPosition,
  updateVisualPosition,
  shipType = 'main-ship',
  isActive,
  isMoving
}: ShipAnimationProps): ShipAnimationReturn => {
  // ============================================================================
  // REFS DE GESTION D'ÉTAT
  // ============================================================================
  
  const shipRef = useRef<THREE.Mesh>(null!);
  const currentWorldPosition = useRef<WorldPosition>({ x: 0, y: 0, z: 0 });
  const currentPath = useRef<WorldPosition[]>([]);
  const pathIndex = useRef<number>(0);
  const animationEnabled = useRef<boolean>(false);
  const lastTargetTile = useRef<string | null>(null);
  const lastSentPosition = useRef<WorldPosition>({ x: 0, y: 0, z: 0 });

  // Store reference
  const { calculateDistance } = useTileStore();

  // ============================================================================
  // DONNÉES DÉRIVÉES DU CONTEXTE (COMME LE DRONE)
  // ============================================================================
  
  const vehicle = context?.vehicle;
  const shipState = context?.fsmState || '';
  const shipVisualState: VehicleVisualState = vehicle?.visualState || getShipVisualState(shipState);

  // ============================================================================
  // SYNCHRONISATION INITIALE DEPUIS FLEETPOSITION (SOURCE DE VÉRITÉ)
  // ============================================================================
  
  const hasInitialized = useRef<boolean>(false);
  
  useEffect(() => {
    // fleetPosition est la vraie source de vérité depuis Scene/Fleet
    // Envoyer seulement UNE FOIS au début pour éviter les boucles infinies
    if (fleetPosition && updateVisualPosition && !hasInitialized.current) {
      hasInitialized.current = true;
      fsmLogger.mouvement(`🚢 [${shipType}] INITIAL SYNC from fleetPosition (source of truth)`, {
        fleetPosition
      });
      updateVisualPosition(fleetPosition);
    }
  }, [fleetPosition, updateVisualPosition, shipType]); // Volontairement pas vehicle?.position pour éviter les boucles  // ============================================================================
  // CONTRÔLE D'ACTIVATION DE L'ANIMATION
  // ============================================================================
  
  useEffect(() => {
    if (!isActive) {
      animationEnabled.current = false;
      fsmLogger.debug(`🚢 [${shipType}] Animation disabled: not active`);
      return;
    }

    const needsAnimation = shouldAnimateShip(shipState, isMoving || false, isActive || false);
    
    if (needsAnimation !== animationEnabled.current) {
      animationEnabled.current = needsAnimation;
      fsmLogger.mouvement(`🚢 [${shipType}] Animation ${needsAnimation ? 'ENABLED' : 'DISABLED'}`, {
        shipState,
        isMoving,
        isActive,
        needsAnimation
      });
    }
  }, [shipState, isMoving, isActive, shipType]);

  // ============================================================================
  // CALCUL DE CHEMIN LORS DU CHANGEMENT DE CIBLE
  // ============================================================================
  
  useEffect(() => {
    if (!vehicle) {
      fsmLogger.debug(`🚢 [${shipType}] No path calculation: vehicle=${!!vehicle}`);
      return;
    }

    // Utiliser la position actuelle du vaisseau comme point de départ
    const startPosition = vehicle.position || vehicle.basePosition || currentWorldPosition.current;
    if (!startPosition) {
      fsmLogger.debug(`🚢 [${shipType}] No valid start position available`);
      return;
    }

    // Déterminer la cible selon l'état du vaisseau
    let targetCoord: WorldPosition | string | null = null;
    let targetKey: string = '';
    
    if (shipState === 'collecting_ship_returning') {
      // En état de retour, toujours cibler la base
      if (vehicle.basePosition) {
        targetCoord = vehicle.basePosition;
        targetKey = `base_${vehicle.basePosition.x}_${vehicle.basePosition.z}`;
        fsmLogger.mouvement(`🚢 [${shipType}] Targeting base for return`, { 
          basePosition: vehicle.basePosition,
          hasTargetTile: !!vehicle.targetTile
        });
      }
    } else if (vehicle.targetTile) {
      // Utiliser la tuile cible du véhicule pour la navigation
      targetCoord = vehicle.targetTile;
      targetKey = vehicle.targetTile;
    }
    
    if (!targetCoord) {
      fsmLogger.debug(`🚢 [${shipType}] No valid target: targetTile=${!!vehicle.targetTile}, returning=${shipState === 'collecting_ship_returning'}`);
      return;
    }

    // Éviter les recalculs inutiles
    if (lastTargetTile.current === targetKey) {
      return;
    }

    try {
      let newPath: WorldPosition[] = [];
      
      if (shipState === 'collecting_ship_returning') {
        // Pour le retour à la base, créer un chemin direct
        newPath = [
          startPosition,
          {
            x: (targetCoord as WorldPosition).x,
            y: (targetCoord as WorldPosition).y + 0.5,
            z: (targetCoord as WorldPosition).z
          }
        ];
        fsmLogger.mouvement(`🚢 [${shipType}] Direct path to base created`, { newPath });
      } else {
        // Calculer le nouveau chemin BFS vers la tuile
        newPath = calculateShipPath(startPosition, targetCoord);
      }

      
      if (newPath.length > 0) {
        currentPath.current = newPath;
        pathIndex.current = 0;
        lastTargetTile.current = targetKey;
        
        fsmLogger.mouvement(`🚢 [${shipType}] 🛤️  PATH: New path calculated`, {
          from: startPosition,
          to: targetCoord,
          pathLength: newPath.length,
          isReturning: shipState === 'collecting_ship_returning',
          path: newPath,
          currentWorldPositionBefore: { ...currentWorldPosition.current }
        });
        

      } else {
        fsmLogger.error(`🚢 [${shipType}] No path found`, {
          from: startPosition,
          to: targetCoord,
          isReturning: shipState === 'collecting_ship_returning'
        });
      }
    } catch (error) {
      // Log d'erreur seulement, pas de log de succès pour éviter les spams
      fsmLogger.error(`🚢 [${shipType}] Error calculating path`, { error, targetCoord });
    }
  }, [vehicle, shipType, shipState]);

  // ============================================================================
  // ANIMATION FRAME OPTIMISÉE - INTERPOLATION TUILE PAR TUILE
  // ============================================================================
  
  useFrame((state, delta) => {
    // Sortie précoce si l'animation n'est pas nécessaire
    if (!shipRef.current || !animationEnabled.current || currentPath.current.length === 0) {
      return;
    }

    const path = currentPath.current;
    const currentIndex = pathIndex.current;
    
    // Vérifier si le chemin est terminé
    if (isPathCompleted(currentWorldPosition.current, path, currentIndex)) {
      animationEnabled.current = false;
      fsmLogger.mouvement(`🚢 [${shipType}] Path completed`, {
        finalPosition: currentWorldPosition.current,
        pathLength: path.length
      });
      return;
    }

    // Obtenir la prochaine tuile cible
    if (currentIndex >= path.length - 1) {
      return; // Pas de prochaine tuile
    }

    const currentTarget = path[currentIndex + 1];
    const speed = getShipSpeed(shipState);
    const lerpFactor = Math.min(1.0, delta * speed);

    // ============================================================================
    // INTERPOLATION VERS LA PROCHAINE TUILE
    // ============================================================================
    
    currentWorldPosition.current.x = THREE.MathUtils.lerp(
      currentWorldPosition.current.x, 
      currentTarget.x, 
      lerpFactor
    );
    currentWorldPosition.current.y = THREE.MathUtils.lerp(
      currentWorldPosition.current.y, 
      currentTarget.y, 
      lerpFactor
    );
    currentWorldPosition.current.z = THREE.MathUtils.lerp(
      currentWorldPosition.current.z, 
      currentTarget.z, 
      lerpFactor
    );

    // ============================================================================
    // DÉTECTION D'ARRIVÉE SUR TUILE
    // ============================================================================
    
    const distance = calculateDistance(currentWorldPosition.current, currentTarget);
    if (distance < 0.1) { // Seuil de détection d'arrivée sur tuile
      pathIndex.current++;
      
      fsmLogger.mouvement(`🚢 [${shipType}] Reached waypoint ${currentIndex + 1}/${path.length}`, {
        waypointPosition: currentTarget,
        currentPosition: currentWorldPosition.current,
        remainingWaypoints: path.length - pathIndex.current - 1
      });
    }

    // ============================================================================
    // MISE À JOUR DU MESH ET ANIMATIONS VISUELLES
    // ============================================================================
    
    shipRef.current.position.set(
      currentWorldPosition.current.x,
      currentWorldPosition.current.y,
      currentWorldPosition.current.z
    );

    // Log de position toutes les 60 frames (environ 1 fois par seconde)
    if (Math.floor(state.clock.getElapsedTime() * 60) % 60 === 0) {
      fsmLogger.mouvement(`🚢 [${shipType}] 📍 MESH: Position update`, {
        currentWorldPosition: { ...currentWorldPosition.current },
        meshPosition: {
          x: shipRef.current.position.x,
          y: shipRef.current.position.y,
          z: shipRef.current.position.z
        },
        currentTarget: currentTarget ? { ...currentTarget } : null,
        pathIndex: currentIndex,
        pathLength: path.length,
        shipState
      });
    }

    // Appliquer les animations visuelles selon l'état
    applyShipVisualAnimations(
      shipRef.current,
      shipVisualState,
      currentWorldPosition.current.y, // baseY
      state.clock.getElapsedTime(),
      delta
    );

    // ============================================================================
    // ENVOI DE LA POSITION AU TRACKER (SEULEMENT SI CHANGEMENT SIGNIFICATIF)
    // ============================================================================
    
    // Éviter d'envoyer la position à chaque frame pour éviter les boucles infinies
    // Envoyer seulement si la position a changé de manière significative
    const positionChangeDelta = calculateDistance(currentWorldPosition.current, lastSentPosition.current);
    
    if (positionChangeDelta > 0.05) { // Seuil de changement significatif
      lastSentPosition.current = { ...currentWorldPosition.current };
      updateVisualPosition(currentWorldPosition.current);
    }
  });

  return {
    shipRef,
    shipState,
    currentPath: currentPath.current,
    pathIndex: pathIndex.current
  };
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Convertit l'état FSM en état visuel du vaisseau
 */
function getShipVisualState(shipState: string): VehicleVisualState {
  if (shipState.includes('moving_to_tile')) return 'moving_to_tile';
  if (shipState.includes('collecting')) return 'collecting';
  if (shipState.includes('returning')) return 'returning';
  return 'docked';
}
