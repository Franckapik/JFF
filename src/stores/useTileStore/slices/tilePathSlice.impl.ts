// =========================================================================
// SLICE FACTORY - TILE PATH UTILITIES
// =========================================================================

const createTilePathSlice = (set: any, get: any): TilePathSliceActions => ({
  findPath: (startCoord, targetCoord, tiles) => {
    const tilesMap = tiles || get().tiles;
    if (!startCoord || !targetCoord || startCoord === targetCoord) {
      return startCoord === targetCoord ? [startCoord] : [];
    }
    const queue = [[startCoord]];
    const visited = new Set();
    while (queue.length > 0) {
      const path = queue.shift()!;
      const currentCoord = path[path.length - 1];
      if (currentCoord === targetCoord) {
        return path;
      }
      if (visited.has(currentCoord)) {
        continue;
      }
      visited.add(currentCoord);
      const currentTile = tilesMap[currentCoord];
      if (currentTile && (currentTile as any).neighbors) {
        for (const neighborCoord of (currentTile as any).neighbors) {
          const neighborTile = tilesMap[neighborCoord];
          if (neighborTile && neighborTile.walkable && !visited.has(neighborCoord)) {
            queue.push([...path, neighborCoord]);
          }
        }
      }
    }
    return [];
  },
  calculateDistance: (from, to, usePathfinding = false) => {
    const tiles = get().tiles;
    const fromCoord = typeof from === 'string' 
      ? from 
      : typeof from === 'object' && 'x' in from && 'z' in from 
        ? `${from.x},${from.z}` 
        : null;
    const toCoord = typeof to === 'string' 
      ? to 
      : typeof to === 'object' && 'x' in to && 'z' in to 
        ? `${to.x},${to.z}` 
        : null;
    if (!fromCoord || !toCoord) {
      return Infinity;
    }
    if (usePathfinding) {
      const path = get().findPath(fromCoord, toCoord, tiles);
      return path.length > 0 ? path.length - 1 : Infinity;
    } else {
      const [fromX, fromZ] = fromCoord.split(',').map(Number);
      const [toX, toZ] = toCoord.split(',').map(Number);
      return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toZ - fromZ, 2));
    }
  },
  calculatePathDistance: (path, tiles) => {
    if (!path || path.length < 2) return 0;
    const tilesMap = tiles || get().tiles;
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const tileA = tilesMap[path[i]];
      const tileB = tilesMap[path[i + 1]];
      if (tileA && tileB) {
        const distance = Math.sqrt(
          Math.pow(tileB.position.x - tileA.position.x, 2) + 
          Math.pow(tileB.position.z - tileA.position.z, 2)
        );
        totalDistance += distance;
      }
    }
    return totalDistance;
  },
  findTileAtPosition: (position, tiles) => {
    const tilesMap = tiles || get().tiles;
    if (!position || typeof position.x !== 'number' || typeof position.z !== 'number') {
      return null;
    }
    const foundTile = Object.values(tilesMap).find((tile: any) => {
      if (!tile || !tile.position) return false;
      const distance = Math.sqrt(
        Math.pow(tile.position.x - position.x, 2) + 
        Math.pow(tile.position.z - position.z, 2)
      );
      return distance < pathConstants.thresholds.positionMatch;
    });
    return foundTile as Tile || null;
  },
  calculatePath: (currentPosition, targetCoord, tiles, fallbackCoord) => {
    const tilesMap = tiles || get().tiles;
    const currentTile = get().findTileAtPosition(currentPosition, tilesMap);
    let path = [];
    if (currentTile) {
      path = get().findPath(currentTile.coord, targetCoord, tilesMap);
    } else if (fallbackCoord) {
      path = get().findPath(fallbackCoord, targetCoord, tilesMap);
    }
    const totalDistance = get().calculatePathDistance(path, tilesMap);
    const isReachable = path.length > 0;
    return {
      path,
      totalDistance,
      isReachable
    };
  },
  isReachable: (from, to, tiles) => {
    const path = get().findPath(from, to, tiles);
    return path.length > 0;
  },
  calculateDroneDistance: (dronePosition, droneState, targetPosition, shipPosition) => {
    if (!dronePosition) return Infinity;
    switch (droneState) {
      case 'deploying':
      case 'scanning': {
        if (!targetPosition) return Infinity;
        const dx = dronePosition.x - targetPosition.x;
        const dz = dronePosition.z - targetPosition.z;
        return Math.sqrt(dx * dx + dz * dz);
      }
      case 'returning': {
        if (!shipPosition) return Infinity;
        return get().calculate3DDistance(dronePosition, shipPosition);
      }
      default:
        return Infinity;
    }
  },
  selectTargetTileInRadiusForDrone: (shipPosition, range, tiles) => {
    if (!shipPosition) return null;
    const tilesMap = tiles || get().tiles;
    if (!tilesMap || Object.keys(tilesMap).length === 0) return null;
    const shipTile = get().findTileAtPosition(shipPosition, tilesMap);
    if (!shipTile) return null;
    const visited = new Set();
    const inRange = [];
    const queue = [
      { coord: shipTile.coord, dist: 0 }
    ];
    while (queue.length > 0) {
      const { coord, dist } = queue.shift()!;
      if (visited.has(coord)) continue;
      visited.add(coord);
      if (dist > 0 && dist <= range) {
        const tile = tilesMap[coord];
        if (tile && tile.walkable) {
          inRange.push(tile);
        }
      }
      if (dist < range) {
        const tile = tilesMap[coord];
        if (tile && Array.isArray(tile.neighbors)) {
          for (const neighborCoord of tile.neighbors) {
            if (!visited.has(neighborCoord)) {
              queue.push({ coord: neighborCoord, dist: dist + 1 });
            }
          }
        }
      }
    }
    if (inRange.length === 0) return null;
    const randomTile = inRange[Math.floor(Math.random() * inRange.length)];
    if (Array.isArray(randomTile.position)) {
      return {
        x: randomTile.position[0],
        y: (randomTile.position[1] || 0) + 0.5,
        z: randomTile.position[2]
      };
    } else {
      return {
        x: randomTile.position.x,
        y: (randomTile.position.y || 0) + 0.5,
        z: randomTile.position.z
      };
    }
  },
  calculate3DDistance: (from, to) => {
    if (!from || !to) return Infinity;
    const dx = to.x - from.x;
    const dy = (to.y || 0) - (from.y || 0);
    const dz = to.z - from.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
});

export default createTilePathSlice;
