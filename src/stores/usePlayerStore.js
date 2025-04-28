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
        // Convertir le tableau de drones en objets séparés
        drone1: {
          id: 'drone1',
          position: null,
          coord: null,
          isMoving: false,
          progress: 0,
          resources: { food: 0, debris: 0, special: 0 },
          targetTile: {
            position: null,
            coord: null,
          },
        },
        drone2: {
          id: 'drone2',
          position: null,
          coord: null,
          isMoving: false,
          progress: 0,
          resources: { food: 0, debris: 0, special: 0 },
          targetTile: {
            position: null,
            coord: null,
          },
        },
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
        // Convertir le tableau de drones en objets séparés
        drone3: {
          id: 'drone3',
          position: null,
          coord: null,
          isMoving: false,
          progress: 0,
          resources: { food: 0, debris: 0, special: 0 },
          targetTile: {
            position: null,
            coord: null,
          },
        },
        drone4: {
          id: 'drone4',
          position: null,
          coord: null,
          isMoving: false,
          progress: 0,
          resources: { food: 0, debris: 0, special: 0 },
          targetTile: {
            position: null,
            coord: null,
          },
        },
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

  // Pour compatibilité avec le code existant
  updateShip: (playerId, updates) => {
    const updateVehicleFn = get().updateVehicle;
    updateVehicleFn(playerId, "ship", updates);
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
      const player = state.players[playerId];
      if (!player) return state;
      
      const vehicle = player.vehicles[vehicleId];
      if (!vehicle) {
        console.warn(`Vehicle '${vehicleId}' not found for player '${playerId}'.`);
        return state;
      }
      
      return {
        players: {
          ...state.players,
          [playerId]: {
            ...player,
            vehicles: {
              ...player.vehicles,
              [vehicleId]: {
                ...vehicle,
                targetTile: {
                  position: targetTile.position,
                  coord: targetTile.coord,
                }
              }
            }
          }
        }
      };
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
   * Collecte les ressources d'une tuile pour un véhicule spécifique
   * @param {string} playerId - ID du joueur
   * @param {string} vehicleId - ID du véhicule
   * @param {Object} destinationTile - Tuile contenant des ressources
   */
  collectResources: (playerId, vehicleId, destinationTile) => {
    set((state) => {
      const player = state.players[playerId];
      if (!player) return state;
      
      const vehicle = player.vehicles[vehicleId || 'ship']; // Par défaut le vaisseau
      if (!vehicle) return state;
      
      if (!destinationTile.collected) {
        const updatedResources = {
          food: vehicle.resources.food + (destinationTile.resources?.food || 0),
          debris: vehicle.resources.debris + (destinationTile.resources?.debris || 0),
          special: vehicle.resources.special + (destinationTile.resources?.special || 0),
        };
        
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              vehicles: {
                ...player.vehicles,
                [vehicleId || 'ship']: {
                  ...vehicle,
                  resources: updatedResources
                }
              }
            }
          }
        };
      }
      
      return state;
    });
  },

  // Pour compatibilité avec le code existant
  collectResources: (playerId, destinationTile) => {
    const collectResourcesFn = get().collectResources;
    collectResourcesFn(playerId, 'ship', destinationTile);
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


