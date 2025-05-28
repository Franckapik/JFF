import React from "react";
import { Cone, Html } from "@react-three/drei";
import ShipMovement from "../Mouvement/ShipMovement";
import DroneMovement from "../Mouvement/DroneMovement";
import usePlayerStore from "../stores/usePlayerStore";
import useBotStore from "../stores/useBotStore/";
import { 
  getBotId, 
  getMainShipId, 
  getDroneId, 
  isMainShipId,
  VEHICLE_TYPES,
  getHumanPlayerId
} from "../ai/constants/playerConstants";

/**
 * =================================================================
 * Composant Bot
 * =================================================================
 * Un composant réutilisable qui encapsule la logique de rendu 
 * d'un bot et ses drones. Peut également être utilisé pour le joueur humain.
 * 
 * @param {Object} props
 * @param {number|null} props.botIndex - Index du bot (0 pour Bot 1, 1 pour Bot 2, etc.), null pour le joueur humain
 * @param {string} props.color - Couleur unique pour le bot et ses drones
 * @param {boolean} props.isHuman - Indique si c'est le joueur humain
 */
const Bot = React.memo(({ 
  botIndex = null, 
  color = "red",
  isHuman = false
}) => {
  /**
   * -----------------------------------------------------------------
   * LOGIQUE DU COMPOSANT
   * -----------------------------------------------------------------
   */
  
  // Déterminer l'ID du joueur (humain ou bot)
  const playerId = isHuman ? getHumanPlayerId(1) : getBotId(botIndex);
  
  // Récupérer le bot actif depuis le store (seulement pertinent pour les bots, pas pour le joueur humain)
  const currentBotIndex = useBotStore(state => state.currentBotIndex);
  const isActiveBot = !isHuman && currentBotIndex === botIndex;
  
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
            emissive={isActiveBot ? "gold" : "black"}
            emissiveIntensity={isActiveBot ? 0.3 : 0}
          />
        </mesh>
        
        {/* Indicateur visuel du bot actif */}
        {isActiveBot && (
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="gold" emissive="gold" emissiveIntensity={0.5} />
          </mesh>
        )}

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
       * Toujours visible par défaut, sauf si explicitement désactivé
       */}
      {(!vehicles || vehicles[getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE)]?.isActive !== false) && (
        <DroneMovement 
          playerId={playerId} 
          droneId={getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE)}
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
       * N'est affiché que s'il est actif dans les véhicules du joueur
       */}
      {vehicles && vehicles[getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE)]?.isActive && (
        <DroneMovement
          playerId={playerId}
          droneId={getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE)}
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
       * Unité avancée avec des capacités spéciales, n'est affichée que si elle est active
       */}
      {vehicles && vehicles[getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE)]?.isActive && (
        <DroneMovement
          playerId={playerId}
          droneId={getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE)}
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

export default Bot;
