import { create } from 'zustand';
import { updateVehicle } from '../utils/utils'; // Importez la fonction utilitaire
import { useTileStore } from './useNewTileStore'; // Importez le tile store
import useGameStore from './useGameStore'; // Importez le gameStore

// Fonction pour créer un véhicule
const createVehicle = (id, isShip = false) => {
  const baseVehicle = {
    id,
    position: null,
    coord: null,
    isMoving: false,
    progress: 0,
    resources: { food: 0, debris: 0, special: 0 },
    targetTile: {
      position: null,
      coord: null,
    },
  };
  
  if (isShip) {
    return {
      ...baseVehicle,
      fuel: 100,
      damage: 0,
      totalDistance: 0,
      path: [],
      startCoord: null,
      isAtCapacity: false,
      maxCapacity: { food: 100, debris: 1000, special: 2 },
    };
  }
  
  return baseVehicle;
};

// Fonction pour créer un joueur
const createPlayer = (playerId) => {
  const playerNum = playerId.slice(-1); // Extraire le numéro du joueur (ex: 'player1' -> '1')
  const droneStartIdx = (parseInt(playerNum) - 1) * 2 + 1; // Calcule l'index de départ des drones
  
  return {
    id: playerId,
    exploringRadius: 3,
    vehicles: {
      ship: createVehicle(`ship${playerNum}`, true),
      [`drone${droneStartIdx}`]: createVehicle(`drone${droneStartIdx}`),
      [`drone${droneStartIdx + 1}`]: createVehicle(`drone${droneStartIdx + 1}`),
    },
    score: {
      resources: { food: 0, debris: 0, special: 0 },
    },
    memory: {
      knownResources: [],
      knownDangers: [],
      explorationCount: 0,
      collectedResources: [],
    },
    messages: [],
  };
};

const usePlayerStore = create((set, get) => {
  // Récupérer le nombre de joueurs depuis gameStore
  const { playerCount } = useGameStore.getState();
  
  // Générer les joueurs dynamiquement
  const initialPlayers = {};
  for (let i = 1; i <= playerCount; i++) {
    initialPlayers[`player${i}`] = createPlayer(`player${i}`);
  }

  // Personnaliser le joueur 1 si nécessaire (par exemple pour les dommages initiaux)
  if (initialPlayers.player1) {
    initialPlayers.player1.vehicles.ship.damage = 20;
  }
  
  return {
    // === ÉTAT INITIAL ===
    selectedVehicle: { playerId: 'player1', vehicleId: 'ship' },
    
    // Nouvelles propriétés pour les vitesses de mouvement des véhicules (simplifiées)
    movementSpeeds: {
      ship: {
        speed: 2,
        rotationSpeed: 2.0
      },
      drone: {
        speed: 2,
        rotationSpeed: 2.0
      }
    },
    
    players: initialPlayers,
    
    // === INITIALISATION ===
    /**
     * Initialise les positions des joueurs sur les tuiles de départ
     * @param {Object} tiles - Les tuiles du jeu
     */
    initializePlayer: (tiles) => {
      const startingTiles = Object.values(tiles).filter((tile) => tile.type === "depart");
      if (startingTiles.length < Object.keys(get().players).length) {
        throw new Error(`Not enough starting tiles of type 'depart' found. Need ${Object.keys(get().players).length}.`);
      }

      set((state) => {
        const updatedPlayers = { ...state.players };
        
        Object.keys(updatedPlayers).forEach((playerId, index) => {
          if (index < startingTiles.length) {
            updatedPlayers[playerId] = {
              ...updatedPlayers[playerId],
              vehicles: {
                ...updatedPlayers[playerId].vehicles,
                ship: {
                  ...updatedPlayers[playerId].vehicles.ship,
                  position: startingTiles[index].position,
                  coord: startingTiles[index].coord,
                  startCoord: startingTiles[index].coord,
                },
              },
            };
          }
        });
        
        return { players: updatedPlayers };
      });
    },

    // === GESTION DES VÉHICULES ===
    /**
     * Met à jour l'état d'un véhicule avec de nouvelles propriétés
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule (ship, drone1, drone2, etc.)
     * @param {Object} updates - Propriétés à mettre à jour
     */
    updateVehicle: (playerId, vehicleId, updates) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        const vehicle = player.vehicles[vehicleId];
        if (!vehicle) {
          console.warn(`Vehicle '${vehicleId}' not found for player '${playerId}'.`);
          return state;
        }
        
        const updatedVehicle = { ...vehicle, ...updates };
        
        // Logique spécifique pour les vaisseaux à la base (dépôt des ressources)
        if (vehicleId === 'ship' && 
            updatedVehicle.coord &&
            updatedVehicle.coord === updatedVehicle.startCoord &&
            !updatedVehicle.isMoving) {
          // Mise à jour du score avec les ressources du vaisseau
          const updatedScore = { ...player.score.resources };
          const shipResources = updatedVehicle.resources;
          
          updatedScore.food += shipResources.food;
          updatedScore.debris += shipResources.debris;
          updatedScore.special += shipResources.special;
          
          // Réinitialiser les ressources du vaisseau
          updatedVehicle.resources = { food: 0, debris: 0, special: 0 };
          
          return {
            players: {
              ...state.players,
              [playerId]: {
                ...player,
                vehicles: {
                  ...player.vehicles,
                  [vehicleId]: updatedVehicle
                },
                score: {
                  ...player.score,
                  resources: updatedScore
                }
              }
            }
          };
        }
        
        // Mise à jour standard du véhicule
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              vehicles: {
                ...player.vehicles,
                [vehicleId]: updatedVehicle
              }
            }
          }
        };
      });
    },

    /**
     * Définit le véhicule actuellement sélectionné
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     */
    selectVehicle: (playerId, vehicleId) => {
      set(() => ({
        selectedVehicle: { playerId, vehicleId }, // Update the globally selected vehicle
      }));
    },

    /**
     * Met à jour la tuile cible d'un véhicule et initie un mouvement
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @param {Object} targetTile - Tuile cible
     */
    moveToTile: (playerId, vehicleId, targetTile) => {
      console.log(`[PlayerStore] Moving ${playerId}/${vehicleId} to tile:`, targetTile.coord);
      
      // Vérifier que les données sont valides
      if (!targetTile || !targetTile.position || !targetTile.coord) {
        console.error("Invalid target tile data:", targetTile);
        return;
      }
      
      set((state) => updateVehicle(state, playerId, vehicleId, {
        targetTile: {
          position: targetTile.position,
          coord: targetTile.coord,
        },
        isMoving: true // Assurez-vous que isMoving est défini sur true
      }));
    },

    /**
     * Transfère les ressources d'un véhicule vers le score du joueur
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule (par défaut: "ship")
     * @returns {boolean} - true si le transfert a réussi, false sinon
     */
     transferResourcesToScore: (playerId, vehicleId = "ship") => {
      const player = get().players[playerId];
      if (!player) return false;
      
      const vehicle = player.vehicles[vehicleId];
      if (!vehicle) return false;
      
      // Vérifier si le véhicule est à sa base
      if (vehicle.coord !== vehicle.startCoord) {
        return false;
      }
      
      // Transférer les ressources au score
      const resources = vehicle.resources;
      
      set((state) => {
        // 1. Mettre à jour le score du joueur
        const updatedScore = {
          ...state.players[playerId].score,
          resources: {
            food: state.players[playerId].score.resources.food + resources.food,
            debris: state.players[playerId].score.resources.debris + resources.debris,
            special: state.players[playerId].score.resources.special + resources.special,
          }
        };
        
        // 2. Réinitialiser les ressources du véhicule
        const updatedVehicle = {
          ...vehicle,
          resources: { food: 0, debris: 0, special: 0 }
        };
        
        // 3. Mettre à jour l'état
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...state.players[playerId],
              vehicles: {
                ...state.players[playerId].vehicles,
                [vehicleId]: updatedVehicle
              },
              score: updatedScore
            }
          }
        };
      });
    },

    checkResourceCapacity: (playerId, vehicleId) => {
      const player = get().players[playerId];
      const vehicle = player.vehicles[vehicleId];

      if (!vehicle.maxCapacity) return; // Skip if the vehicle has no maxCapacity (e.g., drones)

      const { food, debris, special } = vehicle.resources;
      const { food: maxFood, debris: maxDebris, special: maxSpecial } = vehicle.maxCapacity;

      // NOTE: On considère qu'une seule ressource pleine suffit pour déclencher la capacité maximale
      // C'est-à-dire, si food OU debris OU special atteint sa capacité maximale
      const isAtMaxCapacity = food >= maxFood || debris >= maxDebris || special >= maxSpecial;  
      
      /* Version alternative où toutes les ressources doivent être pleines (ET logique)
      const isAtMaxCapacity = food >= maxFood && debris >= maxDebris && special >= maxSpecial;
      */
      
      // Si à capacité max, marquer seulement le vaisseau avec isAtCapacity = true
      if (isAtMaxCapacity) {
        console.log(`${playerId}/${vehicleId} est à sa capacité maximale.`);
        
        // Mettre à jour le vaisseau avec la nouvelle propriété
        set((state) => updateVehicle(state, playerId, vehicleId, { 
          isAtCapacity: true 
        }));
      }
      
      return isAtMaxCapacity;
    },

    /**
     * Ravitaille un véhicule en carburant (remise à 100)
     * @param {string} playerId - ID du joueur
     */
    refuelVehicle: (playerId) => {
      set((state) => updateVehicle(state, playerId, "ship", { fuel: 100 }));
    },

    // === GESTION DES MESSAGES ===
    /**
     * Ajoute un message au journal du joueur
     * @param {string} playerId - ID du joueur
     * @param {Object} message - Message à ajouter
     */
    addPlayerMessage: (playerId, message) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) {
          console.error(`Player with ID '${playerId}' does not exist.`);
          return state; // Return the current state without changes
        }

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              messages: [...player.messages, message],
            },
          },
        };
      });
    },

    /**
     * Marque tous les messages d'un joueur comme lus
     * @param {string} playerId - ID du joueur
     */
    markMessagesAsRead: (playerId) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) {
          console.error(`Player with ID '${playerId}' does not exist.`);
          return state; // Return the current state without changes
        }

        const updatedMessages = player.messages.map((message) => ({
          ...message,
          isRead: true, // Mark all messages as read
        }));

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              messages: updatedMessages,
            },
          },
        };
      });
    },

    /**
     * Consomme du carburant pour un véhicule spécifique
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @param {number} amount - Quantité de carburant à consommer (par défaut: 5)
     * @returns {boolean} - true si suffisamment de carburant, false sinon
     */
    consumeFuel: (playerId, vehicleId, amount = 5) => {
      const player = get().players[playerId];
      if (!player) return false;
      
      const vehicle = player.vehicles[vehicleId];
      if (!vehicle) return false;
      
      // Vérifier s'il y a suffisamment de carburant
      if (vehicle.fuel <= 0) {
        set((state) => updateVehicle(state, playerId, vehicleId, { isMoving: false }));
        return false;
      }
      
      // Consommer le carburant et mettre à jour le véhicule
      const newFuelLevel = Math.max(vehicle.fuel - amount, 0);
      set((state) => updateVehicle(state, playerId, vehicleId, { fuel: newFuelLevel }));
      
      // Retourner true si le nouveau niveau est > 0, false sinon
      return newFuelLevel > 0;
    },

    /**
     * Met à jour la mémoire d'un joueur
     * @param {string} playerId - ID du joueur (ex: 'player1', 'player2')
     * @param {Object} updates - Propriétés à mettre à jour dans la mémoire
     */
    updatePlayerMemory: (playerId, updates) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) {
          console.error(`Player with ID '${playerId}' does not exist.`);
          return state;
        }

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              memory: {
                ...player.memory,
                ...updates, // Applique les mises à jour à la mémoire existante
              },
            },
          },
        };
      });
    },

  };
});

export default usePlayerStore;


