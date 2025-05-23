import React from "react";
import { Cone, Html } from "@react-three/drei";
import ShipMovement from "../Mouvement/ShipMovement";
import DroneMovement from "../Mouvement/DroneMovement";
import usePlayerStore from "../stores/playerStore";
import useBotStore from "../stores/useBotStore";
import { 
  getBotPlayerId, 
  getMainShipId, 
  getDroneId, 
  isMainShipId,
  VEHICLE_TYPES,
  HUMAN_PLAYER_ID
} from "../ai/constants/playerConstants";

/**
 * Composant Bot réutilisable qui encapsule la logique de rendu d'un bot et ses drones
 * Peut également être utilisé pour le joueur humain
 * @param {Object} props
 * @param {number|null} props.botIndex - Index du bot (0 pour Bot 1, 1 pour Bot 2, etc.), null pour le joueur humain
 * @param {Object} props.selectedVehicle - Véhicule actuellement sélectionné
 * @param {string} props.color - Couleur unique pour le bot et ses drones
 * @param {boolean} props.isHuman - Indique si c'est le joueur humain
 */
const Bot = React.memo(({ 
  botIndex = null, 
  selectedVehicle,
  color = "red",
  isHuman = false
}) => {
  // Déterminer l'ID du joueur (humain ou bot)
  const playerId = isHuman ? HUMAN_PLAYER_ID : getBotPlayerId(botIndex);
  
  // Récupérer le bot actif depuis le store (seulement pertinent pour les bots, pas pour le joueur humain)
  const currentBotIndex = useBotStore(state => state.currentBotIndex);
  const isActiveBot = !isHuman && currentBotIndex === botIndex;
  
  // Sélecteur pour les véhicules du bot ou du joueur
  const vehicles = usePlayerStore((state) => state.players[playerId]?.vehicles);
  
  // Déterminer si ce vaisseau est sélectionné
  const isSelected = selectedVehicle.playerId === playerId && isMainShipId(selectedVehicle.vehicleId);
  
  // Si le joueur/bot n'a pas été initialisé, ne rien rendre
  if (!vehicles) {
    return null;
  }

  return (
    <>
      {/* Vaisseau principal */}
      <ShipMovement playerId={playerId}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={color}
            emissive={isSelected ? "white" : isActiveBot ? "gold" : "black"}
            emissiveIntensity={isSelected ? 0.6 : isActiveBot ? 0.3 : 0}
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
            color: 'white',
            background: isActiveBot ? 'rgba(218, 165, 32, 0.7)' : 
                      isSelected ? 'rgba(255, 255, 255, 0.7)' :
                      isHuman ? 'rgba(0, 100, 255, 0.7)' : `rgba(0, 0, 0, 0.5)`,
            padding: '2px 6px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            userSelect: 'none',
            textAlign: 'center',
          }}>
            {isHuman ? 'Joueur 1' : `Bot ${botIndex + 1}`}
          </div>
        </Html>
      </ShipMovement>

      {/* Drone d'exploration - toujours visible car actif par défaut */}
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

      {/* Drone de combat - n'afficher que s'il est actif */}
      {vehicles && vehicles[getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE)]?.isActive && (
        <DroneMovement
          playerId={playerId}
          droneId={getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE)}
        >
          <group>
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
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI/4]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial 
                color={color === "red" ? "darkred" : color === "blue" ? "darkblue" : color === "green" ? "darkgreen" : "darkorange"} 
                metalness={0.7} 
                roughness={0.2} 
              />
            </mesh>
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

      {/* Drone spécial - n'afficher que s'il est actif */}
      {vehicles && vehicles[getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE)]?.isActive && (
        <DroneMovement
          playerId={playerId}
          droneId={getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE)}
        >
          <group>
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
}, (prevProps, nextProps) => {
  // Custom comparison function to determine if re-render is needed
  return (
    prevProps.botIndex === nextProps.botIndex &&
    prevProps.color === nextProps.color &&
    prevProps.isHuman === nextProps.isHuman &&
    prevProps.selectedVehicle.playerId === nextProps.selectedVehicle.playerId &&
    prevProps.selectedVehicle.vehicleId === nextProps.selectedVehicle.vehicleId
  );
});

export default Bot;
