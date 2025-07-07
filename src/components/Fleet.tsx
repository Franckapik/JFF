import React, { useEffect, useRef } from "react";
import { useXFSMDroneTracker } from "../ai/fsm/hooks/trackers/drone/useXFSMDroneTracker.js";
import { useXFSMShipTracker } from "../ai/fsm/hooks/trackers/ship/useXFSMShipTracker.js";
import { useDroneAnimation } from "../animations/useDroneAnimation.js";
import { useShipAnimation } from "../animations/useShipAnimation.js";
import { useXFSM } from "../hooks/useXFSM";
import fsmLogger from "../logger/fsmLogger.js";
import DroneMesh from "./Vehicles/DroneMesh";
import ShipMesh from "./Vehicles/ShipMesh";

// Types
import type { VehicleId, WorldPosition } from "../types";
import type { TileCoordinate } from "../types/coordinates";
import "../types/r3f.d.ts"; // Import R3F types

/**
 * Props interface for Fleet component
 */
interface FleetProps {
  /** ID du bot FSM (ex: 'bot-0') */
  botId: VehicleId;
  /** Index du bot pour la compatibilité */
  botIndex: number;
  /** Position mondiale du vaisseau {x,y,z} */
  shipPosition: WorldPosition;
  /** Couleur des véhicules */
  color: string;
  /** Coordonnée de la tuile de départ */
  tileCoord: TileCoordinate;
}

/**
 * Référence pour le contexte précédent de logging
 */
interface LoggingContext {
  fsmState?: string;
  lastAction?: string;
  droneState?: string;
}

/**
 * =================================================================
 * Composant Fleet - Architecture Refactorisée avec Hooks Spécialisés
 * =================================================================
 * 
 * ✅ ARCHITECTURE FINALE (Post-Refactorisation) :
 * 
 * 📁 STRUCTURE DES FICHIERS :
 * - Fleet.tsx : Coordination des véhicules et intégration FSM
 * - /ai/fsm/hooks/useFSMDroneTracker.js : Tracking spécialisé drones
 * - /ai/fsm/hooks/useFSMShipTracker.js : Tracking spécialisé vaisseaux
 * - /animations/useDroneAnimation.js : Animation des drones
 * - /animations/useShipAnimation.js : Animation des vaisseaux
 * 
 * 🔄 FLUX DE DONNÉES :
 * 1. Fleet.tsx reçoit shipPosition mondiale de Scene.tsx
 * 2. Hooks d'animation calculent positions locales (relatives au parent group)
 * 3. Trackers reçoivent positions mondiales pour événements FSM
 * 4. FSM met à jour le contexte selon les événements reçus
 * 
 * 🎯 RESPONSABILITÉS :
 * - useFSMDroneTracker : Surveillance des distances drone → événements FSM
 * - useFSMShipTracker : Surveillance des distances vaisseau → événements FSM  
 * - useDroneAnimation : Interpolation visuelle + feedback états drones
 * - useShipAnimation : Interpolation visuelle + feedback actions vaisseaux
 * - Fleet.tsx : Coordination, positionnement relatif, rendu final
 * 
 * ⚡ OPTIMISATIONS :
 * - Positionnement relatif (évite double transformation)
 * - Hooks spécialisés par type de véhicule
 * - Séparation animation/tracking pour clarté
 */
const Fleet: React.FC<FleetProps> = React.memo(({ 
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
  const lastLoggedContext = useRef<LoggingContext>({});
  
  useEffect(() => {
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
  const prevDroneState = useRef<string | null>(null);
  
  useEffect(() => {
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
  // - Scene.tsx place Fleet dans un <group position={[tileX, 0.5, tileZ]}>
  // - Fleet utilise des positions relatives [0,0,0] pour éviter double transformation
  // - Animations calculent coordonnées locales puis envoient coordonnées mondiales aux trackers
  
  return (
    <>
      {/* 🚢 VAISSEAU PRINCIPAL - Position relative au group parent */}
      {/* @ts-ignore - React Three Fiber elements */}
      <group ref={shipRef} position={[0, 0, 0]}>
        <ShipMesh 
          color={color} 
          botId={botId} 
          context={context}
          currentAction={currentAction}
          isMoving={isMoving}
        />
      {/* @ts-ignore */}
      </group>

      {/* 🚁 DRONE EXPLORATEUR - Position relative avec offset initial */}
      {/* @ts-ignore - React Three Fiber elements */}
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
      {/* @ts-ignore */}
      </group>
    </>
  );
}, (prevProps: FleetProps, nextProps: FleetProps) => {
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
