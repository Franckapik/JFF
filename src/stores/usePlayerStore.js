import { create } from 'zustand';
import { updateVehicle } from '../utils/utils'; // Importez la fonction utilitaire

const usePlayerStore = create((set, get) => ({
  // === ÉTAT INITIAL ===
  selectedVehicle: { playerId: 'player1', vehicleId: 'ship' }, // Default to player 1's ship
  players: {
    player1: {
      id: 'player1',
      vehicles: {
        ship: {
          id: 'ship1', // Unique ID for player 1's ship
          fuel: 100,
          damage: 20,
          position: null, // Initialize as null until tiles are available
          coord: null,
          isMoving: false,
          progress: 0,
          totalDistance: 0, // Total distance for the current path
          path: [], // Store the calculated path
          resources: { food: 0, debris: 0, special: 0 },
          startCoord: null, // Initialize as null until tiles are available
          targetTile: {
            position: null, // Vecteur 3D pour la position
            coord: null, // Coordonnée de la tuile
          },
        },
        drones: [
          {
            id: 'drone1', // Add an ID for the drone
            position: null,
            coord: null,
            isMoving: false,
            progress: 0,
            resources: { food: 0, debris: 0, special: 0 }, // Add resources for drones
            targetTile: {
              position: null,
              coord: null,
            },
          },
          {
            id: 'drone2', // Add another drone with an ID
            position: null,
            coord: null,
            isMoving: false,
            progress: 0,
            resources: { food: 0, debris: 0, special: 0 }, // Add resources for drones
          },
        ],
      },
      score: {
        resources: { food: 0, debris: 0, special: 0 },
      },
      memory: {
        knownResources: [],
        knownDangers: [],
      },
      messages: [], // Ensure messages array is initialized
    },
    player2: {
      id: 'player2',
      vehicles: {
        ship: {
          id: 'ship2', // Unique ID for player 2's ship
          fuel: 100,
          damage: 0,
          position: null,
          coord: null,
          isMoving: false,
          progress: 0,
          totalDistance: 0,
          path: [],
          resources: { food: 0, debris: 0, special: 0 },
          startCoord: null,
          targetTile: {
            position: null,
            coord: null,
          },
        },
        drones: [
          {
            id: 'drone3', // Add an ID for player 2's first drone
            position: null,
            coord: null,
            isMoving: false,
            progress: 0,
            resources: { food: 0, debris: 0, special: 0 }, // Add resources for drones
          },
          {
            id: 'drone4', // Add another drone for player 2
            position: null,
            coord: null,
            isMoving: false,
            progress: 0,
            resources: { food: 0, debris: 0, special: 0 }, // Add resources for drones
          },
        ],
      },
      score: {
        resources: { food: 0, debris: 0, special: 0 },
      },
      memory: {
        knownResources: [],
        knownDangers: [],
      },
      messages: [], // Ensure messages array is initialized
    },
  },

  // === INITIALISATION ===
  /**
   * Initialise les positions des joueurs sur les tuiles de départ
   * @param {Object} tiles - Les tuiles du jeu
   */
  initializePlayer: (tiles) => {
    const startingTiles = Object.values(tiles).filter((tile) => tile.type === "depart");
    if (startingTiles.length < 2) {
      throw new Error("Not enough starting tiles of type 'depart' found.");
    }

    set((state) => ({
      players: {
        ...state.players,
        player1: {
          ...state.players.player1,
          vehicles: {
            ...state.players.player1.vehicles,
            ship: {
              ...state.players.player1.vehicles.ship,
              position: startingTiles[0].position,
              coord: startingTiles[0].coord,
              startCoord: startingTiles[0].coord,
            },
          },
        },
        player2: {
          ...state.players.player2,
          vehicles: {
            ...state.players.player2.vehicles,
            ship: {
              ...state.players.player2.vehicles.ship,
              position: startingTiles[1].position,
              coord: startingTiles[1].coord,
              startCoord: startingTiles[1].coord,
            },
          },
        },
      },
    }));
  },

  // === GESTION DES VÉHICULES ===
  /**
   * Met à jour l'état d'un vaisseau avec de nouvelles propriétés
   * Gère aussi le dépôt automatique des ressources à la base
   * @param {string} playerId - ID du joueur
   * @param {Object} updates - Propriétés à mettre à jour
   */
  updateShip: (playerId, updates) => {
    set((state) => {
      const updatedState = updateVehicle(state, playerId, "ship", updates);

      // Vérifier si le véhicule est sur la tuile de départ
      const playerVehicle = updatedState.players[playerId].vehicles.ship;
      if (
        playerVehicle.coord &&
        playerVehicle.coord === playerVehicle.startCoord &&
        !playerVehicle.isMoving
      ) {
        const updatedScore = { ...updatedState.players[playerId].score.resources };
        const shipResources = playerVehicle.resources;

        // Ajouter les ressources du véhicule au score du joueur
        updatedScore.food += shipResources.food;
        updatedScore.debris += shipResources.debris;
        updatedScore.special += shipResources.special;

        // Réinitialiser les ressources du véhicule
        return updateVehicle(updatedState, playerId, "ship", {
          resources: { food: 0, debris: 0, special: 0 },
        });
      }

      return updatedState;
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
   * Met à jour la tuile cible d'un véhicule
   * @param {string} playerId - ID du joueur
   * @param {string} vehicleId - ID du véhicule
   * @param {Object} targetTile - Tuile cible
   */
  setVehicleTargetTile: (playerId, vehicleId, targetTile) => {
    set((state) => {
      const vehicle =
        vehicleId === 'ship'
          ? state.players[playerId].vehicles.ship
          : state.players[playerId].vehicles.drones.find((drone) => drone.id === vehicleId);

      if (vehicle && targetTile) {
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...state.players[playerId],
              vehicles: {
                ...state.players[playerId].vehicles,
                [vehicleId === 'ship' ? 'ship' : 'drones']: vehicleId === 'ship'
                  ? {
                      ...vehicle,
                      targetTile: {
                        position: targetTile.position,
                        coord: targetTile.coord,
                      },
                    }
                  : state.players[playerId].vehicles.drones.map((drone) =>
                      drone.id === vehicleId
                        ? {
                            ...drone,
                            targetTile: {
                              position: targetTile.position,
                              coord: targetTile.coord,
                            },
                          }
                        : drone
                    ),
              },
            },
          },
        };
      }

      console.warn(`Vehicle with ID '${vehicleId}' not found for player '${playerId}'.`);
      return state;
    });
  },

  // === GESTION DES DÉPLACEMENTS ===
  // Removing finalizeMovement function since it will be handled in the component

  /**
   * Force un véhicule à retourner à sa base
   * @param {string} playerId - ID du joueur
   * @param {Object} currentTargetTile - Tuile actuelle
   */
  returnToBase: (playerId, currentTargetTile) => {
  // logique de transfert des ressources
  },

  // === GESTION DES INTERACTIONS AVEC L'ENVIRONNEMENT ===
  /**
   * Collecte les ressources d'une tuile
   * @param {string} playerId - ID du joueur
   * @param {Object} destinationTile - Tuile contenant des ressources
   */
  collectResources: (playerId, destinationTile) => {
    set((state) => {
      const playerVehicle = state.players[playerId].vehicles.ship;

      if (!destinationTile.collected) {
        // Mettre à jour les ressources du véhicule
        const updatedResources = {
          food: playerVehicle.resources.food + (destinationTile.resources?.food || 0),
          debris: playerVehicle.resources.debris + (destinationTile.resources?.debris || 0),
          special: playerVehicle.resources.special + (destinationTile.resources?.special || 0),
        };
        
        // Remarque: nous ne modifions plus la tuile ici
        // Cette responsabilité est maintenant dans le TileStore

        return updateVehicle(state, playerId, "ship", {
          resources: updatedResources
        });
      }

      return state;
    });
  },

  /**
   * Répare un véhicule (remise à zéro des dégâts)
   * @param {string} playerId - ID du joueur
   */
  repairVehicle: (playerId) => {
    set((state) => updateVehicle(state, playerId, "ship", { damage: 0 }));
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
}));

export default usePlayerStore;


