import { create } from 'zustand';
import { calculatePathData } from '../utils/utils'; // Import utility functions
import { useTileStore } from '../stores/useNewTileStore'; // Import du store des tuiles
import { Vector3 } from "three"; // Import Vector3 for 3D calculations

// Fonction utilitaire pour mettre à jour un véhicule
const updateVehicle = (state, playerId, vehicleId, updates) => {
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
    ...updates,
  };

  return {
    ...state,
    players: {
      ...state.players,
      [playerId]: {
        ...state.players[playerId],
        vehicles: {
          ...state.players[playerId].vehicles,
          [vehicleId === "ship" ? "ship" : "drones"]:
            vehicleId === "ship"
              ? updatedVehicle
              : state.players[playerId].vehicles.drones.map((drone) =>
                  drone.id === vehicleId ? updatedVehicle : drone
                ),
        },
      },
    },
  };
};

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

      if (!destinationTile.collected) {
        // Mettre à jour les ressources
        const updatedResources = {
          food: playerVehicle.resources.food + (destinationTile.resources?.food || 0),
          debris: playerVehicle.resources.debris + (destinationTile.resources?.debris || 0),
          special: playerVehicle.resources.special + (destinationTile.resources?.special || 0),
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
      }

      return state;
    });
  },

  // Réparer le véhicule
  repairVehicle: (playerId) => {
    set((state) => updateVehicle(state, playerId, "ship", { damage: 0 }));
  },

  // Ravitailler le véhicule
  refuelVehicle: (playerId) => {
    set((state) => updateVehicle(state, playerId, "ship", { fuel: 100 }));
  },

  // Retourner à la base
  returnToBase: (playerId, currentTargetTile) => {
    const { markVehicleArrival } = get();
    markVehicleArrival(playerId, currentTargetTile);
  },

  // Actions à effectuer à la fin d'un déplacement
  finalizeMovement: (playerId, currentTargetTile) => {
    set((state) =>
      updateVehicle(state, playerId, "ship", {
        position: currentTargetTile.position,
        coord: currentTargetTile.coord,
        progress: 100, // Marquer la progression comme terminée
        isMoving: false, // Indiquer que le véhicule a cessé de se déplacer
        targetTile: { position: null, coord: null }, // Effacer la tuile cible
      })
    );
  },

  // Méthode pour mettre à jour la tuile cible du véhicule sélectionné
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

  moveVehicle: (playerId, vehicleId, newPosition, targetTile) => {
    set((state) => {
      const vehicle =
        vehicleId === "ship"
          ? state.players[playerId].vehicles.ship
          : state.players[playerId].vehicles.drones.find((drone) => drone.id === vehicleId);

      if (!vehicle) {
        console.warn(`Vehicle with ID '${vehicleId}' not found for player '${playerId}'.`);
        return state;
      }

      // Calculer la progression en fonction de la distance parcourue
      const targetPosition = targetTile?.position
        ? new Vector3(targetTile.position.x, targetTile.position.y, targetTile.position.z)
        : null;
      const distance = targetPosition
        ? new Vector3().subVectors(targetPosition, newPosition).length()
        : 0;
      const progress = targetPosition
        ? (1 - distance / targetPosition.length()) * 100
        : vehicle.progress;

      const updatedVehicle = {
        ...vehicle,
        position: newPosition,
        progress: Math.min(progress, 100), // Limiter la progression à 100%.
        isMoving: progress < 100, // Indiquer si le véhicule est encore en mouvement
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
}));

export default usePlayerStore;


