import React from "react";
import { Html } from "@react-three/drei";

const ShipMesh = ({ color, botId, context, currentAction, isMoving }) => {
  
  // 🎨 GESTION AVANCÉE DES COULEURS ÉMISSIVES PAR ACTION
  const getEmissiveColor = () => {
    switch (currentAction) {
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
  const getEmissiveIntensity = () => {
    switch (currentAction) {
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
      
      {/* ID LABEL - Vaisseau principal avec état et ressources */}
      <Html position={[0, 0.4, 0]} center>
        <div style={{ 
          color: 'rgba(255,255,255,0.8)', 
          fontSize: '10px', 
          background: 'rgba(0,0,0,0.7)', 
          padding: '3px 8px', 
          borderRadius: '6px',
          fontFamily: 'monospace',
          textAlign: 'center',
          border: currentAction === 'collecting' ? '1px solid #32CD32' : 
                  currentAction === 'moving_to_target' ? '1px solid #FFA500' : 
                  'none'
        }}>
          <div>{context?.vehicle?.id || `${botId}-ship`}</div>
          
          {/* État actuel */}
          {currentAction && (
            <div style={{ 
              fontSize: '8px', 
              color: getEmissiveColor(),
              fontWeight: currentAction === 'collecting' ? 'bold' : 'normal'
            }}>
              {currentAction === 'moving_to_target' ? '→ TARGET' :
               currentAction === 'collecting' ? '⚡ COLLECTING' :
               currentAction === 'returning_to_base' ? '← BASE' :
               currentAction.toUpperCase()}
            </div>
          )}
          
          {/* Indicateur de ressources */}
          {hasResources && (
            <div style={{ 
              fontSize: '7px', 
              color: '#FFD700',
              marginTop: '1px'
            }}>
              💎 {currentResources.food + currentResources.debris + currentResources.special}
            </div>
          )}
        </div>
      </Html>
    </mesh>
  );
};

export default ShipMesh;
