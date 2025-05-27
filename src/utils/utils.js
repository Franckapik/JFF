import { Vector3 } from "three";
// Remove the redundant import of calculatePathData
// import { calculatePathData } from "./utils"; 
import usePlayerStore from "../stores/usePlayerStore"; // Import player store
import useGameStore from "../stores/useGameStore/"; // Import game store
import { HUMAN_PLAYER_ID, getBotId } from "../ai/constants/playerConstants";

export function generateHexPositions(radius, spacing) {
  const gameStore = useGameStore.getState(); // Get current game state
  const humanPlayerCount = gameStore.playerCount; // Number of human players
  const botPlayerCount = gameStore.botCount;     // Number of bot players
  const totalPlayers = humanPlayerCount + botPlayerCount; // Total players

  // Note: The original line was: const playerCount = gameStore.playerCount; // Get total number of players
  // If the local variable 'playerCount' was used later in this function
  // with the expectation that it represented total players, 'totalPlayers' should be used instead.
  // The following code for hex grid generation does not appear to use these counts.

  const hexPositions = [];
  const sqrt3 = Math.sqrt(3);

  // Directions pour calculer les voisins
  const directions = [
    { q: 1, r: 0 },
    { q: -1, r: 0 },
    { q: 0, r: 1 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
    { q: -1, r: 1 },
  ];

  const encodeCoord = (q, r) => {
    const letter = String.fromCharCode(65 + q + radius); // Offset q to ensure it's non-negative
    return `${letter}${r + radius}`; // Offset r to ensure it's non-negative
  };

  // Generate base hex grid
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(s) <= radius) {
        const x = (q + r / 2) * (1.7 + spacing);
        const z = r * (sqrt3 / 2) * (1.7 + spacing);

        // Calcul des voisins
        const neighbors = directions
          .map((dir) => ({ q: q + dir.q, r: r + dir.r }))
          .filter(
            (neighbor) =>
              Math.abs(neighbor.q) <= radius &&
              Math.abs(neighbor.r) <= radius &&
              Math.abs(-neighbor.q - neighbor.r) <= radius
          )
          .map((neighbor) => encodeCoord(neighbor.q, neighbor.r)); // Encode neighbors

        // Déterminer si la tuile est "outer"
        const outer = neighbors.length < 6;

        hexPositions.push({
          coord: encodeCoord(q, r), // Encode q and r as a letter-number coordinate
          position: { x, y: 0, z },
          walkable: true, // Par défaut, la tuile est accessible
          explored: false, // Par défaut, la tuile n'est pas explorée
          collected: false, // Par défaut, la tuile n'est pas collectée
          partiallyCollected: false, // Par défaut, la tuile n'est pas partiellement collectée
          type: "resource", // Par défaut, la tuile est une ressource
          neighbors, // Encoded neighbors
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Couleur aléatoire
          outer, // Propriété outer
          resources: {
            food: Math.floor(Math.random() * 101), // Random food quantity (0-100)
            debris: Math.floor(Math.random() * 1001), // Random debris quantity (0-10000)
            special: Math.floor(Math.random() * 3), // Random special quantity (0-2)
          },
          immunity: Math.random() < 0.1, // 10% chance of immunity
        });
      }
    }
  }

  // Randomly set two tiles as non-walkable
  const walkableTiles = hexPositions.filter((tile) => tile.walkable && !tile.outer);
  const randomIndices = [];
  // Correction: S'assurer que la boucle ne devient pas infinie si walkableTiles.length < 2
  const numTilesToMakeNonWalkable = Math.min(2, walkableTiles.length);
  while (randomIndices.length < numTilesToMakeNonWalkable && walkableTiles.length > 0) {
    const randomIndex = Math.floor(Math.random() * walkableTiles.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }
  randomIndices.forEach((index) => {
    if (walkableTiles[index]) { // Vérifier si l'index est valide
      walkableTiles[index].walkable = false;
    }
  });

  // Assign starting tiles for all players
  // Avant de filtrer les tuiles disponibles, s'assurer qu'il y a suffisamment de tuiles dans le plateau
  // pour accommoder les joueurs, les stations et autres tuiles spéciales
  
  // Si le rayon est trop petit (comme dans les tests avec rayon=0 ou 1),
  // forcer certaines tuiles à être marchables pour garantir qu'il y a assez de tuiles pour tous
  if (radius < 2) {
    // Pour les petits rayons, s'assurer que toutes les tuiles sont marchables
    hexPositions.forEach((tile) => {
      tile.walkable = true;
    });
  }
  
  const availableTiles = hexPositions.filter((tile) => tile.walkable && !tile.outer && tile.type !== 'fuel' && tile.type !== 'repair' && tile.type !== 'danger');
  const playerStartTiles = [];
  
  // Déterminer dynamiquement le nombre de joueurs en fonction du rayon
  // pour éviter les problèmes dans les petits plateaux de jeu
  let adjustedPlayerCount = totalPlayers; // Changed from humanPlayerCount to totalPlayers
  if (radius === 0) {
    adjustedPlayerCount = 1; // Un seul joueur pour un rayon de 0
  } else if (radius === 1 && humanPlayerCount > 3) {
    adjustedPlayerCount = 3; // Limite à 3 joueurs pour un rayon de 1
  } else if (availableTiles.length < humanPlayerCount) {
    adjustedPlayerCount = Math.max(1, availableTiles.length);
  }
  
  const numPlayersToPlace = Math.min(adjustedPlayerCount, availableTiles.length);

  // Select random starting positions for each player
  for (let i = 0; i < numPlayersToPlace; i++) {
    let startTile;
    let attempts = 0; // Pour éviter une boucle infinie si la logique de sélection a un problème
    do {
      startTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
      attempts++;
      if (attempts > availableTiles.length * 2 && availableTiles.length > 0) { // Limite de tentatives
        console.warn("generateHexPositions: Could not find a unique starting tile after multiple attempts. Breaking loop.");
        // Tenter de prendre la première tuile non encore assignée pour éviter une erreur complète
        const unassignedTile = availableTiles.find(t => !playerStartTiles.some(pst => pst.coord === t.coord));
        if (unassignedTile) {
          startTile = unassignedTile;
          break;
        } else {
          // Si toutes les tuiles disponibles sont déjà dans playerStartTiles (ne devrait pas arriver avec la logique actuelle)
          // ou si availableTiles est vide, on ne peut rien faire de plus.
          console.error("generateHexPositions: No available or unassigned tile found for player start. Player will not be placed.");
          startTile = null; // Indique qu'aucune tuile n'a pu être assignée
          break;
        }
      }
    } while (startTile && playerStartTiles.some(tile => tile.coord === startTile.coord) && attempts <= availableTiles.length * 2);
    
    if (startTile) { // S'assurer qu'une tuile a été trouvée
      playerStartTiles.push(startTile);
      startTile.type = "depart";
      startTile.playerId = i === 0 ? HUMAN_PLAYER_ID : getBotId(i - 1); // Assigner playerId correctement
      // Retirer la tuile assignée des tuiles disponibles pour la prochaine itération (si on veut garantir l'unicité plus strictement)
      // Cependant, la condition `playerStartTiles.some` devrait suffire.
      // const indexToRemove = availableTiles.findIndex(t => t.coord === startTile.coord);
      // if (indexToRemove > -1) availableTiles.splice(indexToRemove, 1);
    }
  }

  // Set starting positions for all players
  hexPositions.forEach((tile) => {
    if (tile.type === "depart") {
      tile.walkable = true;
      tile.resources = {
        food: 100,
        debris: 100,
        special: 50
      };
    }
  });

  // Add stations and danger tiles
  const stationCandidates = hexPositions.filter((tile) => tile.walkable && tile.type === "resource");
  
  // Déterminer le nombre de stations en fonction du rayon pour éviter les problèmes dans les petits plateaux
  // Place fuel stations (dynamically adjusted based on radius)
  const numFuelStations = radius === 0 ? 0 : (radius === 1 ? 1 : 2);
  for (let i = 0; i < numFuelStations; i++) {
    if (stationCandidates.length > 0) {
      const fuelStationIndex = Math.floor(Math.random() * stationCandidates.length);
      const fuelStationTile = stationCandidates[fuelStationIndex];
      fuelStationTile.type = "fuel";
      stationCandidates.splice(fuelStationIndex, 1);
    }
  }

  // Place repair stations (dynamically adjusted based on radius)
  const numRepairStations = radius === 0 ? 0 : (radius === 1 ? 1 : 2);
  for (let i = 0; i < numRepairStations; i++) {
    if (stationCandidates.length > 0) {
      const repairStationIndex = Math.floor(Math.random() * stationCandidates.length);
      const repairStationTile = stationCandidates[repairStationIndex];
      repairStationTile.type = "repair";
      stationCandidates.splice(repairStationIndex, 1);
    }
  }

  // Assign danger tiles (dynamically adjusted based on radius)
  const dangerTiles = hexPositions.filter((tile) => tile.walkable && tile.type === "resource");
  // Pour les petits rayons, réduire ou éliminer les tuiles de danger
  const dangerPercentage = radius === 0 ? 0 : (radius === 1 ? 0.05 : 0.1);
  const numDangerTiles = Math.floor(dangerTiles.length * dangerPercentage);
  
  // Ne transformer en danger que si nous avons encore des tuiles ressources après
  if (dangerTiles.length > numDangerTiles + 1) {
    dangerTiles.slice(0, numDangerTiles).forEach((tile) => {
      tile.type = "danger";
      tile.resources = null;
    });
  }

  return hexPositions;
}

/**
 * Fonction utilitaire pour mettre à jour un véhicule dans l'état du store
 * @param {Object} state - L'état actuel du store
 * @param {string} playerId - L'ID du joueur
 * @param {string} vehicleId - L'ID du véhicule (ship, drone1, drone2, etc.)
 * @param {Object} updates - Les propriétés à mettre à jour
 * @returns {Object} Le nouvel état avec les mises à jour
 */
export const updateVehicle = (state, playerId, vehicleId, updates) => {
  // Vérifie si le joueur existe
  if (!state.players[playerId]) {
    console.warn(`Player with ID '${playerId}' not found.`);
    return state;
  }

  // Vérifie si le véhicule existe
  const vehicle = state.players[playerId].vehicles[vehicleId];
  if (!vehicle) {
    console.warn(`Vehicle with ID '${vehicleId}' not found for player '${playerId}'.`);
    return state;
  }

  // Met à jour le véhicule
  const updatedVehicle = {
    ...vehicle,
    ...updates,
  };

  // Retourne l'état mis à jour
  return {
    ...state,
    players: {
      ...state.players,
      [playerId]: {
        ...state.players[playerId],
        vehicles: {
          ...state.players[playerId].vehicles,
          [vehicleId]: updatedVehicle
        },
      },
    },
  };
};

/**
 * Find a path between two hex coordinates using breadth-first search
 * @param {string} startCoord - Starting coordinate (e.g., "A1")
 * @param {string} targetCoord - Target coordinate (e.g., "B2")
 * @param {Object} tiles - Map of all tiles
 * @returns {Array} Array of coordinates representing the path
 */
export const findPath = (startCoord, targetCoord, tiles) => {
  const queue = [[startCoord]];
  const visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const currentCoord = path[path.length - 1];

    if (currentCoord === targetCoord) {
      return path;
    }

    if (!visited.has(currentCoord)) {
      visited.add(currentCoord);
      const neighbors = tiles[currentCoord]?.neighbors || [];
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor) && tiles[neighbor]?.walkable !== false) {
          queue.push([...path, neighbor]);
        }
      });
    }
  }

  return [];
};

/**
 * Calculate the total distance of a path
 * @param {Array} path - Array of coordinates representing the path
 * @param {Object} tiles - Map of all tiles
 * @returns {number} Total distance of the path
 */
export const calculatePathDistance = (path, tiles) => {
  if (!path || path.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const tileA = tiles[path[i]];
    const tileB = tiles[path[i + 1]];
    if (tileA && tileB) {
      totalDistance += new Vector3(tileA.position.x, tileA.position.y, tileA.position.z)
        .distanceTo(new Vector3(tileB.position.x, tileB.position.y, tileB.position.z));
    }
  }
  
  return totalDistance;
};

/**
 * Find the current tile based on a 3D position
 * @param {Object} position - Position {x, y, z} to check
 * @param {Object} tiles - Map of all tiles
 * @returns {Object|null} The tile at this position or null if not found
 */
export const findTileAtPosition = (position, tiles) => {
  return Object.values(tiles).find(
    (tile) =>
      Math.abs(tile.position.x - position.x) < 0.3 &&
      Math.abs(tile.position.z - position.z) < 0.3
  );
};

/**
 * Calculate path from current position to target
 * @param {Object} currentPosition - Current position {x, y, z}
 * @param {string} targetCoord - Target coordinate
 * @param {Object} tiles - Map of all tiles
 * @param {string} fallbackCoord - Fallback coordinate if current position doesn't match a tile
 * @returns {Object} Path data {path, totalDistance}
 */
export const calculatePath = (currentPosition, targetCoord, tiles, fallbackCoord) => {
  // Find the tile at current position
  const currentTile = findTileAtPosition(currentPosition, tiles);
  
  let path = [];
  if (currentTile) {
    path = findPath(currentTile.coord, targetCoord, tiles);
  } else if (fallbackCoord) {
    // Use fallback coordinate if we can't find a tile at current position
    path = findPath(fallbackCoord, targetCoord, tiles);
  }
  
  if (!path || path.length === 0) {
    return { path: [], totalDistance: 0 };
  }
  
  const totalDistance = calculatePathDistance(path, tiles);
  
  return { path, totalDistance };
};




