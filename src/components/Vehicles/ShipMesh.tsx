import React from "react";

// Types
import type { FSMContext } from "../../types/fsm";

/**
 * Props interface for ShipMesh component
 */
interface ShipMeshProps {
  /** Couleur du vaisseau */
  color: string;
  /** Contexte FSM pour l'état du vaisseau */
  context?: FSMContext;
  /** Action actuelle du vaisseau */
  currentAction?: string;
  /** Indique si le vaisseau est en mouvement */
  isMoving?: boolean;
}

/**
 * Type pour les actions du vaisseau
 */
type ShipAction = 
  | 'moving_to_target'
  | 'collecting'
  | 'resource_collection'
  | 'returning_to_base'
  | 'refueling'
  | 'fuel_maintenance'
  | 'idling';

const ShipMesh: React.FC<ShipMeshProps> = ({ 
  color, 
  context, 
  currentAction, 
  isMoving = false 
}) => {
  
  // 🎨 GESTION AVANCÉE DES COULEURS ÉMISSIVES PAR ACTION
  const getEmissiveColor = (): string => {
    switch (currentAction as ShipAction) {
      case 'moving_to_target':
        return "#FFA500"; // Orange pour déplacement vers cible
      case 'collecting':
      case 'resource_collection':
        return "#32CD32"; // Vert pour collecte active
      case 'returning_to_base':
        return "#FF6B6B"; // Rouge-orange pour retour
      case 'refueling':
      case 'fuel_maintenance':
        return "#1E90FF"; // Bleu pour refuel
      case 'idling':
        return "#4A90E2"; // Bleu clair pour attente
      default:
        return isMoving ? "#FFD700" : "#666666"; // Or pour mouvement, gris pour inactif
    }
  };
  
  // 🌟 INTENSITÉ ÉMISSIVE DYNAMIQUE SELON L'ACTION
  const getEmissiveIntensity = (): number => {
    switch (currentAction as ShipAction) {
      case 'collecting':
      case 'resource_collection':
        return 0.5; // Très visible pendant la collecte
      case 'moving_to_target':
        return 0.35; // Bien visible pendant le déplacement
      case 'returning_to_base':
        return 0.4; // Visible pendant le retour
      case 'refueling':
        return 0.3;
      default:
        return isMoving ? 0.2 : 0.1;
    }
  };
  
  // 📊 INDICATEUR DE RESSOURCES (si le vaisseau en a)
  const currentResources = context?.vehicle?.resources;
  const hasResources = currentResources && 
    (currentResources.food > 0 || currentResources.debris > 0 || currentResources.special > 0);
  
  return (
    <mesh position={[0, 0, 0]} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color={color} 
        emissive={getEmissiveColor()}
        emissiveIntensity={getEmissiveIntensity()}
        // Ajout d'un effet métallique si le vaisseau a des ressources
        metalness={hasResources ? 0.3 : 0.1}
        roughness={hasResources ? 0.4 : 0.8}
      />
    </mesh>
  );
};

export default ShipMesh;
