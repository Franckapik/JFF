import React from "react";
import { Cone, Html } from "@react-three/drei";
import ShipMovement from "../Mouvement/ShipMovement";
import DroneMovement from "../Mouvement/DroneMovement";
import usePlayerStore from "../stores/usePlayerStore";

/**
 * =================================================================
 * Composant Fleet
 * =================================================================
 * Un composant réutilisable qui encapsule la logique de rendu 
 * d'une flotte et ses drones. Peut également être utilisé pour le joueur humain.
 * 
 * @param {Object} props
 * @param {number|null} props.botIndex - Index du bot (0 pour Bot 1, 1 pour Bot 2, etc.), null pour le joueur humain
 * @param {string} props.color - Couleur unique pour le bot et ses drones
 * @param {boolean} props.isHuman - Indique si c'est le joueur humain
 */
const Fleet = React.memo(({ 
  botIndex = null, 
  color = "red",
  isHuman = false
}) => {
  /**
   * -----------------------------------------------------------------
   * LOGIQUE DU COMPOSANT
   * -----------------------------------------------------------------
   */
  
  // Déterminer l'ID du joueur (humain ou bot) - version simplifiée pour FSM
  const playerId = isHuman ? "player-1" : `bot-${botIndex}`;
  
  // Sélecteur pour les véhicules du bot ou du joueur
  const vehicles = usePlayerStore((state) => state.players[playerId]?.vehicles);
  
  // Si le joueur/bot n'a pas été initialisé, ne rien rendre
  if (!vehicles) {
    return null;
  }

  /**
   * -----------------------------------------------------------------
   * RENDU DU COMPOSANT
   * -----------------------------------------------------------------
   */
  return (
    <>
      {/**
       * VAISSEAU PRINCIPAL
       * Représente le vaisseau principal du joueur ou du bot
       */}
      <ShipMovement playerId={playerId}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={color}
          />
        </mesh>
        
        {/* Étiquette indiquant le joueur ou le numéro du bot */}
        <Html position={[0, 0.7, 0]} center>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            {isHuman ? 'Joueur 1' : `Bot ${botIndex}`}
          </div>
        </Html>
      </ShipMovement>

      {/**
       * DRONE D'EXPLORATION
       * Simplifié pour la démonstration FSM
       */}
      {vehicles && vehicles[`${playerId}-explorer-drone`]?.isActive && vehicles[`${playerId}-explorer-drone`]?.position && (
        <DroneMovement 
          playerId={playerId} 
          droneId={`${playerId}-explorer-drone`}
        >
          <Cone 
            args={[0.15, 0.4, 8]} 
            rotation={[Math.PI, 0, 0]}
            castShadow
          >
            <meshStandardMaterial 
              color={color} 
              metalness={0.5} 
              roughness={0.3}
            />
          </Cone>
        </DroneMovement>
      )}

      {/**
       * DRONE DE COMBAT
       * Simplifié pour la démonstration FSM
       */}
      {vehicles && vehicles[`${playerId}-combat-drone`]?.isActive && vehicles[`${playerId}-combat-drone`]?.position && (
        <DroneMovement
          playerId={playerId}
          droneId={`${playerId}-combat-drone`}
        >
          <group>
            {/* Corps du drone */}
            <Cone 
              args={[0.2, 0.3, 6]} 
              rotation={[Math.PI, 0, 0]}
              castShadow
            >
              <meshStandardMaterial 
                color={color} 
                metalness={0.7} 
                roughness={0.2} 
              />
            </Cone>
            {/* Arme droite */}
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI/4]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial 
                color={color === "red" ? "darkred" : color === "blue" ? "darkblue" : color === "green" ? "darkgreen" : "darkorange"} 
                metalness={0.7} 
                roughness={0.2} 
              />
            </mesh>
            {/* Arme gauche */}
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0, -Math.PI/4]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial 
                color={color === "red" ? "darkred" : color === "blue" ? "darkblue" : color === "green" ? "darkgreen" : "darkorange"} 
                metalness={0.7} 
                roughness={0.2} 
              />
            </mesh>
          </group>
        </DroneMovement>
      )}

      {/**
       * DRONE SPÉCIAL
       * Simplifié pour la démonstration FSM
       */}
      {vehicles && vehicles[`${playerId}-special-drone`]?.isActive && vehicles[`${playerId}-special-drone`]?.position && (
        <DroneMovement
          playerId={playerId}
          droneId={`${playerId}-special-drone`}
        >
          <group>
            {/* Corps du drone spécial */}
            <Cone 
              args={[0.12, 0.35, 8]} 
              rotation={[Math.PI, 0, 0]}
              castShadow
            >
              <meshStandardMaterial 
                color={color} 
                metalness={0.6} 
                roughness={0.3} 
                emissive={color} 
                emissiveIntensity={0.3} 
              />
            </Cone>
            {/* Anneau technologique */}
            <mesh position={[0, -0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.15, 0.025, 8, 16]} />
              <meshStandardMaterial 
                color={color === "red" ? "darkred" : color === "blue" ? "darkblue" : color === "green" ? "darkgreen" : "darkorange"} 
                metalness={0.6} 
                roughness={0.3} 
                emissive={color} 
                emissiveIntensity={0.5} 
              />
            </mesh>
          </group>
        </DroneMovement>
      )}
    </>
  );
}, 
/**
 * Fonction de comparaison pour memoization
 * Empêche les re-rendus inutiles si les props n'ont pas changé
 */
(prevProps, nextProps) => {
  return (
    prevProps.botIndex === nextProps.botIndex &&
    prevProps.color === nextProps.color &&
    prevProps.isHuman === nextProps.isHuman
  );
});

export default Fleet;