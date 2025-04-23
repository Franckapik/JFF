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
          danger: Math.random() < 0.1, // 10% de chance d'avoir un danger
          neighbors, // Encoded neighbors
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Couleur aléatoire
          outer, // Propriété outer
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

  return hexPositions;
}
