import { Vector3 } from "three";
// Remove the redundant import of calculatePathData
// import { calculatePathData } from "./utils"; 
import usePlayerStore from "../stores/usePlayerStore"; // Import player store

export function generateHexPositions(radius, spacing) {
  
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
          type: "resource", // Par défaut, la tuile est une ressource
          neighbors, // Encoded neighbors
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Couleur aléatoire
          outer, // Propriété outer
          resources: {
            food: Math.floor(Math.random() * 101), // Random food quantity (0-100)
            debris: Math.floor(Math.random() * 10001), // Random debris quantity (0-10000)
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
  while (randomIndices.length < 2 && walkableTiles.length > 0) {
    const randomIndex = Math.floor(Math.random() * walkableTiles.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }
  randomIndices.forEach((index) => {
    walkableTiles[index].walkable = false;
  });

  // Randomly assign starting tiles for the random vehicle and the target vehicle
  const availableTiles = hexPositions.filter((tile) => tile.walkable && !tile.outer);
  const randomVehicleTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
  let targetVehicleTile;
  do {
    targetVehicleTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
  } while (targetVehicleTile.coord === randomVehicleTile.coord);

  randomVehicleTile.randomVehicleStart = true;
  randomVehicleTile.type = "depart"; // Set type to "depart"
  targetVehicleTile.targetVehicleStart = true;
  targetVehicleTile.type = "depart"; // Set type to "depart"

  hexPositions.forEach((tile) => {
    if (tile.targetVehicleStart || tile.randomVehicleStart) {
      tile.resources = { food: 0, debris: 0, special: 0 }; // Ensure no resources on starting tiles
    }
  });

  // Place a fuel station
  const fuelStationCandidates = hexPositions.filter((tile) => tile.walkable && tile.type === "resource");
  if (fuelStationCandidates.length > 0) {
    const fuelStationTile = fuelStationCandidates[Math.floor(Math.random() * fuelStationCandidates.length)];
    fuelStationTile.type = "fuel";
    fuelStationTile.color = "orange"; // Black color for the fuel station
    fuelStationTile.resources = { food: 0, debris: 0, special: 0 }; // Ensure no resources on the fuel station tile
    fuelStationTile.immunity = true; // Set immunity to true for the fuel station tile
  }

  // Place a repair station
  const repairStationCandidates = hexPositions.filter((tile) => tile.walkable && tile.type === "resource");
  if (repairStationCandidates.length > 0) {
    const repairStationTile = repairStationCandidates[Math.floor(Math.random() * repairStationCandidates.length)];
    repairStationTile.type = "repair";
    repairStationTile.color = "green"; // Green color for the repair station
    repairStationTile.resources = { food: 0, debris: 0, special: 0 }; // Ensure no resources on the repair station tile
    repairStationTile.immunity = true; // Set immunity to true for the repair station tile
  }

  // Randomly assign danger tiles
  const dangerTiles = hexPositions.filter((tile) => tile.walkable && tile.type === "resource");
  dangerTiles.slice(0, Math.floor(dangerTiles.length * 0.1)).forEach((tile) => {
    tile.type = "danger";
    tile.color = "red"; // Red color for danger tiles
  });

  return hexPositions;
}

export function generateInitialDrones(count, spacing = 1) {
  const drones = [];
  if (count > 0) {
    const angle = 0; // Single drone at angle 0
    const x = Math.cos(angle) * spacing;
    const z = Math.sin(angle) * spacing;
    drones.push({
      id: 1, // Single drone with ID 1
      position: { x, y: 0, z },
      isMoving: false,
      targetTile: null,
    });
  }
  return drones; // Always return an array
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




