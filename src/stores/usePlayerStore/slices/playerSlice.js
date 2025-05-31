/**
 * =========================================================================
 * PLAYER SLICE (BOT-ONLY SYSTEM)
 * =========================================================================
 * 
 * Ce slice gère la logique de base des bots dans le jeu :
 * - Création dynamique des bots uniquement (système bot-only)
 * - Configuration des vitesses de déplacement par type de véhicule
 * - Initialisation des positions de départ sur les tuiles appropriées
 * - Positionnement automatique des drones autour des vaisseaux principaux
 * 
 * Dépendances :
 * - useGameStore : pour récupérer la configuration du nombre de bots
 * - playerFactory : pour créer les instances de bots
 * - playerConstants : pour les identifiants et types de véhicules
 */

// =========================================================================
// IMPORTS
// =========================================================================
import useGameStore from '../../useGameStore/';
import fsmLogger from '../../../logger/fsmLogger';

// Utilitaires refactorisés
import { generateInitialPlayers } from '../utils/playerInitialization';
import { validateStartingTiles, getStartingTiles } from '../utils/tileValidation';

// =========================================================================
// CONSTANTES DE CONFIGURATION
// =========================================================================

/**
 * Configuration des vitesses de déplacement par type de véhicule
 * Ces valeurs peuvent être ajustées pour équilibrer le gameplay
 */
const MOVEMENT_SPEEDS = {
  ["ship"]: {
    speed: 2,
    rotationSpeed: 2.0
  },
  drone: {
    speed: 3,
    rotationSpeed: 2.5
  }
};

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createPlayerSlice = (set, get) => {
  return {
    
    // =====================================================================
    // ÉTAT INITIAL
    // =====================================================================
    
    /**
     * Configuration des vitesses de mouvement par type de véhicule
     */
    movementSpeeds: MOVEMENT_SPEEDS,
    
    /**
     * Dictionnaire de tous les joueurs (humains et bots) du jeu
     * Généré dynamiquement selon la configuration dans gameStore
     */
    players: generateInitialPlayers(),

    // =====================================================================
    // ACTIONS PUBLIQUES
    // =====================================================================
    
    /**
     * Initialise les positions des bots sur les tuiles de départ (système bot-only)
     * 
     * Cette fonction :
     * 1. Valide qu'il y a suffisamment de tuiles de départ
     * 2. Positionne chaque vaisseau principal sur une tuile différente
     * 3. Positionne automatiquement les drones en formation autour du vaisseau
     * 
     * @param {Object} tiles - Dictionnaire de toutes les tuiles du jeu
     * @throws {Error} Si pas assez de tuiles de départ disponibles
     */
    initializePlayer: (tiles) => {
      const { botCount } = useGameStore.getState();
      const currentPlayers = get().players;
      const numberOfPlayers = Object.keys(currentPlayers).length;
      
      fsmLogger.player(`Starting bot initialization`, {
        botCount,
        numberOfPlayers,
        totalTiles: Object.keys(tiles).length
      });
      
      // Filtrer les tuiles de départ disponibles
      const startingTiles = getStartingTiles(tiles);
      
      // Validation des tuiles de départ
      validateStartingTiles(startingTiles, 0, botCount, numberOfPlayers);

      // Mise à jour de l'état avec les nouvelles positions
      set((state) => {
        const updatedPlayers = { ...state.players };
        
        fsmLogger.player(`Beginning bot positioning on starting tiles`);
        
        // Positionner chaque bot sur une tuile de départ
        Object.keys(updatedPlayers).forEach((playerId, index) => {
          if (index < startingTiles.length) {
            const shipId = `${playerId}-ship`;
            const shipPosition = startingTiles[index].position;
            const shipCoord = startingTiles[index].coord;
            
            fsmLogger.player(`Positioning bot ${playerId} on starting tile ${shipCoord}`, {
              playerId,
              shipId,
              shipCoord,
              shipPosition,
              tileIndex: index
            });
            
            // Positionner le vaisseau principal
            const updatedVehicles = {
              ...updatedPlayers[playerId].vehicles,
              [shipId]: {
                ...updatedPlayers[playerId].vehicles[shipId],
                position: shipPosition,
                coord: shipCoord,
                startCoord: shipCoord,
              },
            };
            
/*             // Positionner les drones en formation autour du vaisseau
            const vehiclesWithDrones = positionDronesAroundShip(
              updatedVehicles, 
              playerId, 
              shipPosition, 
              shipCoord
            ); */
            
            // Mettre à jour le joueur avec ses véhicules positionnés
            updatedPlayers[playerId] = {
              ...updatedPlayers[playerId],
              vehicles: vehiclesWithDrones
            };

            fsmLogger.player(`Successfully positioned bot ${playerId} with ${Object.keys(vehiclesWithDrones).length} vehicles`, {
              playerId,
              vehicleCount: Object.keys(vehiclesWithDrones).length,
              vehicleIds: Object.keys(vehiclesWithDrones)
            });
          } else {
            fsmLogger.player(`Warning: No starting tile available for bot ${playerId} (index ${index})`, {
              playerId,
              index,
              availableTiles: startingTiles.length
            });
          }
        });
        
        fsmLogger.player(`Bot initialization completed successfully`, {
          totalBotsPositioned: Object.keys(updatedPlayers).length,
          playerIds: Object.keys(updatedPlayers)
        });
        
        return { players: updatedPlayers };
      });
    },
  };
};

export default createPlayerSlice;