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
          randomVehicleStart: false, // Default value
          targetVehicleStart: false, // Default value
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
    fuelStationTile.color = "black"; // Black color for the fuel station
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
