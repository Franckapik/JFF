import React, { useMemo } from "react";
import { useXFSM } from "../hooks/useXFSM";
import { useXFSMDroneTracker } from "../ai/fsm/hooks/trackers/drone/useXFSMDroneTracker.js";
import { useXFSMShipTracker } from "../ai/fsm/hooks/trackers/ship/useXFSMShipTracker.js";
import { useDroneAnimation } from "../animations/useDroneAnimation.js";
import { useShipAnimation } from "../animations/useShipAnimation.js";
import ShipMesh from "./Vehicles/ShipMesh.jsx";
import DroneMesh from "./Vehicles/DroneMesh.jsx";
import  fsmLogger  from "../logger/fsmLogger.js";

/**
 * =================================================================
 * Composant Fleet - Architecture Refactorisée avec Hooks Spécialisés
 * =================================================================
 * 
 * ✅ ARCHITECTURE FINALE (Post-Refactorisation) :
 * 
 * 📁 STRUCTURE DES FICHIERS :
 * - Fleet.jsx : Coordination des véhicules et intégration FSM
 * - /ai/fsm/hooks/useFSMDroneTracker.js : Tracking spécialisé drones
 * - /ai/fsm/hooks/useFSMShipTracker.js : Tracking spécialisé vaisseaux
 * - /animations/useDroneAnimation.js : Animation des drones
 * - /animations/useShipAnimation.js : Animation des vaisseaux
 * 
 * 🔄 FLUX DE DONNÉES :
 * 1. Fleet.jsx reçoit shipPosition mondiale de Scene.jsx
 * 2. Hooks d'animation calculent positions locales (relatives au parent group)
 * 3. Trackers reçoivent positions mondiales pour événements FSM
 * 4. FSM met à jour le contexte selon les événements reçus
 * 
 * 🎯 RESPONSABILITÉS :
 * - useFSMDroneTracker : Surveillance des distances drone → événements FSM
 * - useFSMShipTracker : Surveillance des distances vaisseau → événements FSM  
 * - useDroneAnimation : Interpolation visuelle + feedback états drones
 * - useShipAnimation : Interpolation visuelle + feedback actions vaisseaux
 * - Fleet.jsx : Coordination, positionnement relatif, rendu final
 * 
 * ⚡ OPTIMISATIONS :
 * - Positionnement relatif (évite double transformation)
 * - Hooks spécialisés par type de véhicule
 * - Séparation animation/tracking pour clarté
 * 
 * @param {Object} props
 * @param {string} props.botId - ID du bot FSM (ex: 'bot-0')  
 * @param {number} props.botIndex - Index du bot pour la compatibilité
 * @param {Object} props.shipPosition - Position mondiale du vaisseau {x,y,z}
 * @param {string} props.color - Couleur des véhicules
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
  // 🚀 INTÉGRATION FSM AVEC ARCHITECTURE SPÉCIALISÉE
  // ===================================================================
  
  const { fsmState, context, send: fsmSend } = useXFSM(botId);

  // 🐛 DIAGNOSTIC : Log limité du contexte FSM lors de changements significatifs
  const lastLoggedContext = React.useRef({});
  React.useEffect(() => {
    // Ne logger que lors d'un changement d'état ou d'action
    const hasStateChanged = fsmState !== lastLoggedContext.current.fsmState;
    const hasActionChanged = context?.lastAction !== lastLoggedContext.current.lastAction;
    const droneState = context?.droneFleet?.drones?.explorer?.state;
    const hasDroneStateChanged = droneState !== lastLoggedContext.current.droneState;
    
    if (hasStateChanged || hasActionChanged || hasDroneStateChanged) {
      fsmLogger.info(`🛸 [Fleet] Context update for ${botId}:`, {
        fsmState,
        lastAction: context?.lastAction,
        vehiclePosition: context?.vehicle?.position ? 
          `(${context.vehicle.position.x.toFixed(1)}, ${context.vehicle.position.y.toFixed(1)}, ${context.vehicle.position.z.toFixed(1)})` : 
          'none',
        droneActive: context?.droneFleet?.drones?.explorer?.isActive,
        droneState,
        hasTargetPosition: !!context?.droneFleet?.drones?.explorer?.targetPosition,
        targetPosition: context?.droneFleet?.drones?.explorer?.targetPosition ? 
          `(${context.droneFleet.drones.explorer.targetPosition.x.toFixed(1)}, ${context.droneFleet.drones.explorer.targetPosition.y.toFixed(1)}, ${context.droneFleet.drones.explorer.targetPosition.z.toFixed(1)})` : 
          'none'
      });
      
      // Sauvegarder l'état actuel pour comparaison future
      lastLoggedContext.current = {
        fsmState,
        lastAction: context?.lastAction,
        droneState
      };
    }
  }, [context, fsmState, botId, shipPosition]);
  
  // 🔄 NOUVEAU - Log spécifique pour les changements d'état de drone
  const prevDroneState = React.useRef(null);
  React.useEffect(() => {
    const currentDroneState = context?.droneFleet?.drones?.explorer?.state;
    if (currentDroneState && currentDroneState !== prevDroneState.current) {
      fsmLogger.info(`🚨 [Fleet] DRONE STATE CHANGE for ${botId}:`, {
        from: prevDroneState.current,
        to: currentDroneState,
        position: context?.droneFleet?.drones?.explorer?.position,
        targetPosition: context?.droneFleet?.drones?.explorer?.targetPosition
      });
      prevDroneState.current = currentDroneState;
    }
  }, [context?.droneFleet?.drones?.explorer?.state, botId, context]);

  // 🎯 TRACKERS SPÉCIALISÉS : Surveillance distance → événements FSM
  // - useXFSMDroneTracker : Gère deploying, exploring, returning (XState)
  // - useFSMShipTracker : Gère movement, collecting, refueling
  const updateDroneVisualPosition = useXFSMDroneTracker(context, fsmSend, botId, 'explorer');
  const updateShipVisualPosition = useXFSMShipTracker(context, fsmSend, botId, 'ship');

  // 🎭 ANIMATIONS SPÉCIALISÉES : Interpolation visuelle + feedback d'état
  // - useDroneAnimation : Position relative + animations par état drone
  // - useShipAnimation : Position relative + animations par action vaisseau
  const { droneRef, initialPosition, droneState } = useDroneAnimation(
    context, 
    shipPosition, // Position mondiale pour calculs de coordonnées
    updateDroneVisualPosition, 
    'explorer'
  );
  
  const { shipRef, currentAction, isMoving } = useShipAnimation(
    context, 
    shipPosition, // Position mondiale pour calculs de tracking
    updateShipVisualPosition
  );

  // ===================================================================
  // 🎨 RENDU VISUEL - POSITIONNEMENT RELATIF OPTIMISÉ
  // ===================================================================
  // 
  // ⚡ ARCHITECTURE DE POSITIONNEMENT :
  // - Scene.jsx place Fleet dans un <group position={[tileX, 0.5, tileZ]}>
  // - Fleet utilise des positions relatives [0,0,0] pour éviter double transformation
  // - Animations calculent coordonnées locales puis envoient coordonnées mondiales aux trackers
  
  return (
    <>
      {/* 🚢 VAISSEAU PRINCIPAL - Position relative au group parent */}
      <group ref={shipRef} position={[0, 0, 0]}>
        <ShipMesh 
          color={color} 
          botId={botId} 
          context={context}
          currentAction={currentAction}
          isMoving={isMoving}
        />
      </group>

      {/* 🚁 DRONE EXPLORATEUR - Position relative avec offset initial */}
      <group 
        ref={droneRef}
        position={[
          initialPosition.x, // Offset relatif : explorer = [0.5, 0.3, 0.5]
          initialPosition.y, 
          initialPosition.z
        ]}
      >
        <DroneMesh 
          color={color} 
          botId={botId} 
          context={context} 
          droneState={{ state: droneState }}
          droneType="explorer"
        />
      </group>
    </>
  );
}, (prevProps, nextProps) => {
  // 🚀 OPTIMISATION MÉMOIRE - Évite les re-renders inutiles
  // Comparaison des props critiques pour les performances
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