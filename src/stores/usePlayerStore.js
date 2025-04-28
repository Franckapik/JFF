import { create } from 'zustand';
import { calculatePathData } from '../utils/utils'; // Import utility functions
import { useTileStore } from '../stores/useNewTileStore'; // Import du store des tuiles
import { Vector3 } from "three"; // Import Vector3 for 3D calculations

const usePlayerStore = create((set, get) => ({
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
  calculatePath: (playerId, targetTile, tiles) => {
    const playerVehicle = get().players[playerId].vehicles.ship;

    if (!playerVehicle || !targetTile || !tiles[targetTile]) return [];

    const queue = [[playerVehicle.coord]];
    const visited = new Set();
    let foundPath = [];

    while (queue.length > 0) {
      const currentPath = queue.shift();
      const currentCoord = currentPath[currentPath.length - 1];

      if (currentCoord === targetTile) {
        foundPath = currentPath;
        break;
      }

      if (!visited.has(currentCoord)) {
        visited.add(currentCoord);
        const neighbors = tiles[currentCoord]?.neighbors || [];
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor) && tiles[neighbor]?.walkable) {
            queue.push([...currentPath, neighbor]);
          }
        });
      }
    }

    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          vehicles: {
            ...state.players[playerId].vehicles,
            ship: {
              ...playerVehicle,
              path: foundPath, // Stocker le chemin calculé
            },
          },
        },
      },
    }));

    return foundPath;
  },
  updateShip: (playerId, updates) => {
    set((state) => {
      const updatedShip = {
        ...state.players[playerId].vehicles.ship,
        ...updates,
      };

      // Check if the ship is on the starting tile
      if (
        updatedShip.coord &&
        updatedShip.coord === state.players[playerId].vehicles.ship.startCoord &&
        !updatedShip.isMoving
      ) {
        const updatedScore = { ...state.players[playerId].score.resources };
        const shipResources = updatedShip.resources;

        // Add ship resources to the player's score
        updatedScore.food += shipResources.food;
        updatedScore.debris += shipResources.debris;
        updatedScore.special += shipResources.special;

        // Reset ship resources
        updatedShip.resources = { food: 0, debris: 0, special: 0 };

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...state.players[playerId],
              vehicles: {
                ...state.players[playerId].vehicles,
                ship: updatedShip,
              },
              score: {
                ...state.players[playerId].score,
                resources: updatedScore,
              },
            },
          },
        };
      }

      return {
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            vehicles: {
              ...state.players[playerId].vehicles,
              ship: updatedShip,
            },
          },
        },
      };
    });
  },
  selectVehicle: (playerId, vehicleId) => {
    set(() => ({
      selectedVehicle: { playerId, vehicleId }, // Update the globally selected vehicle
    }));
  },
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

  // === Fonctions utilitaires ===

  // Marquer l'arrivée du véhicule à la tuile cible
  markVehicleArrival: (playerId, currentTargetTile) => {
    set((state) => {
      const playerVehicle = state.players[playerId].vehicles.ship;

      return {
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            vehicles: {
              ...state.players[playerId].vehicles,
              ship: {
                ...playerVehicle,
                position: currentTargetTile.position,
                coord: currentTargetTile.coord,
                progress: 100, // Marquer la progression comme terminée
                isMoving: false, // Indiquer que le véhicule a cessé de se déplacer
              },
            },
          },
        },
      };
    });
  },

  // Collecter les ressources
  collectResources: (playerId, destinationTile) => {
    set((state) => {
      const playerVehicle = state.players[playerId].vehicles.ship;

      // Mettre à jour les ressources
      const updatedResources = {
        food: playerVehicle.resources.food + (destinationTile.resources.food || 0),
        debris: playerVehicle.resources.debris + (destinationTile.resources.debris || 0),
        special: playerVehicle.resources.special + (destinationTile.resources.special || 0),
      };

      // Marquer la tuile comme collectée
      const updatedTiles = { ...state.tiles };
      updatedTiles[destinationTile.coord] = {
        ...destinationTile,
        collected: true,
      };

      return {
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            vehicles: {
              ...state.players[playerId].vehicles,
              ship: {
                ...playerVehicle,
                resources: updatedResources,
              },
            },
          },
        },
        tiles: updatedTiles,
      };
    });
  },

  // Réparer le véhicule
  repairVehicle: (playerId) => {
    set((state) => {
      const playerVehicle = state.players[playerId].vehicles.ship;

      return {
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            vehicles: {
              ...state.players[playerId].vehicles,
              ship: {
                ...playerVehicle,
                damage: 0, // Réparer les dommages
              },
            },
          },
        },
      };
    });
  },

  // Ravitailler le véhicule
  refuelVehicle: (playerId) => {
    set((state) => {
      const playerVehicle = state.players[playerId].vehicles.ship;

      return {
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            vehicles: {
              ...state.players[playerId].vehicles,
              ship: {
                ...playerVehicle,
                fuel: 100, // Remplir le carburant
              },
            },
          },
        },
      };
    });
  },

  // Retourner à la base
  returnToBase: (playerId, currentTargetTile) => {
    const { markVehicleArrival } = get();
    markVehicleArrival(playerId, currentTargetTile);
  },

  // Actions à effectuer à la fin d'un déplacement
  finalizeMovement: (playerId, currentTargetTile) => {
    const clearSelectedTile = useTileStore.getState().clearSelectedTile; // Utiliser clearSelectedTile depuis useTileStore

    set((state) => {
      const playerVehicle = state.players[playerId].vehicles.ship;

      return {
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            vehicles: {
              ...state.players[playerId].vehicles,
              ship: {
                ...playerVehicle,
                position: currentTargetTile.position,
                coord: currentTargetTile.coord,
                progress: 100, // Marquer la progression comme terminée
                isMoving: false, // Indiquer que le véhicule a cessé de se déplacer
              },
            },
          },
        },
        hasReachedTarget: true, // Mettre à jour l'état global
      };
    });

    clearSelectedTile(); // Désélectionner la tuile
  },

  // Méthode pour mettre à jour la tuile cible du véhicule sélectionné
  setVehicleTargetTile: (playerId, vehicleId, targetTile) => {
    set((state) => {
      const vehicle =
        vehicleId === 'ship'
          ? state.players[playerId].vehicles.ship
          : state.players[playerId].vehicles.drones.find((drone) => drone.id === vehicleId);

      if (vehicle && targetTile) {
        const targetPosition = targetTile.position
          ? new Vector3(targetTile.position.x, targetTile.position.y, targetTile.position.z)
          : null;

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
                        position: targetPosition,
                        coord: targetTile.coord,
                      },
                    }
                  : state.players[playerId].vehicles.drones.map((drone) =>
                      drone.id === vehicleId
                        ? {
                            ...drone,
                            targetTile: {
                              position: targetPosition,
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

  moveVehicle: (playerId, vehicleId, newPosition, progress, targetTile) => {
    set((state) => {
      const vehicle =
        vehicleId === "ship"
          ? state.players[playerId].vehicles.ship
          : state.players[playerId].vehicles.drones.find((drone) => drone.id === vehicleId);

      if (!vehicle) {
        console.warn(`Vehicle with ID '${vehicleId}' not found for player '${playerId}'.`);
        return state;
      }

      const updatedVehicle = {
        ...vehicle,
        position: newPosition,
        progress: Math.min(progress, 100), // Limiter la progression à 100%.
        isMoving: progress < 100, // Indiquer si le véhicule est encore
        coord: progress === 100 && targetTile?.coord ? targetTile.coord : vehicle.coord,
        fuel: progress === 100 ? Math.max(vehicle.fuel - 10, 0) : vehicle.fuel,
      };

      return {
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            vehicles: {
              ...state.players[playerId].vehicles,
              [vehicleId === "ship" ? "ship" : "drones"]: vehicleId === "ship"
                ? updatedVehicle
                : state.players[playerId].vehicles.drones.map((drone) =>
                    drone.id === vehicleId ? updatedVehicle : drone
                  ),
            },
          },
        },
      };
    });
  },

  // ...other methods like updateShip, collectResources, repairVehicle, etc...
}));

export default usePlayerStore;


