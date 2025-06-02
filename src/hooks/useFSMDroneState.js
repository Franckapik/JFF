/**
 * ============================================================================
 * HOOK FSM DRONE STATE - Accès direct aux drones du contexte FSM
 * ============================================================================
 * 
 * Hook React pour accéder à l'état des drones directement depuis le contexte 
 * FSM sans passer par le Player Store.
 * 
 * @author FSM Integration
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import useFSMStore from '../stores/useFSMStore/index.js';
import fsmLogger from '../logger/fsmLogger.js';

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook pour accéder à l'état des drones d'un bot depuis le contexte FSM
 * @param {string} botId - ID du bot (ex: 'fsm-bot-0')
 * @returns {Object} État des drones du bot
 */
export const useFSMDroneState = (botId) => {
  const [droneFleet, setDroneFleet] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Obtenir le snapshot des états des bots depuis le store FSM
  const botStatesSnapshot = useFSMStore((state) => state.metrics.botStatesSnapshot);

  useEffect(() => {
    if (!botId || !botStatesSnapshot[botId]) {
      setDroneFleet(null);
      return;
    }

    const botState = botStatesSnapshot[botId];
    const newDroneFleet = botState.context?.droneFleet;

    if (newDroneFleet) {
      setDroneFleet(newDroneFleet);
      setLastUpdate(Date.now());
      
      fsmLogger.info(`[useFSMDroneState] Updated drone fleet for ${botId}`, {
        droneCount: Object.keys(newDroneFleet.drones || {}).length,
        status: newDroneFleet.status
      });
    }
  }, [botId, botStatesSnapshot]);

  // ========================================================================
  // UTILITAIRES CALCULÉES
  // ========================================================================

  /**
   * Calcule les positions finales des drones basées sur leur état
   */
  const calculateDronePositions = (shipPosition) => {
    if (!droneFleet?.drones || !shipPosition) {
      return {};
    }

    const positions = {};

    Object.entries(droneFleet.drones).forEach(([droneType, drone]) => {
      switch (drone.state) {
        case 'docked':
          // Position en formation autour du vaisseau
          const offset = droneFleet.formationOffsets[droneType];
          positions[droneType] = {
            x: shipPosition.x + offset.x,
            y: shipPosition.y + offset.y,
            z: shipPosition.z + offset.z
          };
          break;
          
        case 'deploying':
        case 'exploring':
        case 'returning':
          // Position cible ou position actuelle du drone
          positions[droneType] = drone.targetPosition || drone.position || shipPosition;
          break;
          
        default:
          positions[droneType] = shipPosition;
      }
    });

    return positions;
  };

  /**
   * Vérifie si un drone est en mouvement
   */
  const isDroneMoving = (droneType) => {
    const drone = droneFleet?.drones[droneType];
    return drone?.state === 'deploying' || drone?.state === 'exploring' || drone?.state === 'returning';
  };

  /**
   * Obtient l'état visuel d'un drone pour l'animation
   */
  const getDroneVisualState = (droneType) => {
    return droneFleet?.drones[droneType]?.state || 'docked';
  };

  /**
   * Vérifie si la flotte a une mission active
   */
  const hasActiveMission = () => {
    return droneFleet?.status === 'active' && droneFleet.currentMission !== null;
  };

  // ========================================================================
  // INTERFACE DE RETOUR
  // ========================================================================

  return {
    // État brut de la flotte
    droneFleet,
    
    // Statut global
    fleetStatus: droneFleet?.status || 'docked',
    currentMission: droneFleet?.currentMission,
    
    // Drones individuels
    drones: droneFleet?.drones || {},
    
    // Utilitaires
    calculateDronePositions,
    isDroneMoving,
    getDroneVisualState,
    hasActiveMission,
    
    // Métadonnées
    lastUpdate,
    isLoaded: !!droneFleet
  };
};

// ============================================================================
// HOOK POUR DRONE INDIVIDUEL
// ============================================================================

/**
 * Hook pour un drone spécifique
 * @param {string} botId - ID du bot
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns {Object} État du drone spécifique
 */
export const useFSMDrone = (botId, droneType) => {
  const { drones, isDroneMoving, getDroneVisualState, lastUpdate } = useFSMDroneState(botId);
  
  const drone = drones[droneType];
  
  return {
    drone,
    isActive: drone?.isActive || false,
    isMoving: isDroneMoving(droneType),
    visualState: getDroneVisualState(droneType),
    position: drone?.position,
    targetPosition: drone?.targetPosition,
    missionTarget: drone?.missionTarget,
    lastUpdate
  };
};

// ============================================================================
// EXPORT
// ============================================================================

export default useFSMDroneState;
